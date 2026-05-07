import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { api } from '../../lib/api';
import type { Profile } from '../../lib/api/user';
import { mn } from '../../i18n/mn';
import { ProfileHeader } from './ProfileHeader';
import { StatsGrid } from './StatsGrid';
import { ProfileMenu } from './ProfileMenu';

export default function ProfileScreen() {
  const { token, signOut } = useAuth();
  const { stats, streak } = useGamification();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!token) return;
    void (async () => {
      try {
        const p = await api.user.profile(token);
        setProfile(p.data);
      } catch {
        /* ignore */
      }
    })();
  }, [token]);

  const confirmSignOut = () => {
    if (Platform.OS === 'web') {
      const g = globalThis as { confirm?: (message?: string) => boolean };
      if (g.confirm?.(`${mn.profile.signOut}\n\n${mn.profile.signOutConfirm}`)) {
        void signOut();
      }
      return;
    }
    Alert.alert(mn.profile.signOut, mn.profile.signOutConfirm, [
      { text: mn.common.cancel, style: 'cancel' },
      { text: mn.profile.signOut, style: 'destructive', onPress: () => void signOut() },
    ]);
  };

  return (
    <Screen scroll>
      <ProfileHeader
        name={profile?.display_name ?? 'Сурагч'}
        email={profile?.email ?? ''}
        avatar={profile?.avatar_url}
      />
      <StatsGrid stats={stats} streak={streak} />
      <ProfileMenu
        items={[
          {
            key: 'insights',
            label: mn.insights.menu,
            icon: 'stats-chart-outline',
            onPress: () => router.push('/profile/insights'),
          },
          {
            key: 'settings',
            label: mn.profile.settings,
            icon: 'settings-outline',
            onPress: () => router.push('/profile/settings'),
          },
          {
            key: 'signOut',
            label: mn.profile.signOut,
            icon: 'log-out-outline',
            onPress: confirmSignOut,
            danger: true,
          },
        ]}
      />
    </Screen>
  );
}
