import type { Ionicons } from '@expo/vector-icons';

export const PRESET_AVATAR_PREFIX = 'preset:' as const;

export type PresetAvatar = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  iconColor: string;
};

/** Duolingo-style illustrated “mascots” via bold colors + icons (bundled, no network). */
export const PRESET_AVATARS: PresetAvatar[] = [
  { id: 'owl', icon: 'rocket-outline', bg: '#7C3AED', iconColor: '#FEF3C7' },
  { id: 'bear', icon: 'paw-outline', bg: '#EA580C', iconColor: '#FFFBEB' },
  { id: 'frog', icon: 'leaf-outline', bg: '#16A34A', iconColor: '#DCFCE7' },
  { id: 'fox', icon: 'flash-outline', bg: '#F59E0B', iconColor: '#451A03' },
  { id: 'dolphin', icon: 'water-outline', bg: '#0284C7', iconColor: '#E0F2FE' },
  { id: 'panda', icon: 'nutrition-outline', bg: '#1F2937', iconColor: '#F9FAFB' },
  { id: 'bee', icon: 'sunny-outline', bg: '#CA8A04', iconColor: '#422006' },
  { id: 'cat', icon: 'heart-outline', bg: '#DB2777', iconColor: '#FCE7F3' },
  { id: 'bird', icon: 'musical-note-outline', bg: '#0D9488', iconColor: '#CCFBF1' },
  { id: 'robot', icon: 'hardware-chip-outline', bg: '#6366F1', iconColor: '#EEF2FF' },
  { id: 'star', icon: 'star-outline', bg: '#8B5CF6', iconColor: '#EDE9FE' },
  { id: 'moon', icon: 'moon-outline', bg: '#312E81', iconColor: '#C7D2FE' },
];

export function presetAvatarStorageValue(id: string): string {
  return `${PRESET_AVATAR_PREFIX}${id}`;
}

export function findPresetAvatar(avatarUrl: string | null | undefined): PresetAvatar | null {
  if (!avatarUrl?.startsWith(PRESET_AVATAR_PREFIX)) return null;
  const id = avatarUrl.slice(PRESET_AVATAR_PREFIX.length);
  return PRESET_AVATARS.find((p) => p.id === id) ?? null;
}

export function isRemoteAvatarUrl(url: string | null | undefined): boolean {
  return !!url && /^https?:\/\//i.test(url);
}
