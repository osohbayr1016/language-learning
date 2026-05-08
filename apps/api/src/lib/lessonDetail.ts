const NO_USER = -1;

/** Нийтэд нээлттэй хичээлийн нэгж — progress нэгтгэх эсвэл зочин (хоосон SRS). */
export async function fetchPublishedLessonDetail(
  db: D1Database,
  lessonId: number,
  userIdForProgress: number | null
): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false }
> {
  const lesson = await db
    .prepare(
      `SELECT id, chapter_id, title_mn, subtitle_mn, icon, order_num
       FROM lessons WHERE id = ? AND is_published = 1`
    )
    .bind(lessonId)
    .first();

  if (!lesson) return { ok: false };

  const bindUid = userIdForProgress === null ? NO_USER : userIdForProgress;

  const wordsRes = await db
    .prepare(
      `SELECT w.*, lw.order_num,
              uwp.ease_factor, uwp.interval, uwp.repetitions, uwp.next_review
       FROM lesson_words lw
       JOIN words w ON w.id = lw.word_id
       LEFT JOIN user_word_progress uwp ON uwp.word_id = w.id AND uwp.user_id = ?
       WHERE lw.lesson_id = ?
       ORDER BY lw.order_num ASC`
    )
    .bind(bindUid, lessonId)
    .all();

  let myProgress: unknown = null;
  if (userIdForProgress !== null) {
    myProgress = await db
      .prepare(
        `SELECT best_accuracy, attempts, completed_at
         FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?`
      )
      .bind(userIdForProgress, lessonId)
      .first();
  }

  return {
    ok: true,
    data: {
      ...lesson,
      words: wordsRes.results ?? [],
      progress: myProgress ?? null,
    },
  };
}
