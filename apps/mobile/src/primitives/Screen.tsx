import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function Screen({ children, scroll = false, padded = true, style, edges = ['top'] }: Props) {
  const inner: ViewStyle = {
    flex: 1,
    paddingHorizontal: padded ? spacing.lg : 0,
    backgroundColor: colors.bg.primary,
    ...style,
  };

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg.primary} />
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[inner, { paddingBottom: spacing.xxl }]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={inner}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function useBottomInset() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.primary },
});
