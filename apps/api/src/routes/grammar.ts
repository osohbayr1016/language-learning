import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env, Variables } from '../types';
import { grammarAnswerCorrect } from '../lib/grammarGrade';
import { safeAll } from '../lib/lessonCatalog';

type ExerciseRow = {
  id: number;
  exercise_type: string;
  question_jp: string;
  question_mn: string;
  options: string;
  explanation_mn?: string;
  order_num?: number;
};

function publicExercisePayload(r: ExerciseRow): Record<string, unknown> {
  let opts: unknown[] = [];
  if (typeof r.options === 'string' && r.options) {
    try {
      opts = JSON.parse(r.options) as unknown[];
    } catch {
      opts = [];
    }
  }
  return {
    id: r.id,
    exercise_type: r.exercise_type,
    question_jp: r.question_jp,
    question_mn: r.question_mn ?? '',
    options: opts,
    explanation_mn: r.explanation_mn ?? '',
    order_num: r.order_num ?? 0,
  };
}

const grammar = new Hono<{ Bindings: Env; Variables: Variables }>();
grammar.use('*', authMiddleware);

grammar.get('/', async (c) => {
  const { sub } = c.get('user');
  const gRes = await safeAll<{ id?: number }>(
    c.env.DB
      .prepare(
        `SELECT g.id, g.title_mn, g.title_jp, g.grammar_point, g.jlpt_level, g.order_num,
                p.best_accuracy, p.completed_at AS progress_completed_at,
                (SELECT COUNT(*) FROM grammar_exercises e WHERE e.grammar_lesson_id = g.id) AS exercise_count
         FROM grammar_lessons g
         LEFT JOIN user_grammar_progress p
           ON p.grammar_lesson_id = g.id AND p.user_id = ?
         WHERE g.is_published = 1
         ORDER BY g.jlpt_level ASC, g.order_num ASC`
      )
      .bind(sub)
      .all()
  );
  return c.json({ data: gRes.results ?? [] });
});

grammar.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const { sub } = c.get('user');
  if (!Number.isFinite(id)) return c.json({ error: 'Буруу id' }, 400);
  const lesson = await c.env.DB
    .prepare(
      `SELECT id, title_mn, title_jp, grammar_point, explanation_mn, pattern, examples,
              jlpt_level, order_num
       FROM grammar_lessons WHERE id = ? AND is_published = 1`
    )
    .bind(id)
    .first();

  const row = lesson as Record<string, unknown> | undefined;
  if (!row?.id)
    return c.json({ error: 'Дүрэм олдсонгүй' }, 404);

  const prog = await c.env.DB
    .prepare(
      `SELECT best_accuracy, attempts, completed_at FROM user_grammar_progress
       WHERE user_id = ? AND grammar_lesson_id = ?`
    )
    .bind(sub, id)
    .first();

  const exRows = (
    (
      await c.env.DB
        .prepare(
          `SELECT id, exercise_type, question_jp, question_mn,
                  options, explanation_mn, order_num
           FROM grammar_exercises WHERE grammar_lesson_id = ? ORDER BY order_num ASC`
        )
        .bind(id)
        .all()
    ).results ?? []
  ) as ExerciseRow[];

  return c.json({
    data: {
      ...row,
      progress: prog ?? null,
      exercises: exRows.map((r) => publicExercisePayload(r)),
    },
  });
});

grammar.post('/:id/complete', async (c) => {
  const id = Number(c.req.param('id'));
  const { sub } = c.get('user');
  if (!Number.isFinite(id)) return c.json({ error: 'Буруу id' }, 400);

  const body = await c.req.json<{ answers?: Record<number, unknown> | Record<string, unknown> }>().catch(() => ({
    answers: {},
  }));
  const rawMap = body.answers ?? {};
  const answerByExId = new Map<number, unknown>();
  for (const [k, v] of Object.entries(rawMap)) {
    const nk = Number(k);
    if (Number.isFinite(nk)) answerByExId.set(nk, v);
  }

  const exExists = await c.env.DB
    .prepare(`SELECT 1 FROM grammar_lessons WHERE id = ? AND is_published = 1`)
    .bind(id)
    .first();

  const exLesson = Boolean(exExists);
  if (!exLesson) return c.json({ error: 'Дүрэм олдсонгүй' }, 404);

  const rows = (
    (
      await c.env.DB
        .prepare(
          `SELECT id, exercise_type, correct_answer FROM grammar_exercises WHERE grammar_lesson_id = ?`
        )
        .bind(id)
        .all()
    ).results ?? []
  ) as { id: number; exercise_type: string; correct_answer: string }[];

  let hits = 0;
  for (const er of rows) {
    const ans = answerByExId.get(er.id);
    if (grammarAnswerCorrect(er.exercise_type, ans, er.correct_answer))
      hits++;
  }

  const acc = rows.length ? hits / rows.length : 1;

  await c.env.DB
    .prepare(
      `INSERT INTO user_grammar_progress
        (user_id, grammar_lesson_id, best_accuracy, attempts, completed_at, updated_at)
       VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, grammar_lesson_id) DO UPDATE SET
         best_accuracy = MAX(user_grammar_progress.best_accuracy, excluded.best_accuracy),
         attempts = user_grammar_progress.attempts + 1,
         completed_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP`
    )
    .bind(sub, id, acc)
    .run();

  return c.json({ ok: true, accuracy: acc, graded: hits, total: rows.length });
});

export default grammar;
