import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';
import { registerExamStartRoutes } from './exams/examStartRoutes';
import { registerExamSubmitRoute } from './exams/examSubmitRoutes';

const examsApp = new Hono<{ Bindings: Env; Variables: Variables }>();

examsApp.get('/file/:key', async (c) => {
  const key = decodeURIComponent(c.req.param('key'));
  if (!key.startsWith('exams/')) return c.json({ error: 'Хориглосон' }, 403);
  const obj = await c.env.STORAGE.get(key);
  if (!obj) return c.json({ error: 'Файл олдсонгүй' }, 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=86400');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  return new Response(obj.body, { headers });
});

examsApp.use('*', authMiddleware);

registerExamStartRoutes(examsApp);
registerExamSubmitRoute(examsApp);

export default examsApp;
