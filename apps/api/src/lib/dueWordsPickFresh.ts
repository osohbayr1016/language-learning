type LwRow = { lesson_id: number; word_id: number; order_num: number };

export async function pickFreshFromLessons(
  db: D1Database,
  wordLessonOrder: number[],
  need: number,
  seen: Set<number>,
  inProgress: Set<number>,
  maxJlpt: number,
  writerSql: string
): Promise<Record<string, unknown>[]> {
  if (wordLessonOrder.length === 0 || need <= 0) return [];

  const placeholders = wordLessonOrder.map(() => '?').join(',');
  const lwR = await db
    .prepare(
      `SELECT lesson_id, word_id, order_num FROM lesson_words
       WHERE lesson_id IN (${placeholders})`
    )
    .bind(...wordLessonOrder)
    .all();

  const idx = new Map(wordLessonOrder.map((id, i) => [id, i]));
  const rows = ((lwR.results ?? []) as LwRow[]).sort((a, b) => {
    const ia = idx.get(a.lesson_id) ?? 9999;
    const ib = idx.get(b.lesson_id) ?? 9999;
    if (ia !== ib) return ia - ib;
    return a.order_num - b.order_num || a.word_id - b.word_id;
  });

  const orderedIds: number[] = [];
  const dup = new Set<number>();
  for (const r of rows) {
    if (dup.has(r.word_id)) continue;
    dup.add(r.word_id);
    orderedIds.push(r.word_id);
  }

  const candidates = orderedIds.filter((id) => !seen.has(id) && !inProgress.has(id));
  if (candidates.length === 0) return [];

  const ph = candidates.map(() => '?').join(',');
  const batchR = await db
    .prepare(
      `SELECT w.*, NULL AS ease_factor, 0 AS interval, 0 AS repetitions, NULL AS next_review
       FROM words w WHERE w.id IN (${ph})
         AND w.jlpt_level <= ?${writerSql}`
    )
    .bind(...candidates, maxJlpt)
    .all();

  const byId = new Map(
    (batchR.results ?? []).map((row) => [(row as { id: number }).id, row as Record<string, unknown>])
  );

  const fresh: Record<string, unknown>[] = [];
  for (const id of candidates) {
    if (fresh.length >= need) break;
    const row = byId.get(id);
    if (!row) continue;
    seen.add(id);
    fresh.push(row);
  }
  return fresh;
}
