export async function updateStreak(db: D1Database, userId: number): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  const streak = await db.prepare('SELECT * FROM user_streaks WHERE user_id = ?')
    .bind(userId)
    .first<{
      current_streak: number;
      longest_streak: number;
      last_activity_date: string | null;
      total_days_studied: number;
    }>();

  if (!streak) return;
  if (streak.last_activity_date === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const isConsecutive = streak.last_activity_date === yesterday;
  const newStreak = isConsecutive ? streak.current_streak + 1 : 1;
  const newLongest = Math.max(streak.longest_streak, newStreak);

  await db.prepare(
    `UPDATE user_streaks SET
       current_streak = ?, longest_streak = ?,
       last_activity_date = ?, total_days_studied = total_days_studied + 1
     WHERE user_id = ?`
  ).bind(newStreak, newLongest, today, userId).run();
}
