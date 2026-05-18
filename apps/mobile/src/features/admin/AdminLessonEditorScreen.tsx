import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { ConfirmDialog } from '../../primitives';
import { colors } from '../../theme';
import { AdminLessonEditorMeta } from './AdminLessonEditorMeta';
import { lessonEditorStyles as styles } from './AdminLessonEditorStyles';
import { AdminLessonWordRow } from './AdminLessonWordRow';
import { useAdminLessonEditor } from './useAdminLessonEditor';

type PendingDelete = null | { kind: 'lesson' } | { kind: 'word'; wordId: number; label: string };

export function AdminLessonEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lid = Number(id);
  const router = useRouter();
  const { token } = useAuth();
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

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
            onDeleteLesson={() => setPendingDelete({ kind: 'lesson' })}
            onAddWord={() => void editor.addW()}
            onOpenPreview={() => router.push(`/admin/lesson-preview/${lid}` as never)}
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
            onRequestRemove={() =>
              setPendingDelete({ kind: 'word', wordId: item.word_id, label: item.hanzi })
            }
          />
        )}
      />
      <ConfirmDialog
        visible={pendingDelete != null}
        title={
          pendingDelete?.kind === 'word'
            ? 'Үг хасах'
            : pendingDelete?.kind === 'lesson'
              ? 'Хичээл устгах'
              : ''
        }
        message={
          pendingDelete?.kind === 'word'
            ? `«${pendingDelete.label}» үгийг энэ хичээлийн жагсаалаас хасах уу?`
            : pendingDelete?.kind === 'lesson'
              ? `«${editor.titleMn.trim() || 'Хичээл'}»-ийг бүрмөсөн устгах уу?`
              : undefined
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          void (async () => {
            if (!pendingDelete) return;
            const p = pendingDelete;
            setPendingDelete(null);
            if (p.kind === 'lesson') await editor.delLesson();
            else await editor.rmW(p.wordId);
          })();
        }}
      />
    </KeyboardAvoidingView>
  );
}
