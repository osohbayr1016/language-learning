import type { Hono } from 'hono';
import type { Env, Variables } from '../../types';
import { jsonBodyInvalid, readJsonBody } from '../../lib/requestJson';

export function registerLessonWordRoutes(admin: Hono<{ Bindings: Env; Variables: Variables }>) {
  admin.get('/lessons/:lessonId/words', async (c) => {
    const lessonId = Number(c.req.param('lessonId'));
    if (!Number.isFinite(lessonId)) return c.json({ error: 'Буруу id' }, 400);
    const rows = await c.env.DB.prepare(
      `SELECT lw.id AS link_id, lw.lesson_id, lw.word_id, lw.order_num,
              w.kanji, w.romaji, w.meaning_mn, w.jlpt_level
       FROM lesson_words lw
       JOIN words w ON w.id = lw.word_id
       WHERE lw.lesson_id = ?
       ORDER BY lw.order_num ASC`
    )
      .bind(lessonId)
      .all();
    return c.json({ data: rows.results ?? [] });
  });

  admin.post('/lessons/:lessonId/words', async (c) => {
    const lessonId = Number(c.req.param('lessonId'));
    if (!Number.isFinite(lessonId)) return c.json({ error: 'Буруу id' }, 400);
    const body = await readJsonBody<{ word_id: number }>(c);
    if (!body) return jsonBodyInvalid(c);
    const wid = Number(body.word_id);
    if (!Number.isFinite(wid)) return c.json({ error: 'word_id шаардлагатай' }, 400);
    const mx = await c.env.DB.prepare(
      'SELECT COALESCE(MAX(order_num), 0) AS m FROM lesson_words WHERE lesson_id = ?'
    )
      .bind(lessonId)
      .first<{ m: number }>();
    const next = Number(mx?.m ?? 0) + 1;
    try {
      await c.env.DB.prepare(
        'INSERT INTO lesson_words (lesson_id, word_id, order_num) VALUES (?, ?, ?)'
      )
        .bind(lessonId, wid, next)
        .run();
    } catch {
      return c.json({ error: 'Энэ үг аль хэдийн хичээлд байна' }, 409);
    }
    return c.json({ message: 'Нэмэгдлээ' }, 201);
  });

  admin.put('/lessons/:lessonId/words/order', async (c) => {
    const lessonId = Number(c.req.param('lessonId'));
    if (!Number.isFinite(lessonId)) return c.json({ error: 'Буруу id' }, 400);
    const body = await readJsonBody<{ word_ids: number[] }>(c);
    if (!body) return jsonBodyInvalid(c);
    const ids = Array.isArray(body.word_ids) ? body.word_ids.map(Number).filter(Number.isFinite) : [];
    const stmts = ids.map((wid, i) =>
      c.env.DB.prepare(
        'UPDATE lesson_words SET order_num = ? WHERE lesson_id = ? AND word_id = ?'
      ).bind(i + 1, lessonId, wid)
    );
    await c.env.DB.batch(stmts);
    return c.json({ message: 'Дараалал шинэчлэгдлээ' });
  });

  admin.delete('/lessons/:lessonId/words/:wordId', async (c) => {
    const lessonId = Number(c.req.param('lessonId'));
    const wordId = Number(c.req.param('wordId'));
    if (!Number.isFinite(lessonId) || !Number.isFinite(wordId)) return c.json({ error: 'Буруу id' }, 400);
    await c.env.DB.prepare('DELETE FROM lesson_words WHERE lesson_id = ? AND word_id = ?')
      .bind(lessonId, wordId)
      .run();
    return c.json({ message: 'Хасагдлаа' });
  });
}
