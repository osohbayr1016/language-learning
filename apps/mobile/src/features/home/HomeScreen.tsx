import React, { useEffect, useState } from 'react';
import { Screen } from '../../primitives';
import { useGamification } from '../../context/GamificationContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { HomeHeader } from './HomeHeader';
import { HomeLearnedLexiconSection } from './HomeLearnedLexiconSection';
import { DailyGoalCard } from './DailyGoalCard';
import { LearnCurriculumSection } from '../study/LearnCurriculumSection';
import { mn } from '../../i18n/mn';
import { LeaderboardPreview } from './LeaderboardPreview';

export default function HomeScreen() {
  const { stats, streak, dailyGoal, refresh } = useGamification();
  const { token } = useAuth();
  const [name, setName] = useState('Сурагч');

  useEffect(() => {
    void refresh();
    if (!token) return;
    void (async () => {
      try {
        const p = await api.user.profile(token);
        setName(p.data.display_name || 'Сурагч');
      } catch {
        /* ignore */
      }
    })();
  }, [refresh, token]);

  return (
    <Screen scroll scrollBottomInset={70}>
      <HomeHeader name={name} streak={streak?.current_streak ?? 0} />
      <HomeLearnedLexiconSection />
      <DailyGoalCard totalXp={stats?.total_xp ?? 0} goal={dailyGoal} />
      <LearnCurriculumSection showContinue listTitle={mn.home.learnLessonsTitle} />
      <LeaderboardPreview />
    </Screen>
  );
}
