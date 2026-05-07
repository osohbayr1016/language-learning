import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import type { DayMinutes, InsightsSkills, InsightsSummary } from '../../lib/types';
import { firstOfMonth, lastOfMonth, ymd } from './dates';

export type InsightsData = {
  summary: InsightsSummary | null;
  skills: InsightsSkills | null;
  calendar: DayMinutes[];
  week: DayMinutes[];
};

const EMPTY: InsightsData = {
  summary: null,
  skills: null,
  calendar: [],
  week: [],
};

export function useInsights(month: Date, weekEnd: Date) {
  const { token } = useAuth();
  const [data, setData] = useState<InsightsData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const from = ymd(firstOfMonth(month));
      const to = ymd(lastOfMonth(month));
      const end = ymd(weekEnd);
      const [s, sk, cal, wk] = await Promise.all([
        api.insights.summary(token),
        api.insights.skills(token),
        api.insights.calendar(token, from, to),
        api.insights.timeSpent(token, end),
      ]);
      setData({
        summary: s.data,
        skills: sk.data,
        calendar: cal.data,
        week: wk.data,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown');
    } finally {
      setLoading(false);
    }
  }, [token, month, weekEnd]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
