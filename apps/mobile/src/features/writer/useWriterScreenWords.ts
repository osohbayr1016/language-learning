import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { api } from '../../lib/api';
import type { Word, WordWithProgress } from '../../lib/types';
import { useDueWords } from '../../hooks/useDueWords';

function asWordWithProgress(w: Word): WordWithProgress {
  return {
    ...w,
    ease_factor: null,
    interval: null,
    repetitions: null,
    next_review: null,
    last_reviewed: null,
  };
}

export function useWriterScreenWords() {
  const params = useLocalSearchParams<{ forcedId?: string | string[] }>();
  const forcedWordId = useMemo(() => {
    const raw = params.forcedId;
    const idStr = Array.isArray(raw) ? raw[0] : raw;
    const n = idStr ? Number(idStr) : NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [params.forcedId]);

  const kanjiForced = forcedWordId != null;

  const { words: dueWords, loading: dueLoading, error } = useDueWords(8, 'writer', !kanjiForced);

  const [forcedWord, setForcedWord] = useState<WordWithProgress | null>(null);
  const [forcedLoading, setForcedLoading] = useState(kanjiForced);

  useEffect(() => {
    if (!kanjiForced || !forcedWordId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.words.get(forcedWordId);
        if (!cancelled) setForcedWord(asWordWithProgress(res.data));
      } catch {
        if (!cancelled) setForcedWord(null);
      } finally {
        if (!cancelled) setForcedLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kanjiForced, forcedWordId]);

  const words = kanjiForced ? (forcedWord ? [forcedWord] : []) : dueWords;
  const loading = kanjiForced ? forcedLoading : dueLoading;

  return { words, loading, error, kanjiForced, forcedWordId };
}
