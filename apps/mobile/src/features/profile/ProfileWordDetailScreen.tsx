import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../primitives';
import { ToneColoredText, ToneBar } from '../../components/hanzi';
import { PronounceButton } from '../../components/audio/PronounceButton';
import { HanziWriterView, type HanziWriterEvent, type HanziWriterMode } from '../../components/writing/HanziWriterView';
import { WriterControls } from '../writer/WriterControls';
import { parseTones } from '../../lib/tones';
import { api } from '../../lib/api';
import type { Word } from '../../lib/types';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';

export function ProfileWordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const wid = Number(id);
  const { width } = useWindowDimensions();
  const canvasSize = Math.min(width - spacing.lg * 2, 280);

  const [word, setWord] = useState<Word | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<HanziWriterMode>('animate');

  useEffect(() => {
    if (!Number.isFinite(wid)) return;
    void (async () => {
      try {
        const res = await api.words.get(wid);
        setWord(res.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : mn.common.error);
      }
    })();
  }, [wid]);

  const handleWriterEvent = (_e: HanziWriterEvent) => {};

  if (!Number.isFinite(wid)) {
    return (
      <Screen>
        <Text style={styles.err}>{mn.common.error}</Text>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Text style={styles.err}>{error}</Text>
      </Screen>
    );
  }

  if (!word) {
    return (
      <Screen>
        <ActivityIndicator color={colors.brand.primary} />
      </Screen>
    );
  }

  const tones = parseTones(word.tones);
  const firstTone = tones[0] ?? 0;
  const firstChar = Array.from(word.hanzi)[0] ?? '';

  return (
    <>
      <Stack.Screen options={{ title: word.hanzi }} />
      <Screen scroll padded={false}>
        <View style={styles.wrap}>
          <ToneColoredText hanzi={word.hanzi} tones={tones} size="xl" />
          <View style={styles.toneRow}>
            <ToneBar tone={firstTone} width={80} height={32} />
          </View>
          <View style={styles.listen}>
            <PronounceButton wordId={word.id} size="lg" />
          </View>
          <Text style={styles.py}>{word.pinyin}</Text>
          <Text style={styles.mean}>{word.meaning_mn}</Text>
          {firstChar ? (
            <View style={styles.writer}>
              <Text style={styles.sec}>{mn.writer.title}</Text>
              <WriterControls mode={mode} onChange={setMode} />
              <HanziWriterView
                char={firstChar}
                mode={mode}
                size={canvasSize}
                strokeColor={colors.accent.purple}
                outlineColor={colors.border}
                onEvent={handleWriterEvent}
              />
            </View>
          ) : null}
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  toneRow: { marginTop: spacing.sm },
  listen: { marginTop: spacing.sm },
  py: { ...typography.body.md, color: colors.text.secondary },
  mean: { ...typography.body.lg, color: colors.text.primary, textAlign: 'center' },
  writer: { marginTop: spacing.lg, width: '100%', alignItems: 'center', gap: spacing.sm },
  sec: { ...typography.heading.sm, color: colors.text.primary },
  err: { ...typography.body.md, color: colors.accent.pink, padding: spacing.md },
});
