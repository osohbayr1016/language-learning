import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../../src/lib/api';
import { useAuth } from '../../src/context/AuthContext';
import { colors, spacing, typography } from '../../src/theme';

function alertUser(title: string, message?: string) {
  if (Platform.OS === 'web') {
    const g = globalThis as { alert?: (msg: string) => void };
    g.alert?.(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

export default function AdminWordsScreen() {
  const { token } = useAuth();
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaningMn, setMeaningMn] = useState('');
  const [hsk, setHsk] = useState('1');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!token) {
      alertUser('Алдаа', 'Нэвтэрсэн байх шаардлагатай.');
      return;
    }
    const hz = hanzi.trim();
    if (!hz) {
      alertUser('Алдаа', 'Нэг ханз оруулна уу');
      return;
    }
    setLoading(true);
    try {
      const res = await api.admin.createWord(token, {
        hanzi: hz,
        pinyin: pinyin.trim(),
        meaning_mn: meaningMn.trim(),
        hsk_level: Number(hsk) || 1,
      });
      alertUser('Боллоо', `Үгийн id: ${res.data.id}`);
      setHanzi('');
      setPinyin('');
      setMeaningMn('');
    } catch (e) {
      alertUser('Алдаа', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.pad} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Ханз (нэг тэмдэгт)</Text>
        <TextInput value={hanzi} onChangeText={setHanzi} style={styles.input} />
        <Text style={styles.label}>Pinyin</Text>
        <TextInput value={pinyin} onChangeText={setPinyin} style={styles.input} autoCapitalize="none" />
        <Text style={styles.label}>Монгол утга</Text>
        <TextInput
          value={meaningMn}
          onChangeText={setMeaningMn}
          style={styles.input}
          multiline
        />
        <Text style={styles.label}>HSK (1–6)</Text>
        <TextInput value={hsk} onChangeText={setHsk} style={styles.input} keyboardType="number-pad" />
        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={() => void submit()}
          style={({ pressed }) => [
            styles.btn,
            loading && styles.btnDis,
            Platform.OS === 'web' && styles.btnWeb,
            pressed && Platform.OS !== 'web' && styles.btnPressed,
          ]}
        >
          <View pointerEvents="none" accessible={false}>
            <Text style={styles.btnTxt}>{loading ? 'Илгээж байна…' : 'Нэмэх'}</Text>
          </View>
        </Pressable>
        <Text style={styles.hint}>
          Сервер HanziWriter CDN-ээс stroke шалгана. Өгөгдөлгүй бол хадгалахгүй.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg.primary },
  pad: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  label: { ...typography.body.sm, color: colors.text.secondary, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.md,
    color: colors.text.primary,
    backgroundColor: colors.bg.card,
  },
  btn: {
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.brand.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnWeb: { cursor: 'pointer' as const },
  btnPressed: { opacity: 0.92 },
  btnDis: { opacity: 0.6 },
  btnTxt: { ...typography.body.md, color: '#fff', fontWeight: '700' },
  hint: { ...typography.body.sm, color: colors.text.muted, marginTop: spacing.md },
});
