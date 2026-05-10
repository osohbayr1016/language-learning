import type { Chapter, Lesson } from '../../lib/types';

/** Next lesson by `order_num` within the same chapter; null if none. */
export function pickNextLessonInChapter(
  chapters: Chapter[],
  chapterId: number,
  currentOrderNum: number
): Lesson | null {
  const ch = chapters.find((c) => c.id === chapterId);
  const list = ch?.lessons ?? [];
  if (!list.length) return null;
  const sorted = [...list].sort((a, b) => a.order_num - b.order_num);
  const ix = sorted.findIndex((l) => l.order_num === currentOrderNum);
  if (ix < 0 || ix >= sorted.length - 1) return null;
  return sorted[ix + 1] ?? null;
}
