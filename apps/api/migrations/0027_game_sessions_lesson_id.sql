-- Optional link to lesson for lesson-scoped game sessions.
ALTER TABLE game_sessions ADD COLUMN lesson_id INTEGER REFERENCES lessons(id) ON DELETE SET NULL;
