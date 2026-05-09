import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { safeBack } from '../../lib/navigation/safeBack';
import { Button, Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  message?: string;
};

export function StudyEmptyState({ message }: Props) {
  const router = useRouter();
  return (
    <Screen>
      <View style={styles.center}>
        <Ionicons name="checkmark-circle" size={88} color={colors.success} />
        <Text style={styles.title}>{message ?? mn.study.noWords}</Text>
        <Button label={mn.common.back} onPress={() => safeBack(router, '/(tabs)/study')} fullWidth={false} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingHorizontal: spacing.lg },
  title: { ...typography.heading.lg, color: colors.text.primary, textAlign: 'center' },
});
