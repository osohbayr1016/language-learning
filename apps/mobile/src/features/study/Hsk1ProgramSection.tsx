import React, { useMemo } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { mn } from '../../i18n/mn';
import { Hsk1LessonList } from '../lessons/Hsk1LessonList';
import { getFirstLessonId, getPrimaryHsk1Chapter } from '../lessons/hsk1ChapterPick';
import { useLessonChapters } from '../lessons/useLessonChapters';
import { colors, radius, spacing, typography } from '../../theme';
import { hrefStudyTab } from '../../lib/nav/hrefs';
import { Hsk1AdvanceGateBanner } from './Hsk1AdvanceGateBanner';
import { HSK1_TEXTBOOK_PDF_URL } from '../../lib/content/hsk1TextbookPdf';

type StepProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  hint: string;
  onPress: () => void;
};

function FundStep({ icon, label, hint, onPress }: StepProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.step, pressed && styles.stepPressed]}
    >
      <Ionicons name={icon} size={20} color={colors.brand.primary} />
      <View style={styles.stepText}>
        <Text style={styles.stepLabel}>{label}</Text>
        <Text style={styles.stepHint} numberOfLines={2}>
          {hint}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
    </Pressable>
  );
}

/** Сурах таб — суурь алхмууд + 15 хичээлийн жагсаалт */
const MAX_HOME_HSK = 3;

export function Hsk1ProgramSection() {
  const router = useRouter();
  const { chapters, loading, advanceGateOk } = useLessonChapters();
  const homeChapters = useMemo(
    () => chapters.filter((c) => c.hsk_level <= MAX_HOME_HSK),
    [chapters],
  );
  const h1 = useMemo(() => getPrimaryHsk1Chapter(chapters), [chapters]);
  const firstId = useMemo(() => getFirstLessonId(h1), [h1]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <View>
      {advanceGateOk ? <Hsk1AdvanceGateBanner /> : null}
      <Text style={styles.listTitle}>{mn.study.hsk1LessonsTitle}</Text>
      <Hsk1LessonList chapters={homeChapters} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: spacing.xl, alignItems: 'center' },
  intro: { ...typography.body.sm, color: colors.text.secondary, marginBottom: spacing.md },
  fundTitle: {
    ...typography.heading.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  steps: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg.primary,
  },
  stepPressed: { opacity: 0.85 },
  stepText: { flex: 1 },
  stepLabel: { ...typography.body.md, fontWeight: '700' as const, color: colors.text.primary, marginBottom: 2 },
  stepHint: { ...typography.body.sm, color: colors.text.muted },
  listTitle: {
    ...typography.heading.md,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
});
