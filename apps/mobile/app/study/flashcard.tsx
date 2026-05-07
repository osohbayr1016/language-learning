import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/lib/api';
import { calculateNextReview, calculateXP, ReviewRating } from '@chinese-app/srs';
import { colors, spacing, radius, typography, shadows } from '../../src/theme';
import { getToneColor, parseTones } from '../../src/lib/tones';

export default function FlashcardScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Card state
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Audio state
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Session results
  const [sessionResults, setSessionResults] = useState<any[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    loadDueWords();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  async function loadDueWords() {
    if (!token) return;
    try {
      const res = await api.user.dueWords(token, 15); // Load 15 words for a session
      setWords(res.data);
    } catch (e) {
      console.error('Failed to load words', e);
    } finally {
      setLoading(false);
    }
  }

  const currentWord = words[currentIndex];

  const playAudio = async (speed: 'normal' | 'slow' = 'normal') => {
    if (!currentWord) return;
    
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      setIsPlaying(true);
      const url = api.audio.url(currentWord.id, speed);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, rate: speed === 'slow' ? 0.7 : 1.0 }
      );
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.error('Audio playback failed', e);
      setIsPlaying(false);
    }
  };

  const flipCard = () => {
    if (isFlipped) return;
    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(true);
    playAudio('normal');
  };

  const handleRating = async (rating: ReviewRating) => {
    if (!currentWord) return;

    // Calculate new SRS state
    const currentProgress = currentWord.ease_factor ? {
      ease_factor: currentWord.ease_factor,
      interval: currentWord.interval,
      repetitions: currentWord.repetitions,
    } : null;

    const nextState = calculateNextReview(currentProgress, rating);
    
    const result = {
      word_id: currentWord.id,
      ...nextState,
      next_review: nextState.next_review.toISOString(),
    };

    const updatedResults = [...sessionResults, result];
    setSessionResults(updatedResults);
    
    if (rating >= 3) {
      setCorrectCount(prev => prev + 1);
    }

    // Move to next word
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      flipAnim.setValue(0);
    } else {
      // Session complete
      finishSession(updatedResults);
    }
  };

  const finishSession = async (results: any[]) => {
    if (!token) return;
    setLoading(true);
    
    const xp_earned = calculateXP({
      type: 'flashcard',
      correct: correctCount + (results[results.length - 1].repetitions > 0 ? 1 : 0), // Include last rating
      total: words.length
    });

    try {
      await api.user.saveProgress(token, {
        session_type: 'flashcard',
        results,
        xp_earned
      });
      // Navigate back to tabs
      router.back();
    } catch (e) {
      console.error('Failed to save session', e);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent.purple} />
      </View>
    );
  }

  if (words.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        <Text style={styles.doneText}>Өнөөдрийн үгс дууслаа!</Text>
        <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneButtonText}>Буцах</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg']
  });

  const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
  const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

  const tones = parseTones(currentWord.tones);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={28} color={colors.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.progressText}>{currentIndex + 1} / {words.length}</Text>
        <View style={styles.iconButton} />
      </View>

      <View style={[styles.cardContainer, { perspective: 1000 } as any]}>
        {/* FRONT OF CARD */}
        <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
          <View style={styles.hanziContainer}>
            {currentWord.hanzi.split('').map((char: string, i: number) => (
              <Text 
                key={i} 
                style={[styles.hanzi, { color: getToneColor(tones[i] || 0) }]}
              >
                {char}
              </Text>
            ))}
          </View>
          <TouchableOpacity style={styles.tapToReveal} onPress={flipCard}>
            <Ionicons name="hand-right-outline" size={24} color={colors.text.muted} />
            <Text style={styles.tapText}>Дарж эргүүлэх</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* BACK OF CARD */}
        <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
          <View style={styles.backTop}>
            <TouchableOpacity 
              style={styles.audioButton} 
              onPress={() => playAudio('normal')}
              onLongPress={() => playAudio('slow')}
            >
              <Ionicons 
                name={isPlaying ? "volume-high" : "volume-medium"} 
                size={32} 
                color={colors.accent.purple} 
              />
            </TouchableOpacity>
            
            <View style={styles.hanziContainerSmall}>
              {currentWord.hanzi.split('').map((char: string, i: number) => (
                <Text key={i} style={[styles.hanziSmall, { color: getToneColor(tones[i] || 0) }]}>
                  {char}
                </Text>
              ))}
            </View>
            <Text style={styles.pinyin}>{currentWord.pinyin}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.backMiddle}>
            <Text style={styles.meaningMn}>{currentWord.meaning_mn}</Text>
            {currentWord.example_zh ? (
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleZh}>{currentWord.example_zh}</Text>
                <Text style={styles.examplePinyin}>{currentWord.example_pinyin}</Text>
                <Text style={styles.exampleMn}>{currentWord.example_mn}</Text>
              </View>
            ) : null}
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {!isFlipped ? (
          <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
            <Text style={styles.flipButtonText}>Шалгах</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.ratingGrid}>
            <TouchableOpacity style={[styles.rateButton, { backgroundColor: '#EF4444' }]} onPress={() => handleRating(1)}>
              <Text style={styles.rateText}>Дахиад</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.rateButton, { backgroundColor: '#F59E0B' }]} onPress={() => handleRating(3)}>
              <Text style={styles.rateText}>Хэцүү</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.rateButton, { backgroundColor: '#10B981' }]} onPress={() => handleRating(4)}>
              <Text style={styles.rateText}>Сайн</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.rateButton, { backgroundColor: '#3B82F6' }]} onPress={() => handleRating(5)}>
              <Text style={styles.rateText}>Амархан</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    ...typography.heading.sm,
    color: colors.text.secondary,
  },
  doneText: {
    ...typography.heading.lg,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  doneButton: {
    backgroundColor: colors.accent.purple,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  doneButtonText: {
    ...typography.heading.sm,
    color: colors.text.primary,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.xl,
    ...shadows.md,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    justifyContent: 'space-between',
  },
  hanziContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  hanzi: {
    ...typography.hanzi.xl,
  },
  tapToReveal: {
    position: 'absolute',
    bottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  tapText: {
    ...typography.body.sm,
    color: colors.text.muted,
  },
  backTop: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  audioButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  hanziContainerSmall: {
    flexDirection: 'row',
  },
  hanziSmall: {
    ...typography.hanzi.md,
  },
  pinyin: {
    ...typography.pinyin.lg,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  backMiddle: {
    flex: 1,
    alignItems: 'center',
  },
  meaningMn: {
    ...typography.heading.lg,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  exampleContainer: {
    backgroundColor: colors.bg.secondary,
    padding: spacing.md,
    borderRadius: radius.md,
    width: '100%',
  },
  exampleZh: {
    ...typography.body.lg,
    color: colors.text.primary,
    marginBottom: 4,
  },
  examplePinyin: {
    ...typography.body.sm,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  exampleMn: {
    ...typography.body.md,
    color: colors.text.muted,
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  flipButton: {
    backgroundColor: colors.accent.purple,
    padding: spacing.lg,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  flipButtonText: {
    ...typography.heading.md,
    color: colors.text.primary,
  },
  ratingGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rateButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  rateText: {
    ...typography.heading.sm,
    color: colors.text.primary,
  },
});
