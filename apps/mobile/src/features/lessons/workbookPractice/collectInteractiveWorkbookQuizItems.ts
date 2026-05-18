import type { ImportedLessonContent, ImportedWorkbookItem } from '../../../lib/types';

const ABC_ORDER_RE = /^[ABC]-[ABC]-[ABC]$/;

const ALL_ABC_PERM = ['A-B-C', 'A-C-B', 'B-A-C', 'B-C-A', 'C-A-B', 'C-B-A'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function withAbcOrderOptions(item: ImportedWorkbookItem): ImportedWorkbookItem | null {
  if (item.packageExerciseType !== 'sentence_order') return null;
  if (!item.q.includes('排列顺序')) return null;
  const ca = item.answer;
  if (typeof ca !== 'string' || !ABC_ORDER_RE.test(ca)) return null;
  if (!ALL_ABC_PERM.includes(ca)) return null;
  return { ...item, options: shuffle([...ALL_ABC_PERM]) };
}

/** Package workbook items suitable for post-lesson MCQ (choices or ABC order permutations). */
export function collectInteractiveWorkbookQuizItems(content: ImportedLessonContent): ImportedWorkbookItem[] {
  const out: ImportedWorkbookItem[] = [];
  for (const sec of content.workbook?.sections ?? []) {
    for (const item of sec.items) {
      if (!item.gradable) continue;
      const { answer } = item;
      if (answer === null || answer === undefined) continue;
      if (typeof answer === 'boolean') continue;

      const nOpt = item.options?.length ?? 0;
      if (nOpt >= 2) {
        out.push({ ...item, options: shuffle(item.options!) });
        continue;
      }

      const enriched = withAbcOrderOptions(item);
      if (enriched) out.push(enriched);
    }
  }
  return out;
}

export function interactiveWorkbookQuizCount(content: ImportedLessonContent): number {
  return collectInteractiveWorkbookQuizItems(content).length;
}
