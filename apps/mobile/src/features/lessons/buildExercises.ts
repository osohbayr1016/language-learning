import type { ImportedLessonContent, WordWithProgress } from '../../lib/types';
import type { Exercise, ExerciseKind } from './types';
import { LESSON_KIND_PLAN, shuffle, staggerKinds } from './lessonExerciseCore';
import { buildOneExercise } from './lessonExerciseBuilders';
import { buildImportedLearnExercises } from './buildImportedLearnExercises';

function roundsForWordCount(n: number): number {
  if (n <= 8) return 1;
  if (n <= 16) return 2;
  if (n <= 24) return 3;
  return 4;
}

function kindsForLesson(wordCount: number): ExerciseKind[] {
  const r = roundsForWordCount(wordCount);
  const chunks: ExerciseKind[] = [];
  for (let i = 0; i < r; i++) {
    chunks.push(...shuffle(LESSON_KIND_PLAN));
  }
  return staggerKinds(chunks);
}

export function buildExercises(words: WordWithProgress[], content?: ImportedLessonContent | null): Exercise[] {
  if (content) return buildImportedLearnExercises(content);

  if (words.length === 0) return [];

  const kinds = kindsForLesson(words.length);
  const idxOrder = shuffle(words.map((_, i) => i));
  const sequence: Exercise[] = [];
  for (let i = 0; i < kinds.length; i++) {
    const k = kinds[i]!;
    const word = words[idxOrder[i % idxOrder.length]]!;
    sequence.push(buildOneExercise(k, word, words, i));
  }

  return sequence;
}
