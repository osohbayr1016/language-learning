import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';
import { fetchDueWordsQueue } from '../lib/dueWordsQueue';
import { jsonBodyInvalid, readJsonBody } from '../lib/requestJson';

const words = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/words — public
words.get('/', async (c) => {
  const jlpt = c.req.query('jlpt');
  const limit = Math.min(Number(c.req.query('limit') ?? 50), 200);
  const offset = Number(c.req.query('offset') ?? 0);
  const search = c.req.query('q');
  const singleCharRaw = c.req.query('single_char');
  const singleChar =
    singleCharRaw === '1' || singleCharRaw === 'true' || singleCharRaw === 'yes';

  let query = 'SELECT * FROM words WHERE 1=1';
  let countSql = 'SELECT COUNT(*) AS count FROM words WHERE 1=1';
  const params: (string | number)[] = [];
  const countParams: (string | number)[] = [];

  if (jlpt) {
    query += ' AND jlpt_level = ?';
    countSql += ' AND jlpt_level = ?';
    params.push(Number(jlpt));
    countParams.push(Number(jlpt));
  }

  if (search) {
    query += ' AND (kanji LIKE ? OR romaji LIKE ? OR meaning_mn LIKE ?)';
    countSql += ' AND (kanji LIKE ? OR romaji LIKE ? OR meaning_mn LIKE ?)';
    const p = `%${search}%`;
    params.push(p, p, p);
    countParams.push(p, p, p);
  }

  if (singleChar) {
    query += ' AND LENGTH(kanji) <= 3';  // Japanese single kana chars (1 char = up to 3 bytes UTF-8)
    countSql += ' AND LENGTH(kanji) <= 3';
  }

  const textbookUnit = (c.req.query('textbook_unit') ?? '').trim();
  if (textbookUnit) {
    query += ' AND textbook_unit = ?';
    countSql += ' AND textbook_unit = ?';
    params.push(textbookUnit);
    countParams.push(textbookUnit);
  }

  query += ' ORDER BY jlpt_level ASC, id ASC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows, total] = await Promise.all([
    c.env.DB.prepare(query).bind(...params).all(),
    c.env.DB.prepare(countSql).bind(...countParams).first<{ count: number }>(),
  ]);

  return c.json({
    data: rows.results,
    total: total?.count ?? 0,
    page: Math.floor(offset / limit) + 1,
    limit,
    has_more: offset + limit < (total?.count ?? 0),
  });
});

// GET /api/words/due — protected SRS + lesson-path vocabulary (optional mode=writer)
words.get('/due', authMiddleware, async (c) => {
  const { sub } = c.get('user');
  const limit = Number(c.req.query('limit') ?? 20);
  const writerOnly = (c.req.query('mode') ?? '') === 'writer';

  const data = await fetchDueWordsQueue(c.env.DB, sub, limit, { writerOnly });
  return c.json({ data });
});

// GET /api/words/:id — public
words.get('/:id', async (c) => {
  const word = await c.env.DB.prepare(
    'SELECT * FROM words WHERE id = ?'
  ).bind(c.req.param('id')).first();

  if (!word) return c.json({ error: 'Үг олдсонгүй' }, 404);

  return c.json({ data: word });
});

// POST /api/words — admin only
words.post('/', authMiddleware, adminMiddleware, async (c) => {
  const body = await readJsonBody<{
    kanji: string;
    romaji: string;
    romaji_numbered?: string;
    kana?: string;
    meaning_mn: string;
    meaning_en?: string;
    jlpt_level: number;
    part_of_speech?: string;
    example_jp?: string;
    example_romaji?: string;
    example_mn?: string;
    stroke_count?: number;
  }>(c);
  if (!body) return jsonBodyInvalid(c);

  const result = await c.env.DB.prepare(
    `INSERT INTO words (kanji, romaji, romaji_numbered, kana, meaning_mn, meaning_en,
     jlpt_level, part_of_speech, example_jp, example_romaji, example_mn, stroke_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  ).bind(
    body.kanji, body.romaji, body.romaji_numbered ?? body.romaji,
    body.kana ?? '',
    body.meaning_mn, body.meaning_en ?? '',
    body.jlpt_level, body.part_of_speech ?? 'noun',
    body.example_jp ?? '', body.example_romaji ?? '', body.example_mn ?? '',
    body.stroke_count ?? 0
  ).first<{ id: number }>();

  return c.json({ data: { id: result?.id }, message: 'Үг нэмэгдлээ' }, 201);
});

// PUT /api/words/:id — admin only
words.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  const body = await readJsonBody<{
    kanji?: string;
    romaji?: string;
    romaji_numbered?: string;
    kana?: string;
    meaning_mn?: string;
    meaning_en?: string;
    jlpt_level?: number;
    part_of_speech?: string;
    example_jp?: string;
    example_romaji?: string;
    example_mn?: string;
    audio_url?: string;
    stroke_count?: number;
  }>(c);
  if (!body) return jsonBodyInvalid(c);
  const id = c.req.param('id');

  await c.env.DB.prepare(
    `UPDATE words SET
       kanji = COALESCE(?, kanji),
       romaji = COALESCE(?, romaji),
       romaji_numbered = COALESCE(?, romaji_numbered),
       kana = COALESCE(?, kana),
       meaning_mn = COALESCE(?, meaning_mn),
       meaning_en = COALESCE(?, meaning_en),
       jlpt_level = COALESCE(?, jlpt_level),
       part_of_speech = COALESCE(?, part_of_speech),
       example_jp = COALESCE(?, example_jp),
       example_romaji = COALESCE(?, example_romaji),
       example_mn = COALESCE(?, example_mn),
       audio_url = COALESCE(?, audio_url),
       stroke_count = COALESCE(?, stroke_count)
     WHERE id = ?`
  ).bind(
    body.kanji ?? null,
    body.romaji ?? null,
    body.romaji_numbered ?? null,
    body.kana ?? null,
    body.meaning_mn ?? null,
    body.meaning_en ?? null,
    body.jlpt_level ?? null,
    body.part_of_speech ?? null,
    body.example_jp ?? null,
    body.example_romaji ?? null,
    body.example_mn ?? null,
    body.audio_url ?? null,
    body.stroke_count ?? null,
    id
  ).run();

  return c.json({ message: 'Үг шинэчлэгдлээ' });
});

// DELETE /api/words/:id — admin only
words.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  await c.env.DB.prepare('DELETE FROM words WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ message: 'Үг устгагдлаа' });
});

export default words;
