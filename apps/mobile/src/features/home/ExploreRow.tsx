import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Item = {
  key: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  href: string;
};

const ITEMS: Item[] = [
  { key: 'cartoons', title: mn.tabs.cartoons, icon: 'play-circle', color: colors.accent.pink, href: '/(tabs)/cartoons' },
  { key: 'games', title: mn.tabs.games, icon: 'game-controller', color: colors.accent.purple, href: '/(tabs)/games' },
  { key: 'match', title: mn.games.match, icon: 'grid', color: colors.accent.blue, href: '/games/match' },
  { key: 'translate', title: mn.games.translate, icon: 'language', color: colors.accent.teal, href: '/games/translate' },
  { key: 'sentence', title: mn.games.sentence, icon: 'reader', color: colors.accent.amber, href: '/games/sentence' },
  { key: 'stroke', title: mn.games.stroke, icon: 'brush', color: colors.accent.green, href: '/games/stroke' },
];

export function ExploreRow() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Үргэлжлүүлэх</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroller}>
        {ITEMS.map((it) => (
          <Pressable
            key={it.key}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            onPress={() => router.push(it.href as never)}
          >
            <View style={[styles.iconBox, { backgroundColor: `${it.color}22` }]}>
              <Ionicons name={it.icon} size={24} color={it.color} />
            </View>
            <Text style={styles.label} numberOfLines={1}>{it.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  title: { ...typography.heading.md, color: colors.text.primary, marginBottom: spacing.md },
  scroller: { gap: spacing.sm, paddingRight: spacing.md },
  tile: {
    width: 110,
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typography.body.sm, color: colors.text.primary, textAlign: 'center' },
});
