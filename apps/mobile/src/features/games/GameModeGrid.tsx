import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { GameType } from '../../lib/api/games';
import { spacing } from '../../theme';
import { GAMES } from './registry';
import { GameModeCard } from './GameModeCard';
import type { GamesStats } from './useGamesStats';

type Props = {
  stats: GamesStats;
  lessonId: number | null;
  /** Тоглоомын таб — дэлгэц дээр нээх. Задгайгүй бол stack руу push хийнэ. */
  onPickGame?: (key: GameType) => void;
};

export function GameModeGrid({ stats, lessonId, onPickGame }: Props) {
  const router = useRouter();
  const q = lessonId != null ? `?lessonId=${lessonId}` : '';
  const disabled = lessonId == null && Boolean(onPickGame);

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
          disabled={disabled}
          onPress={() => {
            if (onPickGame) {
              onPickGame(g.key);
              return;
            }
            router.push(`${g.href}${q}` as never);
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
