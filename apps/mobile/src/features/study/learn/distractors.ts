import type { WordWithProgress } from '../../../lib/types';

export type DistractorDifficulty = 'easy' | 'medium' | 'hard';

export function pickDistractors(
  pool: WordWithProgress[],
  current: WordWithProgress,
  count: number,
  difficulty: DistractorDifficulty
): WordWithProgress[] {
  let candidates = pool.filter((w) => w.id !== current.id);

  if (difficulty === 'hard') {
    candidates = candidates.filter((w) => w.hsk_level === current.hsk_level);
    if (candidates.length < count) {
      candidates = pool.filter((w) => w.id !== current.id);
    }
  } else if (difficulty === 'medium') {
    candidates = candidates.filter((w) => Math.abs(w.hsk_level - current.hsk_level) <= 1);
    if (candidates.length < count) {
      candidates = pool.filter((w) => w.id !== current.id);
    }
  }

  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function difficultyForAccuracy(accuracy: number): DistractorDifficulty {
  if (accuracy >= 0.85) return 'hard';
  if (accuracy >= 0.55) return 'medium';
  return 'easy';
}

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
