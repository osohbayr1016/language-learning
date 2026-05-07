import { request } from './client';
import type { Chapter, LessonDetail, SkillKey } from '../types';
import type { ProgressResult } from './user';

export type LessonCompleteBody = {
  accuracy: number;
  xp_earned: number;
  duration_seconds?: number;
  results?: ProgressResult[];
  skill_results?: Partial<Record<SkillKey, { hits: number; total: number }>>;
};

export const lessons = {
  catalog: () => request<{ data: Chapter[] }>('/api/lessons/catalog'),
  list: (token: string) =>
    request<{ data: Chapter[] }>('/api/lessons', { token }),
  get: (token: string, id: number) =>
    request<{ data: LessonDetail }>(`/api/lessons/${id}`, { token }),
  complete: (token: string, id: number, body: LessonCompleteBody) =>
    request<{ message: string; data: { lesson_id: number; accuracy: number; xp_earned: number } }>(
      `/api/lessons/${id}/complete`,
      { method: 'POST', token, body: JSON.stringify(body) }
    ),
};
