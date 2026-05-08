import type { AdminChapter } from '../../lib/api/admin';

export type LessonTreeSection = { title: string; data: AdminChapter[] };

/** Groups chapters by `hsk_level` (1–6); sections ordered by HSK; chapters sorted by `order_num`. */
export function groupLessonTreeByHsk(tree: AdminChapter[]): LessonTreeSection[] {
  const map = new Map<number, AdminChapter[]>();
  for (const ch of tree) {
    const lvl = Math.min(6, Math.max(1, Number(ch.hsk_level) || 1));
    const arr = map.get(lvl) ?? [];
    arr.push(ch);
    map.set(lvl, arr);
  }
  const out: LessonTreeSection[] = [];
  for (let hsk = 1; hsk <= 6; hsk++) {
    const list = map.get(hsk);
    if (!list?.length) continue;
    list.sort((a, b) => a.order_num - b.order_num);
    out.push({ title: `HSK ${hsk}`, data: list });
  }
  return out;
}

export function lessonCount(ch: AdminChapter): number {
  return ch.lessons?.length ?? 0;
}
