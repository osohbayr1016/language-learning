import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { WordWithProgress } from '../lib/types';
import { fetchStudyWords } from '../lib/study/fetchStudyWords';

export function useDueWords(limit = 20) {
  const { token } = useAuth();
  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchStudyWords(token, limit);
      setWords(next);
    } catch (e) {
      setError((e as Error).message);
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, [token, limit]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { words, loading, error, refresh };
}
