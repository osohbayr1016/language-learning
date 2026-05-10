import type { Href } from 'expo-router';
import { mn } from '../../i18n/mn';
import { colors } from '../../theme';
import type { HubRowDef } from './adminHubTypes';

/** Сурах таб дээрх горим бүрт — админд зориулсан заавар + гол нэвтрэх цэг. */
export function buildAdminStudyModeHubItems(): HubRowDef[] {
  const a = mn.admin;
  const s = mn.study;
  const vocab = '/admin/vocabulary' as Href;
  const path = '/admin/learning-path' as Href;
  const words = '/admin/words' as Href;

  return [
    {
      key: 'sm-flash',
      label: s.flashcard,
      hint: a.smFlashcard,
      href: vocab,
      icon: 'albums-outline',
      tint: colors.accent.purple,
    },
    {
      key: 'sm-learn',
      label: s.learn,
      hint: a.smLearn,
      href: vocab,
      icon: 'school-outline',
      tint: colors.accent.blue,
    },
    {
      key: 'sm-weak',
      label: s.weakReviewTitle,
      hint: a.smWeak,
      href: vocab,
      icon: 'fitness-outline',
      tint: colors.error,
    },
    {
      key: 'sm-write',
      label: s.write,
      hint: a.smWrite,
      href: vocab,
      icon: 'create-outline',
      tint: colors.accent.teal,
    },
    {
      key: 'sm-writer',
      label: s.writer,
      hint: a.smWriter,
      href: words,
      icon: 'brush-outline',
      tint: colors.accent.pink,
    },
    {
      key: 'sm-speak',
      label: s.speak,
      hint: a.smSpeak,
      href: vocab,
      icon: 'mic-outline',
      tint: colors.success,
    },
    {
      key: 'sm-grammar',
      label: s.grammarTitle,
      hint: a.smGrammar,
      href: path,
      icon: 'library-outline',
      tint: colors.warning,
    },
    {
      key: 'sm-mock',
      label: s.mockExamTitle,
      hint: a.smMock,
      href: path,
      icon: 'clipboard-outline',
      tint: colors.accent.amber,
    },
    {
      key: 'sm-exam-pdf',
      label: a.smExamPdfImport,
      hint: a.smExamPdfImportHint,
      href: '/admin/exam-import' as Href,
      icon: 'document-text-outline',
      tint: colors.brand.secondary,
    },
  ];
}
