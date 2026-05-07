import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ProgressBar } from '../../primitives';
import { colors, spacing, typography } from '../../theme';

type Props = {
  title: string;
  index: number;
  total: number;
};

export function StudyHeader({ title, index, total }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.text.secondary} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.counter}>{index + 1}/{total}</Text>
      </View>
      <ProgressBar value={(index / Math.max(1, total)) * 100} height={6} style={{ marginTop: spacing.sm }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...typography.heading.md, color: colors.text.primary },
  counter: { ...typography.body.md, color: colors.text.secondary, fontWeight: '600' },
});
