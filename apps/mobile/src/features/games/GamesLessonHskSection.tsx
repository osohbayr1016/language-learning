import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { HskLevel } from '../../lib/types';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { useLessonChapters } from '../lessons/useLessonChapters';
import { publishedLessonCountByHsk } from '../lessons/lessonPathUtils';

const HSK_ORDER: HskLevel[] = [1, 2, 3, 4, 5, 6];

type Props = { onPickLevel: (level: HskLevel) => void };

export function GamesLessonHskSection({ onPickLevel }: Props) {
  const { chapters, loading } = useLessonChapters();
  const counts = useMemo(() => publishedLessonCountByHsk(chapters), [chapters]);

  if (loading && chapters.length === 0) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {HSK_ORDER.map((lv, i) => {
        const n = counts[lv];
        const disabled = n === 0;
        const sub = mn.study.lessonPrepLessonCount.replace('{n}', String(n));
        const last = i === HSK_ORDER.length - 1;
        return (
          <Pressable
            key={lv}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            accessibilityLabel={`HSK ${lv}, ${sub}`}
            disabled={disabled}
            style={({ pressed }) => [
              styles.row,
              last && styles.rowLast,
              disabled && styles.rowDisabled,
              !disabled && pressed && styles.rowPressed,
            ]}
            onPress={() => onPickLevel(lv)}
          >
            <View style={styles.rowBody}>
              <Text style={[styles.rowTitle, disabled && styles.muted]}>{`HSK ${lv}`}</Text>
              <Text style={[styles.rowSub, disabled && styles.muted]}>{sub}</Text>
            </View>
            {!disabled ? (
              <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  list: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowPressed: { opacity: 0.88 },
  rowDisabled: { opacity: 0.55 },
  rowBody: { flex: 1 },
  rowTitle: { ...typography.body.md, fontWeight: '800', color: colors.text.primary },
  rowSub: { ...typography.body.sm, color: colors.text.secondary, marginTop: 2 },
  muted: { color: colors.text.muted },
});
