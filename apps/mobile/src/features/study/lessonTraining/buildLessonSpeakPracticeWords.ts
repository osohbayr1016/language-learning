import type { HskLevel, LessonDetail, Word } from '../../../lib/types';
import type { ImportedVocabRow } from '../../lessons/importedVocabRows';

function synthWordFromImport(row: ImportedVocabRow, index: number): Word {
  const lv = Math.min(6, Math.max(1, row.hsk_level)) as HskLevel;
  return {
    id: -(900000 + index),
    hanzi: row.hanzi.trim(),
    pinyin: row.pinyin,
    pinyin_numbered: null,
    tones: '',
    meaning_mn: row.meaning_mn,
    meaning_en: null,
    hsk_level: lv,
    part_of_speech: null,
    example_zh: null,
    example_pinyin: null,
    example_mn: null,
    audio_url: null,
    stroke_count: null,
  };
}

/** Lesson-linked words first (API order), then synthetic rows for ZIP vocab not linked as words. */
export function buildLessonSpeakPracticeWords(detail: LessonDetail): Word[] {
  const imp = detail.imported_content;
  const seen = new Set<string>();
  const out: Word[] = [];

  for (const w of detail.words) {
    const key = w.hanzi.trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(w);
  }

  if (imp?.vocab?.length) {
    let synthIdx = 0;
    for (const row of imp.vocab) {
      const key = row.hanzi.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(synthWordFromImport(row, synthIdx++));
    }
  }

  return out.filter((w) => (w.hanzi ?? '').trim().length > 0);
}
