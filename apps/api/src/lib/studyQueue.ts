const DEFAULT_LIMIT = 20;

/** Study session queue size: overdue SRS rows + new words (HSK≤3), same as GET /api/words/due. */
export async function studyQueueCount(db: D1Database, userId: number, limit = DEFAULT_LIMIT): Promise<number> {
  const overdue = await db
    .prepare(
      `SELECT w.id FROM user_word_progress uwp
       JOIN words w ON w.id = uwp.word_id
       WHERE uwp.user_id = ? AND uwp.next_review <= datetime('now')
       ORDER BY uwp.next_review ASC LIMIT ?`
    )
    .bind(userId, limit)
    .all<{ id: number }>();

  const overdueN = overdue.results?.length ?? 0;
  const newLimit = Math.max(0, limit - overdueN);
  if (newLimit === 0) return overdueN;

  const fresh = await db
    .prepare(
      `SELECT w.id FROM words w
       WHERE w.id NOT IN (SELECT word_id FROM user_word_progress WHERE user_id = ?)
       AND w.hsk_level <= 3
       ORDER BY w.hsk_level ASC, w.id ASC
       LIMIT ?`
    )
    .bind(userId, newLimit)
    .all<{ id: number }>();

  return overdueN + (fresh.results?.length ?? 0);
}
