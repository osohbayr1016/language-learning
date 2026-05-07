import { request, buildQuery } from './client';
import type { Word } from '../types';

export type Course = {
  id: number;
  title_mn: string;
  title_zh: string | null;
  description_mn: string | null;
  thumbnail_url: string | null;
  hsk_level: number | null;
  word_count: number;
  is_published: boolean;
};

export const courses = {
  list: (hsk?: number) =>
    request<{ data: Course[] }>(`/api/courses${buildQuery({ hsk })}`),
  get: (id: number) =>
    request<{ data: Course & { lessons: { id: number; title_mn: string; word_count: number }[] } }>(
      `/api/courses/${id}`
    ),
  words: (id: number) =>
    request<{ data: Word[] }>(`/api/courses/${id}/words`),
};
