import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { calculateAdaptive } from '../../lib/srs/adaptive';
import type { LessonDetail, WordWithProgress } from '../../lib/types';
import type { ProgressResult } from '../../lib/api/user';
import type { Exercise, ExerciseResult, LessonStatus } from './types';
import { buildExercises } from './buildExercises';
import { computeSkillCounts } from './skills';

const XP_PER_CORRECT = 10;

export type LessonState = {
  status: LessonStatus;
  detail: LessonDetail | null;
  exercises: Exercise[];
  index: number;
  results: ExerciseResult[];
  xpEarned: number;
  durationSec: number;
  error: string | null;
};

export function useLessonSession(lessonId: number) {
  const { token } = useAuth();
  const { addLocalXp, refresh: refreshGam } = useGamification();
  const [state, setState] = useState<LessonState>({
    status: 'loading',
    detail: null,
    exercises: [],
    index: 0,
    results: [],
    xpEarned: 0,
    durationSec: 0,
    error: null,
  });
  const startedAt = useRef(Date.now());
  const exerciseStartAt = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;
    if (!token) return;
    void (async () => {
      try {
        const res = await api.lessons.get(token, lessonId);
        const exercises = buildExercises(res.data.words);
        if (cancelled) return;
        startedAt.current = Date.now();
        exerciseStartAt.current = Date.now();
        setState((s) => ({
          ...s,
          status: 'running',
          detail: res.data,
          exercises,
        }));
      } catch (e) {
        if (cancelled) return;
        setState((s) => ({ ...s, status: 'running', error: e instanceof Error ? e.message : 'Алдаа гарлаа' }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId, token]);

  const current = state.exercises[state.index];

  const submit = useCallback((correct: boolean) => {
    setState((s) => {
      const ex = s.exercises[s.index];
      if (!ex) return s;
      const wordIds = ex.kind === 'match-pairs' ? ex.pairs.map((w) => w.id) : [ex.word.id];
      const responseMs = Date.now() - exerciseStartAt.current;
      const result: ExerciseResult = { exerciseId: ex.id, wordIds, correct, responseMs };
      const xpDelta = correct ? XP_PER_CORRECT : 0;
      return {
        ...s,
        results: [...s.results, result],
        xpEarned: s.xpEarned + xpDelta,
      };
    });
  }, []);

  const advance = useCallback(() => {
    setState((s) => {
      const next = s.index + 1;
      if (next >= s.exercises.length) {
        return { ...s, status: 'done', durationSec: Math.round((Date.now() - startedAt.current) / 1000) };
      }
      exerciseStartAt.current = Date.now();
      return { ...s, index: next };
    });
  }, []);

  const finalize = useCallback(async () => {
    if (!token) return;
    if (state.status !== 'done') return;

    const totalCount = state.results.length;
    const correctCount = state.results.filter((r) => r.correct).length;
    const accuracy = totalCount > 0 ? correctCount / totalCount : 0;
    const wordsById = new Map<number, WordWithProgress>();
    for (const w of state.detail?.words ?? []) wordsById.set(w.id, w);

    const progressByWord = new Map<number, { correct: boolean; responseMs: number }>();
    for (const r of state.results) {
      for (const wid of r.wordIds) {
        const existing = progressByWord.get(wid);
        if (!existing || (r.correct && !existing.correct)) {
          progressByWord.set(wid, { correct: r.correct, responseMs: r.responseMs });
        }
      }
    }

    const results: ProgressResult[] = [];
    for (const [wid, info] of progressByWord.entries()) {
      const w = wordsById.get(wid);
      if (!w) continue;
      const r = calculateAdaptive(
        { ease_factor: w.ease_factor, interval: w.interval, repetitions: w.repetitions },
        { rating: info.correct ? 4 : 1, responseMs: info.responseMs, confidence: 1 }
      );
      results.push({
        word_id: wid,
        ease_factor: r.ease_factor,
        interval: r.interval,
        repetitions: r.repetitions,
        next_review: r.next_review.toISOString(),
        response_ms: r.response_ms,
        confidence: r.confidence,
      });
    }

    const skill_results = computeSkillCounts(state.exercises, state.results);

    try {
      await api.lessons.complete(token, lessonId, {
        accuracy,
        xp_earned: state.xpEarned,
        duration_seconds: state.durationSec,
        results,
        skill_results,
      });
      addLocalXp(state.xpEarned);
      void refreshGam();
    } catch (e) {
      console.warn('lesson complete failed', e);
    }
  }, [token, lessonId, state.status, state.exercises, state.results, state.detail, state.xpEarned, state.durationSec, addLocalXp, refreshGam]);

  const accuracy = useMemo(() => {
    if (state.results.length === 0) return 0;
    return state.results.filter((r) => r.correct).length / state.results.length;
  }, [state.results]);

  return { state, current, submit, advance, finalize, accuracy };
}
