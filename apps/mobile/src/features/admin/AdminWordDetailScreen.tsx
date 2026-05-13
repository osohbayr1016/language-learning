import React, { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
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
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import type { Word } from '../../lib/types';
import type { AdminChapter } from '../../lib/api/admin';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing, typography } from '../../theme';

type Tab = 'basic' | 'listening' | 'writing' | 'lesson';

type Props = { wordId: number };

function toast(title: string, msg?: string) {
  if (Platform.OS === 'web') {
    const g = globalThis as { alert?: (s: string) => void };
    g.alert?.(msg ? `${title}\n${msg}` : title);
    return;
  }
  Alert.alert(title, msg);
}

export function AdminWordDetailScreen({ wordId }: Props) {
  const { token } = useAuth();
  const router = useRouter();

  const [word, setWord] = useState<Word | null>(null);
  const [draft, setDraft] = useState<Partial<Word>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>('basic');
  const [tree, setTree] = useState<AdminChapter[]>([]);

  // Lesson tab state
  const [searchQ, setSearchQ] = useState('');
  const [addLessonId, setAddLessonId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    Promise.all([
      api.words.get(wordId),
      api.admin.lessonTree(token),
    ])
      .then(([wRes, tRes]) => {
        if (!cancelled) {
          setWord(wRes.data);
          setDraft(wRes.data);
          setTree(tRes.data ?? []);
        }
      })
      .catch((e) => {
        if (!cancelled) toast('Алдаа', (e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, wordId]);

  const set = (k: keyof Word, v: unknown) => setDraft((d) => ({ ...d, [k]: v }));

  const save = async () => {
    if (!token || !word) return;
    if (!draft.hanzi?.trim() || !draft.pinyin?.trim() || !draft.meaning_mn?.trim()) {
      toast('Алдаа', 'Ханз, Pinyin, Утга заавал байна.');
      return;
    }
    setSaving(true);
    try {
      await api.words.update(token, wordId, draft);
      const full = await api.words.get(wordId);
      setWord(full.data);
      setDraft(full.data);
      toast('Амжилттай', 'Үг шинэчлэгдлээ');
    } catch (e) {
      toast('Алдаа', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!token || !word) return;
    if (Platform.OS === 'web') {
      const g = globalThis as { confirm?: (s: string) => boolean };
      if (!g.confirm?.(`"${draft.hanzi}" үгийг устгах уу?`)) return;
    } else {
      Alert.alert('Устгах', `"${draft.hanzi}" үгийг устгах уу?`, [
        { text: 'Буцах', style: 'cancel' },
        {
          text: 'Устгах',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.words.remove(token, wordId);
              toast('Устгагдлаа');
              router.back();
            } catch (e) {
              toast('Алдаа', (e as Error).message);
            }
          },
        },
      ]);
      return;
    }

    // Web fallback for delete
    try {
      await api.words.remove(token, wordId);
      toast('Устгагдлаа');
      router.back();
    } catch (e) {
      toast('Алдаа', (e as Error).message);
    }
  };

  const addToLesson = async () => {
    if (!token || !addLessonId) return;
    try {
      await api.admin.addLessonWord(token, addLessonId, wordId);
      toast('Амжилттай', 'Хичээлд нэмэгдлээ');
      setAddLessonId(null);
    } catch (e) {
      toast('Алдаа', (e as Error).message);
    }
  };

  const allLessons = useMemo(() => {
    return tree.flatMap((ch) =>
      (ch.lessons ?? []).map((ls) => ({ ...ls, chapterTitle: ch.title_mn, hsk: ch.hsk_level }))
    );
  }, [tree]);

  const filteredLessons = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return allLessons;
    return allLessons.filter(
      (l) => l.title_mn.toLowerCase().includes(q) || l.chapterTitle.toLowerCase().includes(q)
    );
  }, [allLessons, searchQ]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.brand.primary} />
      </View>
    );
  }

  if (!word) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Үг олдсонгүй</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.hanzi}>{draft.hanzi}</Text>
          <View style={styles.headerMeta}>
            <Text style={styles.pinyin}>{draft.pinyin}</Text>
            <View style={styles.hskBadge}>
              <Text style={styles.hskText}>HSK {draft.hsk_level}</Text>
            </View>
          </View>
          <Text style={styles.meaning}>{draft.meaning_mn}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <Pressable style={[styles.tab, tab === 'basic' && styles.tabActive]} onPress={() => setTab('basic')}>
            <Text style={[styles.tabText, tab === 'basic' && styles.tabTextActive]}>📝 Үндсэн</Text>
          </Pressable>
          <Pressable style={[styles.tab, tab === 'listening' && styles.tabActive]} onPress={() => setTab('listening')}>
            <Text style={[styles.tabText, tab === 'listening' && styles.tabTextActive]}>🔊 Сонсох</Text>
          </Pressable>
          <Pressable style={[styles.tab, tab === 'writing' && styles.tabActive]} onPress={() => setTab('writing')}>
            <Text style={[styles.tabText, tab === 'writing' && styles.tabTextActive]}>✍️ Бичих</Text>
          </Pressable>
          <Pressable style={[styles.tab, tab === 'lesson' && styles.tabActive]} onPress={() => setTab('lesson')}>
            <Text style={[styles.tabText, tab === 'lesson' && styles.tabTextActive]}>📚 Хичээл</Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {tab === 'basic' && (
            <View style={styles.section}>
              <Text style={styles.label}>Ханз *</Text>
              <TextInput style={styles.input} value={draft.hanzi} onChangeText={(v) => set('hanzi', v)} />
              
              <Text style={styles.label}>Pinyin *</Text>
              <TextInput style={styles.input} value={draft.pinyin} onChangeText={(v) => set('pinyin', v)} autoCapitalize="none" />
              
              <Text style={styles.label}>Pinyin (тоогоор)</Text>
              <TextInput style={styles.input} value={draft.pinyin_numbered ?? ''} onChangeText={(v) => set('pinyin_numbered', v)} autoCapitalize="none" />
              
              <Text style={styles.label}>Утга (Монгол) *</Text>
              <TextInput style={styles.input} value={draft.meaning_mn} onChangeText={(v) => set('meaning_mn', v)} />
              
              <Text style={styles.label}>Утга (Англи)</Text>
              <TextInput style={styles.input} value={draft.meaning_en ?? ''} onChangeText={(v) => set('meaning_en', v)} />
              
              <Text style={styles.label}>HSK түвшин *</Text>
              <TextInput style={styles.input} value={String(draft.hsk_level ?? 1)} onChangeText={(v) => set('hsk_level', Number(v) || 1)} keyboardType="number-pad" />
              
              <Text style={styles.label}>Үгийн аймаг</Text>
              <TextInput style={styles.input} value={draft.part_of_speech ?? ''} onChangeText={(v) => set('part_of_speech', v)} autoCapitalize="none" />
              
              <Text style={styles.label}>Цохилтын тоо</Text>
              <TextInput style={styles.input} value={String(draft.stroke_count ?? '')} onChangeText={(v) => set('stroke_count', Number(v) || 0)} keyboardType="number-pad" />
              
              <Text style={styles.label}>Тоны дараалал (JSON, e.g. [3,3])</Text>
              <TextInput style={styles.input} value={draft.tones ?? ''} onChangeText={(v) => set('tones', v)} />
            </View>
          )}

          {tab === 'listening' && (
            <View style={styles.section}>
              <Text style={styles.label}>Audio URL / R2 key</Text>
              <TextInput
                style={styles.input}
                value={draft.audio_url ?? ''}
                onChangeText={(v) => set('audio_url', v)}
                placeholder="audio/ni-hao.mp3"
                autoCapitalize="none"
              />
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>💡 R2 bucket дахь аудио файлын зам эсвэл public URL-г бичнэ үү.</Text>
              </View>
            </View>
          )}

          {tab === 'writing' && (
            <View style={styles.section}>
              <Text style={styles.label}>Өгүүлбэр (Хятад)</Text>
              <TextInput style={styles.input} value={draft.example_zh ?? ''} onChangeText={(v) => set('example_zh', v)} placeholder="你好吗？" />
              
              <Text style={styles.label}>Өгүүлбэр (Pinyin)</Text>
              <TextInput style={styles.input} value={draft.example_pinyin ?? ''} onChangeText={(v) => set('example_pinyin', v)} placeholder="Nǐ hǎo ma?" autoCapitalize="none" />
              
              <Text style={styles.label}>Өгүүлбэр (Монгол)</Text>
              <TextInput style={styles.input} value={draft.example_mn ?? ''} onChangeText={(v) => set('example_mn', v)} placeholder="Та сайн уу?" />
              
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>💡 Энэхүү жишээ өгүүлбэр нь Уншиж бичих болон Цээжлэх хэсгүүдэд ашиглагдана.</Text>
              </View>
            </View>
          )}

          {tab === 'lesson' && (
            <View style={styles.section}>
              <Text style={styles.label}>Хичээл хайх</Text>
              <TextInput
                style={styles.input}
                placeholder="Хичээлийн нэр..."
                value={searchQ}
                onChangeText={setSearchQ}
              />
              <View style={styles.lessonList}>
                {filteredLessons.slice(0, 10).map((ls) => (
                  <Pressable
                    key={ls.id}
                    style={[styles.lessonItem, addLessonId === ls.id && styles.lessonItemSelected]}
                    onPress={() => setAddLessonId(ls.id)}
                  >
                    <Text style={styles.lessonItemHsk}>HSK{ls.hsk}</Text>
                    <Text style={styles.lessonItemTitle} numberOfLines={1}>
                      {ls.chapterTitle} › {ls.title_mn}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {addLessonId && (
                <Pressable style={styles.addButton} onPress={() => void addToLesson()}>
                  <Text style={styles.addButtonText}>Энэ хичээлд нэмэх</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Pressable style={styles.saveButton} onPress={() => void save()} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Хадгалж байна...' : 'Хадгалах'}</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => void del()}>
            <Text style={styles.deleteButtonText}>Устгах</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg.primary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg.primary },
  errorText: { ...typography.body.md, color: colors.error },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: {
    backgroundColor: colors.bg.card,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hanzi: { fontSize: 48, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.xs },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  pinyin: { ...typography.body.md, color: colors.brand.primary },
  hskBadge: {
    backgroundColor: colors.hsk[1] + '22',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.hsk[1] + '55',
  },
  hskText: { fontSize: 12, fontWeight: '700', color: colors.hsk[1] },
  meaning: { ...typography.body.md, color: colors.text.secondary },
  
  tabsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.bg.secondary,
    borderRadius: radius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabActive: { backgroundColor: colors.bg.card, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
  tabText: { ...typography.body.sm, color: colors.text.muted, fontWeight: '500' },
  tabTextActive: { color: colors.brand.primary, fontWeight: '700' },
  
  tabContent: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  section: { gap: spacing.sm },
  label: { ...typography.body.sm, color: colors.text.secondary, marginTop: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text.primary,
    backgroundColor: colors.bg.primary,
    ...typography.body.md,
  },
  infoBox: {
    backgroundColor: colors.brand.primary + '15',
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  infoText: { ...typography.body.sm, color: colors.text.secondary },
  
  lessonList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    maxHeight: 200,
    marginTop: spacing.sm,
  },
  lessonItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    gap: spacing.sm,
  },
  lessonItemSelected: { backgroundColor: colors.brand.primary + '22' },
  lessonItemHsk: { fontSize: 12, fontWeight: '700', color: colors.text.muted },
  lessonItemTitle: { flex: 1, ...typography.body.sm, color: colors.text.primary },
  addButton: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  addButtonText: { color: '#fff', fontWeight: '700', ...typography.body.md },

  footer: { flexDirection: 'row', gap: spacing.md },
  saveButton: {
    flex: 2,
    backgroundColor: colors.brand.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: '700', ...typography.body.md },
  deleteButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.error,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  deleteButtonText: { color: colors.error, fontWeight: '700', ...typography.body.md },
});
