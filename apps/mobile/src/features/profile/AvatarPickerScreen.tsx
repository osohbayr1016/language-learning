import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import { Button, Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import type { Profile } from '../../lib/api/user';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';
import { ProfileScreenBackBar } from './ProfileScreenBackBar';
import { ProfileAvatarDisplay } from './ProfileAvatarDisplay';
import {
  PRESET_AVATARS,
  findPresetAvatar,
  isRemoteAvatarUrl,
  presetAvatarStorageValue,
} from './profilePresetAvatars';

function draftIsDefault(url: string) {
  return !url.trim() || (!isRemoteAvatarUrl(url) && !findPresetAvatar(url));
}

export function AvatarPickerScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    void api.user.profile(token).then((p) => setProfile(p.data)).catch(() => {});
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    if (profile) setDraft(profile.avatar_url ?? '');
  }, [profile]);

  const saved = profile?.avatar_url ?? '';
  const isDirty = profile != null && draft !== saved;

  const save = async () => {
    if (!token || !isDirty) return;
    setSaving(true);
    try {
      await api.user.updateProfile(token, { avatar_url: draft });
      router.replace('/(tabs)/profile' as Href);
    } catch {
      Alert.alert(mn.common.error, mn.profile.avatarSaveError);
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = draft.trim() ? draft : null;
  const defaultSelected = draftIsDefault(draft);

  return (
    <Screen scroll>
      <ProfileScreenBackBar title={mn.profile.chooseAvatar} fallback="/(tabs)/profile" />
      <Text style={styles.hint}>{mn.profile.avatarHint}</Text>

      <View style={styles.previewWrap}>
        <Text style={styles.previewLabel}>{mn.profile.avatarPreview}</Text>
        <ProfileAvatarDisplay avatarUrl={previewUrl} size={120} emptyStyle="person" />
      </View>

      <View style={styles.grid}>
        <Pressable
          style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
          onPress={() => setDraft('')}
        >
          <ProfileAvatarDisplay
            avatarUrl={null}
            size={72}
            emptyStyle="person"
            selected={defaultSelected}
          />
          <Text style={styles.caption}>{mn.profile.avatarDefault}</Text>
        </Pressable>
        {PRESET_AVATARS.map((p) => {
          const stored = presetAvatarStorageValue(p.id);
          return (
            <Pressable
              key={p.id}
              style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
              onPress={() => setDraft(stored)}
            >
              <ProfileAvatarDisplay avatarUrl={stored} size={72} selected={draft === stored} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          label={mn.common.save}
          onPress={() => void save()}
          loading={saving}
          disabled={!isDirty}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...typography.body.md,
    color: colors.text.secondary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  previewWrap: { alignItems: 'center', marginBottom: spacing.lg },
  previewLabel: {
    ...typography.heading.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'flex-start',
  },
  cell: { width: '28%', minWidth: 96, alignItems: 'center', marginBottom: spacing.sm },
  cellPressed: { opacity: 0.85 },
  caption: { ...typography.body.sm, color: colors.text.secondary, marginTop: spacing.xs },
  footer: { paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.xl },
});
