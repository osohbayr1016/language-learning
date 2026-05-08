import React from 'react';
import { Platform, Pressable, Share, StyleSheet, Text } from 'react-native';
import { mn } from '../../i18n/mn';
import { spacing, typography, colors } from '../../theme';

type Props = {
  streak: number;
  totalXp: number;
  dailyGoal: number;
};

function buildShareMessage(p: Props) {
  return mn.profile.shareProgressMsg
    .replace('{appName}', mn.appName)
    .replace('{goal}', String(p.dailyGoal))
    .replace('{streak}', String(p.streak))
    .replace('{xp}', String(p.totalXp));
}

export function ProfileShareStreakCard({ streak, totalXp, dailyGoal }: Props) {
  const onShare = async () => {
    const msg = buildShareMessage({ streak, totalXp, dailyGoal });
    if (Platform.OS === 'web') {
      try {
        const nav = globalThis.navigator as { clipboard?: { writeText: (s: string) => Promise<void> } };
        await nav.clipboard?.writeText(msg);
      } catch {
        /* ignore */
      }
      const g = globalThis as { alert?: (m: string) => void };
      g.alert?.(mn.profile.shareCopied);
      return;
    }
    try {
      await Share.share({ message: msg });
    } catch {
      /* ignore */
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => void onShare()}
      style={({ pressed }) => [styles.btn, pressed && Platform.OS !== 'web' ? { opacity: 0.9 } : null]}
    >
      <Text style={styles.tx}>{mn.profile.shareProgress}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.sm,
    borderRadius: 10,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tx: { ...typography.body.md, fontWeight: '700', color: colors.text.primary },
});
