import { safeAll } from './lessonCatalog';

/** Unlock HSK2+ chapters when user finished all HSK1 lessons OR passed any HSK1 published mock exam. */
export async function passesHsk1AdvanceGate(db: D1Database, userId: number): Promise<boolean> {
  const mockPassRow = await db
    .prepare(
      `SELECT 1 AS ok FROM user_exam_sessions s
       JOIN exam_templates t ON t.id = s.template_id
       WHERE s.user_id = ? AND s.status = 'completed' AND s.passed = 1
         AND t.hsk_level = 1 AND t.is_published = 1
       LIMIT 1`
    )
    .bind(userId)
    .first();
  if (mockPassRow) return true;

  const chap1 = await safeAll(
    db
      .prepare(
        `SELECT id FROM chapters WHERE is_published = 1 AND hsk_level = 1 ORDER BY order_num ASC LIMIT 1`
      )
      .all()
  );
  const hsk1chapterId = (chap1.results[0] as { id: number } | undefined)?.id;
  if (!hsk1chapterId) return false;

  const ls = await safeAll(
    db.prepare(`SELECT id FROM lessons WHERE chapter_id = ? AND is_published = 1`).bind(hsk1chapterId).all()
  );
  const lessonIds = ((ls.results ?? []) as { id: number }[]).map((r) => r.id);
  if (!lessonIds.length) return false;

  const ph = lessonIds.map(() => '?').join(',');
  const prog = await safeAll(
    db
      .prepare(
        `SELECT lesson_id FROM user_lesson_progress
         WHERE user_id = ? AND completed_at IS NOT NULL
           AND lesson_id IN (${ph})`
      )
      .bind(userId, ...lessonIds)
      .all()
  );

  const doneSet = new Set(
    (((prog.results ?? []) as { lesson_id?: number }[]) ?? []).map((r) => Number(r.lesson_id)).filter(
      Number.isFinite
    )
  );
  return lessonIds.every((lid) => doneSet.has(lid));
}

export async function lessonChapterHskLevel(
  db: D1Database,
  lessonId: number
): Promise<number | null> {
  const r = await db
    .prepare(
      `SELECT c.hsk_level AS h FROM lessons l
       JOIN chapters c ON c.id = l.chapter_id
       WHERE l.id = ?`
    )
    .bind(lessonId)
    .first();
  const row = r as { h?: number } | null;
  const h = row?.h ?? null;
  if (h === null || h === undefined) return null;
  return Number(h);
}
