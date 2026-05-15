import type { Chapter } from '../../lib/types';

/** JLPT N5 anchor chapter (id=1 or jlpt_level=1). */
export function getPrimaryHsk1Chapter(chapters: Chapter[]): Chapter | null {
  const byId = chapters.find((c) => c.id === 1 && c.jlpt_level === 1);
  if (byId) return byId;
  const h1 = chapters.filter((c) => c.jlpt_level === 1).sort((a, b) => a.order_num - b.order_num);
  return h1[0] ?? null;
}

/** Эхний хичээлийн id (order_num хамгийн бага). */
export function getFirstLessonId(chapter: Chapter | null): number | null {
  if (!chapter?.lessons?.length) return null;
  const sorted = [...chapter.lessons].sort((a, b) => a.order_num - b.order_num);
  return sorted[0]?.id ?? null;
}
