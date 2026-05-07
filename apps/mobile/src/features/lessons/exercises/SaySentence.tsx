import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ToneColoredText, PinyinRow } from '../../../components/hanzi';
import { PronounceButton } from '../../../components/audio/PronounceButton';
import { colors, radius, spacing, typography } from '../../../theme';
import { stripToneMarks } from '../../../lib/tones';
import {
  ensureSpeechPermission,
  startChineseRecognition,
  stopRecognition,
  useSpeechSession,
} from '../../../lib/audio/speech';
import type { Exercise } from '../types';
import { SayFallback } from './SayFallback';

type Props = {
  exercise: Extract<Exercise, { kind: 'say-sentence' }>;
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
};

const PASS_RATIO = 0.6;

function tokenize(text: string): string[] {
  return stripToneMarks(text).match(/[a-z]+/g) ?? [];
}

function tokenOverlap(spoken: string[], target: string[]): number {
  if (target.length === 0) return 0;
  const t = new Set(target);
  let hit = 0;
  for (const s of spoken) if (t.has(s)) hit += 1;
  return hit / target.length;
}

export function SaySentence({ exercise, disabled, onAnswer }: Props) {
  const w = exercise.word;
  const target = w.example_zh ?? w.hanzi;
  const targetTokens = tokenize(w.example_pinyin ?? w.pinyin ?? '');
  const { state, result, errorMessage, reset, supported } = useSpeechSession();
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!result || submitted) return;
    const ratio = tokenOverlap(tokenize(result.transcript), targetTokens);
    setScore(ratio);
    setSubmitted(true);
    onAnswer(ratio >= PASS_RATIO);
  }, [result, submitted, targetTokens, onAnswer]);

  const onMicPress = async () => {
    if (submitted || disabled) return;
    if (state === 'listening') {
      stopRecognition();
      return;
    }
    const granted = await ensureSpeechPermission();
    if (!granted) {
      onAnswer(false);
      setSubmitted(true);
      return;
    }
    reset();
    startChineseRecognition([target]);
  };

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <ToneColoredText hanzi={target} tones={w.tones} size="md" />
        <PinyinRow pinyin={w.example_pinyin ?? w.pinyin ?? ''} size="md" />
        <Text style={styles.translation}>{w.example_mn ?? w.meaning_mn}</Text>
        <PronounceButton wordId={w.id} size="md" style={{ marginTop: spacing.md }} />
      </View>

      {supported ? (
        <View style={styles.micWrap}>
          <Pressable
            onPress={() => void onMicPress()}
            disabled={disabled || submitted}
            style={({ pressed }) => [
              styles.mic,
              { backgroundColor: state === 'listening' ? colors.error : colors.brand.primary },
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={state === 'listening' ? 'stop' : 'mic'}
              size={36}
              color="#FFFFFF"
            />
          </Pressable>
          <Text style={styles.helper}>
            {state === 'listening'
              ? 'Сонсож байна... зогсооход дарна уу'
              : submitted && score !== null
              ? `Таны хэлсэн: ${Math.round(score * 100)}% таарсан`
              : 'Микрофон дээр дарж дээрх өгүүлбэрийг хэлээрэй'}
          </Text>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        </View>
      ) : (
        <SayFallback
          disabled={disabled || submitted}
          onSpoken={() => { setSubmitted(true); onAnswer(true); }}
          onSkip={() => { setSubmitted(true); onAnswer(false); }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between' },
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  translation: {
    ...typography.body.md,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  micWrap: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  mic: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  pressed: { transform: [{ scale: 0.97 }] },
  helper: {
    ...typography.body.md,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  error: { ...typography.body.sm, color: colors.error, textAlign: 'center' },
});
