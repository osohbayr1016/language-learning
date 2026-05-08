import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  attachWebStudyKeydown,
  webKeyEventIsEditingField,
  type WebStudyKeyEvt,
} from '../lib/webStudyKeys';

/** Вэб: 1–4 сонголт, сум зүүн/баруун, Enter (сүүлийн асуултад илгээх). */
export function useMockExamWebKeys(args: {
  examOptions: string[];
  onPick: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
  onSubmit: () => void;
}) {
  const { examOptions, onPick, onPrev, onNext, isLastQuestion, onSubmit } = args;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: WebStudyKeyEvt) => {
      if (webKeyEventIsEditingField(e)) return;
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
        return;
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        onNext();
        return;
      }
      if (e.key === 'Enter' && isLastQuestion) {
        e.preventDefault();
        onSubmit();
        return;
      }
      const k = e.key;
      if (k && k >= '1' && k <= '4' && examOptions.length) {
        e.preventDefault();
        const idx = Math.min(Number(k) - 1, examOptions.length - 1);
        const v = examOptions[idx];
        if (v) onPick(v);
      }
    };
    const detach = attachWebStudyKeydown(onKey);
    return () => detach?.();
  }, [examOptions, onPick, onPrev, onNext, isLastQuestion, onSubmit]);
}
