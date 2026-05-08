import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';

const vocab = new Hono<{ Bindings: Env; Variables: Variables }>();

vocab.use('*', authMiddleware);

vocab.get('/', async (c) => {
  const sub = c.get('user').sub;
  const limit = Math.min(Math.max(Number(c.req.query('limit') ?? 40), 1), 100);
  const offset = Math.max(Number(c.req.query('offset') ?? 0), 0);

  const totalRow = await c.env.DB.prepare(
    'SELECT COUNT(*) AS n FROM user_word_progress WHERE user_id = ?'
  )
    .bind(sub)
    .first<{ n: number }>();
  const total = Number(totalRow?.n ?? 0);

  const rows = await c.env.DB.prepare(
    `SELECT w.*, uwp.ease_factor, uwp.interval, uwp.repetitions, uwp.next_review,
            uwp.last_reviewed, uwp.flashcard_eligible_at
     FROM user_word_progress uwp
     JOIN words w ON w.id = uwp.word_id
     WHERE uwp.user_id = ?
     ORDER BY
       CASE WHEN uwp.last_reviewed IS NULL THEN 1 ELSE 0 END,
       uwp.last_reviewed DESC,
       uwp.next_review ASC
     LIMIT ? OFFSET ?`
  )
    .bind(sub, limit, offset)
    .all();

  return c.json({
    data: rows.results ?? [],
    total,
    limit,
    offset,
    has_more: offset + limit < total,
  });
});

/** Allow learner to move word into flashcard queue before delay ends. */
vocab.patch('/:wordId/eligibility', async (c) => {
  const sub = c.get('user').sub;
  const wordId = Number(c.req.param('wordId'));
  if (!Number.isFinite(wordId)) return c.json({ error: 'Буруу id' }, 400);

  const r = await c.env.DB.prepare(
    `UPDATE user_word_progress SET flashcard_eligible_at = datetime('now')
     WHERE user_id = ? AND word_id = ?`
  )
    .bind(sub, wordId)
    .run();

  if (!r.meta?.changes) return c.json({ error: 'Явц олдсонгүй' }, 404);
  return c.json({ message: 'Боловсорлоо' });
});

export default vocab;
