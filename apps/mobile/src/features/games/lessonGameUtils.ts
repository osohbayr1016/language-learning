import type { Word, WordWithProgress } from '../../lib/types';

export function wordFromLessonRow(w: WordWithProgress): Word {
  return {
    id: w.id,
    hanzi: w.hanzi,
    pinyin: w.pinyin,
    pinyin_numbered: w.pinyin_numbered,
    tones: w.tones,
    meaning_mn: w.meaning_mn,
    meaning_en: w.meaning_en,
    hsk_level: w.hsk_level,
    part_of_speech: w.part_of_speech,
    example_zh: w.example_zh,
    example_pinyin: w.example_pinyin,
    example_mn: w.example_mn,
    audio_url: w.audio_url,
    stroke_count: w.stroke_count,
    textbook_unit: w.textbook_unit ?? null,
  };
}

/** Match: at least one word (hanzi + meaning pair). */
export function canPlayLessonMatch(words: Word[]): boolean {
  return words.length >= 1;
}

/** Translate MCQ: need at least 2 words for a binary choice; 4+ is ideal. */
export function canPlayLessonTranslate(words: Word[]): boolean {
  return words.length >= 2;
}

export function canPlayLessonSentence(words: Word[]): boolean {
  return words.some((w) => (w.example_zh ?? '').trim().length > 0);
}
