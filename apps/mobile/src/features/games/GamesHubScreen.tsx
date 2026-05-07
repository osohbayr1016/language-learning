import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../primitives';
import { GameTileCard } from '../../components/cards/GameTileCard';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

const GAMES: {
  key: string;
  title: string;
  subtitle: string;
  icon: 'grid-outline' | 'language-outline' | 'text-outline' | 'pencil-outline';
  color: string;
  href: string;
}[] = [
  { key: 'match', title: mn.games.match, subtitle: mn.games.matchDesc, icon: 'grid-outline', color: colors.accent.purple, href: '/games/match' },
  { key: 'translate', title: mn.games.translate, subtitle: mn.games.translateDesc, icon: 'language-outline', color: colors.accent.blue, href: '/games/translate' },
  { key: 'sentence', title: mn.games.sentence, subtitle: mn.games.sentenceDesc, icon: 'text-outline', color: colors.accent.teal, href: '/games/sentence' },
  { key: 'stroke', title: mn.games.stroke, subtitle: mn.games.strokeDesc, icon: 'pencil-outline', color: colors.accent.pink, href: '/games/stroke' },
];

export default function GamesHubScreen() {
  const router = useRouter();

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{mn.games.hub}</Text>
        <Text style={styles.subheading}>Тоглож сур, оноо хий</Text>
      </View>
      <View style={styles.grid}>
        {GAMES.map((g) => (
          <GameTileCard
            key={g.key}
            title={g.title}
            subtitle={g.subtitle}
            icon={g.icon}
            color={g.color}
            onPress={() => router.push(g.href as never)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { marginBottom: spacing.lg, marginTop: spacing.sm },
  heading: { ...typography.heading.xl, color: colors.text.primary },
  subheading: { ...typography.body.md, color: colors.text.secondary, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
