import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export const pronounceButtonStyles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mnBtn: {
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bg.elevated,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  mnBtnText: { ...typography.body.sm, fontWeight: '800', color: colors.text.secondary },
  btn: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  holdGlow: {
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    bottom: -18,
    ...typography.body.sm,
    color: colors.warning,
    fontWeight: '600',
  },
  hint: {
    ...typography.body.sm,
    color: colors.text.muted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
