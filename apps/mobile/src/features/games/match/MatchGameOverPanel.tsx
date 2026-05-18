import React from 'react';
import { GameOverScreen } from '../GameOverScreen';

type P = {
  score: number;
  start: number;
  onPlayAgain: () => void;
};

export function MatchGameOverPanel({ score, start, onPlayAgain }: P) {
  return (
    <GameOverScreen
      score={score}
      xp={Math.round(score / 5)}
      durationSeconds={Math.round((Date.now() - start) / 1000)}
      onPlayAgain={onPlayAgain}
    />
  );
}
