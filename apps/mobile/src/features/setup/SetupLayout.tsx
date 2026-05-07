import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SetupHeader } from './SetupHeader';
import { SetupFooter } from './SetupFooter';
import { colors, spacing } from '../../theme';

type Props = {
  current: number;
  total: number;
  onBack: () => void;
  ctaLabel: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  ctaLoading?: boolean;
  showCounter?: boolean;
  children: React.ReactNode;
};

export function SetupLayout({
  current, total, onBack, ctaLabel, onCta,
  ctaDisabled, ctaLoading, showCounter = true, children,
}: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.headerWrap}>
          <SetupHeader
            current={current}
            total={total}
            onBack={onBack}
            showCounter={showCounter}
          />
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        <SetupFooter
          label={ctaLabel}
          onPress={onCta}
          disabled={ctaDisabled}
          loading={ctaLoading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg.primary },
  kav: { flex: 1 },
  headerWrap: { paddingHorizontal: spacing.lg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
