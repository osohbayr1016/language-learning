-- Stores rich lesson packages imported from app-ready HTML files.

CREATE TABLE IF NOT EXISTS lesson_contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL UNIQUE REFERENCES lessons(id) ON DELETE CASCADE,
  external_lesson_id TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'html_import',
  title_jp TEXT NOT NULL DEFAULT '',
  title_mn TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  content_json TEXT NOT NULL,
  dialogue_count INTEGER NOT NULL DEFAULT 0,
  grammar_count INTEGER NOT NULL DEFAULT 0,
  workbook_count INTEGER NOT NULL DEFAULT 0,
  quizlet_text TEXT NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lesson_contents_lesson ON lesson_contents(lesson_id);
