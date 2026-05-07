import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Sheet, Button } from '../../primitives';
import { colors, spacing, typography } from '../../theme';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onLeave: () => void;
};

export function LeaveSheet({ visible, onCancel, onLeave }: Props) {
  return (
    <Sheet visible={visible} onClose={onCancel}>
      <View style={styles.body}>
        <Text style={styles.title}>Хичээлээс гарах уу?</Text>
        <Text style={styles.sub}>
          Одоогийн явц хадгалагдахгүй. Та үнэхээр гарах уу?
        </Text>
        <View style={styles.actions}>
          <Button label="Үлдэх" variant="secondary" onPress={onCancel} />
          <View style={{ height: spacing.sm }} />
          <Button label="Тийм, гарах" variant="danger" onPress={onLeave} />
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: spacing.sm },
  title: { ...typography.heading.lg, color: colors.text.primary, textAlign: 'center' },
  sub: {
    ...typography.body.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  actions: { marginTop: spacing.lg },
});
