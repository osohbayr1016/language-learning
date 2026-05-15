-- Migration: 0005_lessons_path.sql
-- Replaces the old course-bound lessons with a chapter-based course path.

DROP INDEX IF EXISTS idx_lessons_course;
DROP INDEX IF EXISTS idx_lesson_words_lesson;
DROP TABLE IF EXISTS lesson_words;
DROP TABLE IF EXISTS lessons;

CREATE TABLE chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_mn TEXT NOT NULL,
  subtitle_mn TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#FF4B4B',
  jlpt_level INTEGER NOT NULL DEFAULT 1 CHECK(jlpt_level BETWEEN 1 AND 5),
  order_num INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chapters_order ON chapters(order_num);

CREATE TABLE lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title_mn TEXT NOT NULL,
  subtitle_mn TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'book',
  order_num INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_chapter ON lessons(chapter_id, order_num);

CREATE TABLE lesson_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  order_num INTEGER NOT NULL DEFAULT 0,
  UNIQUE(lesson_id, word_id)
);

CREATE INDEX idx_lesson_words_lesson ON lesson_words(lesson_id, order_num);

CREATE TABLE user_lesson_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  best_accuracy REAL NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  completed_at DATETIME,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_user_lesson_progress_user ON user_lesson_progress(user_id);
