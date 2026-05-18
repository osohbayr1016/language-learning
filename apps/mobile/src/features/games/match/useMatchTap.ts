import { useRef } from 'react';
import * as Haptics from 'expo-haptics';
import type { Word } from '../../../lib/types';
import type { MatchCard } from './cards';

type Phase = {
  setDeck: React.Dispatch<React.SetStateAction<MatchCard[]>>;
  selected: MatchCard | null;
  setSelected: React.Dispatch<React.SetStateAction<MatchCard | null>>;
  wrong: string[];
  setWrong: React.Dispatch<React.SetStateAction<string[]>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  matchedPairs: number;
  setMatchedPairs: React.Dispatch<React.SetStateAction<number>>;
  combo: number;
  setCombo: React.Dispatch<React.SetStateAction<number>>;
  roundIdx: number;
  setRoundIdx: React.Dispatch<React.SetStateAction<number>>;
  chunks: Word[][];
  currentChunk: Word[];
  total: number;
  playWord: (id: number) => void;
  finish: () => void;
};

export function useMatchTap({
  setDeck,
  selected,
  setSelected,
  wrong,
  setWrong,
  setScore,
  matchedPairs,
  setMatchedPairs,
  combo,
  setCombo,
  roundIdx,
  setRoundIdx,
  chunks,
  currentChunk,
  total,
  playWord,
  finish,
}: Phase) {
  const comboTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetComboTimer = () => {
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => {
      setCombo(1);
    }, 4000);
  };

  const handleTap = (card: MatchCard) => {
    if (selected?.id === card.id) return;
    if (!selected) {
      setSelected(card);
      void Haptics.selectionAsync();
      return;
    }

    if (selected.wordId === card.wordId && selected.type !== card.type) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDeck((d) => d.map((c) => (c.wordId === card.wordId ? { ...c, matched: true } : c)));
      setSelected(null);

      const points = 10 * combo;
      setScore((s) => s + points);
      setCombo((c) => Math.min(c + 1, 5));
      resetComboTimer();

      const next = matchedPairs + 1;
      setMatchedPairs(next);
      void playWord(card.wordId);

      if (next >= currentChunk.length) {
        if (comboTimer.current) clearTimeout(comboTimer.current);
        if (roundIdx + 1 >= chunks.length) {
          void finish();
        } else {
          setTimeout(() => {
            setRoundIdx((r) => r + 1);
            setMatchedPairs(0);
          }, 800);
        }
      }
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setWrong([selected.id, card.id]);
      setSelected(null);
      setCombo(1);
      setScore((s) => Math.max(0, s - 2));
      setTimeout(() => setWrong([]), 600);
    }
  };

  const stateOf = (c: MatchCard): 'idle' | 'selected' | 'matched' | 'wrong' => {
    if (c.matched) return 'matched';
    if (wrong.includes(c.id)) return 'wrong';
    if (selected?.id === c.id) return 'selected';
    return 'idle';
  };

  const overallMatched = Math.min((roundIdx * 5) + matchedPairs, total);

  return { handleTap, stateOf, overallMatched, comboTimer, resetComboTimer };
}
