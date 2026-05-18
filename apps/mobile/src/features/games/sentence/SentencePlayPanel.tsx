import React from 'react';
import { Screen } from '../../../primitives';
import { mn } from '../../../i18n/mn';
import { GameHud } from '../GameHud';
import { SentencePrompt } from './SentencePrompt';
import { CandidateTray } from './CandidateTray';
import type { Word } from '../../../lib/types';

type P = {
  current: Word | undefined;
  queueLen: number;
  idx: number;
  score: number;
  selected: Word | null;
  candidates: Word[];
  state: 'idle' | 'correct' | 'wrong';
  onPick: (w: Word) => void;
};

export function SentencePlayPanel({
  current,
  queueLen,
  idx,
  score,
  selected,
  candidates,
  state,
  onPick,
}: P) {
  if (!current) return null;
  return (
    <Screen scroll>
      <GameHud title={mn.games.sentence} score={score} progressLabel={`${idx + 1}/${queueLen}`} />
      <SentencePrompt word={current} filled={selected?.hanzi ?? null} />
      <CandidateTray
        candidates={candidates}
        selectedId={selected?.id ?? null}
        state={state}
        onPick={onPick}
      />
    </Screen>
  );
}
