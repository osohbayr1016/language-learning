import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, layout as layoutTokens } from '../theme';

type Props = { children: React.ReactNode };

/**
 * On web: centers the app in a phone-width column (same for main app and `/admin`).
 * On native: pass-through.
 */
export function AppShell({ children }: Props) {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View style={styles.page as ViewStyle}>
      <View
        style={[
          styles.column as ViewStyle,
          { maxWidth: layoutTokens.phoneWebMaxWidth },
          styles.columnCentered as ViewStyle,
        ]}
      >
        {children}
      </View>
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
    flexGrow: 1,
    flexShrink: 0,
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
  columnCentered: {
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
