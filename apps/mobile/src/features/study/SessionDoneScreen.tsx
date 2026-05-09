import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { safeBack } from '../../lib/navigation/safeBack';
import { Button, Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  xp: number;
  total: number;
  correct: number;
};

export function SessionDoneScreen({ xp, total, correct }: Props) {
  const router = useRouter();
  return (
    <Screen>
      <View style={styles.center}>
        <Ionicons name="trophy" size={88} color={colors.warning} />
        <Text style={styles.headline}>{mn.common.done}!</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.value}>+{xp}</Text>
            <Text style={styles.label}>XP</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.value}>{correct}/{total}</Text>
            <Text style={styles.label}>Зөв</Text>
          </View>
        </View>
        <Button
          label={mn.common.back}
          onPress={() => safeBack(router, '/(tabs)/study')}
          fullWidth
          style={{ marginTop: spacing.lg }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingHorizontal: spacing.lg },
  headline: { ...typography.heading.xl, color: colors.text.primary },
  stats: { flexDirection: 'row', gap: spacing.xl },
  stat: { alignItems: 'center' },
  value: { ...typography.heading.xl, color: colors.accent.purple },
  label: { ...typography.body.md, color: colors.text.secondary, marginTop: 4 },
});
