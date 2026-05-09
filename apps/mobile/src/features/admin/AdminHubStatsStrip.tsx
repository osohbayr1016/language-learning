import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { AdminStats } from '../../lib/api/admin';
import { mn } from '../../i18n/mn';
import { colors, radius, spacing, typography } from '../../theme';

type Props = { stats: AdminStats | null };

export function AdminHubStatsStrip({ stats }: Props) {
  const router = useRouter();
  const a = mn.admin;
  if (!stats) {
    return (
      <View style={[styles.strip, styles.loadingStrip]}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }
  return (
    <Pressable onPress={() => router.push('/admin/dashboard')} style={({ pressed }) => [styles.strip, pressed && styles.pressed]}>
      <View style={styles.cell}>
        <Text style={styles.val}>{stats.users}</Text>
        <Text style={styles.lbl}>{a.hubStatsUsers}</Text>
      </View>
      <View style={styles.div} />
      <View style={styles.cell}>
        <Text style={styles.val}>{stats.words}</Text>
        <Text style={styles.lbl}>{a.hskColWords}</Text>
      </View>
      <View style={styles.div} />
      <View style={styles.cell}>
        <Text style={styles.val}>{stats.lessons_total}</Text>
        <Text style={styles.lbl}>{a.hskColLessons}</Text>
      </View>
      <View style={styles.div} />
      <View style={styles.cell}>
        <Text style={styles.val}>{stats.chapters_total}</Text>
        <Text style={styles.lbl}>{a.hskColChapters}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  loadingStrip: { justifyContent: 'center' },
  pressed: { opacity: 0.92 },
  cell: { flex: 1, alignItems: 'center' },
  div: { width: 1, alignSelf: 'stretch', backgroundColor: colors.border },
  val: { ...typography.heading.sm, color: colors.text.primary, fontWeight: '800' },
  lbl: { ...typography.body.sm, color: colors.text.muted, marginTop: 2, fontSize: 11 },
});
