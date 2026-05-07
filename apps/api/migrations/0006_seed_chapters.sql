-- Migration: 0006_seed_chapters.sql
-- One HSK1 chapter with 5 lessons, mapped to the 25 HSK1 words seeded in 0002.

INSERT INTO chapters (id, title_mn, subtitle_mn, color, hsk_level, order_num, is_published) VALUES
  (1, 'HSK 1 — Анхан шат', 'Хятад хэлний эхлэл', '#FF9600', 1, 1, 1),
  (2, 'HSK 2 — Үндэс', 'Холбоос ба үг хэллэг',  '#1CB0F6', 2, 2, 0),
  (3, 'HSK 3 — Дунд шат', 'Илүү гүн агуулга',    '#A560E8', 3, 3, 0);

INSERT INTO lessons (id, chapter_id, title_mn, subtitle_mn, icon, order_num, is_published) VALUES
  (1, 1, 'Мэндлэх',         'Танилцах эхний үгс',    'hand-right',     1, 1),
  (2, 1, 'Төлөөний үг',     'Би, чи, тэр',           'people',         2, 1),
  (3, 1, 'Үндсэн үгс',      'Тийм, үгүй, сайн',      'checkmark-done', 3, 1),
  (4, 1, 'Хэн бэ?',          'Хүн, орон, тоо',        'school',         4, 1),
  (5, 1, 'Энгийн үйл үг',   'Идэх, уух, явах',       'walk',           5, 1);

-- Lesson 1: Мэндлэх (3 words: 你好, 谢谢, 再见)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (1, 1, 1), (1, 2, 2), (1, 3, 3);

-- Lesson 2: Төлөөний үг (4 words: 我, 你, 他, 她)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (2, 4, 1), (2, 5, 2), (2, 6, 3), (2, 7, 4);

-- Lesson 3: Үндсэн үгс (6 words: 是, 不, 好, 大, 小, 人)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (3, 8, 1), (3, 9, 2), (3, 10, 3), (3, 11, 4), (3, 12, 5), (3, 13, 6);

-- Lesson 4: Хэн бэ? (6 words: 中国, 学生, 老师, 一, 二, 三)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (4, 14, 1), (4, 15, 2), (4, 16, 3), (4, 17, 4), (4, 18, 5), (4, 19, 6);

-- Lesson 5: Энгийн үйл үг (6 words: 吃, 喝, 来, 去, 看, 说)
INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES
  (5, 20, 1), (5, 21, 2), (5, 22, 3), (5, 23, 4), (5, 24, 5), (5, 25, 6);
