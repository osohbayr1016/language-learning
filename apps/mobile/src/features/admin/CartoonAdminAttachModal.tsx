import React, { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { api } from '../../lib/api';
import type { Word } from '../../lib/types';
import { cartoonsAdmin } from '../../lib/api/cartoonsAdmin';
import { adminNotify } from './adminNotify';
import { cartoonAttachStyles as styles } from './CartoonAdminAttachModalStyles';

type Row = { word_id: string; start_s: string; end_s: string };

type Props = {
  token: string;
  cartoonId: number | null;
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export function CartoonAdminAttachModal({ token, cartoonId, visible, onClose, onSaved }: Props) {
  const [rows, setRows] = useState<Row[]>([{ word_id: '', start_s: '0', end_s: '5' }]);
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Word[]>([]);
  const [pickIdx, setPickIdx] = useState<number | null>(null);

  const search = useCallback(async () => {
    try {
      const r = await api.words.list({ q: q.trim() || undefined, limit: 40, offset: 0 });
      setHits(Array.isArray(r.data) ? r.data : []);
    } catch {
      setHits([]);
    }
  }, [q]);

  const submit = async () => {
    if (!cartoonId) return;
    const items = rows
      .map((r) => ({
        word_id: Number(r.word_id),
        start_s: Number(r.start_s) || 0,
        end_s: Number(r.end_s) || 0,
      }))
      .filter((r) => r.word_id > 0);
    if (items.length === 0) {
      adminNotify('Алдаа', 'Дор хаяж нэг үгийн ID оруулна уу');
      return;
    }
    try {
      await cartoonsAdmin.attachWords(token, cartoonId, items);
      adminNotify('Боллоо', `${items.length} үг`);
      onSaved();
      onClose();
      setRows([{ word_id: '', start_s: '0', end_s: '5' }]);
    } catch (e) {
      adminNotify('Алдаа', (e as Error).message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.back}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Үг цаг холбох #{cartoonId ?? '—'}</Text>
          <ScrollView keyboardShouldPersistTaps="handled">
            {rows.map((row, i) => (
              <View key={`${i}-row`} style={styles.row}>
                <TextInput
                  style={[styles.inp, styles.wid]}
                  placeholder="word id"
                  keyboardType="number-pad"
                  value={row.word_id}
                  onChangeText={(t) =>
                    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, word_id: t } : r)))
                  }
                />
                <Pressable style={styles.pick} onPress={() => setPickIdx(pickIdx === i ? null : i)}>
                  <Text style={styles.pickTxt}>{pickIdx === i ? 'Хайлт▼' : 'Сонгох'}</Text>
                </Pressable>
                <TextInput
                  style={[styles.inp, styles.num]}
                  keyboardType="decimal-pad"
                  value={row.start_s}
                  onChangeText={(t) =>
                    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, start_s: t } : r)))
                  }
                />
                <TextInput
                  style={[styles.inp, styles.num]}
                  keyboardType="decimal-pad"
                  value={row.end_s}
                  onChangeText={(t) =>
                    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, end_s: t } : r)))
                  }
                />
              </View>
            ))}
            {pickIdx !== null ? (
              <View style={styles.searchBox}>
                <View style={styles.searchRow}>
                  <TextInput style={styles.inpFlex} value={q} onChangeText={setQ} placeholder="Хайх" />
                  <Pressable style={styles.go} onPress={() => void search()}>
                    <Text style={styles.goTxt}>Олох</Text>
                  </Pressable>
                </View>
                {hits.map((w) => (
                  <Pressable
                    key={w.id}
                    style={styles.hit}
                    onPress={() => {
                      const i = pickIdx;
                      if (i === null) return;
                      setRows((rs) =>
                        rs.map((r, j) => (j === i ? { ...r, word_id: String(w.id) } : r))
                      );
                      setPickIdx(null);
                    }}
                  >
                    <Text style={styles.hitTxt}>
                      #{w.id} {w.kanji} · {w.meaning_mn}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            <Pressable
              style={styles.addRow}
              onPress={() => setRows((r) => [...r, { word_id: '', start_s: '0', end_s: '5' }])}
            >
              <Text style={styles.addRowTxt}>+ Мөр</Text>
            </Pressable>
          </ScrollView>
          <View style={styles.footer}>
            <Pressable style={styles.secondary} onPress={onClose}>
              <Text style={styles.secondaryTxt}>Хаах</Text>
            </Pressable>
            <Pressable style={styles.primary} onPress={() => void submit()}>
              <Text style={styles.primaryTxt}>Хадгалах</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
