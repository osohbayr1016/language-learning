import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Button, Pill, Dialog } from '../../primitives';
import { api } from '../../lib/api';
import type { Word } from '../../lib/types';
import type { ProgressBody } from '../../lib/api/user';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { jlptNLabel } from '../../lib/jlptLabel';
import { safeBack } from '../../lib/navigation/safeBack';
import { useAuth } from '../../context/AuthContext';
import { ListenSpeakActivity } from './ListenSpeakActivity';
import {
  clearKanjiActivities,
  loadKanjiActivities,
  saveKanjiActivities,
  type KanjiActivityKey,
} from './kanjiActivityStorage';

// ─── Activity Types ───────────────────────────────────────────────────────────

const ACTIVITIES: {
  key: KanjiActivityKey;
  icon: string;
  label: string;
  description: string;
}[] = [
  { key: 'listen',   icon: '🔊', label: 'Сонсох & Хэлэх', description: 'Сонсоод давтан хэлээрэй' },
  { key: 'write',    icon: '✍️', label: 'Бичих',          description: 'Зурлагын дарааллаар зур' },
  { key: 'sentence', icon: '📖', label: 'Өгүүлбэр',       description: 'Жишээ өгүүлбэрийг уншаарай' },
];

// ─── Sentence sub-component ───────────────────────────────────────────────────

