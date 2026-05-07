-- Migration: 0007_insights.sql
-- Persists per-day activity and per-skill stats so the Insights screen never relies on mock data.

CREATE TABLE IF NOT EXISTS user_daily_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date TEXT NOT NULL,
  minutes_studied INTEGER NOT NULL DEFAULT 0,
  sessions_count INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user_date
  ON user_daily_activity(user_id, activity_date);

CREATE TABLE IF NOT EXISTS user_skill_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  hits INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skill)
);

CREATE INDEX IF NOT EXISTS idx_user_skill_stats_user ON user_skill_stats(user_id);

ALTER TABLE user_stats ADD COLUMN lessons_completed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN perfect_lessons INTEGER NOT NULL DEFAULT 0;
ALTER TABLE user_stats ADD COLUMN games_played INTEGER NOT NULL DEFAULT 0;
