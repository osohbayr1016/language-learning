import React, { useEffect, useMemo, useState } from 'react';
import { useGameSession } from '../../../hooks/useGameSession';
import { useAdaptiveTimer } from '../../../hooks/useAdaptiveTimer';
import { useAudio } from '../../../context/AudioContext';
import { mn } from '../../../i18n/mn';
import { GameOverScreen } from '../GameOverScreen';
import { timingScore } from '../translate/scoring';
import type { Word } from '../../../lib/types';
import { useGameScreenWordPool } from '../useGameScreenWordPool';
import { canPlayLessonSentence } from '../lessonGameUtils';
import { LessonGameGate } from '../LessonGameGate';
import { SentencePlayPanel } from './SentencePlayPanel';

const ROUNDS = 6;
const OPTIONS = 4;

type Props = {
  lessonId?: string;
  initialWords?: Word[];
  onDone?: (score: number, accuracy: number) => void;
};

export default function SentenceScreen({ lessonId, initialWords, onDone }: Props) {
  const { words, loading, lessonErr, useLesson, lessonIdNum } = useGameScreenWordPool({
    lessonId,
    initialWords,
    randomCount: ROUNDS + OPTIONS + 4,
  });

  const pool = words;
  const queue = useMemo(
    () => pool.filter((w) => (w.example_zh ?? '').length > 0),
    [pool]
  );
  const distractorPool = useMemo(() => pool, [pool]);

  const { save } = useGameSession();
  const timer = useAdaptiveTimer();
  const { playWord } = useAudio();

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [start, setStart] = useState<number>(Date.now());
  const [done, setDone] = useState(false);

  const current = queue[idx];

  const candidates = useMemo(() => {
    if (!current) return [];
    const distractors = distractorPool.filter((w) => w.id !== current.id).slice(0, OPTIONS - 1);
    return [current, ...distractors].sort(() => Math.random() - 0.5);
  }, [current, distractorPool]);

  useEffect(() => {
    if (current) timer.start();
  }, [current, timer]);

  useEffect(() => {
    if (!loading && queue.length === 0 && onDone && !done) {
      onDone(0, 0);
    }
  }, [loading, queue.length, onDone, done]);

  const handlePick = async (w: Word) => {
    if (selected || !current) return;
    const ms = timer.stopAndReset() ?? 5000;
    const ok = w.id === current.id;
    setSelected(w);
    const delta = timingScore(ms, ok);
    setScore((s) => Math.max(0, s + delta));
    if (ok) {
      setCorrectCount((c) => c + 1);
      void playWord(current.id);
    }

    setTimeout(async () => {
      setSelected(null);
      if (idx + 1 >= queue.length) {
        const elapsed = Math.max(1, Math.round((Date.now() - start) / 1000));
        const finalScore = score + delta;
        const xp = Math.round(finalScore / 4);
        const acc = queue.length > 0 ? (correctCount + (ok ? 1 : 0)) / queue.length : 0;
        await save({
          game_type: 'sentence',
          score: Math.max(0, finalScore),
          accuracy: acc,
          duration_seconds: elapsed,
          words_practiced: queue.length,
          xp_earned: xp,
          ...(lessonIdNum != null ? { lesson_id: lessonIdNum } : {}),
        });
        setDone(true);
        if (onDone) onDone(finalScore, acc);
      } else {
        setIdx((i) => i + 1);
      }
    }, 900);
  };

  const trayState: 'idle' | 'correct' | 'wrong' = selected
    ? selected.id === current?.id
      ? 'correct'
      : 'wrong'
    : 'idle';

  return (
    <LessonGameGate
      initialWords={initialWords}
      loading={loading}
      useLesson={useLesson}
      lessonErr={lessonErr}
      words={pool}
      canPlay={canPlayLessonSentence(pool)}
      tooFewMessage={mn.games.lessonWordsHintSentence}
      emptyTitle={mn.games.sentence}
      playlistEmpty={!loading && queue.length === 0}
    >
      {done ? (
        onDone ? null : (
          <GameOverScreen
            score={score}
            xp={Math.round(score / 4)}
            durationSeconds={Math.round((Date.now() - start) / 1000)}
            onPlayAgain={() => {
              setIdx(0);
              setSelected(null);
              setScore(0);
              setCorrectCount(0);
              setStart(Date.now());
              setDone(false);
            }}
          />
        )
      ) : (
        <SentencePlayPanel
          current={current}
          queueLen={queue.length}
          idx={idx}
          score={score}
          selected={selected}
          candidates={candidates}
          state={trayState}
          onPick={handlePick}
        />
      )}
    </LessonGameGate>
  );
}
