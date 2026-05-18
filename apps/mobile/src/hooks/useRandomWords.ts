import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Word } from '../lib/types';

/** When `enabled` is false, skips fetch (e.g. lesson word pool is used instead). */
export function useRandomWords(count: number, hsk?: number, enabled = true) {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setWords([]);
      setLoading(false);
      setError(null);
      return;
    }
    void load();
    async function load() {
      setLoading(true);
      try {
        const r = await api.words.list({ hsk, limit: Math.max(50, count * 4) });
        const all = (r.data ?? []).slice();
        const shuffled = all.sort(() => Math.random() - 0.5).slice(0, count);
        setWords(shuffled);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
  }, [count, hsk, enabled]);

  return { words, loading, error };
}
