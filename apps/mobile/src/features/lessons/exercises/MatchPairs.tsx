import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../../theme';
import type { Exercise } from '../types';

type Props = {
  exercise: Extract<Exercise, { kind: 'match-pairs' }>;
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
};

type Side = 'zh' | 'mn';
type Pick = { side: Side; id: number };

export function MatchPairs({ exercise, disabled, onAnswer }: Props) {
  const left = exercise.pairs;
  const right = useMemo(() => [...exercise.pairs].sort(() => Math.random() - 0.5), [exercise]);

  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<number | null>(null);
  const [active, setActive] = useState<Pick | null>(null);
  const [misses, setMisses] = useState(0);

  const totalPairs = exercise.pairs.length;

  const handleTap = (side: Side, id: number) => {
    if (disabled || matched.has(id)) return;
    if (!active) {
      setActive({ side, id });
      return;
    }
    if (active.side === side) {
      setActive({ side, id });
      return;
    }
    if (active.id === id) {
      const next = new Set(matched);
      next.add(id);
      setMatched(next);
      setActive(null);
      if (next.size === totalPairs) onAnswer(misses === 0);
    } else {
      setWrong(id);
      setMisses((m) => m + 1);
      setTimeout(() => {
        setWrong(null);
        setActive(null);
      }, 350);
    }
  };

  const stateOf = (side: Side, id: number) => {
    if (matched.has(id)) return 'matched';
    if (wrong === id || (active && wrong === active.id)) return 'wrong';
    if (active?.side === side && active.id === id) return 'active';
    return 'idle';
  };

  return (
    <View style={styles.root}>
      <View style={styles.col}>
        {left.map((w) => {
          const s = stateOf('zh', w.id);
          return (
            <Tile key={`zh-${w.id}`} state={s} onPress={() => handleTap('zh', w.id)}>
              {w.hanzi}
            </Tile>
          );
        })}
      </View>
      <View style={styles.col}>
        {right.map((w) => {
          const s = stateOf('mn', w.id);
          return (
            <Tile key={`mn-${w.id}`} state={s} onPress={() => handleTap('mn', w.id)}>
              {w.meaning_mn}
            </Tile>
          );
        })}
      </View>
    </View>
  );
}

function Tile({
  children,
  state,
  onPress,
}: {
  children: React.ReactNode;
  state: 'idle' | 'active' | 'wrong' | 'matched';
  onPress: () => void;
}) {
  const styleByState = {
    idle: { bg: colors.bg.card, border: colors.border, text: colors.text.primary },
    active: { bg: '#DDF4FF', border: colors.brand.secondary, text: colors.brand.secondary },
    wrong: { bg: '#FFDFE0', border: colors.error, text: colors.error },
    matched: { bg: '#D7FFB8', border: colors.success, text: colors.text.muted },
  }[state];

  return (
    <Pressable
      onPress={onPress}
      disabled={state === 'matched'}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: styleByState.bg, borderColor: styleByState.border },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text style={[styles.tileText, { color: styleByState.text }]} numberOfLines={2}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', gap: spacing.md, paddingTop: spacing.sm },
  col: { flex: 1, gap: spacing.sm },
  tile: {
    minHeight: 56,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: { ...typography.heading.sm, textAlign: 'center' },
});
