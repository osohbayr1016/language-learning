type LessonProgress = {
  best_accuracy: number;
  attempts: number;
  completed_at: string | null;
};

export async function safeAll<T = unknown>(
  p: Promise<{ results?: T[] }>
): Promise<{ results: T[] }> {
  try {
    const r = await p;
    return { results: r.results ?? [] };
  } catch {
    return { results: [] };
  }
}

/** Published chapters + lessons; `progress` null → lesson progress fields are null. */
export async function publishedLessonTree(
  db: D1Database,
  progress: Map<number, LessonProgress> | null
): Promise<unknown[]> {
  const [chaptersRes, lessonsRes] = await Promise.all([
    safeAll(
      db
        .prepare(
          `SELECT id, title_mn, subtitle_mn, color, jlpt_level, order_num, is_published
           FROM chapters WHERE is_published = 1 ORDER BY order_num ASC`
        )
        .all()
    ),
    safeAll(
      db
        .prepare(
          `SELECT l.id, l.chapter_id, l.title_mn, l.subtitle_mn, l.icon,
                  l.order_num, l.is_published,
                  (SELECT COUNT(*) FROM lesson_words WHERE lesson_id = l.id) AS word_count
           FROM lessons l WHERE l.is_published = 1
           ORDER BY l.chapter_id ASC, l.order_num ASC`
        )
        .all()
    ),
  ]);

  const lessonsByChapter = new Map<number, unknown[]>();
  for (const row of lessonsRes.results ?? []) {
    const l = row as { id: number; chapter_id: number };
    const list = lessonsByChapter.get(l.chapter_id) ?? [];
    const prog = progress?.get(l.id) ?? null;
    list.push({ ...l, progress: prog });
    lessonsByChapter.set(l.chapter_id, list);
  }

  return (chaptersRes.results ?? []).map((row) => {
    const ch = row as { id: number };
    return { ...ch, lessons: lessonsByChapter.get(ch.id) ?? [] };
  });
}
