import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../../lib/api';
import type { AdminStats } from '../../lib/api/admin';
import { useAuth } from '../../context/AuthContext';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';
import { AdminDashboardHskBreakdown } from './AdminDashboardHskBreakdown';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.lbl}>{label}</Text>
      <Text style={styles.val}>{value}</Text>
    </View>
  );
}

export function AdminDashboardScreen() {
  const { token } = useAuth();
  const [s, setS] = useState<AdminStats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setErr(null);
    try {
      const r = await api.admin.stats(token);
      setS(r.data ?? null);
    } catch (e) {
      setErr((e as Error).message);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (err) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>{err}</Text>
      </View>
    );
  }

  if (!s) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

  const a = mn.admin;
  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Stat label="Хэрэглэгчид" value={String(s.users)} />
      <Stat label="Үг" value={String(s.words)} />
      <Stat label="Бүлэг" value={`${s.chapters_published}/${s.chapters_total}`} />
      <Stat label="Хичээл" value={`${s.lessons_published}/${s.lessons_total}`} />
      <Stat label={a.tileLessonWordLinks} value={String(s.lesson_word_links)} />
      <Stat label={a.tileDistinctHanzi} value={String(s.distinct_hanzi)} />
      <Stat label="Дуусгалт" value={String(s.lesson_completions)} />
      <Stat label="7 хоног" value={String(s.lesson_completions_last_7_days)} />
      <Stat label="Тоглоом" value={String(s.game_sessions)} />
      <Stat label="Кино" value={String(s.cartoons)} />
      <AdminDashboardHskBreakdown stats={s} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.bg.primary,
    paddingBottom: spacing.xxl,
  },
  card: {
    width: '47%',
    padding: spacing.md,
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lbl: { ...typography.body.sm, color: colors.text.secondary },
  val: { ...typography.heading.md, color: colors.text.primary, marginTop: 4 },
  center: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.bg.primary },
  err: { ...typography.body.md, color: colors.error },
});
