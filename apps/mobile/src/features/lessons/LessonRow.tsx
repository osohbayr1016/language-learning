import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import type { Lesson } from '../../lib/types';

type Props = {
  lesson: Lesson;
  color: string;
  current?: boolean;
  locked?: boolean;
};

const ICON_MAP: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  'hand-right': 'hand-right',
  people: 'people',
  'checkmark-done': 'checkmark-done',
  school: 'school',
  walk: 'walk',
  book: 'book',
};

export function LessonRow({ lesson, color, current, locked }: Props) {
  const router = useRouter();
  const iconName = ICON_MAP[lesson.icon] ?? 'book';
  const completed = !!lesson.progress?.completed_at;
  const accuracy = lesson.progress?.best_accuracy ?? 0;
  const emphasis = current && !locked;

  return (
    <Pressable
      onPress={() => !locked && router.push(`/lessons/${lesson.id}` as never)}
      disabled={locked}
      style={({ pressed }) => [
        styles.row,
        emphasis && [styles.rowCurrent, { borderColor: color, backgroundColor: `${color}12` }],
        pressed && !locked && styles.pressed,
      ]}
    >
      <View style={styles.circleWrap}>
        {current && !locked ? <View style={[styles.ring, { borderColor: color }]} /> : null}
        <View
          style={[
            styles.circle,
            {
              backgroundColor: locked ? colors.bg.secondary : color,
              borderBottomWidth: locked ? 0 : 4,
              borderBottomColor: locked ? 'transparent' : 'rgba(0,0,0,0.18)',
            },
          ]}
        >
          {locked ? (
            <Ionicons name="lock-closed" size={20} color={colors.text.muted} />
          ) : completed ? (
            <Ionicons name="star" size={22} color="#FFFFFF" />
          ) : (
            <Ionicons name={iconName} size={22} color="#FFFFFF" />
          )}
        </View>
      </View>

      <View style={styles.middle}>
        <View style={styles.titleRow}>
          <View style={[styles.orderBadge, { backgroundColor: locked ? colors.borderLight : `${color}26` }]}>
            <Text style={[styles.orderTxt, locked && { color: colors.text.muted }]}>{lesson.order_num}</Text>
          </View>
          <View style={styles.titleCol}>
            <Text style={[styles.title, locked && styles.titleLocked]} numberOfLines={2}>
              {lesson.title_mn}
            </Text>
            {lesson.subtitle_mn ? (
              <Text style={[styles.subtitle, locked && styles.subLocked]} numberOfLines={1}>
                {completed ? `${Math.round(accuracy * 100)}% нарийвчлал` : lesson.subtitle_mn}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={locked ? colors.text.muted : emphasis ? color : colors.text.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  rowCurrent: { borderWidth: 2, shadowColor: colors.text.primary, shadowOpacity: 0.08, shadowRadius: 8 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.997 }] },
  circleWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  ring: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  titleCol: { flex: 1, minWidth: 0 },
  orderBadge: {
    minWidth: 28,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  orderTxt: { fontSize: 13, fontWeight: '900', color: colors.text.primary },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  titleLocked: { color: colors.text.muted, fontWeight: '700' },
  subtitle: {
    ...typography.body.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  subLocked: { color: colors.text.muted, fontWeight: '500' },
});
