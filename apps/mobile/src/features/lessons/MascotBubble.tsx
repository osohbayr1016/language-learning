import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';

type Props = { message: string };

export function MascotBubble({ message }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.mascot}>
        <Ionicons name="happy" size={28} color="#FFFFFF" />
      </View>
      <View style={styles.bubbleWrap}>
        <View style={styles.tail} />
        <View style={styles.bubble}>
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md },
  mascot: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleWrap: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderRightWidth: 9,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.border,
    marginTop: 12,
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.bg.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  text: { ...typography.body.lg, color: colors.text.primary },
});
