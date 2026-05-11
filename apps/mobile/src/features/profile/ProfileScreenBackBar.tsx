import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { mn } from '../../i18n/mn';
import { colors, radius, spacing, typography } from '../../theme';

type Props = { title: string; fallback: Href; style?: ViewStyle };

export function ProfileScreenBackBar({ title, fallback, style }: Props) {
  const router = useRouter();
  return (
    <View style={[styles.topBar, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={mn.common.back}
        onPress={() => router.replace(fallback)}
        style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: { opacity: 0.72 },
  spacer: { width: 40, height: 40 },
  title: { ...typography.heading.lg, color: colors.text.primary, flex: 1, textAlign: 'center' },
});
