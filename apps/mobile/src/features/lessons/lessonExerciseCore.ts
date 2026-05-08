import type { ExerciseKind } from './types';

export const LESSON_KIND_PLAN: ExerciseKind[] = [
  'memorize',
  'choose-word',
  'listen-mcq',
  'choose-word',
  'true-false',
  'arrange-words',
  'fill-blank',
  'memorize',
  'choose-word',
  'arrange-words',
  'match-pairs',
  'say-sentence',
];

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Ижил төрөл дарааллаар давтагдахаас аль болох сааруулна. */
export function staggerKinds(plan: ExerciseKind[]): ExerciseKind[] {
  const p = plan.slice();
  let prev: ExerciseKind | null = null;
  for (let i = 0; i < p.length; i++) {
    let k = p[i]!;
    if (prev !== null && k === prev) {
      const swapIdx = p.findIndex((x, j) => j > i && x !== prev);
      if (swapIdx > i) {
        [p[i], p[swapIdx]] = [p[swapIdx]!, p[i]!];
        k = p[i]!;
      }
    }
    prev = k;
  }
  return p;
}
