import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from '../../../primitives';
import { useRandomWords } from '../../../hooks/useRandomWords';
import { useLessonGameDetail } from '../../../hooks/useLessonGameDetail';
import { useGameSession } from '../../../hooks/useGameSession';
import { colors, spacing } from '../../../theme';
import { mn } from '../../../i18n/mn';
import { GameHud } from '../GameHud';
import { GameOverScreen } from '../GameOverScreen';
import { collectArrangePhrases } from './collectArrangePhrases';
import { ArrangeRoundView } from './ArrangeRoundView';
import { phraseMeaningHint } from './phraseHint';
import type { Word } from '../../../lib/types';
import { GameLessonTooFew } from '../GameLessonTooFew';

const MAX_ROUNDS = 8;
const RANDOM_FETCH = 80;

type Props = { lessonId?: string };

export default function ArrangeHanziScreen({ lessonId }: Props) {
  const useLesson = Boolean(lessonId);
  const { detail, loading: detLoading, error: detErr } = useLessonGameDetail(
    useLesson ? lessonId : undefined
  );
  const { words: randomWords, loading: randLoading } = useRandomWords(RANDOM_FETCH, undefined, !useLesson);

  const loading = useLesson ? detLoading : randLoading;
  const words = (useLesson ? detail?.words : randomWords) ?? [];

  const phrases = useMemo(
    () => collectArrangePhrases(detail?.imported_content ?? null, words as Word[]),
    [detail, words]
  );
  const rounds = useMemo(() => phrases.slice(0, Math.min(MAX_ROUNDS, phrases.length)), [phrases]);

  const { save } = useGameSession();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [start] = useState(() => Date.now());
  const [done, setDone] = useState(false);

  const lessonIdNum =
    lessonId && Number.isFinite(Number(lessonId)) ? Math.trunc(Number(lessonId)) : undefined;
  const current = rounds[idx];
  const hint =
    current && useLesson && detail?.words ? phraseMeaningHint(current, detail.words) : null;

  if (useLesson && detErr) {
    return <GameLessonTooFew message={detErr} />;
  }

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent.purple} />
        </View>
      </Screen>
    );
  }

  if (rounds.length === 0 || !current) {
    return <GameLessonTooFew message={mn.games.arrangeEmpty} />;
  }

  if (done) {
    return (
      <GameOverScreen
        score={score}
        xp={Math.round(score / 3)}
        durationSeconds={Math.max(1, Math.round((Date.now() - start) / 1000))}
        onPlayAgain={() => {
          setIdx(0);
          setScore(0);
          setHits(0);
          setDone(false);
        }}
      />
    );
  }

  return (
    <Screen scroll>
      <GameHud
        title={mn.games.arrange}
        score={score}
        progressLabel={`${idx + 1}/${rounds.length}`}
      />
      <ArrangeRoundView
        key={`${idx}-${current}`}
        answerPhrase={current}
        hintBelow={hint}
        disabled={false}
        onSolved={async (ok) => {
          const nextScore = ok ? score + 10 : score;
          const nextHits = ok ? hits + 1 : hits;
          setScore(nextScore);
          setHits(nextHits);

          const last = idx + 1 >= rounds.length;
          if (last) {
            const elapsed = Math.max(1, Math.round((Date.now() - start) / 1000));
            await save({
              game_type: 'arrange',
              score: nextScore,
              accuracy: rounds.length > 0 ? nextHits / rounds.length : 0,
              duration_seconds: elapsed,
              words_practiced: rounds.length,
              xp_earned: Math.round(nextScore / 3),
              ...(lessonIdNum != null ? { lesson_id: lessonIdNum } : {}),
            });
            setDone(true);
          } else {
            setIdx((i) => i + 1);
          }
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
