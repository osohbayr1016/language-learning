ALTER TABLE words ADD COLUMN textbook_unit TEXT;

CREATE INDEX IF NOT EXISTS idx_words_textbook_unit ON words(textbook_unit);
