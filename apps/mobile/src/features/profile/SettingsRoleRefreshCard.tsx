import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';

export function SettingsRoleRefreshCard() {
  const { refreshAdminRole } = useAuth();
  const [busy, setBusy] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.section}>{mn.profile.adminCheckRole}</Text>
      <Text style={styles.hint}>{mn.profile.adminNeedRole}</Text>
      <Pressable
        style={styles.btn}
        disabled={busy}
        onPress={() => {
          setBusy(true);
          void refreshAdminRole().finally(() => setBusy(false));
        }}
      >
        {busy ? (
          <ActivityIndicator color={colors.text.primary} />
        ) : (
          <Text style={styles.btnTxt}>{mn.profile.adminCheckRole}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.bg.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  section: { ...typography.heading.md, color: colors.text.primary, marginBottom: spacing.xs },
  hint: { ...typography.body.sm, color: colors.text.secondary, marginBottom: spacing.md },
  btn: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  btnTxt: { ...typography.body.md, color: colors.text.primary, fontWeight: '600' },
});
