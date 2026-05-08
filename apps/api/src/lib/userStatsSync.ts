/**
 * Reconciles derived columns on user_stats from user_word_progress and user_lesson_progress.
 * Does not modify total_xp, total_reviews, or games_played.
 */
export async function syncUserStatsAggregates(db: D1Database, userId: number): Promise<void> {
  await db.prepare('INSERT OR IGNORE INTO user_stats (user_id) VALUES (?)').bind(userId).run();

  await db
    .prepare(
      `UPDATE user_stats SET
         words_learned = (
           SELECT COUNT(DISTINCT word_id) FROM user_word_progress
           WHERE user_id = ? AND repetitions >= 1
         ),
         words_mastered = (
           SELECT COUNT(DISTINCT word_id) FROM user_word_progress
           WHERE user_id = ? AND repetitions >= 2
         ),
         lessons_completed = (
           SELECT COUNT(*) FROM user_lesson_progress
           WHERE user_id = ? AND completed_at IS NOT NULL
         ),
         perfect_lessons = (
           SELECT COUNT(*) FROM user_lesson_progress
           WHERE user_id = ? AND completed_at IS NOT NULL AND best_accuracy >= 0.95
         )
       WHERE user_id = ?`
    )
    .bind(userId, userId, userId, userId, userId)
    .run();
}
