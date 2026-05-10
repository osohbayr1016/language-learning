import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/primitives/Button';
import { colors, spacing, typography } from '../src/theme';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Хуудас олдсонгүй</Text>
      <Text style={styles.body}>
        Энэ хаяг апп дээр байхгүй эсвэл хөгжүүлэлтийн үлдэгдэл холбоос байж болзошгүй.
      </Text>
      <Button
        label="Нүүр хуудас"
        onPress={() => router.replace('/(tabs)/home')}
        accessibilityLabel="Нүүр хуудас руу шилжих"
      />
      <View style={styles.gap} />
      <Button
        label="Нэвтрэх"
        variant="secondary"
        onPress={() => router.replace('/(auth)/login')}
        accessibilityLabel="Нэвтрэх хуудас"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.bg.primary,
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: { ...typography.heading.xl, color: colors.text.primary, textAlign: 'center' },
  body: { ...typography.body.lg, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.md },
  gap: { height: spacing.sm },
});
