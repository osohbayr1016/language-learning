import { useCallback, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { calculateAdaptive, type AdaptiveInputs, type AdaptiveProgressInput } from '../lib/srs/adaptive';
import type { ProgressResult } from '../lib/api/user';

type SessionType = 'flashcard' | 'learn' | 'write' | 'writer';

type Buffer = ProgressResult & { rating: number };

export function useSrsRating(sessionType: SessionType) {
  const { token } = useAuth();
  const { addLocalXp, refresh } = useGamification();
  const buffer = useRef<Buffer[]>([]);

  const record = useCallback(
    (
      wordId: number,
      progress: AdaptiveProgressInput | null,
      inputs: AdaptiveInputs
    ) => {
      const r = calculateAdaptive(progress, inputs);
      const item: Buffer = {
        word_id: wordId,
        rating: r.adjusted_rating,
        ease_factor: r.ease_factor,
        interval: r.interval,
        repetitions: r.repetitions,
        next_review: r.next_review.toISOString(),
        response_ms: r.response_ms,
        confidence: r.confidence,
      };
      buffer.current.push(item);
      return r;
    },
    []
  );

  const flush = useCallback(
    async (xp: number) => {
      if (!token) return;
      const results = buffer.current.map(({ rating: _r, ...rest }) => rest);
      if (results.length === 0) return;
      try {
        await api.user.saveProgress(token, {
          results,
          xp_earned: xp,
          session_type: sessionType,
        });
        addLocalXp(xp);
      } catch (e) {
        console.warn('saveProgress failed', e);
      } finally {
        buffer.current = [];
        void refresh();
      }
    },
    [token, sessionType, addLocalXp, refresh]
  );

  const reset = useCallback(() => { buffer.current = []; }, []);

  return { record, flush, reset, count: () => buffer.current.length };
}
