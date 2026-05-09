import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { WordWithProgress } from '../lib/types';
import { fetchStudyWords } from '../lib/study/fetchStudyWords';

export function useDueWords(limit = 20, mode?: 'writer') {
  const { token } = useAuth();
  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchStudyWords(token, limit, mode);
      setWords(next);
    } catch (e) {
      setError((e as Error).message);
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, [token, limit, mode]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { words, loading, error, refresh };
}
