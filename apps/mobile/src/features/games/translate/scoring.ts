const FAST_BONUS_MS = 2500;
const SLOW_PENALTY_MS = 7000;

export function timingScore(responseMs: number, isCorrect: boolean): number {
  if (!isCorrect) return -3;
  const base = 10;
  if (responseMs <= FAST_BONUS_MS) return base + 6;
  if (responseMs >= SLOW_PENALTY_MS) return Math.max(2, base - 5);
  const t = (SLOW_PENALTY_MS - responseMs) / (SLOW_PENALTY_MS - FAST_BONUS_MS);
  return Math.round(base + t * 6);
}
