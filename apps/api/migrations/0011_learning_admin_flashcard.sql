-- Admin learning path settings + delayed flashcard eligibility
ALTER TABLE chapters ADD COLUMN flashcard_delay_days INTEGER NOT NULL DEFAULT 3;
ALTER TABLE user_word_progress ADD COLUMN flashcard_eligible_at DATETIME;
