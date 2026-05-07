import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing } from '../../theme';
import { GAMES } from './registry';
import { GameModeCard } from './GameModeCard';
import type { GamesStats } from './useGamesStats';

type Props = { stats: GamesStats };

export function GameModeGrid({ stats }: Props) {
  const router = useRouter();
  return (
    <View style={styles.grid}>
      {GAMES.map((g) => (
        <GameModeCard
          key={g.key}
          title={g.title}
          subtitle={g.subtitle}
          icon={g.icon}
          color={g.color}
          best={stats.bestByType[g.key] ?? 0}
          onPress={() => router.push(g.href as never)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
