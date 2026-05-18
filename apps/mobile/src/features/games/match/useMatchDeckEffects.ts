import { useEffect, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { buildMatchDeck, type MatchCard } from './cards';
import type { Word } from '../../../lib/types';

export function useMatchChunks(words: Word[]) {
  return useMemo(() => {
    const res: Word[][] = [];
    for (let i = 0; i < words.length; i += 5) {
      res.push(words.slice(i, i + 5));
    }
    return res;
  }, [words]);
}

type DeckOpts = {
  words: Word[];
  loading: boolean;
  done: boolean;
  roundIdx: number;
  chunks: Word[][];
  setDeck: Dispatch<SetStateAction<MatchCard[]>>;
  setStart: Dispatch<SetStateAction<number>>;
  bumpTick: Dispatch<SetStateAction<number>>;
  deckLength: number;
  onDone?: (score: number, accuracy: number) => void;
};

export function useMatchDeckEffects({
  words,
  loading,
  done,
  roundIdx,
  chunks,
  setDeck,
  setStart,
  bumpTick,
  deckLength,
  onDone,
}: DeckOpts) {
  const currentChunk = chunks[roundIdx] || [];

  useEffect(() => {
    if (currentChunk.length > 0) {
      setDeck(buildMatchDeck(currentChunk));
      if (roundIdx === 0) setStart(Date.now());
    }
  }, [currentChunk, roundIdx, setDeck, setStart]);

  useEffect(() => {
    if (loading || done || deckLength === 0) return;
    const id = setInterval(() => bumpTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [loading, done, deckLength, bumpTick]);

  useEffect(() => {
    if (!loading && words.length === 0 && onDone && !done) {
      onDone(0, 0);
    }
  }, [loading, words.length, onDone, done]);

  return currentChunk;
}
