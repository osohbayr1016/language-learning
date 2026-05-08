import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import type { GrammarRow } from '../../lib/api/grammar';
import { mn } from '../../i18n/mn';
import { colors, radius, spacing, typography } from '../../theme';

export function GrammarListScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [rows, setRows] = useState<GrammarRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!token) {
        setRows([]);
        setLoading(false);
        return;
      }
      try {
        const r = await api.grammar.list(token);
        if (!cancelled) setRows(r.data ?? []);
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Screen edges={['top']} scroll scrollBottomInset={88}>
      <View style={styles.navRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={mn.common.back}
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.header} numberOfLines={1}>
          {mn.study.grammarTitle}
        </Text>
        <View style={styles.backBtn} />
      </View>
      {!token ? (
        <Text style={styles.hint}>{mn.auth.loginTitle}</Text>
      ) : loading ? (
        <ActivityIndicator style={styles.center} color={colors.brand.primary} />
      ) : rows.length === 0 ? (
        <Text style={styles.hint}>{mn.study.courseEmpty}</Text>
      ) : (
        <View style={styles.list}>
          {rows.map((g) => (
            <Pressable
              key={g.id}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => router.push(`/study/grammar/${g.id}` as never)}
            >
              <View>
                <Text style={styles.title} numberOfLines={2}>
                  {g.title_mn}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {g.exercise_count} дасгал
                  {typeof g.best_accuracy === 'number'
                    ? ` · ${Math.round((g.best_accuracy ?? 0) * 100)}%`
                    : ''}
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: { opacity: 0.7 },
  header: {
    flex: 1,
    ...typography.heading.lg,
    color: colors.text.primary,
    textAlign: 'center',
    marginHorizontal: spacing.xs,
  },
  hint: { ...typography.body.md, color: colors.text.secondary },
  center: { marginVertical: spacing.xl },
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowPressed: { opacity: 0.92 },
  title: { ...typography.heading.sm, color: colors.text.primary },
  meta: { ...typography.body.sm, color: colors.text.secondary, marginTop: 4 },
  chev: { fontSize: 22, color: colors.text.muted },
});
