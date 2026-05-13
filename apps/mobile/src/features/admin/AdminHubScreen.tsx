import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { mn } from '../../i18n/mn';
import { api } from '../../lib/api';
import type { AdminStats } from '../../lib/api/admin';
import { colors, radius, spacing, typography } from '../../theme';
import { AdminHubStatsStrip } from './AdminHubStatsStrip';

const { width } = Dimensions.get('window');
const cardMargin = spacing.sm;
const cardWidth = (width - spacing.lg * 2 - cardMargin) / 2;

type BentoCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  href: any;
  fullWidth?: boolean;
};

function BentoCard({ title, icon, color, href, fullWidth }: BentoCardProps) {
  const router = useRouter();
  
  return (
    <Pressable
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        styles.card,
        fullWidth ? styles.cardFull : styles.cardHalf,
        pressed && styles.cardPressed
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </Pressable>
  );
}

export function AdminHubScreen() {
  const { token } = useAuth();
  const [hubStats, setHubStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void api.admin
      .stats(token)
      .then((r) => {
        if (!cancelled) setHubStats(r.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setHubStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Нэвтэрсний дараа дахин оролдоно уу.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>{mn.admin.hubTitle}</Text>
        <Text style={styles.intro}>{mn.admin.hubIntro}</Text>
      </View>

      <AdminHubStatsStrip stats={hubStats} />

      <View style={styles.grid}>
        {/* Main large actions */}
        <BentoCard 
          title="Үгийн сан" 
          icon="library" 
          color={colors.hsk[3]} 
          href="/admin/vocabulary" 
        />
        
        <BentoCard 
          title="Шинэ үг" 
          icon="add-circle" 
          color={colors.accent.teal} 
          href="/admin/words/new" 
        />
        
        <BentoCard 
          title="Суралцах зам" 
          icon="git-branch" 
          color={colors.hsk[2]} 
          href="/admin/learning-path" 
        />
        
        <BentoCard 
          title="HSK 1 Хичээл" 
          icon="list-circle" 
          color={colors.brand.primary} 
          href="/admin/hsk1-lessons" 
        />
        
        <BentoCard 
          title="Олноор оруулах" 
          icon="copy" 
          color={colors.accent.purple} 
          href="/admin/words" 
        />
        
        <BentoCard 
          title="Хэрэглэгчид" 
          icon="people" 
          color={colors.text.secondary} 
          href="/admin/users" 
        />
        
        <BentoCard 
          title="Хүүхэлдэй" 
          icon="film" 
          color={colors.accent.amber} 
          href="/admin/cartoons" 
        />

        <BentoCard 
          title="Шалгалт (PDF)" 
          icon="document-text" 
          color={colors.brand.secondary} 
          href="/admin/exam-import" 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.bg.secondary,
    flexGrow: 1,
    gap: spacing.lg,
  },
  header: {
    gap: 4,
  },
  title: { 
    ...typography.heading.xl, 
    color: colors.text.primary,
    fontWeight: '800',
  },
  intro: {
    ...typography.body.md,
    color: colors.text.secondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cardMargin,
  },
  card: {
    backgroundColor: colors.bg.primary,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHalf: {
    width: cardWidth,
  },
  cardFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.heading.sm,
    color: colors.text.primary,
    fontWeight: '700',
    flex: 1,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: spacing.lg, 
    backgroundColor: colors.bg.secondary 
  },
  muted: { 
    ...typography.body.md, 
    color: colors.text.muted, 
    textAlign: 'center' 
  },
});
