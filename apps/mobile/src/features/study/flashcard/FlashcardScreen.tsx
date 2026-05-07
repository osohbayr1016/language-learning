import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { ReviewRating } from '@chinese-app/srs';
import { Screen } from '../../../primitives';
import { useDueWords } from '../../../hooks/useDueWords';
import { useSrsRating } from '../../../hooks/useSrsRating';
import { useAdaptiveTimer } from '../../../hooks/useAdaptiveTimer';
import { calculateXP } from '@chinese-app/srs';
import { colors, spacing } from '../../../theme';
import { StudyHeader } from '../StudyHeader';
import { StudyEmptyState } from '../EmptyState';
import { SessionDoneScreen } from '../SessionDoneScreen';
import { RatingBar } from '../../../components/srs/RatingBar';
import { ConfidenceBar } from '../../../components/srs/ConfidenceBar';
import { mn } from '../../../i18n/mn';
import { FlipCard } from './FlipCard';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';
import type { ConfidenceLevel } from '../../../lib/srs/adaptive';

export default function FlashcardScreen() {
  const { words, loading, error } = useDueWords(15);
  const session = useSrsRating('flashcard');
  const timer = useAdaptiveTimer();

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const current = words[idx];

  useEffect(() => { if (current) timer.start(); }, [current, timer]);

  const xp = useMemo(
    () => calculateXP({ type: 'flashcard', correct: correctCount, total: words.length }),
    [correctCount, words.length]
  );

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent.purple} />
        </View>
      </Screen>
    );
  }

  if (words.length === 0) {
    return <StudyEmptyState message={error ? mn.study.wordsLoadError : undefined} />;
  }

  if (done) return <SessionDoneScreen xp={xp} total={words.length} correct={correctCount} />;

  const handleRate = async (rating: ReviewRating) => {
    if (!current) return;
    const responseMs = timer.stopAndReset();
    session.record(
      current.id,
      { ease_factor: current.ease_factor, interval: current.interval, repetitions: current.repetitions },
      { rating, responseMs, confidence: confidence ?? undefined }
    );
    if (rating >= 3) setCorrectCount((n) => n + 1);
    setConfidence(null);
    setFlipped(false);
    if (idx + 1 >= words.length) {
      await session.flush(xp + (rating >= 3 ? 5 : 0));
      setDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  };

  return (
    <Screen scroll={false}>
      <StudyHeader title={mn.study.flashcard} index={idx} total={words.length} />
      <View style={styles.cardArea}>
        <FlipCard
          flipped={flipped}
          onPress={() => setFlipped((f) => !f)}
          front={<CardFront word={current!} />}
          back={<CardBack word={current!} />}
        />
      </View>
      {flipped ? (
        <View style={styles.bottom}>
          <ConfidenceBar value={confidence} onChange={setConfidence} />
          <View style={{ height: spacing.md }} />
          <RatingBar onRate={handleRate} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardArea: { flex: 1, paddingVertical: spacing.lg },
  bottom: { paddingBottom: spacing.lg, gap: spacing.sm },
});
