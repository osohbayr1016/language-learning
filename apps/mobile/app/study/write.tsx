import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/lib/api';
import { calculateNextReview, calculateXP } from '@chinese-app/srs';
import { colors, spacing, radius, typography } from '../../src/theme';

export default function WriteScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [words, setWords] = useState<any[]>([]);
  const [sessionQueue, setSessionQueue] = useState<any[]>([]);
  const [currentWord, setCurrentWord] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [sessionResults, setSessionResults] = useState<any[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    if (!token) return;
    try {
      // Load 10 words
      const res = await api.user.dueWords(token, 10);
      setWords(res.data);
      setSessionQueue(res.data);
      if (res.data.length > 0) {
        setupQuestion(res.data[0]);
      }
    } catch (e) {
      console.error('Failed to load words', e);
    } finally {
      setLoading(false);
    }
  }

  const setupQuestion = (word: any) => {
    setCurrentWord(word);
    setInputValue('');
    setIsChecked(false);
    setIsCorrect(null);
  };

  const playAudio = async () => {
    if (!currentWord) return;
    try {
      const url = api.audio.url(currentWord.id, 'normal');
      const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  };

  // Strip tones for easier matching
  const stripTones = (pinyin: string) => {
    return pinyin.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s/g, '');
  };

  const handleCheck = () => {
    if (!inputValue.trim()) return;

    const correctPinyin = stripTones(currentWord.pinyin);
    const userPinyin = stripTones(inputValue);
    const correctHanzi = currentWord.hanzi;

    // Allow user to type either pinyin without tones, or hanzi
    const correct = userPinyin === correctPinyin || inputValue.trim() === correctHanzi;
    
    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      playAudio();
      setCorrectCount(prev => prev + 1);
      
      const currentProgress = currentWord.ease_factor ? {
        ease_factor: currentWord.ease_factor,
        interval: currentWord.interval,
        repetitions: currentWord.repetitions,
      } : null;

      const nextState = calculateNextReview(currentProgress, 4);
      
      const existingIdx = sessionResults.findIndex(r => r.word_id === currentWord.id);
      if (existingIdx === -1) {
        setSessionResults([...sessionResults, {
          word_id: currentWord.id,
          ...nextState,
          next_review: nextState.next_review.toISOString(),
        }]);
      }
    } else {
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
    }
  };

  const nextQuestion = () => {
    if (!isCorrect) {
      const newQueue = [...sessionQueue.slice(1), currentWord];
      setSessionQueue(newQueue);
      setupQuestion(newQueue[0]);
    } else {
      const remaining = sessionQueue.slice(1);
      setSessionQueue(remaining);

      if (remaining.length > 0) {
        setupQuestion(remaining[0]);
      } else {
        finishSession();
      }
    }
  };

  const finishSession = async () => {
    if (!token) return;
    setLoading(true);
    
    const xp_earned = calculateXP({
      type: 'write',
      correct: correctCount,
      total: sessionResults.length
    });

    try {
      await api.user.saveProgress(token, {
        session_type: 'write',
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
        <Text style={styles.doneText}>Бүх үгийг давтсан байна!</Text>
        <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneButtonText}>Буцах</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
        <Text style={styles.promptText}>Бичнэ үү (Пин-инь эсвэл Ханз)</Text>
        <View style={styles.meaningBox}>
          <Text style={styles.meaningText}>{currentWord.meaning_mn}</Text>
        </View>
        
        {isChecked && !isCorrect && (
          <View style={styles.correctAnswerBox}>
             <Text style={styles.correctLabel}>Зөв хариу:</Text>
             <Text style={styles.correctHanzi}>{currentWord.hanzi}</Text>
             <Text style={styles.correctPinyin}>{currentWord.pinyin}</Text>
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            isChecked && isCorrect && styles.inputCorrect,
            isChecked && !isCorrect && styles.inputWrong
          ]}
          placeholder="Энд бичнэ үү..."
          placeholderTextColor={colors.text.muted}
          value={inputValue}
          onChangeText={setInputValue}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isChecked}
          onSubmitEditing={isChecked ? nextQuestion : handleCheck}
        />
      </View>

      <View style={styles.footer}>
        {!isChecked ? (
          <TouchableOpacity 
            style={[styles.button, !inputValue.trim() && { opacity: 0.5 }]} 
            onPress={handleCheck}
            disabled={!inputValue.trim()}
          >
            <Text style={styles.buttonText}>Шалгах</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, isCorrect ? { backgroundColor: colors.success } : { backgroundColor: colors.error }]} 
            onPress={nextQuestion}
          >
            <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: spacing.lg,
  },
  meaningBox: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  meaningText: {
    ...typography.heading.xl,
    color: colors.text.primary,
    textAlign: 'center',
  },
  correctAnswerBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  correctLabel: {
    ...typography.body.sm,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  correctHanzi: {
    ...typography.hanzi.sm,
    color: colors.text.primary,
  },
  correctPinyin: {
    ...typography.pinyin.md,
    color: colors.text.secondary,
  },
  input: {
    width: '100%',
    backgroundColor: colors.bg.input,
    color: colors.text.primary,
    padding: spacing.lg,
    borderRadius: radius.md,
    ...typography.heading.md,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  inputCorrect: {
    borderColor: colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  inputWrong: {
    borderColor: colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  button: {
    backgroundColor: colors.accent.purple,
    padding: spacing.lg,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.heading.md,
    color: colors.text.primary,
  },
});
