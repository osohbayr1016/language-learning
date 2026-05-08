import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../primitives';
import { mn } from '../../i18n/mn';
import { api } from '../../lib/api';
import type { AdminStats } from '../../lib/api/admin';
import { colors, spacing, typography } from '../../theme';
import { AdminHubRow } from './AdminHubRow';
import { buildAdminHubSections } from './adminHubSections';

export function AdminHubScreen() {
  const { token } = useAuth();
  const router = useRouter();
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

  const sections = useMemo(() => buildAdminHubSections(hubStats), [hubStats]);

  if (!token) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Нэвтэрсний дараа дахин оролдоно уу.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{mn.admin.hubTitle}</Text>
      <Text style={styles.intro}>{mn.admin.hubIntro}</Text>

      {sections.map((sec) => (
        <View key={sec.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{sec.title}</Text>
          <Card padding={0} style={styles.card}>
            {sec.items.map((item, idx) => (
              <AdminHubRow
                key={item.key}
                item={item}
                showDivider={idx < sec.items.length - 1}
                onPress={() => router.push(item.href)}
              />
            ))}
          </Card>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.bg.secondary,
    flexGrow: 1,
    gap: spacing.lg,
  },
  title: { ...typography.heading.xl, color: colors.text.primary },
  intro: {
    ...typography.body.md,
    color: colors.text.secondary,
    lineHeight: 22,
    marginTop: -spacing.xs,
  },
  section: { gap: spacing.sm },
  sectionTitle: {
    ...typography.body.sm,
    fontWeight: '700',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  card: { overflow: 'hidden' },
  center: { flex: 1, justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.bg.secondary },
  muted: { ...typography.body.md, color: colors.text.muted, textAlign: 'center' },
});
