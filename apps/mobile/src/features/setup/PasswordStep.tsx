import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  password: string;
  confirm: string;
  onChangePassword: (v: string) => void;
  onChangeConfirm: (v: string) => void;
  error?: string | null;
};

export function PasswordStep({ password, confirm, onChangePassword, onChangeConfirm, error }: Props) {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{mn.setup.passwordTitle}</Text>
      <Input
        label={mn.setup.passwordLabel}
        value={password}
        onChangeText={onChangePassword}
        secureTextEntry={!show1}
        autoComplete="new-password"
        autoCapitalize="none"
        autoFocus
        leftIcon={<Ionicons name="lock-closed-outline" size={22} color={colors.text.muted} />}
        rightIcon={
          <Pressable onPress={() => setShow1((s) => !s)} hitSlop={8}>
            <Ionicons
              name={show1 ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.text.muted}
            />
          </Pressable>
        }
        containerStyle={{ marginTop: spacing.lg }}
      />
      <Input
        label={mn.setup.passwordConfirm}
        value={confirm}
        onChangeText={onChangeConfirm}
        secureTextEntry={!show2}
        autoComplete="new-password"
        autoCapitalize="none"
        leftIcon={<Ionicons name="lock-closed-outline" size={22} color={colors.text.muted} />}
        rightIcon={
          <Pressable onPress={() => setShow2((s) => !s)} hitSlop={8}>
            <Ionicons
              name={show2 ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.text.muted}
            />
          </Pressable>
        }
        error={error ?? undefined}
        containerStyle={{ marginTop: spacing.md }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing.md },
  title: { ...typography.heading.xl, color: colors.text.primary, lineHeight: 36 },
});
