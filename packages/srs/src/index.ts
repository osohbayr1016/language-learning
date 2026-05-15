import type { ReviewRating, UserWordProgress } from '@japanese-learning/types';
export type { ReviewRating } from '@japanese-learning/types';

/**
 * SM-2 (SuperMemo 2) Spaced Repetition Algorithm
 * Same algorithm used by Anki
 * 
 * Rating scale:
 * 0 = total blackout
 * 1 = wrong, remembered after hint
 * 2 = wrong but easy to recall
 * 3 = correct but significant difficulty
 * 4 = correct with small hesitation
 * 5 = perfect instant recall
 */

export interface SRSResult {
  ease_factor: number;
  interval: number;       // days
  repetitions: number;
  next_review: Date;
}

const MIN_EASE_FACTOR = 1.3;
const INITIAL_EASE_FACTOR = 2.5;

export function calculateNextReview(
  progress: Pick<UserWordProgress, 'ease_factor' | 'interval' | 'repetitions'> | null,
  rating: ReviewRating
): SRSResult {
  const ef = progress?.ease_factor ?? INITIAL_EASE_FACTOR;
  const interval = progress?.interval ?? 0;
  const repetitions = progress?.repetitions ?? 0;

  let new_ef = ef;
  let new_interval: number;
  let new_repetitions: number;

  if (rating < 3) {
    // Failed: reset
    new_repetitions = 0;
    new_interval = 1;
    // Slightly reduce ease factor on failure
    new_ef = Math.max(MIN_EASE_FACTOR, ef - 0.2);
  } else {
    // Passed
    new_repetitions = repetitions + 1;

    if (repetitions === 0) {
      new_interval = 1;
    } else if (repetitions === 1) {
      new_interval = 6;
    } else {
      new_interval = Math.round(interval * ef);
    }

    // SM-2 ease factor adjustment
    new_ef = ef + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    new_ef = Math.max(MIN_EASE_FACTOR, new_ef);
  }

  const next_review = new Date();
  next_review.setDate(next_review.getDate() + new_interval);
  // Set to beginning of that day
  next_review.setHours(0, 0, 0, 0);

  return {
    ease_factor: Math.round(new_ef * 100) / 100,
    interval: new_interval,
    repetitions: new_repetitions,
    next_review,
  };
}

/**
 * Get XP earned based on session performance
 */
export function calculateXP(params: {
  type: 'flashcard' | 'learn' | 'write' | 'test' | 'match' | 'stroke';
  correct: number;
  total: number;
  streak_bonus?: number;
}): number {
  const base_xp_per_correct: Record<string, number> = {
    flashcard: 5,
    learn: 8,
    write: 10,
    test: 12,
    match: 6,
    stroke: 10,
  };

  const base = base_xp_per_correct[params.type] ?? 5;
  const accuracy = params.correct / Math.max(params.total, 1);
  const accuracy_bonus = accuracy >= 0.9 ? 1.5 : accuracy >= 0.7 ? 1.2 : 1.0;
  const streak_mult = 1 + (params.streak_bonus ?? 0) * 0.1;

  return Math.round(params.correct * base * accuracy_bonus * streak_mult);
}

/**
 * Check if a word is due for review today
 */
export function isDueForReview(progress: Pick<UserWordProgress, 'next_review'> | null): boolean {
  if (!progress) return true; // New word, always due
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return new Date(progress.next_review) <= today;
}

/**
 * Calculate mastery level from progress
 */
export function getMasteryLevel(
  progress: Pick<UserWordProgress, 'repetitions' | 'ease_factor'> | null
): 'new' | 'learning' | 'review' | 'mastered' {
  if (!progress || progress.repetitions === 0) return 'new';
  if (progress.repetitions < 3) return 'learning';
  if (progress.ease_factor >= 2.5 && progress.repetitions >= 5) return 'mastered';
  return 'review';
}

/**
 * Sort words by priority for study session
 */
export function sortByStudyPriority<T extends { progress?: Pick<UserWordProgress, 'next_review' | 'ease_factor'> | null }>(
  words: T[]
): T[] {
  return [...words].sort((a, b) => {
    const aDate = a.progress?.next_review ? new Date(a.progress.next_review).getTime() : 0;
    const bDate = b.progress?.next_review ? new Date(b.progress.next_review).getTime() : 0;
    // Earlier due date = higher priority
    return aDate - bDate;
  });
}
