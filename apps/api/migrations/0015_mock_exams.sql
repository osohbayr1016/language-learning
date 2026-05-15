-- Migration: 0015_mock_exams.sql
-- HSK Mock Exam System

CREATE TABLE IF NOT EXISTS exam_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  jlpt_level INTEGER NOT NULL DEFAULT 1,
  total_questions INTEGER NOT NULL DEFAULT 40,
  duration_minutes INTEGER NOT NULL DEFAULT 35,
  passing_score INTEGER NOT NULL DEFAULT 120,
  max_score INTEGER NOT NULL DEFAULT 200,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id INTEGER NOT NULL REFERENCES exam_templates(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK(section IN ('listening','reading')),
  part_num INTEGER NOT NULL CHECK(part_num BETWEEN 1 AND 4),
  question_num INTEGER NOT NULL,
  question_type TEXT NOT NULL CHECK(question_type IN (
    'picture_match','sentence_picture','dialogue_picture','dialogue_answer',
    'word_picture','read_picture','sentence_match','fill_blank'
  )),
  audio_text TEXT NOT NULL DEFAULT '',
  question_text TEXT NOT NULL DEFAULT '',
  question_romaji TEXT NOT NULL DEFAULT '',
  options JSON DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  order_num INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_eq_template ON exam_questions(template_id, section, part_num);

CREATE TABLE IF NOT EXISTS user_exam_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id INTEGER NOT NULL REFERENCES exam_templates(id),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress','completed','abandoned')),
  listening_score INTEGER NOT NULL DEFAULT 0,
  reading_score INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  passed INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_ues_user ON user_exam_sessions(user_id);

CREATE TABLE IF NOT EXISTS user_exam_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES user_exam_sessions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES exam_questions(id),
  user_answer TEXT,
  is_correct INTEGER NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_uea_session ON user_exam_answers(session_id);
