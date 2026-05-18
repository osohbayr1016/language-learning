import type {
  ImportedLessonContent,
  ImportedNote,
  ImportedRadical,
  ImportedVocab,
} from './lessonImportTypes';
import { workbookFromPackageExercises } from './lessonPackageWorkbook';

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function hskLevel(v: unknown): number {
  const n = Number(String(v ?? '').replace(/[^\d]/g, ''));
  return Math.min(6, Math.max(1, Number.isFinite(n) && n ? n : 1));
}

function grammarNotes(rows: unknown): ImportedNote[] {
  if (!Array.isArray(rows)) return [];
  const out: ImportedNote[] = [];
  for (const row of rows) {
    const r = (row ?? {}) as Record<string, unknown>;
    const title = str(r.point);
    let body = str(r.mn);
    const examples = Array.isArray(r.examples) ? r.examples : [];
    const exLines: string[] = [];
    for (const ex of examples) {
      const e = (ex ?? {}) as Record<string, unknown>;
      const cn = str(e.cn);
      const mn = str(e.mn);
      if (cn || mn) exLines.push([cn, mn].filter(Boolean).join(' — '));
    }
    if (exLines.length) body = [body, ...exLines].filter(Boolean).join('\n\n');
    if (title && body) out.push({ title, body });
  }
  return out;
}

function slangNotes(rows: unknown): ImportedNote[] {
  if (!Array.isArray(rows)) return [];
  const out: ImportedNote[] = [];
  for (const row of rows) {
    const r = (row ?? {}) as Record<string, unknown>;
    const title = str(r.phrase);
    const parts = [str(r.mn), str(r.example), str(r.translation)].filter(Boolean);
    const body = parts.join('\n\n');
    if (title && body) out.push({ title, body });
  }
  return out;
}

export function commonMistakeNotes(rows: unknown): ImportedNote[] {
  if (!Array.isArray(rows)) return [];
  const out: ImportedNote[] = [];
  for (const row of rows) {
    if (Array.isArray(row) && row.length >= 2) {
      const title = str(row[0]);
      const body = str(row[1]);
      if (title && body) out.push({ title, body });
      continue;
    }
    const r = (row ?? {}) as Record<string, unknown>;
    const title = str(r.title) || str(r.topic) || str(r.label);
    const body = str(r.body) || str(r.mn) || str(r.explanation);
    if (title && body) out.push({ title, body });
  }
  return out;
}

function vocabFromPackage(rows: unknown): ImportedVocab[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => {
      const r = (row ?? {}) as Record<string, unknown>;
      const radicalRaw = str(r.radical) || str(r.radical_char);
      const base: ImportedVocab = {
        hanzi: str(r.word),
        pinyin: str(r.pinyin),
        meaning_mn: str(r.mn),
        hsk_level: hskLevel(r.hsk),
      };
      if (radicalRaw) base.radical = radicalRaw;
      return base;
    })
    .filter((v) => v.hanzi && v.pinyin && v.meaning_mn);
}

/** Optional `radicals` array in ZIP JSON — char/glyph, name mn/mn/name. */
function radicalsFromPackage(rows: unknown): ImportedRadical[] {
  if (!Array.isArray(rows)) return [];
  const out: ImportedRadical[] = [];
  for (const row of rows) {
    const r = (row ?? {}) as Record<string, unknown>;
    const char = str(r.char) || str(r.glyph) || str(r.radical);
    const nameMn = str(r.name_mn) || str(r.mn) || str(r.name);
    if (!char || !nameMn) continue;
    const variant = str(r.variant) || str(r.variant_char) || undefined;
    const noteMn = str(r.note_mn) || str(r.note) || undefined;
    out.push({
      char,
      name_mn: nameMn,
      ...(variant ? { variant } : {}),
      ...(noteMn ? { note_mn: noteMn } : {}),
    });
  }
  return out;
}

function lineFromPkg(raw: unknown) {
  const r = (raw ?? {}) as Record<string, unknown>;
  return { speaker: str(r.speaker), cn: str(r.cn), mn: str(r.mn) };
}

function dialoguesFromPkg(rows: unknown): ImportedLessonContent['dialogues'] {
  if (!Array.isArray(rows)) return [];
  return rows.map((raw, i) => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const lines = Array.isArray(r.lines) ? r.lines.map(lineFromPkg).filter((l) => l.cn || l.mn) : [];
    const title = str(r.title_cn) || str(r.title_mn) || `Section ${i + 1}`;
    const audio = str(r.audio);
    return {
      no: i + 1,
      title,
      lines: lines.length ? lines : undefined,
      text_cn: str(r.full_cn) || undefined,
      text_mn: str(r.full_mn) || undefined,
      audio_url: audio || undefined,
    };
  });
}

/** Maps APP_READY `lesson_data.json` into stored lesson content. */
export function normalizeLessonPackageJson(raw: unknown): ImportedLessonContent {
  const root = (raw ?? {}) as Record<string, unknown>;
  const id = str(root.lesson_id);
  if (!id) throw new Error('lesson_data.json: lesson_id хоосон байна');

  const titleCn = str(root.title_cn);
  const titleMn = str(root.title_mn);
  if (!titleMn && !titleCn) throw new Error('lesson_data.json: гарчиг хоосон байна');

  const rawDialogues = Array.isArray(root.dialogues) ? root.dialogues : root.full_textbook_text;
  const dialogues = dialoguesFromPkg(rawDialogues);
  if (!dialogues.length) throw new Error('lesson_data.json: dialogues/full_textbook_text хоосон байна');

  const vocab = vocabFromPackage(root.vocabulary);
  if (!vocab.length) throw new Error('lesson_data.json: vocabulary хоосон байна');

  const grammar = grammarNotes(root.grammar);
  const slang = slangNotes(root.slang_idiom);
  const workbook = workbookFromPackageExercises(root.workbook_exercises);
  const radicals = radicalsFromPackage(root.radicals);
  const common_mistakes = commonMistakeNotes(root.common_mistakes);

  return {
    external_lesson_id: id,
    title_cn: titleCn,
    title_mn: titleMn,
    source: str(root.source) || 'ZIP lesson import',
    summary: str(root.summary_mn),
    dialogues,
    vocab,
    radicals,
    grammar,
    slang,
    workbook,
    quizlet_text: str(root.quizlet_copy),
    ...(common_mistakes.length ? { common_mistakes } : {}),
  };
}
