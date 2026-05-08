import { request, buildQuery } from './client';
import type { Word, WordWithProgress } from '../types';

export const words = {
  list: (
    params: { hsk?: number; limit?: number; offset?: number; q?: string; single_char?: number } = {}
  ) =>
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
  update: (token: string, id: number, body: Partial<Word>) =>
    request<{ message: string }>(`/api/words/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(body),
    }),
  remove: (token: string, id: number) =>
    request<{ message: string }>(`/api/words/${id}`, { method: 'DELETE', token }),
  createFull: (token: string, body: Record<string, unknown>) =>
    request<{ data: { id: number } }>('/api/words', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
};
