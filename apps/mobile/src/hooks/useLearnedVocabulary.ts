import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { WordWithProgress } from '../lib/types';

const PAGE = 100;

export function useLearnedVocabulary(enabled = true) {
  const { token } = useAuth();
  const [words, setWords] = useState<WordWithProgress[]>([]);
  const [total, setTotal] = useState(0);
  const [nextOffset, setNextOffset] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (startOffset: number, append: boolean) => {
      if (!token) {
        setWords([]);
        setTotal(0);
        setNextOffset(0);
        setLoading(false);
        setLoadingMore(false);
        return;
      }
      const setBusy = append ? setLoadingMore : setLoading;
      setBusy(true);
      setError(null);
      try {
        const page = await api.user.vocabulary(token, {
          limit: PAGE,
          offset: startOffset,
          learned_only: 1,
        });
        setTotal(page.total);
        setNextOffset(startOffset + page.data.length);
        setWords((prev) => (append ? [...prev, ...page.data] : page.data));
      } catch (e) {
        setError((e as Error).message);
        if (!append) {
          setWords([]);
          setTotal(0);
          setNextOffset(0);
        }
      } finally {
        setBusy(false);
      }
    },
    [token]
  );

  const refresh = useCallback(async () => {
    await fetchPage(0, false);
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!token || loading || loadingMore) return;
    if (words.length >= total) return;
    await fetchPage(nextOffset, true);
  }, [token, loading, loadingMore, words.length, total, nextOffset, fetchPage]);

  useEffect(() => {
    if (!enabled) {
      setWords([]);
      setTotal(0);
      setNextOffset(0);
      setLoading(false);
      setLoadingMore(false);
      setError(null);
      return;
    }
    if (!token) {
      setWords([]);
      setTotal(0);
      setNextOffset(0);
      setLoading(false);
      return;
    }
    void refresh();
  }, [enabled, refresh, token]);

  const hasMore = token ? words.length < total : false;

  return { words, total, loading, loadingMore, error, refresh, loadMore, hasMore };
}
