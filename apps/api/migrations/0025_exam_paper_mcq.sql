-- Migration: 0025_exam_paper_mcq.sql
-- Add paper_mcq type, optional exam audio (R2 key). Rebuild exam_questions to extend question_type CHECK.

PRAGMA foreign_keys=OFF;

CREATE TABLE exam_questions_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id INTEGER NOT NULL,
  section TEXT NOT NULL CHECK(section IN ('listening','reading')),
  part_num INTEGER NOT NULL CHECK(part_num BETWEEN 1 AND 4),
  question_num INTEGER NOT NULL,
  question_type TEXT NOT NULL CHECK(question_type IN (
    'picture_match','sentence_picture','dialogue_picture','dialogue_answer',
    'word_picture','read_picture','sentence_match','fill_blank','paper_mcq'
  )),
  audio_text TEXT NOT NULL DEFAULT '',
  question_text TEXT NOT NULL DEFAULT '',
  question_romaji TEXT NOT NULL DEFAULT '',
  options JSON DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  order_num INTEGER NOT NULL DEFAULT 0,
  audio_key TEXT
);

INSERT INTO exam_questions_new (
  id, template_id, section, part_num, question_num, question_type,
  audio_text, question_text, question_romaji, options, correct_answer, order_num, audio_key
)
SELECT
  id, template_id, section, part_num, question_num, question_type,
  audio_text, question_text, question_romaji, options, correct_answer, order_num,
  NULL
FROM exam_questions;

DELETE FROM user_exam_answers;
DELETE FROM user_exam_sessions;

DROP TABLE exam_questions;
ALTER TABLE exam_questions_new RENAME TO exam_questions;

CREATE INDEX IF NOT EXISTS idx_eq_template ON exam_questions(template_id, section, part_num);

PRAGMA foreign_keys=ON;
