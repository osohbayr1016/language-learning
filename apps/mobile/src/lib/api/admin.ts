import { request, buildQuery } from './client';
import { adminPaths } from './adminPaths';

export type { AdminStats, AdminLesson, AdminChapter, LessonWordLink } from './adminPaths';

export type AdminUserRow = {
  id: number;
  email: string;
  display_name: string;
  is_admin: number;
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
  textbook_unit?: string | null;
};

export type AdminBulkResultRow =
  | { ok: true; id: number; hanzi: string }
  | { ok: true; skipped: true; hanzi: string }
  | { ok: false; hanzi: string; error: string };

export type AdminBulkValidateRow =
  | { ok: true; hanzi: string; strokeCount: number }
  | { ok: false; hanzi: string; error: string };

export const adminApi = {
  ...adminPaths,
  users: (token: string, params: { limit?: number; offset?: number } = {}) =>
    request<{ data: AdminUserRow[] }>(`/api/admin/users${buildQuery(params)}`, { token }),
  validateWordsBulk: (
    token: string,
    body: { words: AdminCreateWordBody[]; hsk_level?: number; textbook_unit?: string | null }
  ) =>
    request<{ data: { results: AdminBulkValidateRow[] } }>('/api/admin/words/bulk/validate', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
  createWordsBulk: (
    token: string,
    body: {
      words: AdminCreateWordBody[];
      hsk_level?: number;
      textbook_unit?: string | null;
      duplicate_policy?: 'fail' | 'skip';
    }
  ) =>
    request<{ data: { results: AdminBulkResultRow[] } }>('/api/admin/words/bulk', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
  createWord: (token: string, body: AdminCreateWordBody & { reject_duplicate?: boolean }) =>
    request<{ data: { id: number }; message: string }>('/api/admin/words', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
};
