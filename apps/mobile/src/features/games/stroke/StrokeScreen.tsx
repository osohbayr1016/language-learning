import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Screen } from '../../../primitives';
import { useGameSession } from '../../../hooks/useGameSession';
import { useAdaptiveTimer } from '../../../hooks/useAdaptiveTimer';
import { mn } from '../../../i18n/mn';
import { GameHud } from '../GameHud';
import { GameOverScreen } from '../GameOverScreen';
import { STROKE_PUZZLES, shufflePuzzles, type StrokePuzzle } from './puzzles';
import { PuzzleDisplay } from './PuzzleDisplay';
import { OptionTray } from './OptionTray';
import { timingScore } from '../translate/scoring';

export default function StrokeScreen() {
  const { save } = useGameSession();
  const timer = useAdaptiveTimer();

  const [queue, setQueue] = useState<StrokePuzzle[]>(() => shufflePuzzles(STROKE_PUZZLES));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [start] = useState<number>(Date.now());
  const [done, setDone] = useState(false);

  const current = queue[idx];

  useMemo(() => { if (current) timer.start(); }, [current, timer]);

  if (done) {
    return (
      <GameOverScreen
        score={score}
        xp={Math.round(score / 4)}
        durationSeconds={Math.round((Date.now() - start) / 1000)}
        onPlayAgain={() => {
          setQueue(shufflePuzzles(STROKE_PUZZLES));
          setIdx(0); setPicked(null); setScore(0); setCorrectCount(0); setDone(false);
        }}
      />
    );
  }

  const state: 'idle' | 'correct' | 'wrong' = picked
    ? picked === current.missingPart ? 'correct' : 'wrong'
    : 'idle';

  const handlePick = async (opt: string) => {
    if (picked) return;
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

  return (
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
  );
}

const styles = StyleSheet.create({});
