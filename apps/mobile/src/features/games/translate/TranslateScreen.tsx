import React, { useEffect, useMemo, useState } from 'react';
import { useGameSession } from '../../../hooks/useGameSession';
import { useAdaptiveTimer } from '../../../hooks/useAdaptiveTimer';
import { useAudio } from '../../../context/AudioContext';
import { mn } from '../../../i18n/mn';
import { GameOverScreen } from '../GameOverScreen';
import { pickDistractors, shuffle } from '../../study/learn/distractors';
import { timingScore } from './scoring';
import type { Word } from '../../../lib/types';
import { useGameScreenWordPool } from '../useGameScreenWordPool';
import { canPlayLessonTranslate } from '../lessonGameUtils';
import { LessonGameGate } from '../LessonGameGate';
import { TranslatePlayPanel } from './TranslatePlayPanel';

const ROUNDS = 8;
const OPTIONS = 4;

type Props = {
  lessonId?: string;
  initialWords?: Word[];
  onDone?: (score: number, accuracy: number) => void;
};

export default function TranslateScreen({ lessonId, initialWords, onDone }: Props) {
  const { words, loading, lessonErr, useLesson, lessonIdNum } = useGameScreenWordPool({
    lessonId,
    initialWords,
    randomCount: ROUNDS + OPTIONS + 4,
  });

  const { save } = useGameSession();
  const timer = useAdaptiveTimer();
  const { playWord } = useAudio();

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<Word | null>(null);
  const [start, setStart] = useState<number>(Date.now());
  const [done, setDone] = useState(false);

  const queue = useMemo(() => words, [words]);
  const current = queue[idx];
  const direction = idx % 2 === 0 ? 'zh-to-mn' : 'mn-to-zh';

  const options = useMemo(() => {
    if (!current) return [] as Word[];
    const wordsAsProgress = words.map((w) => ({
      ...w,
      ease_factor: null,
      interval: null,
      repetitions: null,
      next_review: null,
      last_reviewed: null,
    }));
    const cur = wordsAsProgress.find((w) => w.id === current.id)!;
    const ds = pickDistractors(wordsAsProgress, cur, OPTIONS - 1, 'medium');
    return shuffle([cur, ...ds]) as Word[];
  }, [current, words]);

  useEffect(() => {
    if (current) timer.start();
  }, [current, timer]);

  useEffect(() => {
    if (!loading && queue.length === 0 && onDone && !done) {
      onDone(0, 0);
    }
  }, [loading, queue.length, onDone, done]);

  const handlePick = async (chosen: Word) => {
    if (!current || picked) return;
    const ms = timer.stopAndReset() ?? 5000;
    const ok = chosen.id === current.id;
    setPicked(chosen);
    setScore((s) => Math.max(0, s + timingScore(ms, ok)));
    if (ok) {
      setCorrectCount((c) => c + 1);
      void playWord(current.id);
    }
    setTimeout(async () => {
      setPicked(null);
      if (idx + 1 >= queue.length) {
        const elapsed = Math.max(1, Math.round((Date.now() - start) / 1000));
        const finalScore = score + timingScore(ms, ok);
        const xp = Math.round(finalScore / 4);
        const acc = queue.length > 0 ? (correctCount + (ok ? 1 : 0)) / queue.length : 0;
        await save({
          game_type: 'translate',
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
    }, 800);
  };

  return (
    <LessonGameGate
      initialWords={initialWords}
      loading={loading}
      useLesson={useLesson}
      lessonErr={lessonErr}
      words={words}
      canPlay={canPlayLessonTranslate(words)}
      tooFewMessage={mn.games.lessonWordsHintTranslate}
      emptyTitle={mn.games.translate}
    >
      {done ? (
        onDone ? null : (
          <GameOverScreen
            score={score}
            xp={Math.round(score / 4)}
            durationSeconds={Math.round((Date.now() - start) / 1000)}
            onPlayAgain={() => {
              setIdx(0);
              setScore(0);
              setCorrectCount(0);
              setPicked(null);
              setStart(Date.now());
              setDone(false);
            }}
          />
        )
      ) : (
        <TranslatePlayPanel
          current={current}
          direction={direction}
          options={options}
          picked={picked}
          idx={idx}
          queueLen={queue.length}
          score={score}
          handlePick={handlePick}
        />
      )}
    </LessonGameGate>
  );
}
