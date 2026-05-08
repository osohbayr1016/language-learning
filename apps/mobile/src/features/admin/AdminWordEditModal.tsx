import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../../lib/api';
import type { Word } from '../../lib/types';
import { colors, spacing, typography } from '../../theme';

type Props = {
  visible: boolean;
  word: Word | null;
  token: string;
  onClose: () => void;
  onSaved: () => void;
};

function toast(title: string, msg?: string) {
  if (Platform.OS === 'web') {
    const g = globalThis as { alert?: (s: string) => void };
    g.alert?.(msg ? `${title}\n${msg}` : title);
    return;
  }
  Alert.alert(title, msg);
}

export function AdminWordEditModal({ visible, word, token, onClose, onSaved }: Props) {
  const [hanzi, setHanzi] = useState('');
  const [py, setPy] = useState('');
  const [mnStr, setMnStr] = useState('');
  const [hsk, setHsk] = useState('1');

  useEffect(() => {
    if (!word) return;
    setHanzi(word.hanzi);
    setPy(word.pinyin);
    setMnStr(word.meaning_mn);
    setHsk(String(word.hsk_level));
  }, [word]);

  const save = async () => {
    if (!word) return;
    try {
      await api.words.update(token, word.id, {
        hanzi: hanzi.trim(),
        pinyin: py.trim(),
        meaning_mn: mnStr.trim(),
        hsk_level: Math.min(6, Math.max(1, Number(hsk) || 1)) as Word['hsk_level'],
      });
      toast('Хадгалагдлаа');
      onSaved();
      onClose();
    } catch (e) {
      toast('Алдаа', (e as Error).message);
    }
  };

  const del = async () => {
    if (!word) return;
    try {
      await api.words.remove(token, word.id);
      toast('Устгагдлаа');
      onSaved();
      onClose();
    } catch (e) {
      toast('Алдаа', (e as Error).message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.back}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Засах #{word?.id ?? ''}</Text>
          <Text style={styles.lbl}>Ханз</Text>
          <TextInput style={styles.inp} value={hanzi} onChangeText={setHanzi} />
          <Text style={styles.lbl}>Pinyin</Text>
          <TextInput style={styles.inp} value={py} onChangeText={setPy} autoCapitalize="none" />
          <Text style={styles.lbl}>Утга</Text>
          <TextInput style={styles.inp} value={mnStr} onChangeText={setMnStr} />
          <Text style={styles.lbl}>HSK</Text>
          <TextInput style={styles.inp} value={hsk} onChangeText={setHsk} keyboardType="number-pad" />
          <Pressable style={styles.primary} onPress={() => void save()}>
            <Text style={styles.primaryTxt}>Хадгалах</Text>
          </Pressable>
          <Pressable style={styles.danger} onPress={() => void del()}>
            <Text style={styles.dangerTxt}>Устгах</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={onClose}>
            <Text style={styles.secondaryTxt}>Хаах</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  back: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.bg.primary,
    padding: spacing.lg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  title: { ...typography.heading.md, marginBottom: spacing.sm },
  lbl: { ...typography.body.sm, color: colors.text.secondary },
  inp: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.text.primary,
    backgroundColor: colors.bg.card,
  },
  primary: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.brand.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryTxt: { color: '#fff', fontWeight: '700' },
  danger: {
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: 'center',
  },
  dangerTxt: { color: colors.error, fontWeight: '700' },
  secondary: { padding: spacing.md, alignItems: 'center' },
  secondaryTxt: { color: colors.text.secondary, fontWeight: '600' },
});
