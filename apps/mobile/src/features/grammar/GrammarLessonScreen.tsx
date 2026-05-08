import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import type { GrammarDetail } from '../../lib/api/grammar';
import { GrammarExerciseBlock } from './GrammarExerciseBlock';
import { mn } from '../../i18n/mn';
import { colors, radius, spacing, typography } from '../../theme';

export function GrammarLessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const lessonId = Number(id);
  const [detail, setDetail] = useState<GrammarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!token || !Number.isFinite(lessonId)) return;
    setLoading(true);
    try {
      const r = await api.grammar.get(token, lessonId);
      setDetail(r.data);
    } catch {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [token, lessonId]);

  useEffect(() => {
    void load();
  }, [load]);

  const onSubmit = async () => {
    if (!token || !detail) return;
    setSubmitting(true);
    try {
      const numAns: Record<number, string | boolean> = {};
      for (const ex of detail.exercises) {
        const rawV = answers[ex.id] ?? '';
        if (ex.exercise_type === 'true_false')
          numAns[ex.id] = rawV === 'true' || rawV === 'True';
        else numAns[ex.id] = rawV;
      }
      await api.grammar.complete(token, lessonId, numAns);
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Screen edges={['top']}>
        <Text style={styles.muted}>{mn.auth.loginTitle}</Text>
      </Screen>
    );
  }

  if (loading || !detail) {
    return (
      <Screen edges={['top']}>
        <ActivityIndicator color={colors.brand.primary} />
      </Screen>
    );
  }

  return (
    <Screen edges={['top']} scroll scrollBottomInset={100}>
      <Text style={styles.h1}>{detail.title_mn}</Text>
      <Text style={styles.p}>{detail.explanation_mn}</Text>

      {detail.exercises.map((ex) => (
        <View key={ex.id} style={styles.block}>
          <Text style={styles.q}>{ex.question_zh}</Text>
          <GrammarExerciseBlock
            ex={ex}
            value={answers[ex.id] ?? ''}
            onChange={(t) => setAnswers((a) => ({ ...a, [ex.id]: t }))}
          />
        </View>
      ))}

      <Pressable
        style={[styles.submit, submitting && { opacity: 0.6 }]}
        disabled={submitting}
        onPress={() => void onSubmit()}
      >
        <Text style={styles.submitTx}>{mn.common.save}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: { ...typography.heading.lg, color: colors.text.primary, marginBottom: spacing.sm },
  p: { ...typography.body.md, color: colors.text.secondary, marginBottom: spacing.lg },
  block: { marginBottom: spacing.lg },
  q: { ...typography.body.md, color: colors.text.primary, marginBottom: spacing.sm },
  submit: {
    marginTop: spacing.md,
    backgroundColor: colors.brand.primary,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  submitTx: { color: colors.text.inverse, ...typography.heading.sm },
  muted: { ...typography.body.md, color: colors.text.muted },
});
