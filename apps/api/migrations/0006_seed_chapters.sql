-- Migration: 0006_seed_chapters.sql
-- JLPT N5 chapter with 5 lessons, mapped to the 25 JLPT N5 words seeded in 0002.

INSERT INTO chapters (id, title_mn, subtitle_mn, color, jlpt_level, order_num, is_published) VALUES
  (1, 'JLPT N5 — Анхан шат', 'Япон хэлний эхлэл', '#FF4B4B', 1, 1, 1),
  (2, 'JLPT N4 — Үндэс', 'Холбоос ба үг хэллэг',  '#1CB0F6', 2, 2, 0),
  (3, 'JLPT N3 — Дунд шат', 'Илүү гүн агуулга',    '#A560E8', 3, 3, 0);

INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES
  (1, 1, 'Мэндлэх',         'Танилцах эхний үгс',    'hand-right',     1, 1),
  (2, 1, 'Төлөөний үг',     'Би, чи, тэр',           'people',         2, 1),
  (3, 1, 'Үндсэн тэмдэг үг', 'Том, жижиг, сайн',    'checkmark-done', 3, 1),
  (4, 1, 'Хэн бэ?',          'Хүн, орон, тоо',        'school',         4, 1),
  (5, 1, 'Энгийн үйл үг',   'Идэх, уух, явах',       'walk',           5, 1);

-- Lesson 1: Мэндлэх (3 words: こんにちは, ありがとう, さようなら)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (1, 1, 1), (1, 2, 2), (1, 3, 3);

-- Lesson 2: Төлөөний үг (4 words: わたし, あなた, かれ, かのじょ)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (2, 4, 1), (2, 5, 2), (2, 6, 3), (2, 7, 4);

-- Lesson 3: Үндсэн тэмдэг үг (4 words: です, じゃない, いい, おおきい)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (3, 8, 1), (3, 9, 2), (3, 10, 3), (3, 11, 4);

-- Lesson 4: Хэн бэ? (5 words: ちいさい, ひと, にほん, がくせい, せんせい)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (4, 12, 1), (4, 13, 2), (4, 14, 3), (4, 15, 4), (4, 16, 5);

-- Lesson 5: Энгийн үйл үг (6 words: いち, に, さん, たべる, のむ, くる)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (5, 17, 1), (5, 18, 2), (5, 19, 3), (5, 20, 4), (5, 21, 5), (5, 22, 6);
