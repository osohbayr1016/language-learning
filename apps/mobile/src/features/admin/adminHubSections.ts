import type { AdminStats } from '../../lib/api/admin';
import { mn } from '../../i18n/mn';
import { colors } from '../../theme';
import { buildAdminStudyModeHubItems } from './adminStudyModeHubItems';
import type { HubSectionDef } from './adminHubTypes';

function hskWordCountsLine(w: Record<string, number> | undefined): string {
  if (!w) return '';
  return [1, 2, 3, 4, 5, 6].map((i) => String(w[String(i)] ?? 0)).join('/');
}

export function buildAdminHubSections(stats: AdminStats | null): HubSectionDef[] {
  const a = mn.admin;
  const dashHint = stats
    ? `${stats.users} ${a.hubStatsUsers} · ${stats.words} үг · ${stats.lessons_total} хичээл · ${a.hubStatsLink}`
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
          icon: 'analytics-outline',
          tint: colors.brand.secondary,
        },
      ],
    },
    {
      title: a.hubSectionCourses,
      items: [
        {
          key: 'hsk1',
          label: a.hsk1LessonsList,
          hint: a.hsk1LessonsListHint,
          href: '/admin/hsk1-lessons',
          icon: 'list-circle-outline',
          tint: colors.brand.primary,
        },
        {
          key: 'path',
          label: a.learningPath,
          hint: pathHint,
          href: '/admin/learning-path',
          icon: 'git-branch-outline',
          tint: colors.hsk[2],
        },
      ],
    },
    {
      title: a.hubSectionWords,
      items: [
        {
          key: 'voc',
          label: a.vocabulary,
          hint: vocHint,
          href: '/admin/vocabulary',
          icon: 'library-outline',
          tint: colors.hsk[3],
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
      title: a.hubSectionStudyModes,
      items: buildAdminStudyModeHubItems(),
    },
    {
      title: a.hubSectionMedia,
      items: [
        {
          key: 'cart',
          label: a.cartoons,
          hint: a.cartHint,
          href: '/admin/cartoons',
          icon: 'film-outline',
          tint: colors.accent.amber,
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

export type { HubRowDef, HubSectionDef } from './adminHubTypes';
