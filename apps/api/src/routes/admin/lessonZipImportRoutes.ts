import type { Hono } from 'hono';
import { strFromU8, unzipSync } from 'fflate';
import { collectRelativeAudioPaths, rewriteLessonAudioUrls } from '../../lib/lessonPackageAudio';
import { normalizeLessonPackageJson } from '../../lib/lessonPackageNormalize';
import { previewLessonImport } from '../../lib/lessonImportNormalize';
import { storeImportedLesson } from '../../lib/lessonImportStore';
import { resolveImportedWords, validateImportedWords } from '../../lib/lessonImportWords';
import { lessonImportedFilePublicUrl } from '../../lib/r2PublicUrl';
import type { ImportedLessonContent } from '../../lib/lessonImportTypes';
import type { Env, Variables } from '../../types';

function ctForAudioFilename(name: string): string {
  const ext = name.includes('.') ? (name.split('.').pop() ?? '').toLowerCase() : '';
  if (ext === 'mp3') return 'audio/mpeg';
  if (ext === 'wav' || ext === 'wave') return 'audio/wav';
  if (ext === 'm4a') return 'audio/mp4';
  return 'application/octet-stream';
}

function skipZipEntry(name: string): boolean {
  return name.includes('__MACOSX') || name.endsWith('.DS_Store');
}

function findLessonDataInZip(files: Record<string, Uint8Array>): { root: string; raw: Uint8Array } | null {
  for (const key of Object.keys(files)) {
    if (skipZipEntry(key)) continue;
    if (key.endsWith('lesson_data.json')) {
      const root = key.includes('/') ? key.replace(/\/lesson_data\.json$/, '') : '';
      return { root, raw: files[key]! };
    }
  }
  return null;
}

function joinZipPath(root: string, rel: string): string {
  const r = rel.replace(/^\/+/, '').replace(/\\/g, '/');
  if (!root) return r;
  return `${root}/${r}`;
}

function parseZipToContent(buf: ArrayBuffer): {
  content: ImportedLessonContent;
  lessonRoot: string;
  files: Record<string, Uint8Array>;
} {
  if (!buf.byteLength) throw new Error('ZIP хоосон байна');

  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(new Uint8Array(buf), { filter: () => true }) as Record<string, Uint8Array>;
  } catch {
    throw new Error('ZIP задлахад алдаа гарлаа');
  }

  const found = findLessonDataInZip(files);
  if (!found) throw new Error('ZIP дотор lesson_data.json олдсонгүй');

  let parsed: unknown;
  try {
    parsed = JSON.parse(strFromU8(found.raw));
  } catch {
    throw new Error('lesson_data.json буруу байна');
  }

  const content = normalizeLessonPackageJson(parsed);
  return { content, lessonRoot: found.root, files };
}

async function uploadAudioAndRewrite(
  env: Env,
  req: Request,
  content: ImportedLessonContent,
  lessonRoot: string,
  zipFiles: Record<string, Uint8Array>
): Promise<void> {
  const rels = collectRelativeAudioPaths(content);
  const map: Record<string, string> = {};
  const extId = content.external_lesson_id.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 120);

  for (const rel of rels) {
    const zipKey = joinZipPath(lessonRoot, rel);
    const raw = zipFiles[zipKey];
    if (!raw) {
      throw new Error(`Аудио олдсонгүй ZIP дотор: ${rel}`);
    }
    const storageKey = `lessons/imported/${extId}/${rel}`;
    await env.STORAGE.put(storageKey, raw, {
      httpMetadata: { contentType: ctForAudioFilename(rel) },
    });
    map[rel] = lessonImportedFilePublicUrl(req, storageKey);
  }
  rewriteLessonAudioUrls(content, map);
}

export function registerLessonZipImportRoutes(admin: Hono<{ Bindings: Env; Variables: Variables }>) {
  admin.post('/lessons/import-zip/preview', async (c) => {
    try {
      const ct = c.req.header('content-type') ?? '';
      if (!ct.includes('multipart/form-data')) {
        return c.json({ error: 'multipart/form-data шаардлагатай' }, 400);
      }
      const form = await c.req.formData();
      const file = form.get('file');
      if (!file || typeof file === 'string') throw new Error('ZIP файл сонгоно уу');

      const { content } = parseZipToContent(await (file as Blob).arrayBuffer());
      await validateImportedWords(content.vocab);
      return c.json({ data: previewLessonImport(content) });
    } catch (e) {
      return c.json({ error: e instanceof Error ? e.message : 'ZIP урьдчилан харахад алдаа' }, 400);
    }
  });

  admin.post('/lessons/import-zip', async (c) => {
    try {
      const ct = c.req.header('content-type') ?? '';
      if (!ct.includes('multipart/form-data')) {
        return c.json({ error: 'multipart/form-data шаардлагатай' }, 400);
      }
      const form = await c.req.formData();
      const file = form.get('file');
      const chapterRaw = form.get('chapter_id');
      const pubRaw = form.get('is_published');

      if (!file || typeof file === 'string') throw new Error('ZIP файл сонгоно уу');
      const chapterId = Number(typeof chapterRaw === 'string' ? chapterRaw : '');
      if (!Number.isFinite(chapterId)) throw new Error('chapter_id шаардлагатай');

      const { content, lessonRoot, files } = parseZipToContent(await (file as Blob).arrayBuffer());

      await validateImportedWords(content.vocab);
      await uploadAudioAndRewrite(c.env, c.req.raw, content, lessonRoot, files);

      const wordStats = await resolveImportedWords(c.env.DB, content.vocab);
      const lessonId = await storeImportedLesson(c.env.DB, {
        chapterId,
        content,
        links: wordStats.links,
        isPublished: pubRaw === 'false' || pubRaw === '0' ? false : true,
      });

      return c.json(
        {
          data: {
            ...previewLessonImport(content),
            lesson_id: lessonId,
            inserted_words: wordStats.inserted,
            reused_words: wordStats.reused,
            linked_words: wordStats.links.length,
          },
        },
        201
      );
    } catch (e) {
      return c.json({ error: e instanceof Error ? e.message : 'ZIP импортод алдаа' }, 400);
    }
  });
}
