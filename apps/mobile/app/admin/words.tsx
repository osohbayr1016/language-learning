import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { AdminBulkHanziPaste } from '../../src/features/admin/AdminBulkHanziPaste';
import { AdminSingleHanziCreateCard } from '../../src/features/admin/AdminSingleHanziCreateCard';
import { useAuth } from '../../src/context/AuthContext';
import { colors, spacing } from '../../src/theme';

export default function AdminWordsScreen() {
  const { token } = useAuth();
  const [hsk, setHsk] = useState('1');

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.pad} keyboardShouldPersistTaps="handled">
        <AdminSingleHanziCreateCard hsk={hsk} onHskChange={setHsk} />
        <AdminBulkHanziPaste token={token} hskLevel={hsk} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg.primary },
  pad: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
});
