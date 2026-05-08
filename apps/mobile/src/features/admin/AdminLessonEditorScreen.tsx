import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { AdminLessonEditorMeta } from './AdminLessonEditorMeta';
import { lessonEditorStyles as styles } from './AdminLessonEditorStyles';
import { AdminLessonWordRow } from './AdminLessonWordRow';
import { useAdminLessonEditor } from './useAdminLessonEditor';

export function AdminLessonEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lid = Number(id);
  const { token } = useAuth();

  const editor = useAdminLessonEditor({ token, lessonId: lid });

  if (!Number.isFinite(lid)) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Буруу ID</Text>
      </View>
    );
  }

  if (editor.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

  if (!editor.lesson) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Хичээл олдсонгүй</Text>
      </View>
    );
  }

  const n = editor.words.length;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ListHeaderComponent={
          <AdminLessonEditorMeta
            titleMn={editor.titleMn}
            subMn={editor.subMn}
            icon={editor.icon}
            pub={editor.pub}
            widAdd={editor.widAdd}
            setTitleMn={editor.setTitleMn}
            setSubMn={editor.setSubMn}
            setIcon={editor.setIcon}
            setPub={editor.setPub}
            setWidAdd={editor.setWidAdd}
            onSaveMeta={() => void editor.saveMeta()}
            onDeleteLesson={() => void editor.delLesson()}
            onAddWord={() => void editor.addW()}
          />
        }
        data={editor.words}
        keyExtractor={(i) => String(i.word_id)}
        renderItem={({ item, index }) => (
          <AdminLessonWordRow
            item={item}
            index={index}
            total={n}
            onMoveUp={editor.moveUp}
            onMoveDown={editor.moveDown}
            onRemove={editor.rmW}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
}
