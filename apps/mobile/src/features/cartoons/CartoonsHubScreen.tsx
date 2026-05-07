import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../primitives';
import { api } from '../../lib/api';
import type { Cartoon } from '../../lib/api/cartoons';
import { CartoonCard } from '../../components/cards/CartoonCard';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export default function CartoonsHubScreen() {
  const [items, setItems] = useState<Cartoon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const r = await api.cartoons.list();
        setItems(r.data ?? []);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Screen padded scroll={false}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{mn.cartoons.hub}</Text>
        <Text style={styles.subheading}>{mn.cartoons.tapWord}</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.accent.purple} style={{ marginTop: spacing.xl }} />
      ) : error || items.length === 0 ? (
        <Text style={styles.muted}>Хүүхэлдэйн кино нэмэгдээгүй байна</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          renderItem={({ item }) => <CartoonCard cartoon={item} />}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { marginBottom: spacing.lg, marginTop: spacing.sm },
  heading: { ...typography.heading.xl, color: colors.text.primary },
  subheading: { ...typography.body.md, color: colors.text.secondary, marginTop: 4 },
  muted: { ...typography.body.lg, color: colors.text.muted, textAlign: 'center', marginTop: spacing.xl },
});
