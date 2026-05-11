import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../primitives';
import { ProfileAvatarDisplay } from '../../features/profile/ProfileAvatarDisplay';
import { colors, spacing, typography } from '../../theme';
import type { LeaderboardRow as Row } from '../../lib/api/games';

type Props = { row: Row; rank: number };

export function LeaderboardRow({ row, rank }: Props) {
  const isPodium = rank <= 3;
  const podiumColor = rank === 1 ? colors.warning : rank === 2 ? colors.text.secondary : '#CD7F32';

  return (
    <Card padding="md" style={styles.row}>
      <View style={styles.rankBox}>
        {isPodium ? (
          <Ionicons name="trophy" size={20} color={podiumColor} />
        ) : (
          <Text style={styles.rank}>#{rank}</Text>
        )}
      </View>
      <ProfileAvatarDisplay
        avatarUrl={row.avatar_url}
        size={40}
        fallbackLabel={row.display_name}
        emptyStyle="initial"
        style={styles.avatar}
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{row.display_name}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{row.total_xp} XP</Text>
          {row.current_streak ? (
            <Text style={styles.streak}>· {row.current_streak} өдөр</Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  rankBox: { width: 36, alignItems: 'center' },
  rank: { ...typography.heading.sm, color: colors.text.secondary },
  avatar: { marginHorizontal: spacing.sm },
  body: { flex: 1 },
  name: { ...typography.heading.sm, color: colors.text.primary },
  metaRow: { flexDirection: 'row', gap: 4, marginTop: 2 },
  meta: { ...typography.body.sm, color: colors.accent.purple, fontWeight: '600' },
  streak: { ...typography.body.sm, color: colors.text.secondary },
});
