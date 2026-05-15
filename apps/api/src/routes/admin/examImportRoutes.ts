import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../../middleware/auth';
import type { Env, Variables } from '../../types';

type QIn = {
  section: string;
  part_num: number;
  question_num: number;
  audio_text?: string;
  question_text?: string;
  question_pinyin?: string;
  question_romaji?: string;
  options: unknown;
  correct_answer: string;
  order_num: number;
  audio_key?: string | null;
};

type ImportBody = {
  title?: string;
  jlpt_level?: number;
  hsk_level?: number;
  duration_minutes?: number;
  passing_score?: number;
  max_score?: number;
  is_published?: boolean;
  questions?: QIn[];
};

function normOpts(o: unknown): string[] {
  if (!Array.isArray(o)) return [];
  return o.map((x) => String(x).trim()).filter(Boolean);
}

function resolvedAudioContentType(filename: string, headerCt: string | undefined): string {
  const h = headerCt?.trim();
  const ext = filename.includes('.') ? (filename.split('.').pop()?.toLowerCase() ?? '') : '';
  if (!h || h === 'application/octet-stream' || h === 'binary/octet-stream') {
    if (ext === 'mp3') return 'audio/mpeg';
    if (ext === 'wav' || ext === 'wave') return 'audio/wav';
    return 'audio/wav';
  }
  return h;
}

/** Monolith admin sub-router-д зөрүүтэй байж Workers дээр 404 гаргаж болох тул гол аппад шууд mount хийнэ. */
export const examImportApp = new Hono<{ Bindings: Env; Variables: Variables }>();

examImportApp.use('*', authMiddleware);
examImportApp.use('*', adminMiddleware);

examImportApp.post('/upload-audio', async (c) => {
  const filename = c.req.query('filename') ?? `q_${Date.now()}.wav`;
  const ext = filename.includes('.') ? filename.split('.').pop() : 'wav';
  const ct = resolvedAudioContentType(filename, c.req.header('content-type'));
  const key = `exams/audio/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const body = c.req.raw.body;
  if (!body) return c.json({ error: 'Файл алга' }, 400);
  await c.env.STORAGE.put(key, body, { httpMetadata: { contentType: ct } });
  return c.json({ data: { key } }, 201);
});

examImportApp.post('/import', async (c) => {
  const raw = await c.req.json<ImportBody>().catch(() => null);
  if (!raw || typeof raw !== 'object') return c.json({ error: 'Буруу JSON' }, 400);
  const body = raw;

  const title = (body.title ?? '').trim();
  if (!title) return c.json({ error: 'Гарчиг хоосон' }, 400);
  const qs = Array.isArray(body.questions) ? body.questions : [];
  if (!qs.length) return c.json({ error: 'Асуулт алга' }, 400);

  for (let i = 0; i < qs.length; i++) {
    const q = qs[i]!;
    const opts = normOpts(q.options);
    if (opts.length < 2) return c.json({ error: `Сонголт хэт бага: ${i + 1}` }, 400);
    const pn = Number(q.part_num);
    if (!Number.isFinite(pn) || pn < 1 || pn > 4) {
      return c.json({ error: `Буруу part_num: ${i + 1}` }, 400);
    }
    if (!['listening', 'reading'].includes(q.section)) return c.json({ error: 'Буруу section' }, 400);
    const ca = String(q.correct_answer ?? '').trim();
    if (!opts.includes(ca)) return c.json({ error: `Зөв хариу сонголтонд байхгүй: ${i + 1}` }, 400);
    if (q.audio_key != null && q.audio_key !== '') {
      const k = String(q.audio_key);
      if (!k.startsWith('exams/')) return c.json({ error: `Буруу audio_key: ${i + 1}` }, 400);
    }
  }

  const jlpt = Math.min(5, Math.max(1, Number(body.jlpt_level ?? body.hsk_level) || 2));
  const duration = Math.max(1, Number(body.duration_minutes) || 55);
  const maxScore = Math.max(1, Number(body.max_score) || 200);
  const passScoreRaw = body.passing_score != null ? Number(body.passing_score) : 120;
  const passScore = Math.min(maxScore, Math.max(0, Number.isFinite(passScoreRaw) ? passScoreRaw : 120));
  const pub = body.is_published === true ? 1 : 0;

  const insT = await c.env.DB.prepare(
    `INSERT INTO exam_templates (title, jlpt_level, total_questions, duration_minutes, passing_score, max_score, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(title, jlpt, qs.length, duration, passScore, maxScore, pub)
    .run();

  const tid = Number(insT.meta?.last_row_id ?? 0);
  if (!tid) return c.json({ error: 'INSERT алдаа' }, 500);

  const BATCH = 20;
  for (let off = 0; off < qs.length; off += BATCH) {
    const chunk = qs.slice(off, off + BATCH);
    const stmts = chunk.map((q) => {
      const ak =
        q.audio_key != null && String(q.audio_key).startsWith('exams/') ? String(q.audio_key) : null;
      return c.env.DB
        .prepare(
          `INSERT INTO exam_questions (template_id, section, part_num, question_num, question_type, audio_text, question_text, question_romaji, options, correct_answer, order_num, audio_key)
           VALUES (?, ?, ?, ?, 'paper_mcq', ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          tid,
          q.section,
          q.part_num,
          q.question_num,
          q.audio_text ?? '',
          q.question_text ?? '',
          (q.question_romaji ?? q.question_pinyin) ?? '',
          JSON.stringify(normOpts(q.options)),
          String(q.correct_answer).trim(),
          q.order_num,
          ak
        );
    });
    await c.env.DB.batch(stmts);
  }

  return c.json({ data: { template_id: tid } }, 201);
});
