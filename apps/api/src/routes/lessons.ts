import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';
import { updateStreak } from '../lib/streak';
import { buildProgressStatements, bumpStats, type ProgressResult } from '../lib/progress';
import {
  bumpDailyActivity,
  bumpLessonOutcome,
  bumpSkillStats,
  type SkillResults,
} from '../lib/activity';

const lessons = new Hono<{ Bindings: Env; Variables: Variables }>();

lessons.use('*', authMiddleware);

async function safeAll<T = unknown>(p: Promise<{ results?: T[] }>): Promise<{ results: T[] }> {
  try { const r = await p; return { results: r.results ?? [] }; } catch { return { results: [] }; }
}

// GET /api/lessons — chapters joined with their lessons + my progress
lessons.get('/', async (c) => {
  const { sub } = c.get('user');

  const [chaptersRes, lessonsRes, progressRes] = await Promise.all([
    safeAll(
      c.env.DB.prepare(
        `SELECT id, title_mn, subtitle_mn, color, hsk_level, order_num, is_published
         FROM chapters WHERE is_published = 1 ORDER BY order_num ASC`
      ).all()
    ),
    safeAll(
      c.env.DB.prepare(
        `SELECT l.id, l.chapter_id, l.title_mn, l.subtitle_mn, l.icon,
                l.order_num, l.is_published,
                (SELECT COUNT(*) FROM lesson_words WHERE lesson_id = l.id) AS word_count
         FROM lessons l WHERE l.is_published = 1
         ORDER BY l.chapter_id ASC, l.order_num ASC`
      ).all()
    ),
    safeAll(
      c.env.DB.prepare(
        `SELECT lesson_id, best_accuracy, attempts, completed_at
         FROM user_lesson_progress WHERE user_id = ?`
      ).bind(sub).all()
    ),
  ]);

  const progress = new Map<number, { best_accuracy: number; attempts: number; completed_at: string | null }>();
  for (const row of progressRes.results ?? []) {
    const p = row as { lesson_id: number; best_accuracy: number; attempts: number; completed_at: string | null };
    progress.set(p.lesson_id, {
      best_accuracy: p.best_accuracy,
      attempts: p.attempts,
      completed_at: p.completed_at,
    });
  }

  const lessonsByChapter = new Map<number, unknown[]>();
  for (const row of lessonsRes.results ?? []) {
    const l = row as { id: number; chapter_id: number };
    const list = lessonsByChapter.get(l.chapter_id) ?? [];
    list.push({ ...l, progress: progress.get(l.id) ?? null });
    lessonsByChapter.set(l.chapter_id, list);
  }

  const data = (chaptersRes.results ?? []).map((row) => {
    const ch = row as { id: number };
    return { ...ch, lessons: lessonsByChapter.get(ch.id) ?? [] };
  });

  return c.json({ data });
});

// GET /api/lessons/:id — lesson detail with full word rows
lessons.get('/:id', async (c) => {
  const { sub } = c.get('user');
  const id = Number(c.req.param('id'));

  const lesson = await c.env.DB.prepare(
    `SELECT id, chapter_id, title_mn, subtitle_mn, icon, order_num
     FROM lessons WHERE id = ? AND is_published = 1`
  ).bind(id).first();

  if (!lesson) return c.json({ error: 'Хичээл олдсонгүй' }, 404);

  const [wordsRes, myProgress] = await Promise.all([
    c.env.DB.prepare(
      `SELECT w.*, lw.order_num,
              uwp.ease_factor, uwp.interval, uwp.repetitions, uwp.next_review
       FROM lesson_words lw
       JOIN words w ON w.id = lw.word_id
       LEFT JOIN user_word_progress uwp ON uwp.word_id = w.id AND uwp.user_id = ?
       WHERE lw.lesson_id = ?
       ORDER BY lw.order_num ASC`
    ).bind(sub, id).all(),
    c.env.DB.prepare(
      `SELECT best_accuracy, attempts, completed_at
       FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?`
    ).bind(sub, id).first(),
  ]);

  return c.json({
    data: { ...lesson, words: wordsRes.results ?? [], progress: myProgress ?? null },
  });
});

// POST /api/lessons/:id/complete — record results, award XP, bump streak
lessons.post('/:id/complete', async (c) => {
  const { sub } = c.get('user');
  const lessonId = Number(c.req.param('id'));

  const body = await c.req.json<{
    accuracy: number;
    xp_earned: number;
    duration_seconds?: number;
    results?: ProgressResult[];
    skill_results?: SkillResults;
  }>();

  const accuracy = Math.max(0, Math.min(1, body.accuracy));
  const xp = Math.max(0, Math.floor(body.xp_earned));
  const results = body.results ?? [];
  const duration = Math.max(0, Math.floor(body.duration_seconds ?? 0));

  const stmts = [
    c.env.DB.prepare(
      `INSERT INTO user_lesson_progress (user_id, lesson_id, best_accuracy, attempts, completed_at, updated_at)
       VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET
         best_accuracy = MAX(user_lesson_progress.best_accuracy, excluded.best_accuracy),
         attempts = user_lesson_progress.attempts + 1,
         completed_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP`
    ).bind(sub, lessonId, accuracy),
    ...buildProgressStatements(c.env.DB, sub, results),
  ];

  await c.env.DB.batch(stmts);
  await bumpStats(c.env.DB, sub, xp, results.length);
  await updateStreak(c.env.DB, sub);
  await bumpDailyActivity(c.env.DB, sub, duration);
  await bumpLessonOutcome(c.env.DB, sub, accuracy >= 0.95);
  if (body.skill_results) await bumpSkillStats(c.env.DB, sub, body.skill_results);

  return c.json({
    message: 'Хичээл хадгалагдлаа',
    data: { lesson_id: lessonId, accuracy, xp_earned: xp },
  });
});

export default lessons;
