-- Migration: 0013_grammar_lessons.sql
-- Grammar lessons system for HSK 1

CREATE TABLE IF NOT EXISTS grammar_lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_mn TEXT NOT NULL,
  title_jp TEXT NOT NULL DEFAULT '',
  grammar_point TEXT NOT NULL,
  explanation_mn TEXT NOT NULL DEFAULT '',
  pattern TEXT NOT NULL DEFAULT '',
  examples JSON NOT NULL DEFAULT '[]',
  jlpt_level INTEGER NOT NULL DEFAULT 1,
  order_num INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_grammar_jlpt ON grammar_lessons(jlpt_level, order_num);

CREATE TABLE IF NOT EXISTS grammar_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grammar_lesson_id INTEGER NOT NULL REFERENCES grammar_lessons(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL CHECK(exercise_type IN ('fill_blank','choose_correct','reorder','translate','true_false')),
  question_jp TEXT NOT NULL DEFAULT '',
  question_mn TEXT NOT NULL DEFAULT '',
  correct_answer TEXT NOT NULL,
  options JSON DEFAULT '[]',
  explanation_mn TEXT NOT NULL DEFAULT '',
  order_num INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_grammar_ex ON grammar_exercises(grammar_lesson_id);

CREATE TABLE IF NOT EXISTS user_grammar_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grammar_lesson_id INTEGER NOT NULL REFERENCES grammar_lessons(id) ON DELETE CASCADE,
  best_accuracy REAL NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  completed_at DATETIME,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, grammar_lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_grammar ON user_grammar_progress(user_id);
