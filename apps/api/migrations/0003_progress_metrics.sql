-- Migration 0003: adaptive SRS metrics + 'writer' game type

-- Adaptive metrics on user_word_progress
ALTER TABLE user_word_progress ADD COLUMN avg_response_ms INTEGER;
ALTER TABLE user_word_progress ADD COLUMN confidence_avg REAL;

-- SQLite/D1 cannot ALTER a CHECK constraint in place; rebuild table to allow 'writer'.
CREATE TABLE game_sessions_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL CHECK (
    game_type IN ('match', 'translate', 'sentence', 'stroke', 'writer', 'speed_match', 'fill_blank')
  ),
  score INTEGER NOT NULL,
  accuracy REAL,
  duration_seconds INTEGER NOT NULL,
  words_practiced INTEGER,
  xp_earned INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO game_sessions_new (id, user_id, game_type, score, accuracy, duration_seconds, words_practiced, xp_earned, created_at)
SELECT id, user_id, game_type, score, accuracy, duration_seconds, words_practiced, xp_earned, created_at
FROM game_sessions;

DROP TABLE game_sessions;
ALTER TABLE game_sessions_new RENAME TO game_sessions;

CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created ON game_sessions(created_at);
