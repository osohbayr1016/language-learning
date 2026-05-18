import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { AuthHeader } from './AuthHeader';
import { AuthForm } from './AuthForm';
import { AuthFooter } from './AuthFooter';
import { useAuthLocale } from './AuthLocaleContext';

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const { strings } = useAuthLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (payload: { email: string; password: string; displayName?: string }) => {
    setLoading(true);
    setError('');
    try {
      const display_name = payload.displayName?.trim() ?? '';
      const res = await api.auth.register({
        email: payload.email,
        password: payload.password,
        display_name,
      });
      await signIn(res.data);
    } catch (err) {
      setError((err as Error).message || strings.requestFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <AuthHeader title={strings.registerTitle} subtitle={strings.registerSubtitle} />
        <AuthForm mode="register" loading={loading} error={error} onSubmit={handleSubmit} />
        <AuthFooter mode="register" />
      </KeyboardAvoidingView>
    </Screen>
  );
}
