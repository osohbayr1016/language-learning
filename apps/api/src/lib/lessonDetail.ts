const NO_USER = -1;

async function fetchLessonDetailPayload(
  db: D1Database,
  lessonId: number,
  userIdForProgress: number | null,
  publishedOnly: boolean
): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false }
> {
  const pubClause = publishedOnly ? 'AND l.is_published = 1' : '';
  const lesson = await db
    .prepare(
      `SELECT l.id, l.chapter_id, l.title_mn, l.subtitle_mn, l.icon, l.order_num,
              c.jlpt_level AS chapter_jlpt_level
       FROM lessons l
       JOIN chapters c ON c.id = l.chapter_id
       WHERE l.id = ? ${pubClause}`
    )
    .bind(lessonId)
    .first();

  if (!lesson) return { ok: false };

  const bindUid = userIdForProgress === null ? NO_USER : userIdForProgress;
  const importedContent = await db
    .prepare('SELECT content_json FROM lesson_contents WHERE lesson_id = ?')
    .bind(lessonId)
    .first<{ content_json: string }>();

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
      imported_content: importedContent?.content_json ? JSON.parse(importedContent.content_json) : null,
      progress: myProgress ?? null,
    },
  };
}

/** Нийтэд нээлттэй хичээлийн нэгж — progress нэгтгэх эсвэл зочин (хоосон SRS). */
export async function fetchPublishedLessonDetail(
  db: D1Database,
  lessonId: number,
  userIdForProgress: number | null
): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false }
> {
  return fetchLessonDetailPayload(db, lessonId, userIdForProgress, true);
}

/** Админ урьдчилан харах — нийтлэгдээгүй ч агуулга татах. */
export async function fetchLessonDetailForAdminPreview(
  db: D1Database,
  lessonId: number,
  userIdForProgress: number | null
): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false }
> {
  return fetchLessonDetailPayload(db, lessonId, userIdForProgress, false);
}
