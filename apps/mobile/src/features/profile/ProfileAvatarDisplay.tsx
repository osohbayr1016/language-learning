import React from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { findPresetAvatar, isRemoteAvatarUrl } from './profilePresetAvatars';

type Props = {
  avatarUrl: string | null | undefined;
  size: number;
  /** Used when `emptyStyle` is `initial` (e.g. leaderboard). */
  fallbackLabel?: string;
  /** How to render when there is no preset or remote image. */
  emptyStyle?: 'person' | 'initial';
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
};

export function ProfileAvatarDisplay({
  avatarUrl,
  size,
  fallbackLabel,
  emptyStyle = 'person',
  style,
  selected,
}: Props) {
  const preset = findPresetAvatar(avatarUrl);
  const remote = isRemoteAvatarUrl(avatarUrl) ? avatarUrl : null;
  const initial = (fallbackLabel || '?').slice(0, 1).toUpperCase();
  const ring = selected ? { borderWidth: 3, borderColor: colors.brand.primary } : null;
  const dim = { width: size, height: size, borderRadius: size / 2 };

  if (preset) {
    const iconSize = Math.round(size * 0.52);
    return (
      <View style={[styles.base, dim, { backgroundColor: preset.bg }, ring, style]}>
        <Ionicons name={preset.icon} size={iconSize} color={preset.iconColor} />
      </View>
    );
  }

  if (remote) {
    return (
      <View style={[styles.base, dim, ring, style]}>
        <Image
          source={{ uri: remote }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      </View>
    );
  }

  if (emptyStyle === 'initial') {
    return (
      <View style={[styles.base, styles.placeholder, dim, ring, style]}>
        <Text style={[styles.initialText, { fontSize: Math.round(size * 0.42) }]}>{initial}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.base, styles.placeholder, dim, ring, style]}>
      <Ionicons name="person-circle-outline" size={Math.round(size * 0.58)} color={colors.text.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  placeholder: { backgroundColor: colors.bg.elevated },
  initialText: { fontWeight: '600', color: colors.text.primary },
});
