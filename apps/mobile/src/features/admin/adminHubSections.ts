import type { ComponentProps } from 'react';
import type { Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { AdminStats } from '../../lib/api/admin';
import { mn } from '../../i18n/mn';
import { colors } from '../../theme';

type IonName = ComponentProps<typeof Ionicons>['name'];

export type HubRowDef = {
  key: string;
  label: string;
  hint: string;
  href: Href;
  icon: IonName;
  tint: string;
};

export type HubSectionDef = { title: string; items: HubRowDef[] };

function hskWordCountsLine(w: Record<string, number> | undefined): string {
  if (!w) return '';
  return [1, 2, 3, 4, 5, 6].map((i) => String(w[String(i)] ?? 0)).join('/');
}

export function buildAdminHubSections(stats: AdminStats | null): HubSectionDef[] {
  const a = mn.admin;
  const dashHint = stats
    ? `${stats.users} хэрэглэгч · ${stats.words} үг · ${stats.lessons_total} хичээл`
    : a.dashHint;
  const pathHint = stats
    ? `${stats.chapters_total} бүлэг · ${stats.lessons_total} хичээл · ${stats.lesson_word_links} слот`
    : a.pathHint;
  const vocHint = stats
    ? `${stats.words} үг · HSK ${hskWordCountsLine(stats.words_by_hsk)}`
    : a.vocHint;
  return [
    {
      title: a.hubSectionStats,
      items: [
        {
          key: 'dash',
          label: a.dashboard,
          hint: dashHint,
          href: '/admin/dashboard',
          icon: 'speedometer-outline',
          tint: colors.brand.secondary,
        },
      ],
    },
    {
      title: a.hubSectionContent,
      items: [
        {
          key: 'path',
          label: a.learningPath,
          hint: pathHint,
          href: '/admin/learning-path',
          icon: 'git-branch-outline',
          tint: colors.brand.primary,
        },
        {
          key: 'voc',
          label: a.vocabulary,
          hint: vocHint,
          href: '/admin/vocabulary',
          icon: 'library-outline',
          tint: colors.hsk[3],
        },
        {
          key: 'cart',
          label: a.cartoons,
          hint: a.cartHint,
          href: '/admin/cartoons',
          icon: 'film-outline',
          tint: colors.accent.amber,
        },
        {
          key: 'hanzi',
          label: a.newHanziWord,
          hint: a.hanziHint,
          href: '/admin/words',
          icon: 'create-outline',
          tint: colors.accent.teal,
        },
      ],
    },
    {
      title: a.hubSectionPeople,
      items: [
        {
          key: 'usr',
          label: a.users,
          hint: a.usersHint,
          href: '/admin/users',
          icon: 'people-outline',
          tint: colors.text.secondary,
        },
      ],
    },
  ];
}
