import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import type { Chapter } from '../../lib/types';

/** Сурах / нүүр — HSK хичээлийн бүлгүүдийг API-аас татаж хадгална. */
export function useLessonChapters() {
  const { token } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    let next: Chapter[] = [];
    try {
      setLoading(true);
      if (token) {
        try {
          const res = await api.lessons.list(token);
          next = res.data ?? [];
        } catch {
          next = [];
        }
      }
      if (next.length === 0) {
        try {
          const pub = await api.lessons.catalog();
          next = pub.data ?? [];
        } catch {
          next = [];
        }
      }
      setChapters(next);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { chapters, loading, refresh };
}
