import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Word } from '../lib/types';

export function useRandomWords(count: number, jlpt?: number) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
    async function load() {
      setLoading(true);
      try {
        const r = await api.words.list({ jlpt, limit: Math.max(50, count * 4) });
        const all = (r.data ?? []).slice();
        const shuffled = all.sort(() => Math.random() - 0.5).slice(0, count);
        setWords(shuffled);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
  }, [count, jlpt]);

  return { words, loading, error };
}
