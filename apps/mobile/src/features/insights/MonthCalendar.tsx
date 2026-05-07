import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { lastOfMonth, pad2 } from './dates';

type Props = {
  monthStart: Date;
  studied: Set<string>;
};

const CELL = 36;

export function MonthCalendar({ monthStart, studied }: Props) {
  const grid = useMemo(() => buildGrid(monthStart), [monthStart]);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

  return (
    <View>
      <View style={styles.weekRow}>
        {mn.insights.history.weekday.map((d) => (
          <Text key={d} style={styles.weekday}>{d}</Text>
        ))}
      </View>
      {grid.map((week, wi) => (
        <View key={wi} style={styles.row}>
          {week.map((cell, ci) => {
            const key = cell?.key ?? `${wi}-${ci}`;
            const did = cell ? studied.has(cell.key) : false;
            const isToday = cell?.key === todayKey;
            return (
              <View key={key} style={styles.cell}>
                {cell ? (
                  <View style={[
                    styles.dot,
                    did && styles.dotActive,
                    isToday && !did && styles.dotToday,
                  ]}>
                    <Text style={[
                      styles.day,
                      did && styles.dayActive,
                    ]}>{cell.day}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

type Cell = { key: string; day: number };

function buildGrid(monthStart: Date): (Cell | null)[][] {
  const last = lastOfMonth(monthStart).getDate();
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const cells: (Cell | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= last; d++) {
    cells.push({
      key: `${monthStart.getFullYear()}-${pad2(monthStart.getMonth() + 1)}-${pad2(d)}`,
      day: d,
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Cell | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const styles = StyleSheet.create({
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cell: { width: CELL, alignItems: 'center', justifyContent: 'center' },
  weekday: { ...typography.body.sm, color: colors.text.muted, width: CELL, textAlign: 'center', fontWeight: '700' },
  dot: {
    width: 30, height: 30, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.bg.secondary,
  },
  dotActive: { backgroundColor: colors.brand.primary },
  dotToday: { borderWidth: 2, borderColor: colors.brand.primary },
  day: { ...typography.body.sm, color: colors.text.secondary, fontWeight: '700' },
  dayActive: { color: colors.text.inverse },
});
