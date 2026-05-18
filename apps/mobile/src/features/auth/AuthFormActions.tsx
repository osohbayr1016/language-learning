import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../primitives';
import { spacing, typography, colors } from '../../theme';
import { AuthGoogleButton } from './AuthGoogleButton';
import { useAuthLocale } from './AuthLocaleContext';

type Props = {
  mode: 'login' | 'register';
  loading: boolean;
  error: string;
  onSubmitPress: () => void;
};

export function AuthFormActions({ mode, loading, error, onSubmitPress }: Props) {
  const { strings } = useAuthLocale();
  return (
    <>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Button
        label={mode === 'login' ? strings.signIn : strings.signUp}
        loading={loading}
        onPress={onSubmitPress}
        accessibilityLabel={mode === 'login' ? strings.signIn : strings.signUp}
        style={styles.submit}
      />

      <AuthGoogleButton strings={strings} />
    </>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: spacing.md,
    borderRadius: 12,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: { ...typography.body.md, color: colors.error },
  submit: { marginTop: spacing.md },
});
