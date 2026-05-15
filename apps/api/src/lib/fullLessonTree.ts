import { safeAll } from './lessonCatalog';

/** All chapters + lessons + word_count for admin editor (includes unpublished). */
export async function fetchFullLessonTree(db: D1Database): Promise<unknown[]> {
  const [chaptersRes, lessonsRes] = await Promise.all([
    safeAll(
      db.prepare(`SELECT id, title_mn, subtitle_mn, color, jlpt_level, order_num, is_published,
                         flashcard_delay_days
                  FROM chapters ORDER BY order_num ASC`).all()
    ),
    safeAll(
      db
        .prepare(
          `SELECT l.id, l.chapter_id, l.title_mn, l.subtitle_mn, l.icon,
                  l.order_num, l.is_published,
                  (SELECT COUNT(*) FROM lesson_words WHERE lesson_id = l.id) AS word_count
           FROM lessons l ORDER BY l.chapter_id ASC, l.order_num ASC`
        )
        .all()
    ),
  ]);

  const lessonsByChapter = new Map<number, unknown[]>();
  for (const row of lessonsRes.results ?? []) {
    const l = row as { id: number; chapter_id: number };
    const list = lessonsByChapter.get(l.chapter_id) ?? [];
    list.push(l);
    lessonsByChapter.set(l.chapter_id, list);
  }

  return (chaptersRes.results ?? []).map((row) => {
    const ch = row as { id: number };
    return { ...ch, lessons: lessonsByChapter.get(ch.id) ?? [] };
  });
}
