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
  textbook_unit?: string | null;
};

export type WordWithProgress = Word & {
  ease_factor: number | null;
  interval: number | null;
  repetitions: number | null;
  next_review: string | null;
  last_reviewed: string | null;
  flashcard_eligible_at?: string | null;
};

export type LessonProgress = {
  best_accuracy: number;
  attempts: number;
  completed_at: string | null;
};

export type ImportedDialogueLine = { speaker?: string; cn: string; mn: string };
export type ImportedDialogue = {
  no: number;
  title: string;
  lines?: ImportedDialogueLine[];
  text_cn?: string;
  text_mn?: string;
};
export type ImportedNote = { title: string; body: string };
export type ImportedWorkbookItem = {
  q: string;
  options?: string[];
  answer?: string | boolean | null;
  parts?: string[];
};
export type ImportedWorkbookSection = {
  type: string;
  title: string;
  bank?: string[];
  items: ImportedWorkbookItem[];
};
export type ImportedLessonContent = {
  external_lesson_id: string;
  title_cn: string;
  title_mn: string;
  source: string;
  summary: string;
  dialogues: ImportedDialogue[];
  vocab: { hanzi: string; pinyin: string; meaning_mn: string; hsk_level: number }[];
  grammar: ImportedNote[];
  slang: ImportedNote[];
  workbook: { sections: ImportedWorkbookSection[] };
  quizlet_text: string;
  mock_exam_template_id?: number;
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
  locked_below_advance_gate?: boolean;
};

export type LessonDetail = {
  id: number;
  chapter_id: number;
  chapter_hsk_level?: HskLevel;
  title_mn: string;
  subtitle_mn: string;
  icon: string;
  order_num: number;
  words: WordWithProgress[];
  imported_content?: ImportedLessonContent | null;
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
