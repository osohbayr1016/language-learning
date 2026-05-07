import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Card } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = { dueCount: number };

export function DueTodayCard({ dueCount }: Props) {
  const router = useRouter();
  const has = dueCount > 0;

  return (
    <Card padding="lg" variant="elevated" style={styles.card}>
      <View style={styles.head}>
        <View style={[styles.iconBox, { backgroundColor: has ? `${colors.accent.purple}22` : `${colors.success}22` }]}>
          <Ionicons
            name={has ? 'time-outline' : 'checkmark-circle-outline'}
            size={26}
            color={has ? colors.accent.purple : colors.success}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{mn.home.dueToday}</Text>
          <Text style={styles.subtitle}>
            {has
              ? mn.home.dueWordsCount.replace('{n}', String(dueCount))
              : mn.home.noDue}
          </Text>
        </View>
      </View>
      <Button
        label={has ? mn.home.continueStudy : mn.study.flashcard}
        onPress={() => router.push('/study/flashcard')}
        style={{ marginTop: spacing.md }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.heading.md, color: colors.text.primary },
  subtitle: { ...typography.body.md, color: colors.text.secondary, marginTop: 2 },
});
