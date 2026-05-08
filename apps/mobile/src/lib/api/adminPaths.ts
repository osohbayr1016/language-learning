import { request } from './client';

export type AdminStats = {
  users: number;
  words: number;
  chapters_total: number;
  chapters_published: number;
  chapters_draft: number;
  lessons_total: number;
  lessons_published: number;
  lessons_draft: number;
  lesson_completions: number;
  lesson_completions_last_7_days: number;
  game_sessions: number;
  cartoons: number;
  lesson_word_links: number;
  distinct_hanzi: number;
  /** keys "1" … "6" */
  words_by_hsk: Record<string, number>;
  chapters_by_hsk: Record<string, number>;
  lessons_by_hsk: Record<string, number>;
};

export type AdminLesson = {
  id: number;
  chapter_id: number;
  title_mn: string;
  subtitle_mn: string;
  icon: string;
  order_num: number;
  is_published: number;
  word_count: number;
};

export type AdminChapter = {
  id: number;
  title_mn: string;
  subtitle_mn: string;
  color: string;
  hsk_level: number;
  order_num: number;
  is_published: number;
  flashcard_delay_days: number;
  lessons: AdminLesson[];
};

export type LessonWordLink = {
  link_id: number;
  lesson_id: number;
  word_id: number;
  order_num: number;
  hanzi: string;
  pinyin: string;
  meaning_mn: string;
  hsk_level: number;
};

export const adminPaths = {
  stats: (token: string) => request<{ data: AdminStats }>('/api/admin/stats', { token }),
  lessonTree: (token: string) => request<{ data: AdminChapter[] }>('/api/admin/lesson-tree', { token }),

  patchChapter: (
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
    request<{ message: string }>(`/api/admin/chapters/${id}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(body),
    }),

  createLesson: (
    token: string,
    body: { chapter_id: number; title_mn: string; subtitle_mn?: string; order_num?: number }
  ) =>
    request<{ data: { id: number } }>('/api/admin/lessons', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),

  patchLesson: (
    token: string,
    id: number,
    body: Partial<{
      title_mn: string;
      subtitle_mn: string;
      icon: string;
      order_num: number;
      is_published: number;
      chapter_id: number;
    }>
  ) =>
    request<{ message: string }>(`/api/admin/lessons/${id}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(body),
    }),

  deleteLesson: (token: string, id: number) =>
    request<{ message: string }>(`/api/admin/lessons/${id}`, { method: 'DELETE', token }),

  lessonWords: (token: string, lessonId: number) =>
    request<{ data: LessonWordLink[] }>(`/api/admin/lessons/${lessonId}/words`, { token }),

  addLessonWord: (token: string, lessonId: number, word_id: number) =>
    request<{ message: string }>(`/api/admin/lessons/${lessonId}/words`, {
      method: 'POST',
      token,
      body: JSON.stringify({ word_id }),
    }),

  removeLessonWord: (token: string, lessonId: number, wordId: number) =>
    request<{ message: string }>(`/api/admin/lessons/${lessonId}/words/${wordId}`, {
      method: 'DELETE',
      token,
    }),

  reorderLessonWords: (token: string, lessonId: number, word_ids: number[]) =>
    request<{ message: string }>(`/api/admin/lessons/${lessonId}/words/order`, {
      method: 'PUT',
      token,
      body: JSON.stringify({ word_ids }),
    }),
};
