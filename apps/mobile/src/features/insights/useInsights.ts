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

  // Depend on stable string keys; new Date objects with the same calendar
  // value would otherwise re-trigger the effect every render.
  const from = ymd(firstOfMonth(month));
  const to = ymd(lastOfMonth(month));
  const end = ymd(weekEnd);

  const refresh = useCallback(async () => {
    if (!token) {
      setData(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const [sRes, skRes, calRes, wkRes] = await Promise.allSettled([
      api.insights.summary(token),
      api.insights.skills(token),
      api.insights.calendar(token, from, to),
      api.insights.timeSpent(token, end),
    ]);
    setData({
      summary: sRes.status === 'fulfilled' ? sRes.value.data : null,
      skills: skRes.status === 'fulfilled' ? skRes.value.data : null,
      calendar: calRes.status === 'fulfilled' ? calRes.value.data : [],
      week: wkRes.status === 'fulfilled' ? wkRes.value.data : [],
    });
    setLoading(false);
  }, [token, from, to, end]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}
