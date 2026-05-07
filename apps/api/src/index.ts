import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env, Variables } from './types';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import wordRoutes from './routes/words';
import audioRoutes from './routes/audio';
import courseRoutes from './routes/courses';
import gameRoutes from './routes/games';
import cartoonRoutes from './routes/cartoons';
import lessonRoutes from './routes/lessons';
import insightRoutes from './routes/insights';

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// ── Middleware ──────────────────────────────────────────────
app.use('*', logger());

app.use(
  '*',
  cors({
    origin: (origin, c) => {
      const allowed = [
        c.env.CORS_ORIGIN,
        'http://localhost:5173',   // Admin Vite dev
        'http://localhost:8081',   // Expo dev
        'exp://localhost:8081',
      ];
      return allowed.includes(origin) ? origin : allowed[0];
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Health check ────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'ok', version: '1.0.0' }));

// ── Routes ──────────────────────────────────────────────────
app.route('/api/auth', authRoutes);
app.route('/api/user', userRoutes);
app.route('/api/words', wordRoutes);
app.route('/api/audio', audioRoutes);
app.route('/api/courses', courseRoutes);
app.route('/api/games', gameRoutes);
app.route('/api/cartoons', cartoonRoutes);
app.route('/api/lessons', lessonRoutes);
app.route('/api/insights', insightRoutes);

// ── 404 handler ─────────────────────────────────────────────
app.notFound((c) => c.json({ error: 'Route олдсонгүй' }, 404));

// ── Error handler ────────────────────────────────────────────
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: 'Серверт алдаа гарлаа', detail: err.message }, 500);
});

export default app;
