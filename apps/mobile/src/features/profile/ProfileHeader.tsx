import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  name: string;
  email: string;
  avatar?: string | null;
};

export function ProfileHeader({ name, email, avatar }: Props) {
  const initial = (name || '?').slice(0, 1).toUpperCase();

  return (
    <View style={styles.wrap}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.initial}>{initial}</Text>
        </View>
      )}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: spacing.lg, marginTop: spacing.md },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.bg.elevated,
    marginBottom: spacing.md,
  },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initial: { fontSize: 36, color: colors.text.primary, fontWeight: '300' },
  name: { ...typography.heading.lg, color: colors.text.primary },
  email: { ...typography.body.md, color: colors.text.secondary, marginTop: 2 },
});
