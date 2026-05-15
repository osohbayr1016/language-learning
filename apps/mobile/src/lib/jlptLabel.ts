import type { JlptLevel } from './types';

/** DB `jlpt_level`: 1 = N5 (easiest) … 5 = N1 */
export function jlptNLabel(level: number | JlptLevel): string {
  const n = Number(level);
  if (n < 1 || n > 5) return `JLPT ${n}`;
  return `N${6 - n}`;
}
