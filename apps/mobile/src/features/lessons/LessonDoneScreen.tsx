import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Screen } from '../../primitives';
import { useGamification } from '../../context/GamificationContext';
import { colors, radius, spacing, typography } from '../../theme';
import { MetricRing } from './MetricRing';
import { computeSkills } from './skills';
import type { Exercise, ExerciseResult } from './types';

type Props = {
  exercises: Exercise[];
  results: ExerciseResult[];
  durationSec: number;
  xpEarned: number;
  accuracy: number;
  onContinue: () => void;
};

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function LessonDoneScreen({
  exercises,
  results,
  durationSec,
  xpEarned,
  accuracy,
  onContinue,
}: Props) {
  const { streak } = useGamification();
  const skills = computeSkills(exercises, results);

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <Ionicons name="trophy" size={64} color={colors.warning} />
        <Text style={styles.title}>Хичээл дууслаа!</Text>
        <Text style={styles.sub}>+{xpEarned} XP цуглуулсан</Text>
      </View>

      <View style={styles.pillRow}>
        <View style={[styles.pill, { backgroundColor: '#FFF6D8' }]}>
          <Ionicons name="time-outline" size={18} color={colors.warning} />
          <Text style={styles.pillLabel}>{formatDuration(durationSec)}</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: '#E2F4FF' }]}>
          <Ionicons name="checkmark-circle" size={18} color={colors.brand.secondary} />
          <Text style={styles.pillLabel}>{Math.round(accuracy * 100)}% нарийвчлал</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: '#FFE7E7' }]}>
          <Ionicons name="flame" size={18} color={colors.error} />
          <Text style={styles.pillLabel}>{streak?.current_streak ?? 0} өдөр</Text>
        </View>
      </View>

      <Text style={styles.section}>Чадварын явц</Text>
      <View style={styles.grid}>
        <MetricRing label="Сонсох" value={skills.listening} icon="ear" color={colors.brand.secondary} />
        <MetricRing label="Дуудлага" value={skills.pronunciation} icon="mic" color={colors.error} />
        <MetricRing label="Өнгө" value={skills.tones} icon="musical-notes" color={colors.warning} />
        <MetricRing label="Цээж" value={skills.recall} icon="bulb" color={colors.brand.primary} />
        <MetricRing label="Унших" value={skills.reading} icon="book" color={colors.accent.purple} />
        <MetricRing label="Зураас" value={skills.stroke} icon="brush" color={colors.accent.pink} />
      </View>

      <Button label="ҮРГЭЛЖЛҮҮЛЭХ" onPress={onContinue} style={{ marginTop: spacing.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: spacing.lg },
  title: { ...typography.heading.xl, color: colors.text.primary, marginTop: spacing.sm },
  sub: { ...typography.heading.md, color: colors.brand.primary, marginTop: 4 },
  pillRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: spacing.md },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  pillLabel: { ...typography.body.md, fontWeight: '700', color: colors.text.primary },
  section: {
    ...typography.heading.md,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
});
