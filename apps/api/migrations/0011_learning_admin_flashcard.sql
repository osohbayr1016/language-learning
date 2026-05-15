-- Admin learning path settings + delayed flashcard eligibility
ALTER TABLE chapters ADD COLUMN flashcard_delay_days INTEGER NOT NULL DEFAULT 3;
-- user_word_progress.flashcard_eligible_at is already in 0001_initial_schema.sql
