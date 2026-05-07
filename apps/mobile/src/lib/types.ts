export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type Tone = 0 | 1 | 2 | 3 | 4;

export type Word = {
  id: number;
  hanzi: string;
  pinyin: string;
  pinyin_numbered: string | null;
  tones: string;
  meaning_mn: string;
  meaning_en: string | null;
  hsk_level: HskLevel;
  part_of_speech: string | null;
  example_zh: string | null;
  example_pinyin: string | null;
  example_mn: string | null;
  audio_url: string | null;
  stroke_count: number | null;
};

export type WordWithProgress = Word & {
  ease_factor: number | null;
  interval: number | null;
  repetitions: number | null;
  next_review: string | null;
  last_reviewed: string | null;
};

export type LessonProgress = {
  best_accuracy: number;
  attempts: number;
  completed_at: string | null;
};

export type Lesson = {
  id: number;
  chapter_id: number;
  title_mn: string;
  subtitle_mn: string;
  icon: string;
  order_num: number;
  is_published: number;
  word_count: number;
  progress: LessonProgress | null;
};

export type Chapter = {
  id: number;
  title_mn: string;
  subtitle_mn: string;
  color: string;
  hsk_level: HskLevel;
  order_num: number;
  is_published: number;
  lessons: Lesson[];
};

export type LessonDetail = {
  id: number;
  chapter_id: number;
  title_mn: string;
  subtitle_mn: string;
  icon: string;
  order_num: number;
  words: WordWithProgress[];
  progress: LessonProgress | null;
};

export type SkillKey =
  | 'listening'
  | 'pronunciation'
  | 'tones'
  | 'recall'
  | 'reading'
  | 'stroke';

export type InsightsSummary = {
  longest_streak: number;
  current_streak: number;
  total_days_studied: number;
  lessons_completed: number;
  perfect_lessons: number;
  words_learned: number;
  words_mastered: number;
  games_played: number;
  total_xp: number;
};

export type SkillStat = { hits: number; total: number; ratio: number };
export type InsightsSkills = Record<SkillKey, SkillStat>;

export type DayMinutes = { date: string; minutes: number; sessions?: number };
