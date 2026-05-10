import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Action = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  href: string;
};

const ACTIONS: Action[] = [
  { key: 'flashcard', label: mn.study.flashcard, icon: 'albums-outline', color: colors.accent.purple, href: '/study/flashcard' },
  { key: 'learn', label: mn.study.learn, icon: 'school-outline', color: colors.accent.blue, href: '/study/learn' },
  { key: 'write', label: mn.study.write, icon: 'create-outline', color: colors.accent.teal, href: '/study/write' },
  { key: 'writer', label: mn.study.writer, icon: 'brush-outline', color: colors.accent.pink, href: '/study/writer' },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{mn.home.quickActions}</Text>
      <View style={styles.grid}>
        {ACTIONS.map((a) => (
          <Pressable
            key={a.key}
            accessibilityRole="button"
            accessibilityLabel={a.label}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            onPress={() => router.push(a.href as never)}
          >
            <View style={[styles.iconBox, { backgroundColor: `${a.color}22` }]}>
              <Ionicons name={a.icon} size={26} color={a.color} />
            </View>
            <Text style={styles.label}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  title: { ...typography.heading.md, color: colors.text.primary, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typography.heading.sm, color: colors.text.primary, flexShrink: 1 },
});
