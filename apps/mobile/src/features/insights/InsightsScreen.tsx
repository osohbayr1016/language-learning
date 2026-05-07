import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { addMonths, addWeeks, firstOfMonth, startOfWeek, addDays } from './dates';
import { useInsights } from './useInsights';
import { InsightsHeader } from './InsightsHeader';
import { TopStatsRow } from './TopStatsRow';
import { GrowthAreaCard } from './GrowthAreaCard';
import { NumberStatsGrid } from './NumberStatsGrid';
import { LearningDayHistoryCard } from './LearningDayHistoryCard';
import { LearningTimeCard } from './LearningTimeCard';

export function InsightsScreen() {
  const today = new Date();
  const [month, setMonth] = useState<Date>(firstOfMonth(today));
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(today));
  const weekEnd = addDays(weekStart, 6);

  const { data, loading, error } = useInsights(month, weekEnd);

  return (
    <Screen scroll>
      <InsightsHeader />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
      ) : error ? (
        <Text style={styles.error}>{mn.insights.errors.load}</Text>
      ) : (
        <>
          <TopStatsRow
            longest={data.summary?.longest_streak ?? 0}
            current={data.summary?.current_streak ?? 0}
            days={data.summary?.total_days_studied ?? 0}
          />
          <GrowthAreaCard skills={data.skills} />
          <NumberStatsGrid summary={data.summary} />
          <LearningDayHistoryCard
            monthStart={month}
            days={data.calendar}
            onPrev={() => setMonth((m) => addMonths(m, -1))}
            onNext={() => setMonth((m) => addMonths(m, 1))}
          />
          <LearningTimeCard
            weekStart={weekStart}
            data={data.week}
            onPrev={() => setWeekStart((w) => addWeeks(w, -1))}
            onNext={() => setWeekStart((w) => addWeeks(w, 1))}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { paddingVertical: spacing.xxl, alignItems: 'center' },
  error: {
    ...typography.body.md,
    color: colors.error,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
