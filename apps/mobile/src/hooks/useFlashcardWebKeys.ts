import { useEffect } from 'react';
import { Platform } from 'react-native';
import type { ReviewRating } from '@chinese-app/srs';
import {
  attachWebStudyKeydown,
  webKeyEventIsEditingField,
  type WebStudyKeyEvt,
} from '../lib/webStudyKeys';

const RATING_BY_INDEX: ReviewRating[] = [1, 3, 4, 5];

/** Вэб: Space = эргүүлэх; ар тал дээр 1–4 = Again/Hard/Good/Easy дараалал. */
export function useFlashcardWebKeys(opts: {
  flipped: boolean;
  disabled?: boolean;
  onFlip: () => void;
  onRate: (r: ReviewRating) => void;
}) {
  const { flipped, disabled, onFlip, onRate } = opts;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: WebStudyKeyEvt) => {
      if (disabled || webKeyEventIsEditingField(e)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        onFlip();
        return;
      }
      if (!flipped) return;
      const k = e.key;
      if (k && k >= '1' && k <= '4') {
        e.preventDefault();
        const i = Number(k) - 1;
        onRate(RATING_BY_INDEX[i]!);
      }
    };
    const detach = attachWebStudyKeydown(onKey);
    return () => detach?.();
  }, [disabled, flipped, onFlip, onRate]);
}
