import type { WordWithProgress } from '../../lib/types';
import type { Exercise, ExerciseKind } from './types';

const PLAN: ExerciseKind[] = [
  'memorize',
  'choose-word',
  'listen-mcq',
  'choose-word',
  'true-false',
  'arrange-words',
  'fill-blank',
  'memorize',
  'choose-word',
  'arrange-words',
  'match-pairs',
  'say-sentence',
];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOptions(
  correct: WordWithProgress,
  pool: WordWithProgress[],
  count: number
): WordWithProgress[] {
  const others = shuffle(pool.filter((w) => w.id !== correct.id)).slice(0, Math.max(0, count - 1));
  return shuffle([correct, ...others]);
}

function buildOne(
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
  // match-pairs
  const pairs = shuffle(pool).slice(0, Math.min(4, pool.length));
  if (!pairs.find((w) => w.id === word.id)) pairs[0] = word;
  return { kind: 'match-pairs', id, pairs };
}

export function buildExercises(words: WordWithProgress[]): Exercise[] {
  if (words.length === 0) return [];

  const sequence: Exercise[] = [];
  let prev: ExerciseKind | null = null;
  let plan = shuffle(PLAN);

  for (let i = 0; i < PLAN.length; i++) {
    let kind = plan[i];
    if (prev && kind === prev) {
      const swapIdx = plan.findIndex((k, j) => j > i && k !== prev);
      if (swapIdx > i) {
        [plan[i], plan[swapIdx]] = [plan[swapIdx], plan[i]];
        kind = plan[i];
      }
    }

    const word = words[i % words.length];
    sequence.push(buildOne(kind, word, words, i));
    prev = kind;
  }

  return sequence;
}