function SentencePanel({
  word,
  onComplete,
}: {
  word: Word;
  onComplete: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  if (!word.example_jp) {
    return (
      <View style={sp.wrap}>
        <Text style={sp.noExample}>Энэ үгэнд жишээ өгүүлбэр байхгүй байна.</Text>
        <Button label="Ойлголоо ✓" onPress={onComplete} style={sp.btn} />
      </View>
    );
  }

  return (
    <View style={sp.wrap}>
      <Text style={sp.label}>Япон өгүүлбэр:</Text>
      <Text style={sp.exJp}>{word.example_jp}</Text>
      {word.example_romaji && <Text style={sp.exRomaji}>{word.example_romaji}</Text>}

      {!revealed ? (
        <Pressable style={sp.revealBtn} onPress={() => setRevealed(true)}>
          <Ionicons name="eye" size={18} color={colors.brand.secondary} />
          <Text style={sp.revealText}>Утгыг харах</Text>
        </Pressable>
      ) : (
        <>
          <View style={sp.meaningBox}>
            <Text style={sp.exMn}>{word.example_mn ?? '—'}</Text>
          </View>
          <Button label="Ойлголоо ✓" onPress={onComplete} style={sp.btn} />
        </>
      )}
    </View>
  );
}

const sp = StyleSheet.create({
  wrap: { gap: spacing.md },
  label: { ...typography.body.sm, color: colors.text.muted, fontWeight: '700', textTransform: 'uppercase' },
  exJp: { fontSize: 24, fontWeight: '700', color: colors.text.primary, textAlign: 'center', lineHeight: 36 },
  exRomaji: { ...typography.body.md, color: colors.brand.secondary, textAlign: 'center' },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed' as any,
    borderColor: colors.brand.secondary,
  },
  revealText: { ...typography.body.md, color: colors.brand.secondary, fontWeight: '600' },
  meaningBox: {
    backgroundColor: colors.brand.primary + '10',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.brand.primary + '40',
  },
  exMn: { ...typography.body.lg, color: colors.brand.primaryDark, textAlign: 'center', fontWeight: '600' },
  noExample: { ...typography.body.md, color: colors.text.muted, textAlign: 'center', paddingVertical: spacing.md },
  btn: { width: '100%' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function KanjiDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const wordId = Number(id);

  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState<Set<KanjiActivityKey>>(new Set());
  const [saving, setSaving] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', message: '' });
  const [activeActivity, setActiveActivity] = useState<KanjiActivityKey | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;

  // Load word data
  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const res = await api.words.get(wordId);
        setWord(res.data);
      } catch (e) {
        console.error('Failed to load kanji details:', e);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id, wordId]);

  // Restore progress from AsyncStorage every time screen is focused
  // This handles coming back from the Writer screen
  useFocusEffect(
    useCallback(() => {
      if (!wordId) return;
      loadKanjiActivities(wordId).then(saved => {
        setCompleted(saved);
      });
    }, [wordId])
  );

  // Animate progress bar
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: completed.size / ACTIVITIES.length,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  }, [completed.size]);

  const markActivity = useCallback(
    async (key: KanjiActivityKey) => {
      const next = new Set(completed);
      next.add(key);
      setCompleted(next);
      setActiveActivity(null);
      await saveKanjiActivities(wordId, next);
    },
    [completed, wordId]
  );

  const allDone = completed.size === ACTIVITIES.length;

  const markLearned = async () => {
    if (!token || !word) {
      setDialogContent({ title: 'Нэвтрэх шаардлагатай', message: 'Явцаа хадгалахын тулд нэвтэрнэ үү.' });
      setDialogVisible(true);
      return;
    }
    setSaving(true);
    try {
      const body: ProgressBody = {
        results: [{
          word_id: word.id,
          ease_factor: 2.5,
          interval: 1,
          repetitions: 1,
          next_review: new Date(Date.now() + 86400000).toISOString(),
          confidence: 1,
        }],
        xp_earned: 20,
        session_type: 'learn',
      };
      await api.user.saveProgress(token, body);
      await clearKanjiActivities(wordId); // clear session progress after saving
      setDialogContent({ title: '🎉 Амжилттай!', message: `"${word.kanji}" суралцсанаар тэмдэглэгдлээ! +20 XP авлаа.` });
      setDialogVisible(true);
    } catch (e) {
      setDialogContent({ title: 'Алдаа', message: (e as Error).message });
      setDialogVisible(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
      </Screen>
    );
  }

  if (!word) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorText}>Ханз олдсонгүй</Text>
          <Button
            label="Буцах"
            onPress={() => safeBack(router, '/(tabs)/kanji')}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </Screen>
    );
  }

  const hskColor = colors.jlpt[word.jlpt_level as keyof typeof colors.jlpt] || colors.brand.primary;

  return (
    <Screen scroll scrollBottomInset={120}>
      {/* Back + HSK */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => safeBack(router, '/(tabs)/kanji')}
          hitSlop={12}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color={colors.text.primary} />
        </Pressable>
        <Pill label={jlptNLabel(word.jlpt_level)} color={hskColor} />
      </View>

      {/* Hero card */}
      <View style={styles.heroCard}>
        <Text style={styles.hanziHuge}>{word.kanji}</Text>
        <Text style={styles.pinyin}>{word.romaji}</Text>
        <Text style={styles.meaning}>{word.meaning_mn}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          {allDone
            ? '✅ Бүх даалгавар дууслаа!'
            : `${completed.size} / ${ACTIVITIES.length} даалгавар дууссан`}
        </Text>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Activity cards */}
      <View style={styles.activitiesGrid}>
        {ACTIVITIES.map(act => {
          const done = completed.has(act.key);
          const isActive = activeActivity === act.key;

          return (
            <View key={act.key} style={styles.activityOuter}>
              <Pressable
                style={[
                  styles.activityCard,
                  done && styles.activityCardDone,
                  isActive && styles.activityCardActive,
                ]}
                onPress={() => {
                  if (done) return; // already done, tap does nothing
                  if (act.key === 'write') {
                    router.push({
                      pathname: '/study/writer',
                      params: { forcedId: String(word.id) },
                    } as never);
                    return;
                  }
                  setActiveActivity(isActive ? null : act.key);
                }}
              >
                {/* Icon + done badge */}
                <View style={styles.activityIconWrap}>
                  <Text style={styles.activityIcon}>{act.icon}</Text>
                  {done && (
                    <View style={styles.doneCheck}>
                      <Ionicons name="checkmark" size={11} color="#fff" />
                    </View>
                  )}
                </View>

                <View style={styles.activityTextWrap}>
                  <Text style={[styles.activityLabel, done && styles.activityLabelDone]}>
                    {act.label}
                  </Text>
                  <Text style={styles.activityDesc} numberOfLines={1}>
                    {done ? 'Дууссан ✓' : act.description}
                  </Text>
                </View>

                {!done && (
                  <Ionicons
                    name={isActive ? 'chevron-up' : 'chevron-forward'}
                    size={18}
                    color={colors.text.muted}
                  />
                )}
              </Pressable>

              {/* Expanded inline panel */}
              {isActive && !done && (
                <View style={styles.expandedPanel}>
                  {act.key === 'listen' && (
                    <ListenSpeakActivity
                      word={word}
                      onComplete={() => void markActivity('listen')}
                    />
                  )}
                  {act.key === 'sentence' && (
                    <SentencePanel
                      word={word}
                      onComplete={() => void markActivity('sentence')}
                    />
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Mark as learned */}
      <Pressable
        style={[
          styles.learnBtn,
          (!allDone || saving) && styles.learnBtnDisabled,
        ]}
        onPress={() => void markLearned()}
        disabled={!allDone || saving}
      >
        <Ionicons
          name={allDone ? 'star' : 'lock-closed'}
          size={20}
          color={allDone ? '#fff' : colors.text.muted}
        />
        <Text style={[styles.learnBtnText, !allDone && styles.learnBtnTextDisabled]}>
          {saving
            ? 'Хадгалж байна...'
            : allDone
            ? 'Суралцлаа гэж тэмдэглэх (+20 XP)'
            : 'Бүх даалгавраа дуусгасны дараа'}
        </Text>
      </Pressable>

      <Dialog
        visible={dialogVisible}
        title={dialogContent.title}
        message={dialogContent.message}
        onClose={() => {
          setDialogVisible(false);
          if (dialogContent.title.includes('Амжилттай')) {
            safeBack(router, '/(tabs)/kanji');
          }
        }}
      />
    </Screen>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { ...typography.body.lg, color: colors.text.secondary },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  backBtn: { padding: spacing.xs },

  heroCard: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  hanziHuge: {
    fontSize: 96,
    fontWeight: '800',
    color: colors.text.primary,
    lineHeight: 112,
  },
  pinyin: {
    ...typography.heading.lg,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  meaning: {
    ...typography.body.lg,
    color: colors.text.muted,
  },

  progressSection: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  progressLabel: {
    ...typography.body.sm,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    borderRadius: radius.full,
  },

  activitiesGrid: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  activityOuter: {},

  activityCard: {
    backgroundColor: colors.bg.primary,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.sm,
  },
  activityCardDone: {
    borderColor: colors.brand.primary + '80',
    backgroundColor: colors.brand.primary + '08',
  },
  activityCardActive: {
    borderColor: colors.brand.secondary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  activityIconWrap: {
    position: 'relative',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIcon: { fontSize: 28 },
  doneCheck: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityTextWrap: { flex: 1 },
  activityLabel: {
    ...typography.heading.sm,
    color: colors.text.primary,
  },
  activityLabelDone: { color: colors.brand.primaryDark },
  activityDesc: {
    ...typography.body.sm,
    color: colors.text.muted,
    marginTop: 2,
  },

  expandedPanel: {
    backgroundColor: colors.bg.secondary,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: colors.brand.secondary,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    padding: spacing.lg,
  },

  learnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.brand.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  learnBtnDisabled: {
    backgroundColor: colors.border,
  },
  learnBtnText: {
    ...typography.heading.sm,
    color: '#fff',
    textAlign: 'center',
  },
  learnBtnTextDisabled: {
    color: colors.text.muted,
  },
});
