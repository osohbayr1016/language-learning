import { request, buildQuery } from './client';
import type { DayMinutes, InsightsSkills, InsightsSummary } from '../types';

export const insights = {
  summary: (token: string) =>
    request<{ data: InsightsSummary }>('/api/insights/summary', { token }),
  skills: (token: string) =>
    request<{ data: InsightsSkills }>('/api/insights/skills', { token }),
  calendar: (token: string, from: string, to: string) =>
    request<{ data: DayMinutes[] }>(
      `/api/insights/calendar${buildQuery({ from, to })}`,
      { token }
    ),
  timeSpent: (token: string, end: string) =>
    request<{ data: DayMinutes[] }>(
      `/api/insights/time-spent${buildQuery({ end })}`,
      { token }
    ),
};
