import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/lib/api';
import { calculateNextReview, calculateXP, ReviewRating } from '@chinese-app/srs';
import { colors, spacing, radius, typography } from '../../src/theme';

type QuestionType = 'hanzi_to_meaning' | 'meaning_to_hanzi';

export default function LearnScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [words, setWords] = useState<any[]>([]);
  const [sessionQueue, setSessionQueue] = useState<any[]>([]);
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [questionType, setQuestionType] = useState<QuestionType>('hanzi_to_meaning');
  
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [sessionResults, setSessionResults] = useState<any[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    if (!token) return;
    try {
      // Load 10 words for learning
      const res = await api.user.dueWords(token, 10);
      setWords(res.data);
      setSessionQueue(res.data);
      if (res.data.length > 0) {
        setupQuestion(res.data[0], res.data);
      }
    } catch (e) {
      console.error('Failed to load words', e);
    } finally {
      setLoading(false);
    }
  }

  const setupQuestion = (word: any, allWords: any[]) => {
    setCurrentWord(word);
    setSelectedOption(null);
    setIsCorrect(null);

    // Randomize question type
    const type = Math.random() > 0.5 ? 'hanzi_to_meaning' : 'meaning_to_hanzi';
    setQuestionType(type);

    // Generate 3 random wrong options
    const wrongOptions = allWords
      .filter(w => w.id !== word.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [word, ...wrongOptions].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  const playAudio = async () => {
    if (!currentWord) return;
    try {
      const url = api.audio.url(currentWord.id, 'normal');
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  };

  const handleSelect = (option: any) => {
    if (selectedOption !== null) return; // Already answered

    const correct = option.id === currentWord.id;
    setSelectedOption(option.id);
    setIsCorrect(correct);

    if (correct) {
      playAudio();
      setCorrectCount(prev => prev + 1);
      
      // Calculate rating based on it being a test, 4 for correct, 1 for wrong
      const currentProgress = currentWord.ease_factor ? {
        ease_factor: currentWord.ease_factor,
        interval: currentWord.interval,
        repetitions: currentWord.repetitions,
      } : null;

      const nextState = calculateNextReview(currentProgress, 4);
      
      // Remove from queue or update existing result
      const existingIdx = sessionResults.findIndex(r => r.word_id === currentWord.id);
      if (existingIdx >= 0) {
        // If they already failed it in this session, keep the worse rating (or update?)
      } else {
        setSessionResults([...sessionResults, {
          word_id: currentWord.id,
          ...nextState,
          next_review: nextState.next_review.toISOString(),
        }]);
      }

      setTimeout(nextQuestion, 1500);
    } else {
      // Failed - mark as rating 1, push to end of queue to test again
      const currentProgress = currentWord.ease_factor ? {
        ease_factor: currentWord.ease_factor,
        interval: currentWord.interval,
        repetitions: currentWord.repetitions,
      } : null;

      const nextState = calculateNextReview(currentProgress, 1);
      
      const existingIdx = sessionResults.findIndex(r => r.word_id === currentWord.id);
      if (existingIdx === -1) {
        setSessionResults([...sessionResults, {
          word_id: currentWord.id,
          ...nextState,
          next_review: nextState.next_review.toISOString(),
        }]);
      }

      setTimeout(() => {
        const newQueue = [...sessionQueue.slice(1), currentWord]; // Move to back
        setSessionQueue(newQueue);
        setupQuestion(newQueue[0], words);
      }, 2000);
    }
  };

  const nextQuestion = () => {
    const remaining = sessionQueue.slice(1);
    setSessionQueue(remaining);

    if (remaining.length > 0) {
      setupQuestion(remaining[0], words);
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    if (!token) return;
    setLoading(true);
    
    const xp_earned = calculateXP({
      type: 'learn',
      correct: correctCount,
      total: sessionResults.length
    });

    try {
      await api.user.saveProgress(token, {
        session_type: 'learn',
        results: sessionResults,
        xp_earned
      });
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
        <Text style={styles.doneText}>Өнөөдөр сурах шинэ үг алга байна.</Text>
        <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneButtonText}>Буцах</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={28} color={colors.text.secondary} />
        </TouchableOpacity>
        <Text style={styles.progressText}>
          {words.length - sessionQueue.length + 1} / {words.length}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.questionContainer}>
        {questionType === 'hanzi_to_meaning' ? (
          <>
            <Text style={styles.promptText}>Энэ юу гэсэн утгатай вэ?</Text>
            <View style={styles.hanziBox}>
              <Text style={styles.hanziText}>{currentWord.hanzi}</Text>
              {isCorrect === false && selectedOption !== null && (
                <Text style={styles.pinyinText}>{currentWord.pinyin}</Text>
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.promptText}>Үүнийг юу гэж орчуулах вэ?</Text>
            <View style={styles.hanziBox}>
              <Text style={styles.meaningText}>{currentWord.meaning_mn}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isActuallyCorrect = option.id === currentWord.id;
          
          let bgColor = colors.bg.secondary;
          let borderColor = colors.border;
          
          if (selectedOption !== null) {
            if (isActuallyCorrect) {
              bgColor = 'rgba(16, 185, 129, 0.2)'; // Success
              borderColor = colors.success;
            } else if (isSelected) {
              bgColor = 'rgba(239, 68, 68, 0.2)'; // Error
              borderColor = colors.error;
            } else {
              bgColor = colors.bg.card;
            }
          }

          return (
            <TouchableOpacity 
              key={option.id}
              style={[styles.optionButton, { backgroundColor: bgColor, borderColor }]}
              onPress={() => handleSelect(option)}
              disabled={selectedOption !== null}
            >
              <Text style={[styles.optionText, isSelected && { color: colors.text.primary }]}>
                {questionType === 'hanzi_to_meaning' ? option.meaning_mn : option.hanzi}
              </Text>
              {questionType === 'meaning_to_hanzi' && selectedOption !== null && isActuallyCorrect && (
                 <Text style={styles.optionPinyin}>{option.pinyin}</Text>
              )}
            </TouchableOpacity>
          );
        })}
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
    ...typography.heading.md,
    color: colors.text.primary,
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
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  promptText: {
    ...typography.heading.md,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  hanziBox: {
    alignItems: 'center',
  },
  hanziText: {
    ...typography.hanzi.lg,
    color: colors.text.primary,
  },
  pinyinText: {
    ...typography.pinyin.lg,
    color: colors.text.muted,
    marginTop: spacing.sm,
  },
  meaningText: {
    ...typography.heading.lg,
    color: colors.text.primary,
    textAlign: 'center',
  },
  optionsContainer: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  optionButton: {
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    ...typography.heading.sm,
    color: colors.text.primary,
  },
  optionPinyin: {
    ...typography.body.sm,
    color: colors.text.muted,
    marginTop: 4,
  }
});
