import React, { RefObject } from 'react';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../primitives';
import { colors, spacing } from '../../theme';

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: string;
  onBlur: () => void;
  inputRef: RefObject<TextInput | null>;
  onSubmitEditing: () => void;
};

export function RegisterDisplayNameField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  onBlur,
  inputRef,
  onSubmitEditing,
}: Props) {
  return (
    <Input
      ref={inputRef}
      label={label}
      placeholder={placeholder}
      autoCapitalize="words"
      autoComplete="name"
      textContentType="name"
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="next"
      error={error}
      leftIcon={<Ionicons name="person-outline" size={18} color={colors.text.secondary} />}
      containerStyle={{ marginBottom: spacing.md }}
    />
  );
}
