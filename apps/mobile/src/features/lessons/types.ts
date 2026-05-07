import type { WordWithProgress } from '../../lib/types';

export type ExerciseKind =
  | 'memorize'
  | 'choose-word'
  | 'listen-mcq'
  | 'match-pairs'
  | 'arrange-words'
  | 'fill-blank'
  | 'true-false'
  | 'say-sentence';

export type Exercise =
  | { kind: 'memorize'; id: string; word: WordWithProgress }
  | {
      kind: 'choose-word';
      id: string;
      word: WordWithProgress;
      options: WordWithProgress[];
    }
  | {
      kind: 'listen-mcq';
      id: string;
      word: WordWithProgress;
      options: WordWithProgress[];
    }
  | { kind: 'match-pairs'; id: string; pairs: WordWithProgress[] }
  | { kind: 'arrange-words'; id: string; word: WordWithProgress }
  | {
      kind: 'fill-blank';
      id: string;
      word: WordWithProgress;
      options: WordWithProgress[];
    }
  | {
      kind: 'true-false';
      id: string;
      word: WordWithProgress;
      shownMeaning: string;
      isTrue: boolean;
    }
  | { kind: 'say-sentence'; id: string; word: WordWithProgress };

export type ExerciseResult = {
  exerciseId: string;
  wordIds: number[];
  correct: boolean;
  responseMs: number;
};

export type LessonStatus = 'loading' | 'running' | 'done';

export const EXERCISE_TITLES: Record<ExerciseKind, string> = {
  memorize: 'Цээжлэх',
  'choose-word': 'Үг сонго',
  'listen-mcq': 'Сонсоод сонго',
  'match-pairs': 'Тааруулах',
  'arrange-words': 'Үгээр зохио',
  'fill-blank': 'Дутууг бөглө',
  'true-false': 'Үнэн худал',
  'say-sentence': 'Хэлж сонсго',
};
