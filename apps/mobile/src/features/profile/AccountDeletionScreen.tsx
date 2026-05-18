import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { api } from "../../lib/api";
import { ConfirmDialog, Screen, Button } from "../../primitives";
import { ProfileScreenBackBar } from "./ProfileScreenBackBar";
import { colors, spacing, typography } from "../../theme";
import { useAuth } from "../../context/AuthContext";
import { mn } from "../../i18n/mn";

export function AccountDeletionScreen() {
  const router = useRouter();
  const { token, signOut } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDelete = useCallback(async () => {
    if (!token) {
      setError("Нэвтэрсэн байх шаардлагатай.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.user.deleteAccount(token);
      await signOut();
      router.replace("/(auth)/login");
    } catch (e) {
      const msg = e instanceof Error ? e.message : mn.common.error;
      setError(msg);
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  }, [token, signOut, router]);

  return (
    <Screen scroll>
      <ProfileScreenBackBar title={mn.profile.deleteAccount} fallback="/profile/settings" style={{ marginBottom: spacing.lg }} />
      <Text style={styles.body}>{mn.profile.deleteAccountSubtitle}</Text>
      <Text style={[styles.body, styles.list]}>
        • Profile мэдээлэл, learning progress, хадгалсан үг, тестийн үр дүн зэрэг сервер дээрх өгөгдөл устгагдана.
      </Text>
      <Text style={[styles.body, styles.list]}>
        • Нээлттэй хуудаснаас хүсэлт гаргах боломжтой (Тохиргоо → Нууцлалын бодлого эсвэл /delete-account хуудас).
      </Text>

      {error ? <Text style={styles.err}>{error}</Text> : null}

      <Button
        label={busy ? mn.common.loading : mn.profile.deleteAccount}
        variant="danger"
        onPress={() => setConfirmOpen(true)}
        disabled={busy || !token}
      />

      {busy ? (
        <View style={styles.spinner}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
      ) : null}

      <ConfirmDialog
        visible={confirmOpen}
        title="Бүртгэлээ устгах уу?"
        message="Энэ үйлдлийг буцаах боломжгүй. Та итгэлтэй байна уу?"
        cancelLabel={mn.common.cancel}
        confirmLabel="Устгах"
        confirmVariant="danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => void runDelete()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { ...typography.body.md, color: colors.text.secondary, lineHeight: 22 },
  list: { marginTop: spacing.sm },
  err: { ...typography.body.md, color: colors.warning, marginVertical: spacing.md },
  spinner: { marginTop: spacing.md },
});
