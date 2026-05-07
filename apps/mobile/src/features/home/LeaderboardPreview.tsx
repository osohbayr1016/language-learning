import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LeaderboardRow } from '../../components/gamification';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import type { LeaderboardRow as Row } from '../../lib/api/games';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export function LeaderboardPreview() {
  const { token } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!token) return;
    void (async () => {
      try {
        const r = await api.games.leaderboard(token);
        setRows(r.data.slice(0, 3));
      } catch {
        /* ignore */
      }
    })();
  }, [token]);

  if (rows.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{mn.home.leaderboard}</Text>
      {rows.map((r, i) => (
        <LeaderboardRow key={`${r.display_name}-${i}`} row={r} rank={i + 1} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xl },
  title: { ...typography.heading.md, color: colors.text.primary, marginBottom: spacing.md },
});
