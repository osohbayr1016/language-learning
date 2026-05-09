import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Button, Screen } from '../../primitives';
import { useDueWords } from '../../hooks/useDueWords';
import { useGameSession } from '../../hooks/useGameSession';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { StudyHeader } from '../study/StudyHeader';
import { StudyEmptyState } from '../study/EmptyState';
import { HanziWriterView, type HanziWriterEvent, type HanziWriterMode } from '../../components/writing/HanziWriterView';
import { WriterControls } from './WriterControls';
import { CharacterPicker } from './CharacterPicker';
import { AccuracyMeter } from './AccuracyMeter';

export default function WriterScreen() {
  const { words, loading, error } = useDueWords(8);
  const { save } = useGameSession();
  const { width } = useWindowDimensions();
  const canvasSize = Math.min(width - spacing.lg * 2, 320);

  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<HanziWriterMode>('animate');
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState<{ strokes: number } | null>(null);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [advanceBusy, setAdvanceBusy] = useState(false);
  const advanceLockRef = useRef(false);

  const current = words[idx];
  const firstChar = current ? Array.from(current.hanzi)[0] : '';

  useEffect(() => {
    setMistakes(0);
    setCompleted(null);
    setMode('animate');
    setStartedAt(Date.now());
  }, [idx]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}><ActivityIndicator color={colors.accent.purple} /></View>
      </Screen>
    );
  }
  if (words.length === 0) {
    return <StudyEmptyState message={error ? mn.study.wordsLoadError : undefined} />;
  }

  const handleEvent = (e: HanziWriterEvent) => {
    if (e.type === 'mistake') setMistakes((m) => m + 1);
    if (e.type === 'complete') setCompleted({ strokes: e.strokes });
  };

  const finishCharacter = async () => {
    if (advanceLockRef.current || advanceBusy) return;
    advanceLockRef.current = true;
    setAdvanceBusy(true);
    try {
      const strokes = completed?.strokes ?? current!.stroke_count ?? 1;
      const score = Math.max(0, Math.round(100 - (mistakes / Math.max(1, strokes)) * 30));
      const xp = Math.round(score / 10);
      await save({
        game_type: 'writer',
        score,
        accuracy: score / 100,
        duration_seconds: Math.round((Date.now() - startedAt) / 1000),
        words_practiced: 1,
        xp_earned: xp,
      });
      if (idx + 1 >= words.length) {
        setIdx(0);
      } else {
        setIdx((i) => i + 1);
      }
    } finally {
      advanceLockRef.current = false;
      setAdvanceBusy(false);
    }
  };

  return (
    <Screen scroll>
      <StudyHeader title={mn.study.writer} index={idx} total={words.length} />
      <CharacterPicker words={words} current={current!} onPick={(w) => setIdx(words.findIndex((x) => x.id === w.id))} />
      <View style={styles.canvasWrap}>
        <HanziWriterView
          key={`${current!.id}-${mode}`}
          char={firstChar}
          mode={mode}
          size={canvasSize}
          strokeColor={colors.accent.purple}
          outlineColor={colors.border}
          onEvent={handleEvent}
        />
      </View>
      <Text style={styles.hint}>{mode === 'quiz' ? 'Зураасаар нь дагаж зураарай' : 'Үзээд дараа нь өөрөө бичиж үзээрэй'}</Text>
      <WriterControls mode={mode} onChange={setMode} />
      {mode === 'quiz' && completed ? (
        <>
          <AccuracyMeter mistakes={mistakes} strokes={completed.strokes} />
          <Button
            label={mn.common.next}
            onPress={() => void finishCharacter()}
            loading={advanceBusy}
            disabled={advanceBusy}
            style={{ marginTop: spacing.md }}
          />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  canvasWrap: { alignItems: 'center', marginVertical: spacing.md },
  hint: { ...typography.body.md, color: colors.text.muted, textAlign: 'center', marginVertical: spacing.sm },
});
