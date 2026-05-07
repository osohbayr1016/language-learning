import { request, buildQuery } from './client';
import type { Word, WordWithProgress } from '../types';

export const words = {
  list: (params: { hsk?: number; limit?: number; offset?: number; q?: string } = {}) =>
    request<{ data: Word[]; total: number; has_more: boolean }>(
      `/api/words${buildQuery(params)}`
    ),
  get: (id: number) =>
    request<{ data: Word }>(`/api/words/${id}`),
  due: (token: string, limit = 20) =>
    request<{ data: WordWithProgress[] }>(
      `/api/words/due${buildQuery({ limit })}`,
      { token }
    ),
};
