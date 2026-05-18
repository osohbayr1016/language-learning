import React, { useMemo, useState } from 'react';
import { useGameSession } from '../../../hooks/useGameSession';
import { useAudio } from '../../../context/AudioContext';
import { mn } from '../../../i18n/mn';
import { MatchGameOverPanel } from './MatchGameOverPanel';
import { buildMatchDeck, type MatchCard } from './cards';
import type { Word } from '../../../lib/types';
import { useGameScreenWordPool } from '../useGameScreenWordPool';
import { canPlayLessonMatch } from '../lessonGameUtils';
import { LessonGameGate } from '../LessonGameGate';
import { useMatchTap } from './useMatchTap';
import { MatchPlayingView } from './MatchPlayingView';
import { useMatchChunks, useMatchDeckEffects } from './useMatchDeckEffects';

const PAIRS = 6;

type Props = {
  lessonId?: string;
  initialWords?: Word[];
  onDone?: (score: number, accuracy: number) => void;
};

export default function MatchScreen({ lessonId, initialWords, onDone }: Props) {
  const { words, loading, lessonErr, useLesson, lessonIdNum } = useGameScreenWordPool({
    lessonId,
    initialWords,
    randomCount: PAIRS,
  });

  const { save } = useGameSession();
  const { playWord } = useAudio();

  const [deck, setDeck] = useState<MatchCard[]>([]);
  const [selected, setSelected] = useState<MatchCard | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [start, setStart] = useState<number>(Date.now());
  const [done, setDone] = useState(false);
  const [combo, setCombo] = useState(1);
  const [roundIdx, setRoundIdx] = useState(0);
  const [, bumpTick] = useState(0);

  const chunks = useMatchChunks(words);
  const currentChunk = useMatchDeckEffects({
    words,
    loading,
    done,
    roundIdx,
    chunks,
    setDeck,
    setStart,
    bumpTick,
    deckLength: deck.length,
    onDone,
  });

  const wordsById = useMemo(
    () => Object.fromEntries(words.map((w) => [w.id, w])),
    [words]
  );

  const total = words.length;
  const elapsedSeconds =
    !loading && deck.length > 0 && !done ? Math.max(0, Math.floor((Date.now() - start) / 1000)) : null;

  const restartMidRound = () => {
    if (words.length === 0) return;
    setRoundIdx(0);
    setDeck(buildMatchDeck(chunks[0]));
    setMatchedPairs(0);
    setScore(0);
    setCombo(1);
    setSelected(null);
    setWrong([]);
    setStart(Date.now());
  };

  const finish = async () => {
    const elapsed = Math.max(1, Math.round((Date.now() - start) / 1000));
    const xp = Math.round(score / 5);
    const acc = total > 0 ? matchedPairs / total : 0;
    await save({
      game_type: 'match',
      score,
      accuracy: acc,
      duration_seconds: elapsed,
      words_practiced: total,
      xp_earned: xp,
      ...(lessonIdNum != null ? { lesson_id: lessonIdNum } : {}),
    });
    setDone(true);
    if (onDone) onDone(score, acc);
  };

  const { handleTap, stateOf, overallMatched } = useMatchTap({
    setDeck,
    selected,
    setSelected,
    wrong,
    setWrong,
    setScore,
    matchedPairs,
    setMatchedPairs,
    combo,
    setCombo,
    roundIdx,
    setRoundIdx,
    chunks,
    currentChunk,
    total,
    playWord,
    finish,
  });

  return (
    <LessonGameGate
      initialWords={initialWords}
      loading={loading}
      useLesson={useLesson}
      lessonErr={lessonErr}
      words={words}
      canPlay={canPlayLessonMatch(words)}
      tooFewMessage={mn.games.lessonWordsHintMatch}
      emptyTitle={mn.games.match}
    >
      {done ? (
        onDone ? null : (
          <MatchGameOverPanel
            score={score}
            start={start}
            onPlayAgain={() => {
              setRoundIdx(0);
              setDeck(buildMatchDeck(chunks[0]));
              setMatchedPairs(0);
              setScore(0);
              setCombo(1);
              setSelected(null);
              setWrong([]);
              setStart(Date.now());
              setDone(false);
            }}
          />
        )
      ) : (
        <MatchPlayingView
          score={score}
          combo={combo}
          elapsedSeconds={elapsedSeconds}
          overallMatched={overallMatched}
          total={total}
          onRestart={restartMidRound}
          deck={deck}
          wordsById={wordsById}
          stateOf={stateOf}
          onTapCard={handleTap}
        />
      )}
    </LessonGameGate>
  );
}
