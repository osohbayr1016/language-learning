import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';

const user = new Hono<{ Bindings: Env; Variables: Variables }>();

user.use('*', authMiddleware);

// GET /api/user/profile
user.get('/profile', async (c) => {
  const { sub } = c.get('user');

  const profile = await c.env.DB.prepare(
    'SELECT id, email, display_name, avatar_url, created_at FROM users WHERE id = ?'
  ).bind(sub).first();

  if (!profile) return c.json({ error: 'Хэрэглэгч олдсонгүй' }, 404);

  return c.json({ data: profile });
});

// PUT /api/user/profile
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

// GET /api/user/streak
user.get('/streak', async (c) => {
  const { sub } = c.get('user');

  const streak = await c.env.DB.prepare(
    'SELECT * FROM user_streaks WHERE user_id = ?'
  ).bind(sub).first();

  return c.json({ data: streak });
});

// GET /api/user/stats
user.get('/stats', async (c) => {
  const { sub } = c.get('user');

  const stats = await c.env.DB.prepare(
    'SELECT * FROM user_stats WHERE user_id = ?'
  ).bind(sub).first();

  return c.json({ data: stats });
});

// GET /api/user/dashboard
user.get('/dashboard', async (c) => {
  const { sub, email } = c.get('user');

  const [profile, streak, stats, dueCount] = await Promise.all([
    c.env.DB.prepare(
      'SELECT id, email, display_name, avatar_url FROM users WHERE id = ?'
    ).bind(sub).first(),
    c.env.DB.prepare(
      'SELECT * FROM user_streaks WHERE user_id = ?'
    ).bind(sub).first(),
    c.env.DB.prepare(
      'SELECT * FROM user_stats WHERE user_id = ?'
    ).bind(sub).first(),
    c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM user_word_progress
       WHERE user_id = ? AND next_review <= datetime('now')`
    ).bind(sub).first<{ count: number }>(),
  ]);

  return c.json({
    data: {
      user: profile,
      streak,
      stats,
      due_today: dueCount?.count ?? 0,
    },
  });
});

// GET /api/user/due-words
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

// POST /api/user/progress (update SRS after study session)
user.post('/progress', async (c) => {
  const { sub } = c.get('user');
  const body = await c.req.json<{
    results: Array<{
      word_id: number;
      ease_factor: number;
      interval: number;
      repetitions: number;
      next_review: string;
    }>;
    xp_earned: number;
    session_type: string;
  }>();

  const statements = body.results.map((r) =>
    c.env.DB.prepare(
      `INSERT INTO user_word_progress (user_id, word_id, ease_factor, interval, repetitions, next_review, last_reviewed)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, word_id) DO UPDATE SET
         ease_factor = excluded.ease_factor,
         interval = excluded.interval,
         repetitions = excluded.repetitions,
         next_review = excluded.next_review,
         last_reviewed = CURRENT_TIMESTAMP`
    ).bind(sub, r.word_id, r.ease_factor, r.interval, r.repetitions, r.next_review)
  );

  await c.env.DB.batch(statements);

  // Update XP and review count
  await c.env.DB.prepare(
    `UPDATE user_stats SET
       total_xp = total_xp + ?,
       total_reviews = total_reviews + ?,
       words_learned = (
         SELECT COUNT(DISTINCT word_id) FROM user_word_progress
         WHERE user_id = ? AND repetitions >= 1
       )
     WHERE user_id = ?`
  ).bind(body.xp_earned, body.results.length, sub, sub).run();

  // Update streak
  await updateStreak(c.env.DB, sub);

  return c.json({ message: 'Явц хадгалагдлаа', data: { xp_earned: body.xp_earned } });
});

async function updateStreak(db: D1Database, userId: number) {
  const today = new Date().toISOString().split('T')[0];

  const streak = await db.prepare(
    'SELECT * FROM user_streaks WHERE user_id = ?'
  ).bind(userId).first<{
    current_streak: number; longest_streak: number; last_activity_date: string | null;
    total_days_studied: number;
  }>();

  if (!streak) return;

  if (streak.last_activity_date === today) return; // Already studied today

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const isConsecutive = streak.last_activity_date === yesterday;

  const new_streak = isConsecutive ? streak.current_streak + 1 : 1;
  const new_longest = Math.max(streak.longest_streak, new_streak);

  await db.prepare(
    `UPDATE user_streaks SET
       current_streak = ?, longest_streak = ?,
       last_activity_date = ?, total_days_studied = total_days_studied + 1
     WHERE user_id = ?`
  ).bind(new_streak, new_longest, today, userId).run();
}

export default user;
