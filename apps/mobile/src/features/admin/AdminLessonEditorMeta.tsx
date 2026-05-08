import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { spacing } from '../../theme';
import { lessonEditorStyles as styles } from './AdminLessonEditorStyles';

type Props = {
  titleMn: string;
  subMn: string;
  icon: string;
  pub: boolean;
  widAdd: string;
  setTitleMn: (v: string) => void;
  setSubMn: (v: string) => void;
  setIcon: (v: string) => void;
  setPub: (v: boolean | ((p: boolean) => boolean)) => void;
  setWidAdd: (v: string) => void;
  onSaveMeta: () => void;
  onDeleteLesson: () => void;
  onAddWord: () => void;
};

export function AdminLessonEditorMeta(props: Props) {
  const {
    titleMn,
    subMn,
    icon,
    pub,
    widAdd,
    setTitleMn,
    setSubMn,
    setIcon,
    setPub,
    setWidAdd,
    onSaveMeta,
    onDeleteLesson,
    onAddWord,
  } = props;

  return (
    <View style={styles.hdr}>
      <Text style={styles.lbl}>Гарчиг</Text>
      <TextInput style={styles.inp} value={titleMn} onChangeText={setTitleMn} />
      <Text style={styles.lbl}>Дэд гарчиг</Text>
      <TextInput style={styles.inp} value={subMn} onChangeText={setSubMn} />
      <Text style={styles.lbl}>Icon</Text>
      <TextInput style={styles.inp} value={icon} onChangeText={setIcon} autoCapitalize="none" />
      <Pressable style={styles.rowTap} onPress={() => setPub((p) => !p)}>
        <Text style={styles.lbl}>Нийтлэх: {pub ? 'тийм' : 'үгүй'}</Text>
      </Pressable>
      <Pressable style={styles.primary} onPress={() => void onSaveMeta()}>
        <Text style={styles.primaryTxt}>Хадгалах</Text>
      </Pressable>
      <Pressable style={styles.danger} onPress={() => void onDeleteLesson()}>
        <Text style={styles.dangerTxt}>Хичээл устгах</Text>
      </Pressable>
      <Text style={[styles.lbl, { marginTop: spacing.md }]}>Үг нэмэх (word id)</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.inp, styles.flex1]}
          value={widAdd}
          onChangeText={setWidAdd}
          keyboardType="number-pad"
        />
        <Pressable style={styles.primary} onPress={() => void onAddWord()}>
          <Text style={styles.primaryTxt}>Нэмэх</Text>
        </Pressable>
      </View>
    </View>
  );
}
