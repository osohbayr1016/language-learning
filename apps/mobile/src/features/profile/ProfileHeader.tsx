import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileAvatarDisplay } from './ProfileAvatarDisplay';
import { colors, spacing, typography } from '../../theme';

type Props = {
  name: string;
  email: string;
  avatar?: string | null;
  onEditAvatar?: () => void;
};

export function ProfileHeader({ name, email, avatar, onEditAvatar }: Props) {
  const wrap = (
    <View style={styles.avatarWrap}>
      <ProfileAvatarDisplay avatarUrl={avatar} size={96} emptyStyle="person" />
      {onEditAvatar ? (
        <View style={styles.editBadge}>
          <Ionicons name="pencil" size={14} color={colors.text.inverse} />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.wrap}>
      {onEditAvatar ? (
        <Pressable
          accessibilityRole="button"
          onPress={onEditAvatar}
          style={({ pressed }) => [pressed && styles.avatarPressed]}
        >
          {wrap}
        </Pressable>
      ) : (
        wrap
      )}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: spacing.lg, marginTop: spacing.md },
  avatarWrap: { position: 'relative', marginBottom: spacing.md },
  avatarPressed: { opacity: 0.88 },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg.primary,
  },
  name: { ...typography.heading.lg, color: colors.text.primary },
  email: { ...typography.body.md, color: colors.text.secondary, marginTop: 2 },
});
