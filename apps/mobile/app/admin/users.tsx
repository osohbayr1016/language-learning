import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../src/lib/api';
import { useAuth } from '../../src/context/AuthContext';
import type { AdminUserRow } from '../../src/lib/api/admin';
import { colors, spacing, typography } from '../../src/theme';

export default function AdminUsersScreen() {
  const { token } = useAuth();
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.admin.users(token, { limit: 100 });
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      Alert.alert('Алдаа', (e as Error).message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const extendOne = async (id: number) => {
    if (!token) return;
    setBusyId(id);
    try {
      await api.admin.extendPremium(token, id, 1);
      await load();
      Alert.alert('Амжилттай', 'Premium 1 сараар сунгагдлаа');
    } catch (e) {
      Alert.alert('Алдаа', (e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={rows}
        keyExtractor={(i) => String(i.id)}
        refreshing={loading}
        onRefresh={() => void load()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.email} numberOfLines={1}>
                {item.email}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {item.display_name} · admin:{item.is_admin ? 'тийм' : 'үгүй'}
              </Text>
              <Text style={styles.meta}>Premium: {item.premium_until ?? '—'}</Text>
            </View>
            <Pressable
              style={styles.smallBtn}
              disabled={busyId === item.id}
              onPress={() => void extendOne(item.id)}
            >
              <Text style={styles.smallBtnTxt}>+1 сар</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.primary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  rowMain: { flex: 1, minWidth: 0 },
  email: { ...typography.heading.sm, color: colors.text.primary },
  meta: { ...typography.body.sm, color: colors.text.secondary, marginTop: 2 },
  smallBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.accent.teal,
    borderRadius: 8,
  },
  smallBtnTxt: { ...typography.body.sm, color: '#fff', fontWeight: '700' },
});
