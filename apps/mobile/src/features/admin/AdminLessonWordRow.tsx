import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LessonWordLink } from '../../lib/api/admin';
import { lessonEditorStyles as styles } from './AdminLessonEditorStyles';

type Props = {
  item: LessonWordLink;
  index: number;
  total: number;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  onRequestRemove: () => void;
};

export function AdminLessonWordRow({ item, index, total, onMoveUp, onMoveDown, onRequestRemove }: Props) {
  return (
    <View style={styles.wrow}>
      <View style={styles.wordOrderBtns}>
        <Pressable
          style={[styles.ordBtn, index === 0 && styles.ordBtnDis]}
          disabled={index === 0}
          onPress={() => void onMoveUp(index)}
        >
          <Text style={styles.ordTxt}>↑</Text>
        </Pressable>
        <Pressable
          style={[styles.ordBtn, index >= total - 1 && styles.ordBtnDis]}
          disabled={index >= total - 1}
          onPress={() => void onMoveDown(index)}
        >
          <Text style={styles.ordTxt}>↓</Text>
        </Pressable>
      </View>
      <View style={styles.flex1}>
        <Text style={styles.hz}>{item.hanzi}</Text>
        <Text style={styles.meta}>
          {item.pinyin} · {item.meaning_mn}
        </Text>
      </View>
      <Pressable onPress={onRequestRemove}>
        <Text style={styles.rm}>Хасах</Text>
      </Pressable>
    </View>
  );
}
