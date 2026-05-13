import { colors } from '../../theme';
import type { HubShortcut } from './AdminHubBentoCard';

export type AdminHubSectionDef = {
  titleKey: 'hubSectionCourses' | 'hubSectionWords' | 'hubSectionMedia' | 'hubSectionPeople';
  items: HubShortcut[];
};

export const ADMIN_HUB_SECTIONS: AdminHubSectionDef[] = [
  {
    titleKey: 'hubSectionCourses',
    items: [
      {
        title: 'Суралцах зам',
        icon: 'git-branch',
        color: colors.hsk[2],
        href: '/admin/learning-path',
      },
      {
        title: 'HSK 1 Хичээл',
        icon: 'list-circle',
        color: colors.brand.primary,
        href: '/admin/hsk1-lessons',
      },
    ],
  },
  {
    titleKey: 'hubSectionWords',
    items: [
      { title: 'Үгийн сан', icon: 'library', color: colors.hsk[3], href: '/admin/vocabulary' },
      {
        title: 'Шинэ үг',
        icon: 'add-circle',
        color: colors.accent.teal,
        href: '/admin/words/new',
      },
      {
        title: 'Олноор оруулах',
        icon: 'copy',
        color: colors.accent.purple,
        href: '/admin/words',
      },
    ],
  },
  {
    titleKey: 'hubSectionMedia',
    items: [
      {
        title: 'Хүүхэлдэй',
        icon: 'film',
        color: colors.accent.amber,
        href: '/admin/cartoons',
      },
      {
        title: 'Шалгалт (PDF)',
        icon: 'document-text',
        color: colors.brand.secondary,
        href: '/admin/exam-import',
      },
    ],
  },
  {
    titleKey: 'hubSectionPeople',
    items: [
      {
        title: 'Хэрэглэгчид',
        icon: 'people',
        color: colors.text.secondary,
        href: '/admin/users',
      },
    ],
  },
];
