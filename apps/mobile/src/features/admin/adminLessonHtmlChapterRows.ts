import type { AdminChapter } from '../../lib/api/admin';

const HSK_LEVELS = [1, 2, 3, 4, 5, 6] as const;

export type ChapterPickRow =
  | { type: 'chapter'; chapter: AdminChapter }
  | { type: 'missing'; hsk: number };

/** One row per HSK 1–6: real chapter chips or a placeholder when no chapter exists for that level. */
export function buildChapterPickRows(chapters: AdminChapter[]): ChapterPickRow[] {
  const rows: ChapterPickRow[] = [];
  for (const hsk of HSK_LEVELS) {
    const list = chapters
      .filter((c) => c.hsk_level === hsk)
      .slice()
      .sort((a, b) => a.order_num - b.order_num || a.id - b.id);
    if (!list.length) rows.push({ type: 'missing', hsk });
    else {
      for (const chapter of list) rows.push({ type: 'chapter', chapter });
    }
  }
  return rows;
}

export function firstSelectableChapterId(chapters: AdminChapter[]): number | null {
  const rows = buildChapterPickRows(chapters);
  const first = rows.find((r): r is Extract<ChapterPickRow, { type: 'chapter' }> => r.type === 'chapter');
  return first?.chapter.id ?? null;
}
