import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';
import { bumpDailyActivity, bumpGamePlayed } from '../lib/activity';
import { updateStreak } from '../lib/streak';
import { addXpToUserStats } from '../lib/progress';

const games = new Hono<{ Bindings: Env; Variables: Variables }>();

games.use('*', authMiddleware);

// POST /api/games/session — save game result
games.post('/session', async (c) => {
  const { sub } = c.get('user');
  const body = await c.req.json<{
    game_type: string;
    score: number;
    accuracy: number;
    duration_seconds: number;
    words_practiced: number;
    xp_earned: number;
  }>();

  await c.env.DB.prepare(
    `INSERT INTO game_sessions (user_id, game_type, score, accuracy, duration_seconds, words_practiced, xp_earned)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    sub, body.game_type, body.score, body.accuracy,
    body.duration_seconds, body.words_practiced, body.xp_earned
  ).run();

  await addXpToUserStats(c.env.DB, sub, body.xp_earned);

  await bumpDailyActivity(c.env.DB, sub, body.duration_seconds);
  await bumpGamePlayed(c.env.DB, sub);
  await updateStreak(c.env.DB, sub);

  return c.json({ message: 'Тоглоом хадгалагдлаа', data: { xp_earned: body.xp_earned } });
});

// GET /api/games/history
games.get('/history', async (c) => {
  const { sub } = c.get('user');
  const limit = Number(c.req.query('limit') ?? 10);

  const history = await c.env.DB.prepare(
    'SELECT * FROM game_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).bind(sub, limit).all();

  return c.json({ data: history.results });
});

// GET /api/games/leaderboard
games.get('/leaderboard', async (c) => {
  const leaderboard = await c.env.DB.prepare(
    `SELECT u.display_name, u.avatar_url, s.total_xp, s.words_mastered,
            st.current_streak
     FROM user_stats s
     JOIN users u ON s.user_id = u.id
     LEFT JOIN user_streaks st ON st.user_id = u.id
     WHERE COALESCE(u.is_admin, 0) = 0
     ORDER BY s.total_xp DESC
     LIMIT 20`
  ).all();

  return c.json({ data: leaderboard.results });
});

export default games;
