import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

type Props = { children: React.ReactNode };

const PHONE_WIDTH = 430;

/**
 * On web: centers the app inside a 430-px wide phone-style column with
 * subtle borders and shadow on a neutral page background. On native: pass-through.
 */
export function AppShell({ children }: Props) {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View style={styles.page as ViewStyle}>
      <View style={styles.column as ViewStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: '100%' as unknown as number,
    width: '100%',
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  column: {
    width: '100%',
    maxWidth: PHONE_WIDTH,
    flex: 1,
    minHeight: '100%' as unknown as number,
    backgroundColor: colors.bg.primary,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    overflow: 'hidden',
  },
});
