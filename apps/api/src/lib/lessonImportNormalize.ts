import type {
  ImportedDialogue,
  ImportedLessonContent,
  ImportedNote,
  ImportedRadical,
  ImportedVocab,
  ImportedWorkbookItem,
  LessonHtmlPreview,
} from './lessonImportTypes';
import { commonMistakeNotes } from './lessonPackageNormalize';
import { vocabQuizMismatchWarnings } from './lessonImportQuizWarnings';

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function hsk(v: unknown): number {
  const n = Number(String(v ?? '').replace(/[^\d]/g, ''));
  return Math.min(6, Math.max(1, Number.isFinite(n) && n ? n : 1));
}

function notes(rows: unknown): ImportedNote[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => (Array.isArray(r) ? { title: str(r[0]), body: str(r[1]) } : null))
    .filter((r): r is ImportedNote => !!r?.title && !!r.body);
}

function vocab(rows: unknown): ImportedVocab[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r) => {
      if (Array.isArray(r)) {
        const radicalRaw = typeof r[4] === 'string' ? str(r[4]) : '';
        const base: ImportedVocab = {
          hanzi: str(r[0]),
          pinyin: str(r[1]),
          meaning_mn: str(r[2]),
          hsk_level: hsk(r[3]),
        };
        if (radicalRaw) base.radical = radicalRaw;
        return base;
      }
      const o = (r ?? {}) as Record<string, unknown>;
      const radicalRaw = str(o.radical) || str(o.radical_char);
      const base: ImportedVocab = {
        hanzi: str(o.word ?? o.hanzi),
        pinyin: str(o.pinyin),
        meaning_mn: str(o.meaning_mn ?? o.mn),
        hsk_level: hsk(o.hsk),
      };
      if (radicalRaw) base.radical = radicalRaw;
      return base.hanzi && base.pinyin && base.meaning_mn ? base : null;
    })
    .filter((r): r is ImportedVocab => !!r?.hanzi && !!r.pinyin && !!r.meaning_mn);
}

function radicalsHtml(raw: unknown): ImportedRadical[] {
  if (!Array.isArray(raw)) return [];
  const out: ImportedRadical[] = [];
  for (const row of raw) {
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

function line(raw: unknown) {
  if (Array.isArray(raw)) return { speaker: str(raw[0]), cn: str(raw[1]), mn: str(raw[2]) };
  const r = (raw ?? {}) as Record<string, unknown>;
  return { speaker: str(r.speaker), cn: str(r.cn), mn: str(r.mn) };
}

function dialogues(rows: unknown): ImportedDialogue[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((raw, i) => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const lines = Array.isArray(r.lines) ? r.lines.map(line).filter((l) => l.cn || l.mn) : undefined;
    return {
      no: Number(r.no ?? i + 1),
      title: str(r.title),
      lines,
      text_cn: str(r.text_cn),
      text_mn: str(r.text_mn),
    };
  });
}

function workbookItem(raw: unknown): ImportedWorkbookItem | null {
  if (typeof raw === 'string') return { q: raw.trim() };
  if (Array.isArray(raw)) return { q: raw.join(' / '), parts: raw.map(str).filter(Boolean) };
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const options = Array.isArray(r.options) ? r.options.map(str).filter(Boolean) : undefined;
  return { q: str(r.q), options, answer: r.answer as string | boolean | null | undefined };
}

function workbook(raw: unknown): ImportedLessonContent['workbook'] {
  const sections = Array.isArray((raw as { sections?: unknown[] } | null)?.sections)
    ? (raw as { sections: unknown[] }).sections
    : [];
  return {
    sections: sections.map((s) => {
      const row = (s ?? {}) as Record<string, unknown>;
      const items = Array.isArray(row.items)
        ? row.items.map(workbookItem).filter((i): i is ImportedWorkbookItem => Boolean(i))
        : [];
      const bank = Array.isArray(row.bank) ? row.bank.map(str).filter(Boolean) : undefined;
      return { type: str(row.type) || 'workbook', title: str(row.title), bank, items };
    }),
  };
}

function countWorkbook(content: ImportedLessonContent): number {
  return content.workbook.sections.reduce((n, s) => n + s.items.length, 0);
}

function optionalPositiveInt(v: unknown): number | undefined {
  const n = typeof v === 'string' || typeof v === 'number' ? Number(String(v).trim()) : NaN;
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.trunc(n);
}

export function normalizeLessonImport(raw: unknown): ImportedLessonContent {
  const root = (raw ?? {}) as Record<string, unknown>;
  const lesson = (root.lesson ?? {}) as Record<string, unknown>;
  const mockExamId = optionalPositiveInt(lesson.mock_exam_template_id) ?? optionalPositiveInt(root.mock_exam_template_id);
  const content: ImportedLessonContent = {
    external_lesson_id: str(lesson.id),
    title_cn: str(lesson.title_cn),
    title_mn: str(lesson.title_mn),
    source: str(lesson.source) || 'HTML lesson import',
    summary: str(lesson.summary),
    dialogues: dialogues(lesson.dialogues),
    vocab: vocab(lesson.vocab),
    radicals: radicalsHtml((lesson as Record<string, unknown>).radicals ?? root.radicals),
    grammar: notes(lesson.grammar),
    slang: notes(lesson.slang),
    common_mistakes: commonMistakeNotes(
      (lesson as Record<string, unknown>).common_mistakes ?? root.common_mistakes
    ),
    workbook: workbook(root.workbook),
    quizlet_text: str(lesson.quizlet_text) || str(root.quizlet_text),
    ...(mockExamId != null ? { mock_exam_template_id: mockExamId } : {}),
  };
  if (!content.external_lesson_id) throw new Error('lesson.id хоосон байна');
  if (!content.title_mn && !content.title_cn) throw new Error('Хичээлийн гарчиг хоосон байна');
  if (!content.vocab.length) throw new Error('Үгийн сан хоосон байна');
  return content;
}

export function previewLessonImport(content: ImportedLessonContent): LessonHtmlPreview {
  return {
    external_lesson_id: content.external_lesson_id,
    title_cn: content.title_cn,
    title_mn: content.title_mn,
    source: content.source,
    vocab_count: content.vocab.length,
    dialogue_count: content.dialogues.length,
    grammar_count: content.grammar.length,
    workbook_count: countWorkbook(content),
    warnings: vocabQuizMismatchWarnings(content),
  };
}
