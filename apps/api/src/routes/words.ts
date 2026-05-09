import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';
import { fetchDueWordsQueue } from '../lib/dueWordsQueue';

const words = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/words — public
words.get('/', async (c) => {
  const hsk = c.req.query('hsk');
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

  if (hsk) {
    query += ' AND hsk_level = ?';
    countSql += ' AND hsk_level = ?';
    params.push(Number(hsk));
    countParams.push(Number(hsk));
  }

  if (search) {
    query += ' AND (hanzi LIKE ? OR pinyin LIKE ? OR meaning_mn LIKE ?)';
    countSql += ' AND (hanzi LIKE ? OR pinyin LIKE ? OR meaning_mn LIKE ?)';
    const p = `%${search}%`;
    params.push(p, p, p);
    countParams.push(p, p, p);
  }

  if (singleChar) {
    query += ' AND LENGTH(hanzi) = 1';
    countSql += ' AND LENGTH(hanzi) = 1';
  }

  const textbookUnit = (c.req.query('textbook_unit') ?? '').trim();
  if (textbookUnit) {
    query += ' AND textbook_unit = ?';
    countSql += ' AND textbook_unit = ?';
    params.push(textbookUnit);
    countParams.push(textbookUnit);
  }

  query += ' ORDER BY hsk_level ASC, id ASC LIMIT ? OFFSET ?';
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
  const body = await c.req.json();

  const result = await c.env.DB.prepare(
    `INSERT INTO words (hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en,
     hsk_level, part_of_speech, example_zh, example_pinyin, example_mn, stroke_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
  ).bind(
    body.hanzi, body.pinyin, body.pinyin_numbered,
    JSON.stringify(body.tones ?? []),
    body.meaning_mn, body.meaning_en ?? '',
    body.hsk_level, body.part_of_speech ?? 'noun',
    body.example_zh ?? '', body.example_pinyin ?? '', body.example_mn ?? '',
    body.stroke_count ?? 0
  ).first<{ id: number }>();

  return c.json({ data: { id: result?.id }, message: 'Үг нэмэгдлээ' }, 201);
});

// PUT /api/words/:id — admin only
words.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  const body = await c.req.json();
  const id = c.req.param('id');

  await c.env.DB.prepare(
    `UPDATE words SET
       hanzi = COALESCE(?, hanzi),
       pinyin = COALESCE(?, pinyin),
       meaning_mn = COALESCE(?, meaning_mn),
       meaning_en = COALESCE(?, meaning_en),
       hsk_level = COALESCE(?, hsk_level),
       part_of_speech = COALESCE(?, part_of_speech),
       example_zh = COALESCE(?, example_zh),
       example_pinyin = COALESCE(?, example_pinyin),
       example_mn = COALESCE(?, example_mn)
     WHERE id = ?`
  ).bind(
    body.hanzi ?? null, body.pinyin ?? null,
    body.meaning_mn ?? null, body.meaning_en ?? null,
    body.hsk_level ?? null, body.part_of_speech ?? null,
    body.example_zh ?? null, body.example_pinyin ?? null,
    body.example_mn ?? null, id
  ).run();

  return c.json({ message: 'Үг шинэчлэгдлээ' });
});

// DELETE /api/words/:id — admin only
words.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  await c.env.DB.prepare('DELETE FROM words WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ message: 'Үг устгагдлаа' });
});

export default words;
