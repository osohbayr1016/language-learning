async function count(db: D1Database, sql: string): Promise<number> {
  const row = await db.prepare(sql).first<{ n: number }>();
  return Number(row?.n ?? 0);
}

const HSK_LEVELS = [1, 2, 3, 4, 5, 6] as const;

function emptyHskCounts(): Record<string, number> {
  const o: Record<string, number> = {};
  for (const h of HSK_LEVELS) o[String(h)] = 0;
  return o;
}

async function countsGroupedByHsk(
  db: D1Database,
  sql: string
): Promise<Record<string, number>> {
  const out = emptyHskCounts();
  const res = await db.prepare(sql).all();
  for (const row of res.results ?? []) {
    const r = row as { hsk_level: number; n: number };
    const lvl = Number(r.hsk_level);
    if (lvl >= 1 && lvl <= 6) out[String(lvl)] = Number(r.n ?? 0);
  }
  return out;
}

export async function fetchAdminStats(db: D1Database) {
  const [
    users,
    words,
    chapters_total,
    chapters_published,
    lessons_total,
    lessons_published,
    lesson_completions,
    lesson_completions_7d,
    game_sessions,
    cartoons,
    lesson_word_links,
    distinct_hanzi,
    words_by_hsk,
    chapters_by_hsk,
    lessons_by_hsk,
  ] = await Promise.all([
    count(db, 'SELECT COUNT(*) AS n FROM users'),
    count(db, 'SELECT COUNT(*) AS n FROM words'),
    count(db, 'SELECT COUNT(*) AS n FROM chapters'),
    count(db, 'SELECT COUNT(*) AS n FROM chapters WHERE is_published = 1'),
    count(db, 'SELECT COUNT(*) AS n FROM lessons'),
    count(db, 'SELECT COUNT(*) AS n FROM lessons WHERE is_published = 1'),
    count(db, 'SELECT COUNT(*) AS n FROM user_lesson_progress WHERE completed_at IS NOT NULL'),
    count(
      db,
      `SELECT COUNT(*) AS n FROM user_lesson_progress
       WHERE completed_at IS NOT NULL AND completed_at >= datetime('now', '-7 days')`
    ),
    count(db, 'SELECT COUNT(*) AS n FROM game_sessions'),
    count(db, 'SELECT COUNT(*) AS n FROM cartoons'),
    count(db, 'SELECT COUNT(*) AS n FROM lesson_words'),
    count(db, 'SELECT COUNT(DISTINCT hanzi) AS n FROM words'),
    countsGroupedByHsk(db, 'SELECT hsk_level, COUNT(*) AS n FROM words GROUP BY hsk_level'),
    countsGroupedByHsk(db, 'SELECT hsk_level, COUNT(*) AS n FROM chapters GROUP BY hsk_level'),
    countsGroupedByHsk(
      db,
      `SELECT c.hsk_level, COUNT(l.id) AS n
       FROM lessons l JOIN chapters c ON c.id = l.chapter_id
       GROUP BY c.hsk_level`
    ),
  ]);

  return {
    users,
    words,
    chapters_total,
    chapters_published,
    chapters_draft: chapters_total - chapters_published,
    lessons_total,
    lessons_published,
    lessons_draft: lessons_total - lessons_published,
    lesson_completions,
    lesson_completions_last_7_days: lesson_completions_7d,
    game_sessions,
    cartoons,
    lesson_word_links,
    distinct_hanzi,
    words_by_hsk,
    chapters_by_hsk,
    lessons_by_hsk,
  };
}
