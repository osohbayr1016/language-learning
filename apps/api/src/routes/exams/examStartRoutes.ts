import { Hono } from 'hono';
import type { Env, Variables } from '../../types';
import { omitExamQuestionAnswer } from './examOmit';
import type { QRow } from './examTypes';

export async function sessionRowLatest(
  uid: number,
  tid: number,
  db: D1Database
): Promise<{ id?: number } | null> {
  return db
    .prepare(
      `SELECT id FROM user_exam_sessions WHERE user_id = ? AND template_id = ?
       ORDER BY id DESC LIMIT 1`
    )
    .bind(uid, tid)
    .first() as Promise<{ id?: number } | null>;
}

export function registerExamStartRoutes(app: Hono<{ Bindings: Env; Variables: Variables }>) {
  app.get('/templates', async (c) => {
    const rows = (
      await c.env.DB.prepare(
        `SELECT id, title, hsk_level, total_questions, duration_minutes,
                passing_score, max_score FROM exam_templates
         WHERE is_published = 1 ORDER BY hsk_level ASC, id ASC`
      ).all()
    ).results;

    const { sub } = c.get('user');
    const best = (await c.env.DB
      .prepare(
        `SELECT MAX(total_score) AS best_score,
                MAX(CASE WHEN passed = 1 THEN 1 ELSE 0 END) AS passed_any
         FROM user_exam_sessions WHERE user_id = ?`
      )
      .bind(sub)
      .first()) as { best_score?: number; passed_any?: number } | null;

    return c.json({
      data: rows ?? [],
      my_mock: {
        best_total_score: best?.best_score ?? 0,
        has_passed: Boolean(best?.passed_any),
      },
    });
  });

  app.post('/templates/:tid/start', async (c) => {
    const tid = Number(c.req.param('tid'));
    const { sub } = c.get('user');
    if (!Number.isFinite(tid)) return c.json({ error: 'Буруу template' }, 400);

    const tmpl = (await c.env.DB.prepare(
      `SELECT id, duration_minutes FROM exam_templates WHERE id = ? AND is_published = 1`
    )
      .bind(tid)
      .first()) as { id?: number; duration_minutes?: number } | null;

    if (!tmpl?.id) return c.json({ error: 'Шаблон олдсонгүй' }, 404);

    await c.env.DB
      .prepare(
        `INSERT INTO user_exam_sessions (user_id, template_id, status)
         VALUES (?, ?, 'in_progress')`
      )
      .bind(sub, tid)
      .run();

    const last = await sessionRowLatest(sub, tid, c.env.DB);
    const sessionIdResolved = Number(last?.id ?? 0);

    await c.env.DB
      .prepare(
        `UPDATE user_exam_sessions SET status='abandoned'
         WHERE user_id = ? AND template_id = ?
           AND status = 'in_progress' AND id != ?`
      )
      .bind(sub, tid, sessionIdResolved)
      .run();

    const qs = (
      (
        await c.env.DB
          .prepare(
            `SELECT id, template_id, section, part_num, question_num,
                    question_type, audio_text, question_text,
                    question_pinyin, options, order_num
             FROM exam_questions WHERE template_id = ? ORDER BY order_num ASC`
          )
          .bind(tid)
          .all()
      ).results ?? []
    ) as QRow[];

    return c.json({
      data: {
        session_id: sessionIdResolved,
        duration_minutes: tmpl.duration_minutes ?? 35,
        questions: qs.map(omitExamQuestionAnswer),
      },
    });
  });
}
