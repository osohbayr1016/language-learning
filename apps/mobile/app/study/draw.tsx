import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/lib/api';
import { colors, spacing, radius, typography } from '../../src/theme';

export default function DrawScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0); // Which character of the word are we drawing
  const [loading, setLoading] = useState(true);
  
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    if (!token) return;
    try {
      // Load 5 words for drawing practice
      const res = await api.user.dueWords(token, 5);
      setWords(res.data);
    } catch (e) {
      console.error('Failed to load words', e);
    } finally {
      setLoading(false);
    }
  }

  const currentWord = words[currentIndex];
  const charArray = currentWord ? currentWord.hanzi.split('') : [];
  const activeChar = charArray[currentCharIndex];

  // HTML content for WebView running hanzi-writer
  const generateHtml = (char: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
      <script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"></script>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          background-color: ${colors.bg.card};
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          overflow: hidden;
        }
        #character-target-div {
          width: 300px;
          height: 300px;
          background-color: #f8fafc;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <div id="character-target-div"></div>
      <script>
        var writer = HanziWriter.create('character-target-div', '${char}', {
          width: 300,
          height: 300,
          padding: 20,
          strokeColor: '${colors.accent.purple}',
          outlineColor: '${colors.border}',
          drawingColor: '${colors.accent.teal}',
          showOutline: true,
          showCharacter: false,
        });
        
        writer.quiz({
          onComplete: function(summaryData) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'COMPLETE', data: summaryData }));
          },
          onMistake: function(strokeData) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MISTAKE', data: strokeData }));
          }
        });

        // Function to animate if user is stuck
        window.animateStroke = function() {
           writer.animateCharacter();
        }
      </script>
    </body>
    </html>
  `;

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'COMPLETE') {
        // Move to next character or next word
        setTimeout(() => {
          if (currentCharIndex < charArray.length - 1) {
            setCurrentCharIndex(prev => prev + 1);
          } else {
            if (currentIndex < words.length - 1) {
              setCurrentIndex(prev => prev + 1);
              setCurrentCharIndex(0);
            } else {
              finishSession();
            }
          }
        }, 1000);
      }
    } catch (e) {
      console.error("WebView Message Error", e);
    }
  };

  const finishSession = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // In a real app we'd save xp and progress here for the write session
      await api.user.saveProgress(token, {
        session_type: 'draw',
        results: [],
        xp_earned: words.length * 5
      });
      router.back();
    } catch (e) {
      console.error('Failed to save draw session', e);
      setLoading(false);
    }
  };

  const animateHint = () => {
    webViewRef.current?.injectJavaScript(`window.animateStroke(); true;`);
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
        <Text style={styles.doneText}>Зурах дасгалууд дууслаа!</Text>
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
          {currentIndex + 1} / {words.length}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.wordMeaning}>{currentWord.meaning_mn}</Text>
        <Text style={styles.wordPinyin}>{currentWord.pinyin}</Text>
      </View>

      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: generateHtml(activeChar) }}
          style={styles.webview}
          scrollEnabled={false}
          bounces={false}
          onMessage={onMessage}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.hintButton} onPress={animateHint}>
          <Ionicons name="help-buoy" size={24} color={colors.text.primary} />
          <Text style={styles.hintText}>Тусламж (Зурлага харах)</Text>
        </TouchableOpacity>
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
  infoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  wordMeaning: {
    ...typography.heading.xl,
    color: colors.text.primary,
    textAlign: 'center',
  },
  wordPinyin: {
    ...typography.pinyin.lg,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  webViewContainer: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.bg.card,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  hintButton: {
    flexDirection: 'row',
    backgroundColor: colors.bg.secondary,
    padding: spacing.lg,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  hintText: {
    ...typography.heading.sm,
    color: colors.text.primary,
  },
});
