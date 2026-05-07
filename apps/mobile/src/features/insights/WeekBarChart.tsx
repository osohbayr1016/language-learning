import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { DayMinutes } from '../../lib/types';
import { addDays, ymd } from './dates';

const HEIGHT = 130;
const BAR_W = 22;

type Props = {
  weekStart: Date;
  data: DayMinutes[];
};

type Cell = { date: string; minutes: number; day: number };

export function WeekBarChart({ weekStart, data }: Props) {
  const cells = useMemo<Cell[]>(() => {
    const map = new Map<string, number>();
    for (const d of data) map.set(d.date, d.minutes ?? 0);
    const out: Cell[] = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const key = ymd(day);
      out.push({ date: key, minutes: map.get(key) ?? 0, day: day.getDate() });
    }
    return out;
  }, [weekStart, data]);

  const max = Math.max(1, ...cells.map((c) => c.minutes));
  const peakIndex = cells.reduce((acc, c, i) => (c.minutes > cells[acc].minutes ? i : acc), 0);

  return (
    <View style={styles.wrap}>
      <View style={styles.bars}>
        {cells.map((c, i) => {
          const h = Math.max(4, Math.round((c.minutes / max) * HEIGHT));
          const isPeak = i === peakIndex && c.minutes > 0;
          return (
            <View key={c.date} style={styles.col}>
              {isPeak && (
                <View style={styles.bubble}>
                  <Text style={styles.bubbleText}>{c.minutes} {mn.insights.time.minutesShort}</Text>
                </View>
              )}
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: h, backgroundColor: isPeak ? colors.brand.primary : colors.border },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{c.day}</Text>
              <Text style={styles.dayName}>{mn.insights.history.weekday[i]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 12 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  col: { alignItems: 'center', width: BAR_W + 12 },
  barTrack: {
    width: BAR_W, height: HEIGHT,
    justifyContent: 'flex-end',
    backgroundColor: colors.borderLight,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  bar: { width: BAR_W, borderRadius: radius.sm },
  dayLabel: { ...typography.body.sm, color: colors.text.primary, marginTop: 4, fontWeight: '700' },
  dayName: { ...typography.body.sm, color: colors.text.muted, fontSize: 10 },
  bubble: {
    backgroundColor: colors.text.primary,
    paddingHorizontal: 6, paddingVertical: 3,
    borderRadius: radius.sm, marginBottom: 4,
  },
  bubbleText: { ...typography.body.sm, color: colors.text.inverse, fontWeight: '700', fontSize: 10 },
});
