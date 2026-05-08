import type { WordWithProgress } from '../../lib/types';
import type { Exercise, ExerciseKind } from './types';
import { shuffle } from './lessonExerciseCore';

function pickOptions(
  correct: WordWithProgress,
  pool: WordWithProgress[],
  count: number
): WordWithProgress[] {
  const others = shuffle(pool.filter((w) => w.id !== correct.id)).slice(0, Math.max(0, count - 1));
  return shuffle([correct, ...others]);
}

export function buildOneExercise(
  kind: ExerciseKind,
  word: WordWithProgress,
  pool: WordWithProgress[],
  index: number
): Exercise {
  const id = `${kind}-${word.id}-${index}`;

  if (kind === 'memorize') return { kind, id, word };
  if (kind === 'choose-word') return { kind, id, word, options: pickOptions(word, pool, 4) };
  if (kind === 'listen-mcq') return { kind, id, word, options: pickOptions(word, pool, 4) };
  if (kind === 'arrange-words') return { kind, id, word };
  if (kind === 'fill-blank') return { kind, id, word, options: pickOptions(word, pool, 4) };
  if (kind === 'say-sentence') return { kind, id, word };
  if (kind === 'true-false') {
    const showTrue = Math.random() > 0.45;
    const decoy = pool.find((w) => w.id !== word.id) ?? word;
    return {
      kind,
      id,
      word,
      shownMeaning: showTrue ? word.meaning_mn : decoy.meaning_mn,
      isTrue: showTrue,
    };
  }
  const pairs = shuffle(pool).slice(0, Math.min(4, pool.length));
  if (!pairs.find((w) => w.id === word.id)) pairs[0] = word;
  return { kind: 'match-pairs', id, pairs };
}
