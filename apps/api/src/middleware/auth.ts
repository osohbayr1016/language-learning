import { createMiddleware } from 'hono/factory';
import { verifyJWT } from '../lib/auth';
import type { Env, Variables } from '../types';

export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(
  async (c, next) => {
    const authorization = c.req.header('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return c.json({ error: 'Нэвтрэх шаардлагатай', code: 'UNAUTHORIZED' }, 401);
    }

    const token = authorization.slice(7);
    const payload = await verifyJWT(token, c.env.JWT_SECRET);

    if (!payload) {
      return c.json({ error: 'Token хүчингүй болсон', code: 'TOKEN_EXPIRED' }, 401);
    }

    c.set('user', payload);
    await next();
  }
);

export const adminMiddleware = createMiddleware<{ Bindings: Env; Variables: Variables }>(
  async (c, next) => {
    const user = c.get('user');
    if (!user?.is_admin) {
      return c.json({ error: 'Admin эрх шаардлагатай', code: 'FORBIDDEN' }, 403);
    }
    await next();
  }
);
