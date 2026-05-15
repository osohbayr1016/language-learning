-- Migration 0004: cartoons (videos) + cartoon_words (vocabulary timestamps)

CREATE TABLE IF NOT EXISTS cartoons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_mn TEXT NOT NULL,
  description_mn TEXT NOT NULL DEFAULT '',
  video_key TEXT NOT NULL,           -- R2 object key
  thumbnail_key TEXT,                -- R2 object key for thumbnail
  jlpt_level INTEGER CHECK(jlpt_level BETWEEN 1 AND 5),
  duration_s INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cartoons_published ON cartoons(is_published);
CREATE INDEX IF NOT EXISTS idx_cartoons_jlpt ON cartoons(jlpt_level);

CREATE TABLE IF NOT EXISTS cartoon_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cartoon_id INTEGER NOT NULL REFERENCES cartoons(id) ON DELETE CASCADE,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  start_s REAL NOT NULL DEFAULT 0,
  end_s REAL NOT NULL DEFAULT 0,
  UNIQUE(cartoon_id, word_id, start_s)
);

CREATE INDEX IF NOT EXISTS idx_cartoon_words_cartoon ON cartoon_words(cartoon_id);
CREATE INDEX IF NOT EXISTS idx_cartoon_words_time ON cartoon_words(cartoon_id, start_s);
