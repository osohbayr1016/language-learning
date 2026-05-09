import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { safeBack } from '../../lib/navigation/safeBack';
import { ProgressBar } from '../../primitives';
import { colors, spacing, typography } from '../../theme';

type Props = {
  title: string;
  index: number;
  total: number;
  trailing?: React.ReactNode;
};

export function StudyHeader({ title, index, total, trailing }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable onPress={() => safeBack(router, '/(tabs)/study')} hitSlop={12}>
          <Ionicons name="close" size={26} color={colors.text.secondary} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.right}>
          {trailing}
          <Text style={styles.counter}>
            {index + 1}/{total}
          </Text>
        </View>
      </View>
      <ProgressBar value={(index / Math.max(1, total)) * 100} height={6} style={{ marginTop: spacing.sm }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  title: { ...typography.heading.md, color: colors.text.primary, flex: 1, minWidth: 0 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  counter: { ...typography.body.md, color: colors.text.secondary, fontWeight: '600' },
});
