import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from '../../primitives';
import { colors, spacing } from '../../theme';
import { addMonths, addWeeks, firstOfMonth, startOfWeek, addDays } from './dates';
import { useInsights } from './useInsights';
import { InsightsHeader } from './InsightsHeader';
import { TopStatsRow } from './TopStatsRow';
import { GrowthAreaCard } from './GrowthAreaCard';
import { NumberStatsGrid } from './NumberStatsGrid';
import { LearningDayHistoryCard } from './LearningDayHistoryCard';
import { LearningTimeCard } from './LearningTimeCard';

export function InsightsScreen() {
  const initial = useMemo(() => {
    const t = new Date();
    return { month: firstOfMonth(t), weekStart: startOfWeek(t) };
  }, []);
  const [month, setMonth] = useState<Date>(initial.month);
  const [weekStart, setWeekStart] = useState<Date>(initial.weekStart);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  const { data, loading } = useInsights(month, weekEnd);

  return (
    <Screen scroll scrollBottomInset={70}>
      <InsightsHeader />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
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
});
