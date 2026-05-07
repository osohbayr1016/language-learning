import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  score: number;
  xp: number;
  durationSeconds: number;
  onPlayAgain: () => void;
};

export function GameOverScreen({ score, xp, durationSeconds, onPlayAgain }: Props) {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.center}>
        <Ionicons name="trophy" size={88} color={colors.warning} />
        <Text style={styles.headline}>{mn.games.gameOver}</Text>
        <View style={styles.row}>
          <Stat value={score} label={mn.games.score} color={colors.accent.purple} />
          <Stat value={`+${xp}`} label="XP" color={colors.success} />
          <Stat value={`${durationSeconds}s`} label="Хугацаа" color={colors.accent.teal} />
        </View>
        <Button label={mn.games.playAgain} onPress={onPlayAgain} style={{ marginTop: spacing.lg }} />
        <Button label={mn.common.back} variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.sm }} />
      </View>
    </Screen>
  );
}

function Stat({ value, label, color }: { value: number | string; label: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingHorizontal: spacing.lg },
  headline: { ...typography.heading.xl, color: colors.text.primary },
  row: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  stat: { alignItems: 'center' },
  value: { ...typography.heading.xl },
  label: { ...typography.body.md, color: colors.text.secondary, marginTop: 2 },
});
