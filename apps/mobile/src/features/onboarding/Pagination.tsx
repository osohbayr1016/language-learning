import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../theme';

type Props = { count: number; current: number };

export function Pagination({ count, current }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.active : styles.inactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  dot: { height: 6, borderRadius: 3 },
  active: { width: 24, backgroundColor: colors.accent.purple },
  inactive: { width: 6, backgroundColor: colors.border },
});
