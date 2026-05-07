import type { Word } from '../../../lib/types';

export type MatchCard = {
  id: string;
  wordId: number;
  type: 'hanzi' | 'meaning';
  text: string;
  matched: boolean;
};

export function buildMatchDeck(words: Word[]): MatchCard[] {
  const cards: MatchCard[] = [];
  words.forEach((w) => {
    cards.push({ id: `h-${w.id}`, wordId: w.id, type: 'hanzi', text: w.hanzi, matched: false });
    cards.push({ id: `m-${w.id}`, wordId: w.id, type: 'meaning', text: w.meaning_mn, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}
