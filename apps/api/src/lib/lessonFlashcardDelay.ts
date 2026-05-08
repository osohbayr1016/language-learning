/** ISO datetime when word may enter mixed flashcard queue (after lesson intro). */
export async function computeLessonFlashcardEligibleAt(
  db: D1Database,
  lessonId: number
): Promise<string> {
  const row = await db
    .prepare(
      `SELECT COALESCE(c.flashcard_delay_days, 3) AS d
       FROM lessons l JOIN chapters c ON c.id = l.chapter_id WHERE l.id = ?`
    )
    .bind(lessonId)
    .first<{ d: number }>();
  const days = Math.max(0, Math.floor(Number(row?.d ?? 3)));
  const dt = new Date();
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString();
}
