import type { Word } from '../../../lib/types';

export type MatchCard = {
  id: string;
  wordId: number;
  type: 'kanji' | 'meaning';
  text: string;
  matched: boolean;
};

export function buildMatchDeck(words: Word[]): MatchCard[] {
  const cards: MatchCard[] = [];
  words.forEach((w) => {
    cards.push({ id: `k-${w.id}`, wordId: w.id, type: 'kanji', text: w.kanji, matched: false });
    cards.push({ id: `m-${w.id}`, wordId: w.id, type: 'meaning', text: w.meaning_mn, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}
