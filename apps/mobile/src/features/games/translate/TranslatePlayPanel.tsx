import React from 'react';
import { Screen } from '../../../primitives';
import { mn } from '../../../i18n/mn';
import { GameHud } from '../GameHud';
import { AnswerOption } from '../../study/learn/AnswerOption';
import { TranslateQuestion } from './TranslateQuestion';
import type { Word } from '../../../lib/types';

type P = {
  current: Word | undefined;
  direction: 'zh-to-mn' | 'mn-to-zh';
  options: Word[];
  picked: Word | null;
  idx: number;
  queueLen: number;
  score: number;
  handlePick: (w: Word) => void;
};

export function TranslatePlayPanel({
  current,
  direction,
  options,
  picked,
  idx,
  queueLen,
  score,
  handlePick,
}: P) {
  if (!current) return null;
  return (
    <Screen scroll>
      <GameHud
        title={mn.games.translate}
        score={score}
        progressLabel={`${idx + 1}/${queueLen}`}
      />
      <TranslateQuestion word={current} direction={direction} />
      {options.map((o) => {
        let state: 'idle' | 'correct' | 'wrong' | 'reveal' = 'idle';
        if (picked) {
          if (o.id === current.id) state = 'correct';
          else if (o.id === picked.id) state = 'wrong';
        }
        return (
          <AnswerOption
            key={o.id}
            word={{
              ...o,
              ease_factor: null,
              interval: null,
              repetitions: null,
              next_review: null,
              last_reviewed: null,
            }}
            show={direction === 'zh-to-mn' ? 'mn' : 'hanzi'}
            state={state}
            onPress={() => handlePick(o)}
          />
        );
      })}
    </Screen>
  );
}
