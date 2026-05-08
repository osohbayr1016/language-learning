import React from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { bulkHanziStyles as styles } from './AdminBulkHanziPaste.styles';
import { AdminBulkHanziPasteTools } from './AdminBulkHanziPasteTools';
import { AdminBulkParsedSection } from './AdminBulkParsedSection';
import { useAdminBulkHanziPaste } from './useAdminBulkHanziPaste';

type Props = { token: string | null | undefined; hskLevel: string };

export function AdminBulkHanziPaste({ token, hskLevel }: Props) {
  const p = useAdminBulkHanziPaste(token, hskLevel);

  return (
    <View style={styles.block}>
      <Text style={styles.sectionTitle}>Олон мөр (ханз + pinyin + ### + утга)</Text>
      <Text style={styles.hintTiny}>
        Жишээ: 你好 nǐhǎo ### Сайн байна уу{'\n'}
        Олон ханз бол: 拐卖 guǎimài ### хүн худалдах
      </Text>
      <AdminBulkHanziPasteTools
        token={Boolean(token)}
        textbookUnit={p.textbookUnitBulk}
        onTextbookUnit={p.setTextbookUnitBulk}
        dupPolicy={p.dupPolicy}
        onDupPolicy={p.setDupPolicy}
        onValidate={() => void p.runValidate()}
        validateBusy={p.validateBusy}
        canValidate={p.okRows.length > 0 && Boolean(p.preview)}
      />
      <TextInput
        style={styles.textarea}
        value={p.bulkText}
        onChangeText={p.setBulkText}
        multiline
        textAlignVertical="top"
        placeholder="Мөр бүр ..."
        editable={!!token}
      />
      <Pressable
        accessibilityRole="button"
        disabled={!token || p.busy}
        style={({ pressed }) => [styles.btnSec, pressed && Platform.OS !== 'web' && { opacity: 0.92 }]}
        onPress={p.runParse}
      >
        <Text style={styles.btnSecTx}>Задлах</Text>
      </Pressable>
      {p.preview && p.preview.length > 0 ? (
        <AdminBulkParsedSection
          preview={p.preview}
          okRows={p.okRows}
          errRows={p.errRows}
          serverFails={p.serverFails}
          token={Boolean(token)}
          bulkExZh={p.bulkExZh}
          bulkExPy={p.bulkExPy}
          bulkExMn={p.bulkExMn}
          onBulkExZh={p.setBulkExZh}
          onBulkExPy={p.setBulkExPy}
          onBulkExMn={p.setBulkExMn}
        />
      ) : null}
      <Pressable
        accessibilityRole="button"
        disabled={!token || p.busy || p.okRows.length === 0}
        style={({ pressed }) => [
          styles.btn,
          (!token || p.okRows.length === 0 || p.busy) && styles.btnDis,
          pressed && Platform.OS !== 'web' && styles.btnPressed,
          Platform.OS === 'web' && styles.btnWeb,
        ]}
        onPress={() => void p.runBulk()}
      >
        <Text style={styles.btnTxt}>{p.busy ? 'Илгээж байна…' : 'Бүгдийг нэмэх'}</Text>
      </Pressable>
    </View>
  );
}
