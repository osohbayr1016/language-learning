import { req, API_URL } from './net';
import type {
  AdminChapter,
  AdminStats,
  Cartoon,
  LessonWordRow,
  Word,
} from './types';

export const adminApi = {
  login: (body: { email: string; password: string }) =>
    req<{ data: { access_token: string; refresh_token: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** Confirms JWT is valid and `users.is_admin` — same check as `/api/admin/*` middleware. */
  profile: (token: string) =>
    req<{ data: { is_admin?: number } }>('/api/user/profile', { token }),

  stats: (token: string) => req<{ data: AdminStats }>('/api/admin/stats', { token }),
  lessonTree: (token: string) => req<{ data: AdminChapter[] }>('/api/admin/lesson-tree', { token }),

  users: {
    list: (token: string, params?: { limit?: number; offset?: number }) => {
      const q = new URLSearchParams();
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.offset) q.set('offset', String(params.offset));
      return req<{ data: unknown[] }>(`/api/admin/users?${q}`, { token });
    },
  },

  chapters: {
    patch: (
      token: string,
      id: number,
      body: Partial<{
        title_mn: string;
        subtitle_mn: string;
        color: string;
        hsk_level: number;
        order_num: number;
        is_published: number;
        flashcard_delay_days: number;
      }>
    ) =>
      req<{ message: string }>(`/api/admin/chapters/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(body),
      }),
    create: (
      token: string,
      body: {
        title_mn: string;
        subtitle_mn?: string;
        hsk_level?: number;
        order_num?: number;
        flashcard_delay_days?: number;
      }
    ) =>
      req<{ data: { id: number } }>('/api/admin/chapters', {
        method: 'POST',
        token,
        body: JSON.stringify(body),
      }),
  },

  lessons: {
    list: (token: string, chapterId: number) =>
      req<{ data: unknown[] }>(`/api/admin/lessons?chapter_id=${chapterId}`, { token }),
    create: (
      token: string,
      body: { chapter_id: number; title_mn: string; subtitle_mn?: string; order_num?: number }
    ) =>
      req<{ data: { id: number } }>('/api/admin/lessons', {
        method: 'POST',
        token,
        body: JSON.stringify(body),
      }),
    patch: (
      token: string,
      id: number,
      body: Partial<{ title_mn: string; subtitle_mn: string; icon: string; order_num: number; is_published: number }>
    ) =>
      req<{ message: string }>(`/api/admin/lessons/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(body),
      }),
    delete: (token: string, id: number) =>
      req<{ message: string }>(`/api/admin/lessons/${id}`, { method: 'DELETE', token }),
  },

  lessonWords: {
    list: (token: string, lessonId: number) =>
      req<{ data: LessonWordRow[] }>(`/api/admin/lessons/${lessonId}/words`, { token }),
    add: (token: string, lessonId: number, word_id: number) =>
      req<{ message: string }>(`/api/admin/lessons/${lessonId}/words`, {
        method: 'POST',
        token,
        body: JSON.stringify({ word_id }),
      }),
    reorder: (token: string, lessonId: number, word_ids: number[]) =>
      req<{ message: string }>(`/api/admin/lessons/${lessonId}/words/order`, {
        method: 'PUT',
        token,
        body: JSON.stringify({ word_ids }),
      }),
    remove: (token: string, lessonId: number, wordId: number) =>
      req<{ message: string }>(`/api/admin/lessons/${lessonId}/words/${wordId}`, {
        method: 'DELETE',
        token,
      }),
  },

  words: {
    list: (q?: string, hsk?: number, limit = 80, offset = 0) => {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (hsk) params.append('hsk', String(hsk));
      params.append('limit', String(limit));
      params.append('offset', String(offset));
      return req<{ data: Word[]; total: number }>(`/api/words?${params}`);
    },
    update: (token: string, id: number, body: Partial<Word>) =>
      req<{ message: string }>(`/api/words/${id}`, { method: 'PUT', token, body: JSON.stringify(body) }),
    delete: (token: string, id: number) =>
      req<{ message: string }>(`/api/words/${id}`, { method: 'DELETE', token }),
    createFull: (token: string, body: Record<string, unknown>) =>
      req<{ data: { id: number } }>('/api/words', { method: 'POST', token, body: JSON.stringify(body) }),
    createHanzi: (token: string, body: Record<string, unknown>) =>
      req<{ data: { id: number } }>('/api/admin/words', { method: 'POST', token, body: JSON.stringify(body) }),
  },

  cartoons: {
    list: () => req<{ data: Cartoon[] }>('/api/cartoons'),
    create: (token: string, body: Partial<Cartoon> & { video_key: string; thumbnail_key?: string }) =>
      req<{ data: { id: number } }>('/api/cartoons', { method: 'POST', token, body: JSON.stringify(body) }),
    attachWords: (token: string, id: number, items: { word_id: number; start_s: number; end_s: number }[]) =>
      req<{ message: string }>(`/api/cartoons/${id}/words`, {
        method: 'POST',
        token,
        body: JSON.stringify({ items }),
      }),
  },

  upload: async (token: string, file: File, kind: 'video' | 'thumbnail'): Promise<{ key: string; url: string }> => {
    const res = await fetch(
      `${API_URL}/api/cartoons/upload?filename=${encodeURIComponent(file.name)}&kind=${kind}`,
      { method: 'POST', headers: { 'Content-Type': file.type, Authorization: `Bearer ${token}` }, body: file }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Upload failed');
    return data.data;
  },

  importExam: (
    token: string,
    body: {
      title: string;
      hsk_level?: number;
      duration_minutes?: number;
      passing_score?: number;
      max_score?: number;
      is_published?: boolean;
      questions: Record<string, unknown>[];
    }
  ) =>
    req<{ data: { template_id: number } }>('/api/admin/exams/import', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),

  uploadExamAudio: async (token: string, file: File): Promise<{ key: string }> => {
    const lowered = file.name.toLowerCase();
    const inferred =
      file.type?.trim()?.startsWith('audio/')
        ? file.type
        : lowered.endsWith('.mp3')
          ? 'audio/mpeg'
          : lowered.endsWith('.wav') || lowered.endsWith('.wave')
            ? 'audio/wav'
            : 'audio/wav';
    const res = await fetch(
      `${API_URL}/api/admin/exams/upload-audio?filename=${encodeURIComponent(file.name)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': inferred,
          Authorization: `Bearer ${token}`,
        },
        body: file,
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Upload failed');
    return data.data;
  },
};
