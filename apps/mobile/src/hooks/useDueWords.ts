import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { WordWithProgress } from '../lib/types';

export function useDueWords(limit = 20) {
  const { token } = useAuth();
  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.user.dueWords(token, limit);
      setWords(res.data ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token, limit]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { words, loading, error, refresh };
}
