import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import type { Word } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import { wordFromLessonRow } from '../features/games/lessonGameUtils';

type State = {
  words: Word[];
  lessonTitle: string;
  loading: boolean;
  error: string | null;
};

const empty: State = { words: [], lessonTitle: '', loading: false, error: null };

/** Loads vocabulary for a lesson from public or authenticated lesson detail. */
export function useLessonGameWords(lessonIdParam: string | undefined) {
  const { token } = useAuth();
  const [state, setState] = useState<State>(empty);

  useEffect(() => {
    if (!lessonIdParam) {
      setState(empty);
      return;
    }
    const id = Number(lessonIdParam);
    if (!Number.isFinite(id) || id <= 0) {
      setState({ words: [], lessonTitle: '', loading: false, error: 'Буруу хичээлийн ID' });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    void (async () => {
      try {
        const res = token ? await api.lessons.get(token, id) : await api.lessons.publicDetail(id);
        const words = (res.data?.words ?? []).map(wordFromLessonRow);
        if (cancelled) return;
        setState({
          words,
          lessonTitle: res.data?.title_mn ?? '',
          loading: false,
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        setState({
          words: [],
          lessonTitle: '',
          loading: false,
          error: (e as Error).message,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonIdParam, token]);

  return state;
}
