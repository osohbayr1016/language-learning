import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/lib/api';
import { colors, spacing, radius, typography, shadows } from '../../src/theme';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 6;
// 3 columns
const CARD_WIDTH = (width - spacing.lg * 2 - CARD_MARGIN * 6) / 3;

interface CardData {
  id: string; // unique for the card instance
  wordId: number; // the id of the vocabulary word
  type: 'hanzi' | 'meaning';
  content: string;
  isMatched: boolean;
  isError: boolean;
}

export default function MatchGameScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<CardData[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardData[]>([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    loadGame();
  }, []);

  async function loadGame() {
    if (!token) return;
    setLoading(true);
    try {
      // Load 6 random words for the match game
      const res = await api.words.list({ limit: 6 });
      const words = res.data;

      let deck: CardData[] = [];
      words.forEach((word) => {
        deck.push({
          id: `hanzi_${word.id}`,
          wordId: word.id,
          type: 'hanzi',
          content: word.hanzi,
          isMatched: false,
          isError: false,
        });
        deck.push({
          id: `meaning_${word.id}`,
          wordId: word.id,
          type: 'meaning',
          content: word.meaning_mn,
          isMatched: false,
          isError: false,
        });
      });

      // Shuffle deck
      deck = deck.sort(() => Math.random() - 0.5);
      
      setCards(deck);
      setStartTime(Date.now());
      setScore(0);
      setGameOver(false);
      setSelectedCards([]);
    } catch (e) {
      console.error('Failed to load match game', e);
    } finally {
      setLoading(false);
    }
  }

  const handleCardPress = (card: CardData) => {
    if (card.isMatched || selectedCards.length >= 2 || selectedCards.find(c => c.id === card.id)) {
      return;
    }

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      checkMatch(newSelected[0], newSelected[1]);
    }
  };

  const checkMatch = (card1: CardData, card2: CardData) => {
    const isMatch = card1.wordId === card2.wordId && card1.type !== card2.type;

    if (isMatch) {
      setCards(prev => prev.map(c => 
        (c.id === card1.id || c.id === card2.id) ? { ...c, isMatched: true } : c
      ));
      setScore(prev => prev + 10);
      setSelectedCards([]);

      // Check win condition
      setCards(prev => {
        const allMatched = prev.every(c => c.isMatched || c.id === card1.id || c.id === card2.id);
        if (allMatched) {
          finishGame(score + 10);
        }
        return prev;
      });
    } else {
      // Error state
      setCards(prev => prev.map(c => 
        (c.id === card1.id || c.id === card2.id) ? { ...c, isError: true } : c
      ));
      setScore(prev => Math.max(0, prev - 2));

      setTimeout(() => {
        setCards(prev => prev.map(c => 
          (c.id === card1.id || c.id === card2.id) ? { ...c, isError: false } : c
        ));
        setSelectedCards([]);
      }, 800);
    }
  };

  const finishGame = async (finalScore: number) => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    // Time bonus
    const timeBonus = Math.max(0, 30 - timeTaken) * 2;
    const totalScore = finalScore + timeBonus;

    setScore(totalScore);
    setGameOver(true);

    if (token) {
      try {
        await api.games.saveSession(token, {
          game_type: 'match',
          score: totalScore,
          metadata: { time_taken: timeTaken }
        });
      } catch (e) {
        console.error('Failed to save score', e);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent.purple} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={28} color={colors.text.secondary} />
        </TouchableOpacity>
        <View style={styles.scoreBoard}>
          <Ionicons name="star" size={20} color={colors.accent.blue} />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        <View style={styles.iconButton} />
      </View>

      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Ionicons name="trophy" size={80} color={colors.accent.pink} style={styles.trophyIcon} />
          <Text style={styles.gameOverTitle}>Тоглоом дууслаа!</Text>
          <Text style={styles.finalScore}>Нийт оноо: {score}</Text>
          
          <TouchableOpacity style={styles.playAgainBtn} onPress={loadGame}>
            <Text style={styles.playAgainText}>Дахин тоглох</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Буцах</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {cards.map(card => {
            const isSelected = selectedCards.find(c => c.id === card.id);
            
            let cardStyle = [styles.card];
            let textStyle = [styles.cardText];

            if (card.isMatched) {
              cardStyle.push(styles.cardMatched);
              textStyle.push(styles.textMatched);
            } else if (card.isError) {
              cardStyle.push(styles.cardError);
              textStyle.push(styles.textError);
            } else if (isSelected) {
              cardStyle.push(styles.cardSelected);
              textStyle.push(styles.textSelected);
            }

            if (card.type === 'hanzi') {
               textStyle.push({ ...typography.hanzi.sm, fontWeight: '500' } as any);
            }

            return (
              <TouchableOpacity
                key={card.id}
                style={cardStyle}
                onPress={() => handleCardPress(card)}
                activeOpacity={0.7}
              >
                <Text style={textStyle} numberOfLines={3} adjustsFontSizeToFit>
                  {card.content}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
    marginBottom: spacing.xl,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreBoard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  scoreText: {
    ...typography.heading.md,
    color: colors.text.primary,
    marginLeft: spacing.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    margin: CARD_MARGIN,
    backgroundColor: colors.bg.card,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
    borderWidth: 2,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardSelected: {
    borderColor: colors.accent.blue,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    transform: [{ scale: 1.05 }],
  },
  cardMatched: {
    opacity: 0,
  },
  cardError: {
    borderColor: colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  cardText: {
    ...typography.body.md,
    color: colors.text.primary,
    textAlign: 'center',
  },
  textSelected: {
    color: colors.text.primary,
  },
  textMatched: {
    opacity: 0,
  },
  textError: {
    color: colors.error,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  trophyIcon: {
    marginBottom: spacing.lg,
  },
  gameOverTitle: {
    ...typography.heading.xl,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  finalScore: {
    ...typography.heading.md,
    color: colors.accent.blue,
    marginBottom: spacing.xxl,
  },
  playAgainBtn: {
    backgroundColor: colors.accent.purple,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  playAgainText: {
    ...typography.heading.sm,
    color: colors.text.primary,
  },
  backBtn: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backText: {
    ...typography.heading.sm,
    color: colors.text.secondary,
  },
});
