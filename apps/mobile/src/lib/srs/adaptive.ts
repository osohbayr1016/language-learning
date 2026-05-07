import { calculateNextReview } from '@chinese-app/srs';
import type { ReviewRating } from '@chinese-app/srs';

export type ConfidenceLevel = 0 | 1 | 2;

export type AdaptiveInputs = {
  rating: ReviewRating;
  responseMs?: number;
  confidence?: ConfidenceLevel;
};

export type AdaptiveProgressInput = {
  ease_factor: number | null;
  interval: number | null;
  repetitions: number | null;
};

const FAST_MS = 2500;
const SLOW_MS = 12000;

function latencyAdjustment(ms: number | undefined, rating: ReviewRating): number {
  if (typeof ms !== 'number') return 0;
  if (rating < 3) return 0;
  if (ms <= FAST_MS) return 1;
  if (ms >= SLOW_MS) return -1;
  return 0;
}

function confidenceAdjustment(c: ConfidenceLevel | undefined): number {
  if (typeof c !== 'number') return 0;
  if (c === 2) return 0;
  if (c === 0) return -1;
  return 0;
}

export function adaptRating({ rating, responseMs, confidence }: AdaptiveInputs): ReviewRating {
  const adjusted = rating + latencyAdjustment(responseMs, rating) + confidenceAdjustment(confidence);
  return Math.max(0, Math.min(5, adjusted)) as ReviewRating;
}

export function calculateAdaptive(
  progress: AdaptiveProgressInput | null,
  inputs: AdaptiveInputs
) {
  const adjusted = adaptRating(inputs);
  const result = calculateNextReview(
    progress
      ? {
          ease_factor: progress.ease_factor ?? 2.5,
          interval: progress.interval ?? 0,
          repetitions: progress.repetitions ?? 0,
        }
      : null,
    adjusted
  );
  return {
    ...result,
    raw_rating: inputs.rating,
    adjusted_rating: adjusted,
    response_ms: inputs.responseMs,
    confidence: inputs.confidence,
  };
}
