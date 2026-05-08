import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';
import { AdminHanziCoreWordInputs } from './AdminHanziCoreWordInputs';
import { AdminHanziExampleFieldsBlock } from './AdminHanziExampleFieldsBlock';
import { AdminSingleHanziTailFields } from './AdminSingleHanziTailFields';
import { examplePatchFromTriplet } from './exampleFieldsForAdminWord';

function alertUser(title: string, message?: string) {
  if (Platform.OS === 'web') {
    const g = globalThis as { alert?: (msg: string) => void };
    g.alert?.(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message ?? '');
}

type Props = { hsk: string; onHskChange: (s: string) => void };

export function AdminSingleHanziCreateCard({ hsk, onHskChange }: Props) {
  const { token } = useAuth();
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [meaningMn, setMeaningMn] = useState('');
  const [textbookUnit, setTextbookUnit] = useState('');
  const [rejectDup, setRejectDup] = useState(false);
  const [exampleZh, setExampleZh] = useState('');
  const [examplePy, setExamplePy] = useState('');
  const [exampleMn, setExampleMn] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!token) return alertUser('Алдаа', 'Нэвтэрсэн байх шаардлагатай.');
    const hz = hanzi.trim();
    if (!hz) return alertUser('Алдаа', 'Нэг ханз оруулна уу');
    setLoading(true);
    try {
      const ex = examplePatchFromTriplet({
        exampleZh,
        examplePinyin: examplePy,
        exampleMn,
      });
      const res = await api.admin.createWord(token, {
        hanzi: hz,
        pinyin: pinyin.trim(),
        meaning_mn: meaningMn.trim(),
        hsk_level: Number(hsk) || 1,
        textbook_unit: textbookUnit.trim() || undefined,
        reject_duplicate: rejectDup,
        ...ex,
      });
      alertUser('Боллоо', `Үгийн id: ${res.data.id}`);
      setHanzi('');
      setPinyin('');
      setMeaningMn('');
      setExampleZh('');
      setExamplePy('');
      setExampleMn('');
    } catch (e) {
      alertUser('Алдаа', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.block}>
      <AdminHanziCoreWordInputs
        hanzi={hanzi}
        pinyin={pinyin}
        meaningMn={meaningMn}
        onHanzi={setHanzi}
        onPinyin={setPinyin}
        onMeaningMn={setMeaningMn}
      />
      <AdminHanziExampleFieldsBlock
        exampleZh={exampleZh}
        examplePinyin={examplePy}
        exampleMn={exampleMn}
        onExampleZh={setExampleZh}
        onExamplePinyin={setExamplePy}
        onExampleMn={setExampleMn}
        disabled={!token}
      />
      <AdminSingleHanziTailFields
        hsk={hsk}
        onHskChange={onHskChange}
        textbookUnit={textbookUnit}
        onTextbookUnit={setTextbookUnit}
        rejectDup={rejectDup}
        onRejectDup={setRejectDup}
      />
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
        <Text style={styles.btnTxt}>{loading ? 'Илгээж байна…' : 'Нэмэх'}</Text>
      </Pressable>
      <Text style={styles.hint}>
        Олон ханзтай үед тэмдэг бүрийн зурах шинжийг нэгтгэнэ. Өгөгдөл байхгүй бол уг тэмдэгтээр түр зогсоно.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { flex: 1 },
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
