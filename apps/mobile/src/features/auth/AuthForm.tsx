import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { useAuthLocale } from './AuthLocaleContext';
import { validateAuthEmail, validateAuthPassword } from './authFormValidate';
import { AuthFormShell } from './AuthFormShell';
import { AuthForgotLink } from './AuthForgotLink';
import { AuthGoogleButton } from './AuthGoogleButton';

type Props = {
  mode: 'login' | 'register';
  loading: boolean;
  error: string;
  onSubmit: (email: string, password: string) => void;
};

export function AuthForm({ mode, loading, error, onSubmit }: Props) {
  const { strings } = useAuthLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailErr, setEmailErr] = useState<string | undefined>();
  const [pwErr, setPwErr] = useState<string | undefined>();
  const pwRef = useRef<TextInput>(null);

  const mapEmailErr = useCallback(
    (k: string | undefined) => {
      if (k === 'required') return strings.requiredEmail;
      if (k === 'invalid') return strings.emailInvalid;
      return undefined;
    },
    [strings],
  );

  const mapPwErr = useCallback(
    (k: string | undefined) => {
      if (k === 'required') return strings.requiredPassword;
      if (k === 'weak') return strings.weakPassword;
      return undefined;
    },
    [strings],
  );

  const runSubmit = useCallback(() => {
    const eV = validateAuthEmail(email);
    const pV = validateAuthPassword(password, mode);
    setEmailErr(mapEmailErr(eV));
    setPwErr(mapPwErr(pV));
    if (eV || pV) return;
    onSubmit(email.trim(), password);
  }, [email, password, mode, mapEmailErr, mapPwErr, onSubmit]);

  const onBlurEmail = () => setEmailErr(mapEmailErr(validateAuthEmail(email)));
  const onBlurPw = () => setPwErr(mapPwErr(validateAuthPassword(password, mode)));

  return (
    <AuthFormShell onSubmit={runSubmit}>
      <View style={styles.form}>
        <Input
          label={strings.email}
          placeholder="name@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          value={email}
          onChangeText={(t) => { setEmail(t); if (emailErr) setEmailErr(undefined); }}
          onBlur={onBlurEmail}
          onSubmitEditing={() => pwRef.current?.focus()}
          returnKeyType="next"
          error={emailErr}
          leftIcon={<Ionicons name="mail-outline" size={18} color={colors.text.secondary} />}
          containerStyle={styles.field}
        />
        <Input
          ref={pwRef}
          label={strings.password}
          placeholder={strings.passwordPlaceholder}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(t) => { setPassword(t); if (pwErr) setPwErr(undefined); }}
          onBlur={onBlurPw}
          returnKeyType="done"
          onSubmitEditing={runSubmit}
          autoComplete={mode === 'login' ? 'password' : 'password-new'}
          textContentType={mode === 'login' ? 'password' : 'newPassword'}
          error={pwErr}
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.text.secondary} />}
          rightIcon={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showPassword ? strings.hidePassword : strings.showPassword}
              onPress={() => setShowPassword((s) => !s)}
              hitSlop={8}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={colors.text.secondary}
              />
            </Pressable>
          }
          containerStyle={styles.field}
        />

        <AuthForgotLink strings={strings} />

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Button
          label={mode === 'login' ? strings.signIn : strings.signUp}
          loading={loading}
          onPress={runSubmit}
          accessibilityLabel={mode === 'login' ? strings.signIn : strings.signUp}
          style={styles.submit}
        />

        <AuthGoogleButton strings={strings} />
      </View>
    </AuthFormShell>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: spacing.md },
  field: { marginBottom: spacing.md },
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
