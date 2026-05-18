import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { GameType } from '../../lib/api/games';
import { GameModeGrid } from './GameModeGrid';
import { GAMES } from './registry';
import type { GamesStats } from './useGamesStats';

type Props = {
  lessonId: number | null;
  stats: GamesStats;
  onStartPlay: (key: GameType) => void;
};

export function GamesHubModesSection({ lessonId, stats, onStartPlay }: Props) {
  return (
    <View style={styles.modesBlock}>
      <Text style={styles.modesHeading}>{mn.games.lessonModesHeading}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={mn.games.shufflePlay}
        disabled={lessonId == null}
        style={({ pressed }) => [
          styles.shuffleBtn,
          lessonId == null && styles.shuffleDisabled,
          pressed && lessonId != null && styles.shufflePressed,
        ]}
        onPress={() => {
          const g = GAMES[Math.floor(Math.random() * GAMES.length)];
          onStartPlay(g.key);
        }}
      >
        <Text style={[styles.shuffleBtnTxt, lessonId == null && styles.shuffleTxtDisabled]}>
          {mn.games.shufflePlay}
        </Text>
      </Pressable>
      <GameModeGrid stats={stats} lessonId={lessonId} onPickGame={onStartPlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  modesBlock: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.sm,
  },
  modesHeading: {
    ...typography.heading.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  shuffleBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brand.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  shuffleDisabled: { backgroundColor: colors.border, opacity: 0.85 },
  shufflePressed: { opacity: 0.9 },
  shuffleBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  shuffleTxtDisabled: { color: colors.text.muted },
});
