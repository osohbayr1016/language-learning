import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  onPress: () => void;
};

export function GameTileCard({ title, subtitle, icon, color, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { borderColor: color },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={icon} size={32} color={colors.text.inverse} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 160,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.heading.md, color: colors.text.primary, marginBottom: 4 },
  subtitle: { ...typography.body.md, color: colors.text.secondary },
});
