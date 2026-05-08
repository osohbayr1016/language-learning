import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const learningPathStyles = StyleSheet.create({
  listPad: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  ch: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg.card,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chTitle: { ...typography.heading.sm, color: colors.text.primary },
  sectionHdr: {
    ...typography.body.sm,
    fontWeight: '800',
    color: colors.text.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    letterSpacing: 0.4,
  },
  ls: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lsTitle: { ...typography.body.md, color: colors.text.primary, fontWeight: '600' },
  meta: { ...typography.body.sm, color: colors.text.secondary },
  inp: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.text.primary,
    backgroundColor: colors.bg.primary,
  },
  small: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.accent.teal,
    borderRadius: 8,
  },
  smallTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  muted: { ...typography.body.md, color: colors.text.muted },
});
