import React from 'react';
import { MandarinSpeechCard } from '../../../components/practice/MandarinSpeechCard';
import type { Exercise } from '../types';

type Props = {
  exercise: Extract<Exercise, { kind: 'say-sentence' }>;
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
};

export function SaySentence({ exercise, disabled, onAnswer }: Props) {
  return (
    <MandarinSpeechCard
      word={exercise.word}
      disabled={disabled}
      speechPrompt="example"
      onEvaluated={onAnswer}
    />
  );
}
