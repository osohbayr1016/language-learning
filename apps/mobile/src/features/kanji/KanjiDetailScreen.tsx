import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Button, Pill } from '../../primitives';
import { PronounceButton } from '../../components/audio/PronounceButton';
import { ToneColoredText } from '../../components/hanzi';
import { api } from '../../lib/api';
import type { Word } from '../../lib/types';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { safeBack } from '../../lib/navigation/safeBack';
import { mn } from '../../i18n/mn';

export function KanjiDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const res = await api.words.get(Number(id));
        setWord(res.data);
      } catch (e) {
        console.error('Failed to load kanji details:', e);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
      </Screen>
    );
  }

  if (!word) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorText}>Ханз олдсонгүй (Kanji not found)</Text>
          <Button label={mn.common.back} onPress={() => safeBack(router, '/(tabs)/kanji')} style={{ marginTop: spacing.lg }} />
        </View>
      </Screen>
    );
  }

  const hskColor = colors.hsk[word.hsk_level] || colors.accent.purple;

  return (
    <Screen scroll scrollBottomInset={100}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => safeBack(router, '/(tabs)/kanji')}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={28} color={colors.text.primary} />
        </Pressable>
        <Pill label={`HSK ${word.hsk_level}`} color={hskColor} />
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.hanziHuge}>{word.hanzi}</Text>
        <Text style={styles.pinyin}>{word.pinyin}</Text>
        <View style={styles.audioWrap}>
          <PronounceButton wordId={word.id} meaningMn={word.meaning_mn} size="lg" />
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Утга (Meaning)</Text>
        <Text style={styles.meaningText}>{word.meaning_mn}</Text>
      </View>

      <View style={styles.actionContainer}>
        <Text style={styles.sectionTitle}>Зурж сурах</Text>
        <Text style={styles.hintText}>Ханзны зурлага дэс дарааллаар зурж сурцгаая.</Text>
        <Button
          label="Зурж дадлага хийх (Practice Writing)"
          onPress={() => {
            router.push({
              pathname: '/study/writer',
              params: { forcedId: word.id }
            } as never);
          }}
          style={styles.practiceBtn}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.body.lg,
    color: colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  backBtn: {
    padding: spacing.xs,
  },
  heroCard: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  hanziHuge: {
    fontSize: 110,
    fontWeight: '800',
    color: colors.text.primary,
    lineHeight: 130,
    marginBottom: spacing.xs,
  },
  pinyin: {
    ...typography.heading.lg,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  audioWrap: {
    marginTop: spacing.md,
  },
  detailsCard: {
    backgroundColor: colors.bg.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.heading.sm,
    color: colors.brand.primary,
    marginBottom: spacing.xs,
  },
  meaningText: {
    ...typography.heading.md,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  actionContainer: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.brand.primaryShadow,
  },
  hintText: {
    ...typography.body.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  practiceBtn: {
    width: '100%',
  },
});
