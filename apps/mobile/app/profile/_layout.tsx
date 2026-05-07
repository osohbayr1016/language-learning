import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg.primary },
        headerTintColor: colors.text.primary,
        headerTitleStyle: { color: colors.text.primary, fontSize: 18, fontWeight: '600' },
        contentStyle: { backgroundColor: colors.bg.primary },
      }}
    />
  );
}
