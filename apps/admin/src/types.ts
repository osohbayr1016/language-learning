export type Cartoon = {
  id: number;
  title_mn: string;
  description_mn: string;
  thumbnail_url: string | null;
  jlpt_level: number | null;
  duration_s: number;
  is_published: number;
  created_at: string;
};

export type Word = {
  id: number;
  kanji: string;
  romaji: string;
  romaji_numbered?: string;
  kana?: string;
  meaning_mn: string;
  meaning_en?: string;
  jlpt_level: number;
  part_of_speech?: string;
  example_jp?: string;
  example_romaji?: string;
  example_mn?: string;
  audio_url?: string | null;
  stroke_count?: number;
  textbook_unit?: string;
};

export type AdminStats = {
  users: number;
  words: number;
  chapters_total: number;
  chapters_published: number;
  chapters_draft: number;
  lessons_total: number;
  lessons_published: number;
  lessons_draft: number;
  lesson_completions: number;
  lesson_completions_last_7_days: number;
  game_sessions: number;
  cartoons: number;
  lesson_word_links: number;
  distinct_kanji: number;
  words_by_jlpt: Record<string, number>;
  chapters_by_jlpt: Record<string, number>;
  lessons_by_jlpt: Record<string, number>;
};

export type AdminLesson = {
  id: number;
  chapter_id: number;
  title_mn: string;
  subtitle_mn: string;
  icon: string;
  order_num: number;
  is_published: number;
  word_count: number;
};

export type AdminChapter = {
  id: number;
  title_mn: string;
  subtitle_mn: string;
  color: string;
  hsk_level: number;
  order_num: number;
  is_published: number;
  flashcard_delay_days: number;
  lessons: AdminLesson[];
};

export type LessonWordRow = {
  link_id: number;
  lesson_id: number;
  word_id: number;
  order_num: number;
  hanzi: string;
  pinyin: string;
  meaning_mn: string;
  hsk_level: number;
};
