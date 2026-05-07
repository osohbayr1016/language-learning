import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { InsightsSummary } from '../../lib/types';
import { SectionCard } from './SectionCard';

type Tile = {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

type Props = { summary: InsightsSummary | null };

export function NumberStatsGrid({ summary }: Props) {
  const s = summary ?? ({} as Partial<InsightsSummary>);
  const tiles: Tile[] = [
    { label: mn.insights.numbers.lessons,        value: s.lessons_completed ?? 0, icon: 'book',           color: colors.brand.primary },
    { label: mn.insights.numbers.perfect,        value: s.perfect_lessons ?? 0,   icon: 'ribbon',         color: colors.warning },
    { label: mn.insights.numbers.wordsLearned,   value: s.words_learned ?? 0,     icon: 'school',         color: colors.info },
    { label: mn.insights.numbers.wordsMastered,  value: s.words_mastered ?? 0,    icon: 'checkmark-done', color: colors.brand.primary },
    { label: mn.insights.numbers.xp,             value: s.total_xp ?? 0,          icon: 'star',           color: colors.accent.purple },
    { label: mn.insights.numbers.games,          value: s.games_played ?? 0,      icon: 'game-controller',color: colors.accent.pink },
  ];

  return (
    <SectionCard title={mn.insights.numbers.title}>
      <View style={styles.grid}>
        {tiles.map((t) => (
          <View key={t.label} style={styles.tile}>
            <View style={[styles.icon, { backgroundColor: `${t.color}1A` }]}>
              <Ionicons name={t.icon} size={20} color={t.color} />
            </View>
            <Text style={styles.value}>{t.value}</Text>
            <Text style={styles.label} numberOfLines={2}>{t.label}</Text>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '31%',
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    ...shadows.sm,
  },
  icon: {
    width: 36, height: 36, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: { ...typography.heading.md, color: colors.text.primary },
  label: { ...typography.body.sm, color: colors.text.secondary, textAlign: 'center', marginTop: 2 },
});
