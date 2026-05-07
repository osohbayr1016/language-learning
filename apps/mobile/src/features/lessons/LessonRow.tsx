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

  return (
    <Pressable
      onPress={() => !locked && router.push(`/lessons/${lesson.id}` as never)}
      disabled={locked}
      style={({ pressed }) => [styles.row, pressed && !locked && styles.pressed]}
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
        <Text style={[styles.title, locked && { color: colors.text.muted }]} numberOfLines={1}>
          {lesson.title_mn}
        </Text>
        {lesson.subtitle_mn ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {completed ? `${Math.round(accuracy * 100)}% нарийвчлал` : lesson.subtitle_mn}
          </Text>
        ) : null}
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={locked ? colors.text.muted : colors.text.secondary}
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
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.sm,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
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
  middle: { flex: 1 },
  title: { ...typography.heading.sm, color: colors.text.primary },
  subtitle: { ...typography.body.sm, color: colors.text.secondary, marginTop: 2 },
});
