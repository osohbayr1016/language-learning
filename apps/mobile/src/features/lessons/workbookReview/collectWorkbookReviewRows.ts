import type { ImportedLessonContent, ImportedWorkbookItem } from '../../../lib/types';

export type WorkbookReviewRow = {
  sectionTitle: string;
  bank?: string[];
  item: ImportedWorkbookItem;
};

export function collectWorkbookReviewRows(content: ImportedLessonContent): WorkbookReviewRow[] {
  const out: WorkbookReviewRow[] = [];
  for (const sec of content.workbook?.sections ?? []) {
    const sectionTitle = sec.title?.trim() || sec.type || '';
    for (const item of sec.items) {
      if (!item.q?.trim()) continue;
      out.push({ sectionTitle, bank: sec.bank, item });
    }
  }
  return out;
}

export function workbookReviewRowCount(content: ImportedLessonContent): number {
  return collectWorkbookReviewRows(content).length;
}
