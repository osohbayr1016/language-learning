import React from 'react';
import type { Exercise } from '../types';
import { MemorizeCard } from './MemorizeCard';
import { ChooseWordMcq } from './ChooseWordMcq';
import { ListenMcq } from './ListenMcq';
import { MatchPairs } from './MatchPairs';
import { ArrangeWords } from './ArrangeWords';
import { FillBlank } from './FillBlank';
import { TrueFalse } from './TrueFalse';
import { SaySentence } from './SaySentence';

type Props = {
  exercise: Exercise;
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
};

export function ExerciseRenderer({ exercise, disabled, onAnswer }: Props) {
  switch (exercise.kind) {
    case 'memorize':
      return <MemorizeCard exercise={exercise} disabled={disabled} onAnswer={onAnswer} />;
    case 'choose-word':
      return <ChooseWordMcq exercise={exercise} disabled={disabled} onAnswer={onAnswer} />;
    case 'listen-mcq':
      return <ListenMcq exercise={exercise} disabled={disabled} onAnswer={onAnswer} />;
    case 'match-pairs':
      return <MatchPairs exercise={exercise} disabled={disabled} onAnswer={onAnswer} />;
    case 'arrange-words':
      return <ArrangeWords exercise={exercise} disabled={disabled} onAnswer={onAnswer} />;
    case 'fill-blank':
      return <FillBlank exercise={exercise} disabled={disabled} onAnswer={onAnswer} />;
    case 'true-false':
      return <TrueFalse exercise={exercise} disabled={disabled} onAnswer={onAnswer} />;
    case 'say-sentence':
      return <SaySentence exercise={exercise} disabled={disabled} onAnswer={onAnswer} />;
  }
}

export function exercisePromptFor(exercise: Exercise): string {
  switch (exercise.kind) {
    case 'memorize':
      return 'Энэ үгийг сайн цээжил';
    case 'choose-word':
      return `"${exercise.word.meaning_mn}" гэдэг үг аль вэ?`;
    case 'listen-mcq':
      return 'Юу сонсогдов?';
    case 'match-pairs':
      return 'Хоёроо тааруул';
    case 'arrange-words':
      return 'Энэ өгүүлбэрийг бүтээ';
    case 'fill-blank':
      return 'Дутуу үгийг бөглө';
    case 'true-false':
      return 'Энэ үнэн үү?';
    case 'say-sentence':
      return 'Дээрх өгүүлбэрийг хэлж сонсго';
  }
}

export function exerciseCorrectAnswer(exercise: Exercise): string {
  switch (exercise.kind) {
    case 'memorize':
      return exercise.word.hanzi;
    case 'choose-word':
    case 'listen-mcq':
    case 'fill-blank':
      return `${exercise.word.hanzi} (${exercise.word.pinyin})`;
    case 'arrange-words':
      return exercise.word.example_zh ?? exercise.word.hanzi;
    case 'match-pairs':
      return exercise.pairs.map((w) => w.hanzi).join(' · ');
    case 'true-false':
      return exercise.isTrue ? 'Үнэн' : 'Худал';
    case 'say-sentence':
      return exercise.word.example_zh ?? exercise.word.hanzi;
  }
}
