import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from '../../../primitives';
import { spacing } from '../../../theme';
import { mn } from '../../../i18n/mn';

type Props = {
  disabled: boolean;
  onSubmit: (value: string) => void;
};

export function AnswerInput({ disabled, onSubmit }: Props) {
  const [value, setValue] = useState('');

  const handle = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue('');
  };

  return (
    <View style={styles.wrap}>
      <Input
        placeholder={mn.study.typeAnswer}
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
        onSubmitEditing={handle}
        returnKeyType="send"
        containerStyle={styles.inputWrap}
      />
      <Button
        label={mn.study.next}
        onPress={handle}
        disabled={disabled || !value.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  inputWrap: { width: '100%' },
});
