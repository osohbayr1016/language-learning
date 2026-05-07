import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  best: number;
  onPress: () => void;
};

export function GameModeCard({ title, subtitle, icon, color, best, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderTopColor: color },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="#FFFFFF" />
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
      <View style={styles.footer}>
        {best > 0 ? (
          <View style={[styles.badge, { backgroundColor: `${color}1A` }]}>
            <Ionicons name="trophy" size={12} color={color} />
            <Text style={[styles.badgeLabel, { color }]}>{best}</Text>
          </View>
        ) : (
          <View style={[styles.badge, styles.badgeNew]}>
            <Text style={styles.badgeNewLabel}>{mn.games.newBadge.toUpperCase()}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderTopWidth: 6,
    padding: spacing.md,
    minHeight: 180,
    ...shadows.sm,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: { ...typography.heading.md, color: colors.text.primary, marginBottom: 2 },
  subtitle: { ...typography.body.sm, color: colors.text.secondary },
  footer: { flexDirection: 'row', marginTop: 'auto', paddingTop: spacing.sm },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeLabel: { fontSize: 12, fontWeight: '800' },
  badgeNew: { backgroundColor: colors.bg.secondary },
  badgeNewLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: colors.text.muted,
  },
});
