import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { LessonDetail } from '../lib/types';
import { useAuth } from '../context/AuthContext';

/** Full lesson payload (words + imported_content) for games / prep flows. */
export function useLessonGameDetail(lessonIdParam: string | undefined) {
  const { token } = useAuth();
  const [detail, setDetail] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonIdParam) {
      setDetail(null);
      setError(null);
      return;
    }
    const id = Number(lessonIdParam);
    if (!Number.isFinite(id) || id <= 0) {
      setDetail(null);
      setError('Буруу хичээлийн ID');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const res = token ? await api.lessons.get(token, id) : await api.lessons.publicDetail(id);
        if (!cancelled) {
          setDetail(res.data ?? null);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setDetail(null);
          setError((e as Error).message);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonIdParam, token]);

  return { detail, loading, error };
}
