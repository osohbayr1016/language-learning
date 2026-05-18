import type { Word } from '../../lib/types';
import { useRandomWords } from '../../hooks/useRandomWords';
import { useLessonGameWords } from '../../hooks/useLessonGameWords';

type Opts = {
  lessonId?: string;
  initialWords?: Word[];
  randomCount: number;
};

export function useGameScreenWordPool({ lessonId, initialWords, randomCount }: Opts) {
  const useLesson = Boolean(lessonId && !initialWords);
  const skipRandom = Boolean(initialWords) || useLesson;
  const { words: randomPool, loading: randomLoading } = useRandomWords(
    randomCount,
    undefined,
    !skipRandom
  );
  const { words: lessonWords, loading: lessonLoading, error: lessonErr } = useLessonGameWords(
    useLesson ? lessonId : undefined
  );

  const words = initialWords ?? (useLesson ? lessonWords : randomPool);
  const loading = initialWords ? false : useLesson ? lessonLoading : randomLoading;
  const lessonIdNum =
    lessonId && Number.isFinite(Number(lessonId)) && Number(lessonId) > 0
      ? Math.trunc(Number(lessonId))
      : undefined;

  return { words, loading, lessonErr, useLesson, lessonIdNum };
}
