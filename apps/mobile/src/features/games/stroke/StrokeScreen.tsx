import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Screen } from '../../../primitives';
import { useGameSession } from '../../../hooks/useGameSession';
import { useAdaptiveTimer } from '../../../hooks/useAdaptiveTimer';
import { useLessonGameWords } from '../../../hooks/useLessonGameWords';
import { mn } from '../../../i18n/mn';
import { GameHud } from '../GameHud';
import { GameOverScreen } from '../GameOverScreen';
import { LessonGameGate } from '../LessonGameGate';
import {
  puzzlesForLessonWords,
  shufflePuzzles,
  STROKE_PUZZLES,
  type StrokePuzzle,
} from './puzzles';
import { PuzzleDisplay } from './PuzzleDisplay';
import { OptionTray } from './OptionTray';
import { timingScore } from '../translate/scoring';

type Props = { lessonId?: string };

export default function StrokeScreen({ lessonId }: Props) {
  const useLesson = Boolean(lessonId);
  const { words, loading, error: lessonErr } = useLessonGameWords(
    useLesson ? lessonId : undefined
  );

  const pool = useMemo(() => {
    if (!useLesson) return STROKE_PUZZLES;
    return puzzlesForLessonWords(words);
  }, [useLesson, words]);

  const { save } = useGameSession();
  const timer = useAdaptiveTimer();

  const [queue, setQueue] = useState<StrokePuzzle[]>(() =>
    lessonId ? [] : shufflePuzzles(STROKE_PUZZLES)
  );
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [start, setStart] = useState<number>(Date.now());
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    if (!useLesson) return;
    if (loading) return;
    setQueue(shufflePuzzles(pool));
    setIdx(0);
    setPicked(null);
    setScore(0);
    setCorrectCount(0);
    setStart(Date.now());
    setDone(false);
  }, [useLesson, loading, pool]);

  const current = queue[idx];

  useEffect(() => {
    if (current) timer.start();
  }, [current, timer]);

  const restart = useCallback(() => {
    const next = shufflePuzzles(useLesson ? pool : STROKE_PUZZLES);
    setQueue(next);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setCorrectCount(0);
    setStart(Date.now());
    setDone(false);
  }, [useLesson, pool]);

  const handlePick = async (opt: string) => {
    if (picked || !current) return;
    const ms = timer.stopAndReset() ?? 5000;
    const ok = opt === current.missingPart;
    setPicked(opt);
    const delta = timingScore(ms, ok);
    setScore((s) => Math.max(0, s + delta));
    if (ok) setCorrectCount((c) => c + 1);

    setTimeout(async () => {
      setPicked(null);
      if (idx + 1 >= queue.length) {
        const elapsed = Math.max(1, Math.round((Date.now() - start) / 1000));
        const finalScore = score + delta;
        const xp = Math.round(finalScore / 4);
        await save({
          game_type: 'stroke',
          score: Math.max(0, finalScore),
          accuracy: queue.length > 0 ? (correctCount + (ok ? 1 : 0)) / queue.length : 0,
          duration_seconds: elapsed,
          words_practiced: queue.length,
          xp_earned: xp,
        });
        setDone(true);
      } else {
        setIdx((i) => i + 1);
      }
    }, 900);
  };

  if (done) {
    return (
      <GameOverScreen
        score={score}
        xp={Math.round(score / 4)}
        durationSeconds={Math.round((Date.now() - start) / 1000)}
        onPlayAgain={restart}
      />
    );
  }

  const state: 'idle' | 'correct' | 'wrong' = picked
    ? picked === current?.missingPart
      ? 'correct'
      : 'wrong'
    : 'idle';

  const playUi =
    current != null ? (
      <Screen scroll>
        <GameHud
          title={mn.games.stroke}
          score={score}
          progressLabel={`${idx + 1}/${queue.length}`}
        />
        <PuzzleDisplay puzzle={current} filled={picked && state === 'correct' ? picked : null} />
        <OptionTray
          options={current.options}
          selected={picked}
          state={state}
          correct={current.missingPart}
          onPick={handlePick}
        />
      </Screen>
    ) : null;

  if (!useLesson) {
    return playUi;
  }

  return (
    <LessonGameGate
      loading={loading}
      useLesson={useLesson}
      lessonErr={lessonErr}
      words={words}
      canPlay={words.length > 0}
      tooFewMessage={mn.games.lessonWordsShort}
      emptyTitle={mn.games.stroke}
    >
      {playUi}
    </LessonGameGate>
  );
}
