export type ProgressResult = {
  word_id: number;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
  response_ms?: number;
  confidence?: number;
};

export function buildProgressStatements(db: D1Database, userId: number, results: ProgressResult[]) {
  return results.map((r) =>
    db.prepare(
      `INSERT INTO user_word_progress (
         user_id, word_id, ease_factor, interval, repetitions, next_review, last_reviewed,
         avg_response_ms, confidence_avg
       )
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
       ON CONFLICT(user_id, word_id) DO UPDATE SET
         ease_factor = excluded.ease_factor,
         interval = excluded.interval,
         repetitions = excluded.repetitions,
         next_review = excluded.next_review,
         last_reviewed = CURRENT_TIMESTAMP,
         avg_response_ms = COALESCE(
           CASE WHEN excluded.avg_response_ms IS NULL THEN user_word_progress.avg_response_ms
                WHEN user_word_progress.avg_response_ms IS NULL THEN excluded.avg_response_ms
                ELSE (user_word_progress.avg_response_ms * 3 + excluded.avg_response_ms) / 4
           END,
           user_word_progress.avg_response_ms
         ),
         confidence_avg = COALESCE(
           CASE WHEN excluded.confidence_avg IS NULL THEN user_word_progress.confidence_avg
                WHEN user_word_progress.confidence_avg IS NULL THEN excluded.confidence_avg
                ELSE (user_word_progress.confidence_avg * 3 + excluded.confidence_avg) / 4.0
           END,
           user_word_progress.confidence_avg
         )`
    ).bind(
      userId, r.word_id, r.ease_factor, r.interval, r.repetitions, r.next_review,
      r.response_ms ?? null, r.confidence ?? null
    )
  );
}

export async function bumpStats(
  db: D1Database,
  userId: number,
  xp: number,
  reviewCount: number
): Promise<void> {
  await db.prepare(
    `UPDATE user_stats SET
       total_xp = total_xp + ?,
       total_reviews = total_reviews + ?,
       words_learned = (
         SELECT COUNT(DISTINCT word_id) FROM user_word_progress
         WHERE user_id = ? AND repetitions >= 1
       )
     WHERE user_id = ?`
  ).bind(xp, reviewCount, userId, userId).run();
}
