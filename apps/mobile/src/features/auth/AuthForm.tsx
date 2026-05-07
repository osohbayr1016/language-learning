import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  mode: 'login' | 'register';
  loading: boolean;
  error: string;
  onSubmit: (email: string, password: string) => void;
};

export function AuthForm({ mode, loading, error, onSubmit }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.form}>
      <Input
        label={mn.auth.email}
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        leftIcon={<Ionicons name="mail-outline" size={18} color={colors.text.secondary} />}
        containerStyle={styles.field}
      />
      <Input
        label={mn.auth.password}
        placeholder="********"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.text.secondary} />}
        rightIcon={
          <Pressable onPress={() => setShowPassword((s) => !s)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.text.secondary}
            />
          </Pressable>
        }
        containerStyle={styles.field}
      />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Button
        label={mode === 'login' ? mn.auth.signIn : mn.auth.signUp}
        loading={loading}
        onPress={() => onSubmit(email, password)}
        style={styles.submit}
      />
    </View>
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
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: { ...typography.body.md, color: colors.error },
  submit: { marginTop: spacing.lg },
});
