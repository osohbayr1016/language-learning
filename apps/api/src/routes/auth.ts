import { Hono } from 'hono';
import {
  signJWT,
  verifyJWT,
  hashPassword,
  verifyPassword,
  generateRefreshToken,
} from '../lib/auth';
import type { Env, Variables } from '../types';
import type { LoginRequest, RegisterRequest } from '@chinese-app/types';

const auth = new Hono<{ Bindings: Env; Variables: Variables }>();

const ACCESS_TOKEN_TTL = 60 * 15;       // 15 minutes
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 30; // 30 days

// POST /api/auth/register
auth.post('/register', async (c) => {
  const body = await c.req.json<RegisterRequest>();

  if (!body.email || !body.password || !body.display_name) {
    return c.json({ error: 'Бүх талбарыг бөглөнө үү' }, 400);
  }

  if (body.password.length < 8) {
    return c.json({ error: 'Нууц үг дор хаяж 8 тэмдэгт байх ёстой' }, 400);
  }

  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(body.email.toLowerCase()).first();

  if (existing) {
    return c.json({ error: 'Энэ имэйл хаяг бүртгэлтэй байна' }, 409);
  }

  const password_hash = await hashPassword(body.password);

  const result = await c.env.DB.prepare(
    `INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?) RETURNING id`
  ).bind(body.email.toLowerCase(), password_hash, body.display_name).first<{ id: number }>();

  if (!result) {
    return c.json({ error: 'Бүртгэл үүсгэхэд алдаа гарлаа' }, 500);
  }

  // Initialize streak + stats rows
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO user_streaks (user_id) VALUES (?)').bind(result.id),
    c.env.DB.prepare('INSERT INTO user_stats (user_id) VALUES (?)').bind(result.id),
  ]);

  const access_token = await signJWT(
    { sub: result.id, email: body.email.toLowerCase(), is_admin: false, exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL },
    c.env.JWT_SECRET
  );

  const refresh_token = generateRefreshToken();
  const refresh_hash = await hashPassword(refresh_token);
  const expires_at = new Date(Date.now() + REFRESH_TOKEN_TTL * 1000).toISOString();

  await c.env.DB.prepare(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
  ).bind(result.id, refresh_hash, expires_at).run();

  return c.json({
    data: {
      access_token,
      refresh_token,
      expires_in: ACCESS_TOKEN_TTL,
    },
    message: 'Бүртгэл амжилттай үүслээ',
  }, 201);
});

// POST /api/auth/login
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

  if (!user) {
    return c.json({ error: 'Имэйл эсвэл нууц үг буруу байна' }, 401);
  }

  const valid = await verifyPassword(body.password, user.password_hash);
  if (!valid) {
    return c.json({ error: 'Имэйл эсвэл нууц үг буруу байна' }, 401);
  }

  const access_token = await signJWT(
    {
      sub: user.id,
      email: user.email,
      is_admin: user.is_admin === 1,
      exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL,
    },
    c.env.JWT_SECRET
  );

  const refresh_token = generateRefreshToken();
  const refresh_hash = await hashPassword(refresh_token);
  const expires_at = new Date(Date.now() + REFRESH_TOKEN_TTL * 1000).toISOString();

  await c.env.DB.prepare(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
  ).bind(user.id, refresh_hash, expires_at).run();

  return c.json({
    data: {
      access_token,
      refresh_token,
      expires_in: ACCESS_TOKEN_TTL,
    },
  });
});

// POST /api/auth/refresh
auth.post('/refresh', async (c) => {
  const body = await c.req.json<{ refresh_token: string }>();

  if (!body.refresh_token) {
    return c.json({ error: 'Refresh token шаардлагатай' }, 400);
  }

  const token_hash = await hashPassword(body.refresh_token);
  const stored = await c.env.DB.prepare(
    `SELECT rt.user_id, rt.expires_at, u.email, u.is_admin
     FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id
     WHERE rt.token_hash = ?`
  ).bind(token_hash).first<{ user_id: number; expires_at: string; email: string; is_admin: number }>();

  if (!stored) {
    return c.json({ error: 'Token хүчингүй' }, 401);
  }

  if (new Date(stored.expires_at) < new Date()) {
    await c.env.DB.prepare('DELETE FROM refresh_tokens WHERE token_hash = ?').bind(token_hash).run();
    return c.json({ error: 'Token хугацаа дууссан' }, 401);
  }

  const access_token = await signJWT(
    {
      sub: stored.user_id,
      email: stored.email,
      is_admin: stored.is_admin === 1,
      exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL,
    },
    c.env.JWT_SECRET
  );

  return c.json({
    data: { access_token, expires_in: ACCESS_TOKEN_TTL },
  });
});

// POST /api/auth/logout
auth.post('/logout', async (c) => {
  const body = await c.req.json<{ refresh_token: string }>();

  if (body.refresh_token) {
    const token_hash = await hashPassword(body.refresh_token);
    await c.env.DB.prepare('DELETE FROM refresh_tokens WHERE token_hash = ?').bind(token_hash).run();
  }

  return c.json({ message: 'Амжилттай гарлаа' });
});

export default auth;
