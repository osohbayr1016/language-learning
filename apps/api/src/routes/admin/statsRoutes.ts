import type { Hono } from 'hono';
import type { Env, Variables } from '../../types';
import { fetchAdminStats } from '../../lib/adminStats';
import { fetchFullLessonTree } from '../../lib/fullLessonTree';

export function registerStatsRoutes(admin: Hono<{ Bindings: Env; Variables: Variables }>) {
  admin.get('/stats', async (c) => {
    const data = await fetchAdminStats(c.env.DB);
    return c.json({ data });
  });

  admin.get('/lesson-tree', async (c) => {
    const data = await fetchFullLessonTree(c.env.DB);
    return c.json({ data });
  });
}
