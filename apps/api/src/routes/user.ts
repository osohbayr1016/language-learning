import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';
import { updateStreak } from '../lib/streak';
import { buildProgressStatements, bumpStats, type ProgressResult } from '../lib/progress';

const user = new Hono<{ Bindings: Env; Variables: Variables }>();

user.use('*', authMiddleware);

user.get('/profile', async (c) => {
  const { sub } = c.get('user');
  const profile = await c.env.DB.prepare(
    'SELECT id, email, display_name, avatar_url, created_at FROM users WHERE id = ?'
  ).bind(sub).first();
  if (!profile) return c.json({ error: 'Хэрэглэгч олдсонгүй' }, 404);
  return c.json({ data: profile });
});

user.put('/profile', async (c) => {
  const { sub } = c.get('user');
  const body = await c.req.json<{ display_name?: string; avatar_url?: string }>();
  await c.env.DB.prepare(
    `UPDATE users SET display_name = COALESCE(?, display_name),
     avatar_url = COALESCE(?, avatar_url), updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).bind(body.display_name ?? null, body.avatar_url ?? null, sub).run();
  return c.json({ message: 'Профайл шинэчлэгдлээ' });
});

user.get('/streak', async (c) => {
  const { sub } = c.get('user');
  const streak = await c.env.DB.prepare('SELECT * FROM user_streaks WHERE user_id = ?')
    .bind(sub).first();
  return c.json({ data: streak });
});

user.get('/stats', async (c) => {
  const { sub } = c.get('user');
  const stats = await c.env.DB.prepare('SELECT * FROM user_stats WHERE user_id = ?')
    .bind(sub).first();
  return c.json({ data: stats });
});

user.get('/dashboard', async (c) => {
  const { sub } = c.get('user');
  const [profile, streak, stats, dueCount] = await Promise.all([
    c.env.DB.prepare(
      'SELECT id, email, display_name, avatar_url FROM users WHERE id = ?'
    ).bind(sub).first(),
    c.env.DB.prepare('SELECT * FROM user_streaks WHERE user_id = ?').bind(sub).first(),
    c.env.DB.prepare('SELECT * FROM user_stats WHERE user_id = ?').bind(sub).first(),
    c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM user_word_progress
       WHERE user_id = ? AND next_review <= datetime('now')`
    ).bind(sub).first<{ count: number }>(),
  ]);
  return c.json({
    data: { user: profile, streak, stats, due_today: dueCount?.count ?? 0 },
  });
});

user.get('/due-words', async (c) => {
  const { sub } = c.get('user');
  const limit = Number(c.req.query('limit') ?? 20);
  const dueWords = await c.env.DB.prepare(
    `SELECT w.*, uwp.ease_factor, uwp.interval, uwp.repetitions, uwp.next_review, uwp.last_reviewed
     FROM user_word_progress uwp
     JOIN words w ON uwp.word_id = w.id
     WHERE uwp.user_id = ? AND uwp.next_review <= datetime('now')
     ORDER BY uwp.next_review ASC
     LIMIT ?`
  ).bind(sub, limit).all();
  return c.json({ data: dueWords.results });
});

user.post('/progress', async (c) => {
  const { sub } = c.get('user');
  const body = await c.req.json<{
    results: ProgressResult[];
    xp_earned: number;
    session_type: string;
  }>();

  await c.env.DB.batch(buildProgressStatements(c.env.DB, sub, body.results));
  await bumpStats(c.env.DB, sub, body.xp_earned, body.results.length);
  await updateStreak(c.env.DB, sub);

  return c.json({ message: 'Явц хадгалагдлаа', data: { xp_earned: body.xp_earned } });
});

export default user;
