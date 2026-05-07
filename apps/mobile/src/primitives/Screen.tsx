import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** Extra bottom inset for scroll content (e.g. tab bar height on tab screens). */
  scrollBottomInset?: number;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function Screen({
  children,
  scroll = false,
  padded = true,
  scrollBottomInset = 0,
  style,
  edges = ['top'],
}: Props) {
  const insets = useSafeAreaInsets();
  const inner: ViewStyle = {
    flex: 1,
    paddingHorizontal: padded ? spacing.lg : 0,
    backgroundColor: colors.bg.primary,
    ...style,
  };

  const scrollContent: ViewStyle = {
    paddingHorizontal: padded ? spacing.lg : 0,
    backgroundColor: colors.bg.primary,
    paddingBottom: spacing.xxl + insets.bottom + scrollBottomInset,
    ...style,
  };

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg.primary} />
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={inner}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function useBottomInset(): number {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.primary },
});
