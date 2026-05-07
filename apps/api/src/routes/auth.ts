import { Hono } from 'hono';
import { hashPassword, verifyPassword } from '../lib/auth';
import {
  ACCESS_TOKEN_TTL,
  deleteRefreshToken,
  findRefreshTokenOwner,
  issueAccessToken,
  issueRefreshToken,
} from '../lib/tokens';
import type { Env, Variables } from '../types';
import type { LoginRequest, RegisterRequest } from '@chinese-app/types';

const auth = new Hono<{ Bindings: Env; Variables: Variables }>();

auth.post('/register', async (c) => {
  const body = await c.req.json<RegisterRequest>();

  if (!body.email || !body.password || !body.display_name) {
    return c.json({ error: 'Бүх талбарыг бөглөнө үү' }, 400);
  }
  if (body.password.length < 8) {
    return c.json({ error: 'Нууц үг дор хаяж 8 тэмдэгт байх ёстой' }, 400);
  }

  const email = body.email.toLowerCase();
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) {
    return c.json({ error: 'Энэ имэйл хаяг бүртгэлтэй байна' }, 409);
  }

  const password_hash = await hashPassword(body.password);
  const result = await c.env.DB.prepare(
    `INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?) RETURNING id`
  ).bind(email, password_hash, body.display_name).first<{ id: number }>();

  if (!result) return c.json({ error: 'Бүртгэл үүсгэхэд алдаа гарлаа' }, 500);

  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO user_streaks (user_id) VALUES (?)').bind(result.id),
    c.env.DB.prepare('INSERT INTO user_stats (user_id) VALUES (?)').bind(result.id),
  ]);

  const access_token = await issueAccessToken(
    { id: result.id, email, is_admin: false },
    c.env.JWT_SECRET
  );
  const refresh_token = await issueRefreshToken(c.env.DB, result.id);

  return c.json(
    {
      data: { access_token, refresh_token, expires_in: ACCESS_TOKEN_TTL },
      message: 'Бүртгэл амжилттай үүслээ',
    },
    201
  );
});

auth.post('/login', async (c) => {
  const body = await c.req.json<LoginRequest>();
  if (!body.email || !body.password) {
    return c.json({ error: 'Имэйл болон нууц үгээ оруулна уу' }, 400);
  }

  const user = await c.env.DB.prepare(
    'SELECT id, email, password_hash, is_admin, display_name FROM users WHERE email = ?'
  ).bind(body.email.toLowerCase()).first<{
    id: number; email: string; password_hash: string; is_admin: number; display_name: string;
  }>();

  if (!user || !(await verifyPassword(body.password, user.password_hash))) {
    return c.json({ error: 'Имэйл эсвэл нууц үг буруу байна' }, 401);
  }

  const access_token = await issueAccessToken(
    { id: user.id, email: user.email, is_admin: user.is_admin === 1 },
    c.env.JWT_SECRET
  );
  const refresh_token = await issueRefreshToken(c.env.DB, user.id);

  return c.json({
    data: { access_token, refresh_token, expires_in: ACCESS_TOKEN_TTL },
  });
});

auth.post('/refresh', async (c) => {
  const body = await c.req.json<{ refresh_token: string }>();
  if (!body.refresh_token) {
    return c.json({ error: 'Refresh token шаардлагатай' }, 400);
  }

  const stored = await findRefreshTokenOwner(c.env.DB, body.refresh_token);
  if (!stored) return c.json({ error: 'Token хүчингүй' }, 401);

  if (new Date(stored.expires_at) < new Date()) {
    await deleteRefreshToken(c.env.DB, body.refresh_token);
    return c.json({ error: 'Token хугацаа дууссан' }, 401);
  }

  const access_token = await issueAccessToken(
    { id: stored.user_id, email: stored.email, is_admin: stored.is_admin === 1 },
    c.env.JWT_SECRET
  );

  return c.json({ data: { access_token, expires_in: ACCESS_TOKEN_TTL } });
});

auth.post('/logout', async (c) => {
  const body = await c.req.json<{ refresh_token: string }>();
  if (body.refresh_token) {
    await deleteRefreshToken(c.env.DB, body.refresh_token);
  }
  return c.json({ message: 'Амжилттай гарлаа' });
});

export default auth;
