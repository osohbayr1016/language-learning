import type { Chapter, HskLevel, Lesson } from '../../lib/types';

export function uniqueSortedHskLevels(chapters: Chapter[]): HskLevel[] {
  const s = new Set<HskLevel>();
  for (const c of chapters) s.add(c.hsk_level);
  return Array.from(s).sort((a, b) => a - b);
}

/** Эхний дуусаагүй, түгжээгүй хичээл (chapter order_num, дотор lesson order_num). */
export function findNextLesson(chapters: Chapter[]): { lesson: Lesson; chapter: Chapter } | null {
  const sorted = [...chapters].sort((a, b) => a.order_num - b.order_num);
  for (const ch of sorted) {
    const isLocked = ch.is_published === 0;
    if (isLocked) continue;
    const lessons = [...ch.lessons].sort((a, b) => a.order_num - b.order_num);
    for (const lesson of lessons) {
      if (lesson.is_published === 0) continue;
      if (!lesson.progress?.completed_at) return { lesson, chapter: ch };
    }
  }
  return null;
}

/** Нийтлэгдсэн бүлэг + хичээлээр HSK түвшин тус бүрээр тоолно. */
export function publishedLessonCountByHsk(chapters: Chapter[]): Record<HskLevel, number> {
  const acc: Record<HskLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const ch of chapters) {
    if (ch.is_published === 0) continue;
    for (const l of ch.lessons) {
      if (l.is_published === 0) continue;
      acc[ch.hsk_level] += 1;
    }
  }
  return acc;
}

/** Хичээл сонгох модалд — түвшний шүүлт, зөвхөн нийтлэгдсэн бүлэг/хичээл. */
export function chaptersForLessonPrepPicker(chapters: Chapter[], hskLevel: HskLevel | null): Chapter[] {
  let list = chapters;
  if (hskLevel != null) list = list.filter((ch) => ch.hsk_level === hskLevel);
  return list
    .filter((ch) => ch.is_published !== 0)
    .map((ch) => ({
      ...ch,
      lessons: [...ch.lessons].filter((l) => l.is_published !== 0).sort((a, b) => a.order_num - b.order_num),
    }))
    .filter((ch) => ch.lessons.length > 0)
    .sort((a, b) => a.order_num - b.order_num);
}
