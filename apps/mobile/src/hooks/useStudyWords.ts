import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { WordWithProgress } from '../lib/types';
import { api } from '../lib/api';
import { fetchStudyWords } from '../lib/study/fetchStudyWords';

export type StudyWordSource = 'due' | 'weak';

/** Сурах горим: due = ерөнхий дараалал, weak = SRS "сайн биш" онцлогтой үгс. */
export function useStudyWords(source: StudyWordSource, limit = 15) {
  const { token } = useAuth();
  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (source === 'weak') {
        if (!token) {
          setWords([]);
          return;
        }
        const r = await api.user.vocabularyWeak(token, { limit });
        setWords(r.data ?? []);
        return;
      }
      const next = await fetchStudyWords(token, limit);
      setWords(next);
    } catch (e) {
      setError((e as Error).message);
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, [token, source, limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { words, loading, error, refresh };
}
