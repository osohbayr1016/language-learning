import { request, buildQuery } from './client';
import { adminPaths } from './adminPaths';

export type { AdminStats, AdminLesson, AdminChapter, LessonWordLink } from './adminPaths';

export type AdminUserRow = {
  id: number;
  email: string;
  display_name: string;
  is_admin: number;
  premium_until: string | null;
  created_at: string;
};

export type AdminCreateWordBody = {
  hanzi: string;
  pinyin: string;
  meaning_mn: string;
  meaning_en?: string;
  hsk_level?: number;
  part_of_speech?: string;
  example_zh?: string;
  example_pinyin?: string;
  example_mn?: string;
};

export const adminApi = {
  ...adminPaths,
  users: (token: string, params: { limit?: number; offset?: number } = {}) =>
    request<{ data: AdminUserRow[] }>(`/api/admin/users${buildQuery(params)}`, { token }),
  extendPremium: (token: string, userId: number, extend_months = 1) =>
    request<{ message: string; data?: { premium_until: string } }>(
      `/api/admin/users/${userId}`,
      { method: 'PATCH', token, body: JSON.stringify({ extend_months }) }
    ),
  createWord: (token: string, body: AdminCreateWordBody) =>
    request<{ data: { id: number }; message: string }>('/api/admin/words', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
};
