import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
            <Text style={styles.email} numberOfLines={1}>
              {item.email}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {item.display_name} · админ:{item.is_admin ? 'тийм' : 'үгүй'}
            </Text>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  email: { ...typography.heading.sm, color: colors.text.primary },
  meta: { ...typography.body.sm, color: colors.text.secondary, marginTop: 2 },
});
