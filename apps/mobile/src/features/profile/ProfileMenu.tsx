import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../primitives';
import { colors, spacing, typography } from '../../theme';

type Item = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  danger?: boolean;
};

type Props = { items: Item[] };

export function ProfileMenu({ items }: Props) {
  return (
    <Card padding={0} style={styles.card}>
      {items.map((it, idx) => (
        <Pressable
          key={it.key}
          onPress={it.onPress}
          style={({ pressed }) => [
            styles.row,
            idx < items.length - 1 && styles.divider,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name={it.icon}
            size={22}
            color={it.danger ? colors.error : colors.text.secondary}
          />
          <Text
            style={[
              styles.label,
              { color: it.danger ? colors.error : colors.text.primary },
            ]}
          >
            {it.label}
          </Text>
          {!it.danger ? (
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          ) : (
            <View style={{ width: 18 }} />
          )}
        </Pressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  pressed: { backgroundColor: colors.bg.elevated },
  label: { ...typography.heading.sm, color: colors.text.primary, flex: 1 },
});
