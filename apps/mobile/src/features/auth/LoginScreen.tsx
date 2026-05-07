import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { mn } from '../../i18n/mn';
import { AuthHeader } from './AuthHeader';
import { AuthForm } from './AuthForm';
import { AuthFooter } from './AuthFooter';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (email: string, password: string) => {
    if (!email || !password) {
      setError(mn.auth.requiredFields);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.auth.login({ email, password });
      await signIn(res.data);
    } catch (err) {
      setError((err as Error).message || mn.common.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <AuthHeader title={mn.auth.loginTitle} subtitle="Тавтай морил" />
        <AuthForm mode="login" loading={loading} error={error} onSubmit={handleSubmit} />
        <AuthFooter mode="login" />
      </KeyboardAvoidingView>
    </Screen>
  );
}
