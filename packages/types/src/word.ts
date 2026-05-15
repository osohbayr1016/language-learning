import type { JlptLevel } from './jlpt';
import type { UserWordProgress } from './progress';

export interface Word {
  id: number;
  kanji: string;
  romaji: string;
  romaji_numbered: string;
  kana: string;
  meaning_mn: string;
  meaning_en: string;
  jlpt_level: JlptLevel;
  part_of_speech: string;
  example_jp: string;
  example_romaji: string;
  example_mn: string;
  audio_url?: string;
  stroke_count: number;
  textbook_unit?: string | null;
  created_at: string;
}

export interface WordWithProgress extends Word {
  progress?: UserWordProgress;
}
