import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { Lesson } from '../../lib/types';
import { colors, radius, spacing, typography } from '../../theme';

export type LessonPrepStepItem = {
  lesson: Lesson;
  chapterColor: string;
};

type Props = {
  items: LessonPrepStepItem[];
  activeLessonId: number | null;
  onStepPress: (lessonId: number) => void;
};

function StepNode({
  done,
  active,
  orderNum,
  color,
  onPress,
}: {
  done: boolean;
  active: boolean;
  orderNum: number;
  color: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(active ? 1 : 0.92);

  useEffect(() => {
    scale.value = withSpring(active ? 1.06 : 0.92, { damping: 14, stiffness: 220 });
  }, [active, scale]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.nodeHit}>
      <Animated.View
        style={[
          styles.nodeOuter,
          active && { borderColor: color, backgroundColor: `${color}18` },
          !active && !done && styles.nodeIdle,
          anim,
        ]}
      >
        {done ? (
          <Ionicons name="checkmark" size={16} color={active ? color : colors.brand.primaryDark} />
        ) : (
          <Text style={[styles.nodeNum, active && { color }]}>{orderNum}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function LessonPrepLessonStepper({ items, activeLessonId, onStepPress }: Props) {
  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((it, i) => {
          const { lesson, chapterColor } = it;
          const done = !!lesson.progress?.completed_at;
          const active = lesson.id === activeLessonId;
          const last = i === items.length - 1;
          return (
            <View key={lesson.id} style={styles.segment}>
              <StepNode
                done={done}
                active={active}
                orderNum={lesson.order_num}
                color={chapterColor}
                onPress={() => onStepPress(lesson.id)}
              />
              {!last ? <View style={[styles.connector, done && styles.connectorDone]} /> : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  segment: { flexDirection: 'row', alignItems: 'center' },
  nodeHit: { alignItems: 'center', justifyContent: 'center' },
  nodeOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeIdle: { opacity: 0.85 },
  nodeNum: { ...typography.heading.sm, fontSize: 13, fontWeight: '900', color: colors.text.secondary },
  connector: {
    width: 20,
    height: 2,
    marginHorizontal: 2,
    borderRadius: 1,
    backgroundColor: colors.border,
  },
  connectorDone: { backgroundColor: `${colors.brand.primary}99` },
});
