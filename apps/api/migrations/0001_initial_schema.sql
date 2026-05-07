-- Migration: 0001_initial_schema.sql
-- Chinese Learning App - Full D1 Schema

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- REFRESH TOKENS
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- ============================================================
-- WORDS (VOCABULARY)
-- ============================================================
CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  pinyin_numbered TEXT NOT NULL,
  tones TEXT NOT NULL DEFAULT '[]',        -- JSON array e.g. [3,3]
  meaning_mn TEXT NOT NULL,
  meaning_en TEXT NOT NULL DEFAULT '',
  hsk_level INTEGER NOT NULL CHECK(hsk_level BETWEEN 1 AND 6),
  part_of_speech TEXT NOT NULL DEFAULT 'noun',
  example_zh TEXT NOT NULL DEFAULT '',
  example_pinyin TEXT NOT NULL DEFAULT '',
  example_mn TEXT NOT NULL DEFAULT '',
  audio_url TEXT,
  stroke_count INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_words_hsk ON words(hsk_level);
CREATE INDEX IF NOT EXISTS idx_words_hanzi ON words(hanzi);

-- ============================================================
-- AUDIO CACHE
-- ============================================================
CREATE TABLE IF NOT EXISTS audio_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  audio_key TEXT NOT NULL,     -- R2 object key
  audio_url TEXT NOT NULL,     -- Public CDN URL
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_audio_cache_word ON audio_cache(word_id);

-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_mn TEXT NOT NULL,
  title_zh TEXT NOT NULL DEFAULT '',
  description_mn TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT,
  video_url TEXT,
  hsk_level INTEGER NOT NULL DEFAULT 1 CHECK(hsk_level BETWEEN 1 AND 6),
  word_count INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER REFERENCES users(id),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_hsk ON courses(hsk_level);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);

-- ============================================================
-- LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title_mn TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  word_count INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);

-- ============================================================
-- COURSE WORDS (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS course_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  UNIQUE(course_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_course_words_course ON course_words(course_id);
CREATE INDEX IF NOT EXISTS idx_course_words_word ON course_words(word_id);

-- ============================================================
-- LESSON WORDS (many-to-many)
-- ============================================================
CREATE TABLE IF NOT EXISTS lesson_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  UNIQUE(lesson_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_words_lesson ON lesson_words(lesson_id);

-- ============================================================
-- USER WORD PROGRESS (SRS)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_word_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval INTEGER NOT NULL DEFAULT 0,        -- days
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_reviewed DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user ON user_word_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_review ON user_word_progress(user_id, next_review);
CREATE INDEX IF NOT EXISTS idx_progress_word ON user_word_progress(word_id);

-- ============================================================
-- USER STREAKS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_streaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  total_days_studied INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_streaks_user ON user_streaks(user_id);

-- ============================================================
-- USER STATS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  words_learned INTEGER NOT NULL DEFAULT 0,
  words_mastered INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_stats_user ON user_stats(user_id);

-- ============================================================
-- GAME SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS game_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL CHECK(game_type IN ('match','speed_match','fill_blank','stroke')),
  score INTEGER NOT NULL DEFAULT 0,
  accuracy REAL NOT NULL DEFAULT 0.0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  words_practiced INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_type ON game_sessions(game_type);
