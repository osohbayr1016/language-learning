import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';

const courses = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/courses — public
courses.get('/', async (c) => {
  const hsk = c.req.query('hsk');
  const limit = Number(c.req.query('limit') ?? 20);
  const offset = Number(c.req.query('offset') ?? 0);

  let query = `SELECT c.*, COUNT(DISTINCT cw.word_id) as word_count
               FROM courses c LEFT JOIN course_words cw ON c.id = cw.course_id
               WHERE c.is_published = 1`;
  const params: (string | number)[] = [];

  if (hsk) {
    query += ' AND c.hsk_level = ?';
    params.push(Number(hsk));
  }

  query += ' GROUP BY c.id ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const rows = await c.env.DB.prepare(query).bind(...params).all();
  return c.json({ data: rows.results });
});

// GET /api/courses/:id — public
courses.get('/:id', async (c) => {
  const id = c.req.param('id');

  const [course, lessons] = await Promise.all([
    c.env.DB.prepare('SELECT * FROM courses WHERE id = ? AND is_published = 1').bind(id).first(),
    c.env.DB.prepare(
      `SELECT l.*, COUNT(lw.word_id) as word_count
       FROM lessons l LEFT JOIN lesson_words lw ON l.id = lw.lesson_id
       WHERE l.course_id = ? GROUP BY l.id ORDER BY l.order_index ASC`
    ).bind(id).all(),
  ]);

  if (!course) return c.json({ error: 'Хичээл олдсонгүй' }, 404);

  return c.json({ data: { ...course, lessons: lessons.results } });
});

// GET /api/courses/:id/words — public
courses.get('/:id/words', async (c) => {
  const id = c.req.param('id');

  const words = await c.env.DB.prepare(
    `SELECT w.* FROM course_words cw JOIN words w ON cw.word_id = w.id
     WHERE cw.course_id = ? ORDER BY cw.order_index ASC`
  ).bind(id).all();

  return c.json({ data: words.results });
});

// ===== ADMIN ROUTES =====

// POST /api/courses — admin
courses.post('/', authMiddleware, adminMiddleware, async (c) => {
  const body = await c.req.json();

  const result = await c.env.DB.prepare(
    `INSERT INTO courses (title_mn, title_zh, description_mn, thumbnail_url, video_url, hsk_level, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`
  ).bind(
    body.title_mn, body.title_zh ?? '',
    body.description_mn ?? '', body.thumbnail_url ?? null,
    body.video_url ?? null, body.hsk_level ?? 1,
    c.get('user').sub
  ).first<{ id: number }>();

  return c.json({ data: { id: result?.id }, message: 'Хичээл үүслээ' }, 201);
});

// PUT /api/courses/:id — admin
courses.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  const body = await c.req.json();
  const id = c.req.param('id');

  await c.env.DB.prepare(
    `UPDATE courses SET
       title_mn = COALESCE(?, title_mn),
       title_zh = COALESCE(?, title_zh),
       description_mn = COALESCE(?, description_mn),
       thumbnail_url = COALESCE(?, thumbnail_url),
       video_url = COALESCE(?, video_url),
       hsk_level = COALESCE(?, hsk_level),
       is_published = COALESCE(?, is_published),
       updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).bind(
    body.title_mn ?? null, body.title_zh ?? null,
    body.description_mn ?? null, body.thumbnail_url ?? null,
    body.video_url ?? null, body.hsk_level ?? null,
    body.is_published != null ? (body.is_published ? 1 : 0) : null,
    id
  ).run();

  return c.json({ message: 'Хичээл шинэчлэгдлээ' });
});

// POST /api/courses/:id/words — admin: add words to course
courses.post('/:id/words', authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json<{ word_ids: number[] }>();

  const statements = body.word_ids.map((wordId, idx) =>
    c.env.DB.prepare(
      `INSERT OR IGNORE INTO course_words (course_id, word_id, order_index) VALUES (?, ?, ?)`
    ).bind(id, wordId, idx)
  );

  await c.env.DB.batch(statements);

  // Update word_count
  await c.env.DB.prepare(
    `UPDATE courses SET word_count = (
       SELECT COUNT(*) FROM course_words WHERE course_id = ?
     ) WHERE id = ?`
  ).bind(id, id).run();

  return c.json({ message: 'Үгнүүд нэмэгдлээ' });
});

// POST /api/upload/presign — admin: get R2 presigned upload URL
courses.post('/upload/presign', authMiddleware, adminMiddleware, async (c) => {
  const body = await c.req.json<{ filename: string; type: 'video' | 'thumbnail' }>();

  const ext = body.filename.split('.').pop();
  const key = `${body.type}s/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  // For Cloudflare R2, generate a presigned URL (1 hour expiry)
  const uploadUrl = await c.env.STORAGE.createMultipartUpload(key);

  return c.json({
    data: {
      key,
      upload_url: uploadUrl,
      public_url: `https://assets.yourdomain.com/${key}`, // Replace with your R2 custom domain
    },
  });
});

// DELETE /api/courses/:id — admin
courses.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  await c.env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(c.req.param('id')).run();
  return c.json({ message: 'Хичээл устгагдлаа' });
});

export default courses;
