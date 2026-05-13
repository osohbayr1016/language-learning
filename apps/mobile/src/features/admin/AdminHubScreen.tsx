import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { mn } from '../../i18n/mn';
import { api } from '../../lib/api';
import type { AdminStats } from '../../lib/api/admin';
import { colors, spacing, typography } from '../../theme';
import { ADMIN_HUB_SECTIONS } from './adminHubData';
import { AdminHubBentoCard } from './AdminHubBentoCard';
import { AdminHubStatsStrip } from './AdminHubStatsStrip';

export function AdminHubScreen() {
  const { token } = useAuth();
  const [hubStats, setHubStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void api.admin
      .stats(token)
      .then((r) => {
        if (!cancelled) setHubStats(r.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setHubStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Нэвтэрсний дараа дахин оролдоно уу.</Text>
      </View>
    );
  }

  const a = mn.admin;

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.inner}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{a.hubTitle}</Text>
          <Text style={styles.heroIntro}>{a.hubIntro}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.overline}>{a.hubSectionStats}</Text>
          <AdminHubStatsStrip stats={hubStats} />
        </View>

        {ADMIN_HUB_SECTIONS.map((section) => (
          <View key={section.titleKey} style={styles.block}>
            <Text style={styles.overline}>{a[section.titleKey]}</Text>
            <View style={styles.linkStack}>
              {section.items.map((item) => (
                <AdminHubBentoCard key={String(item.href)} {...item} />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: colors.bg.secondary,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  inner: {
    width: '100%',
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  hero: { gap: 6 },
  heroTitle: {
    ...typography.heading.xl,
    color: colors.text.primary,
    fontWeight: '800',
  },
  heroIntro: { ...typography.body.md, color: colors.text.secondary },
  block: { gap: spacing.sm },
  overline: {
    ...typography.body.sm,
    fontWeight: '700',
    color: colors.text.muted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  linkStack: { gap: spacing.sm },
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.bg.secondary,
  },
  muted: { ...typography.body.md, color: colors.text.muted, textAlign: 'center' },
});
