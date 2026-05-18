import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../primitives';
import { colors, spacing } from '../../theme';
import { useAuthLocale } from './AuthLocaleContext';
import {
  validateAuthDisplayName,
  validateAuthEmail,
  validateAuthPassword,
} from './authFormValidate';
import {
  mapDisplayNameFieldError,
  mapEmailFieldError,
  mapPasswordFieldError,
} from './authLocaleFieldErrors';
import { AuthFormShell } from './AuthFormShell';
import { AuthForgotLink } from './AuthForgotLink';
import { AuthFormActions } from './AuthFormActions';
import { RegisterDisplayNameField } from './RegisterDisplayNameField';

export type AuthFormCredentials = {
  email: string;
  password: string;
  /** Register flow only — persisted as users.display_name (leaderboard, profile). */
  displayName?: string;
};

type Props = {
  mode: 'login' | 'register';
  loading: boolean;
  error: string;
  onSubmit: (credentials: AuthFormCredentials) => void;
};

export function AuthForm({ mode, loading, error, onSubmit }: Props) {
  const { strings } = useAuthLocale();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dnErr, setDnErr] = useState<string | undefined>();
  const [emailErr, setEmailErr] = useState<string | undefined>();
  const [pwErr, setPwErr] = useState<string | undefined>();
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const pwRef = useRef<TextInput>(null);

  const runSubmit = useCallback(() => {
    const dnTrim = displayName.trim();
    const dnV = mode === 'register' ? validateAuthDisplayName(displayName) : undefined;
    const eV = validateAuthEmail(email);
    const pV = validateAuthPassword(password, mode);
    setDnErr(mapDisplayNameFieldError(strings, dnV));
    setEmailErr(mapEmailFieldError(strings, eV));
    setPwErr(mapPasswordFieldError(strings, pV));
    if (dnV || eV || pV) return;
    onSubmit({
      email: email.trim(),
      password,
      displayName: mode === 'register' ? dnTrim : undefined,
    });
  }, [displayName, email, password, mode, strings, onSubmit]);

  const onBlurDn = () =>
    setDnErr(mapDisplayNameFieldError(strings, validateAuthDisplayName(displayName)));
  const onBlurEmail = () => setEmailErr(mapEmailFieldError(strings, validateAuthEmail(email)));
  const onBlurPw = () =>
    setPwErr(mapPasswordFieldError(strings, validateAuthPassword(password, mode)));

  return (
    <AuthFormShell onSubmit={runSubmit}>
      <View style={styles.form}>
        {mode === 'register' ? (
          <RegisterDisplayNameField
            label={strings.displayName}
            placeholder={strings.displayNamePlaceholder}
            value={displayName}
            onChangeText={(t) => {
              setDisplayName(t);
              if (dnErr) setDnErr(undefined);
            }}
            onBlur={onBlurDn}
            error={dnErr}
            inputRef={nameRef}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        ) : null}
        <Input
          ref={emailRef}
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

        <AuthFormActions mode={mode} loading={loading} error={error} onSubmitPress={runSubmit} />
      </View>
    </AuthFormShell>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: spacing.md },
  field: { marginBottom: spacing.md },
});
