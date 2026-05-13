import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../primitives';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { api } from '../../lib/api';
import type { Word } from '../../lib/types';
import { useRouter } from 'expo-router';

export default function KanjiScreen() {
  const [kanjis, setKanjis] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.words.list({ single_char: 1, limit: 500 });
        setKanjis(res.data);
      } catch (e) {
        console.error('Failed to load kanjis:', e);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const grouped = kanjis.reduce((acc, word) => {
    const lvl = word.hsk_level || 1;
    if (!acc[lvl]) acc[lvl] = [];
    acc[lvl].push(word);
    return acc;
  }, {} as Record<number, Word[]>);

  const levels = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  return (
    <Screen scroll scrollBottomInset={70}>
      <View style={styles.header}>
        <Text style={styles.title}>{mn.kanji.title}</Text>
        <Text style={styles.subtitle}>{mn.kanji.subtitle}</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
      ) : levels.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>{mn.kanji.empty}</Text>
        </View>
      ) : (
        levels.map((lvl) => (
          <View key={lvl} style={styles.section}>
            <Text style={styles.sectionTitle}>{mn.kanji.hskLevel.replace('{level}', String(lvl))}</Text>
            <View style={styles.grid}>
              {grouped[lvl].map((word) => (
                <Pressable
                  key={word.id}
                  style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                  onPress={() => {
                    // Navigate to writer
                    router.push({
                      pathname: '/kanji/[id]',
                      params: { id: word.id },
                    });
                  }}
                >
                  <Text style={styles.hanzi}>{word.hanzi}</Text>
                  <Text style={styles.pinyin}>{word.pinyin}</Text>
                  <Text style={styles.meaning} numberOfLines={1}>
                    {word.meaning_mn}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.heading.lg,
    color: colors.brand.primary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body.md,
    color: colors.text.secondary,
  },
  center: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  empty: {
    ...typography.body.md,
    color: colors.text.muted,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.heading.sm,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '31%', // roughly 3 per row
    backgroundColor: colors.bg.primary,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    aspectRatio: 1,
    justifyContent: 'center',
  },
  cardPressed: {
    opacity: 0.7,
    borderColor: colors.brand.primary,
  },
  hanzi: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  pinyin: {
    ...typography.body.xs,
    color: colors.text.secondary,
  },
  meaning: {
    ...typography.body.xs,
    color: colors.text.muted,
    marginTop: 2,
    textAlign: 'center',
  },
});
