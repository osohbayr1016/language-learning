import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Screen } from '../../primitives';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { MetricRing } from './MetricRing';
import { LessonDoneMockExamCta } from './LessonDoneMockExamCta';
import type { SkillScores } from './skills';
import type { Streak } from '../../lib/api/user';
import type { HskLevel, ImportedLessonContent } from '../../lib/types';

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

type Props = {
  durationSec: number;
  xpEarned: number;
  accuracy: number;
  skills: SkillScores;
  streak: Streak;
  enablePostLessonNav: boolean;
  token: string | null;
  importedContent?: ImportedLessonContent | null;
  chapterHskLevel?: HskLevel;
  nextLesson: { id: number; title_mn: string } | null;
  goNext: () => void;
  onContinue: () => void;
};

export function LessonDoneWithStats({
  durationSec,
  xpEarned,
  accuracy,
  skills,
  streak,
  enablePostLessonNav,
  token,
  importedContent,
  chapterHskLevel,
  nextLesson,
  goNext,
  onContinue,
}: Props) {
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

      <View style={styles.btns}>
        {enablePostLessonNav ? (
          <LessonDoneMockExamCta
            token={token}
            imported={importedContent}
            chapterHskLevel={chapterHskLevel}
          />
        ) : null}
        {enablePostLessonNav && nextLesson ? (
          <Button
            label={`${mn.lesson.continueNextPrefix} ${nextLesson.title_mn}`}
            onPress={goNext}
            accessibilityLabel={`${mn.lesson.continueNextPrefix} ${nextLesson.title_mn}`}
          />
        ) : null}
        <Button
          label={
            enablePostLessonNav ? (nextLesson ? mn.lesson.backToStudy : 'ҮРГЭЛЖЛҮҮЛЭХ') : mn.admin.lessonPreviewDone
          }
          variant={enablePostLessonNav && nextLesson ? 'secondary' : 'primary'}
          onPress={onContinue}
        />
      </View>
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
  btns: { marginTop: spacing.xl, gap: spacing.md },
});
