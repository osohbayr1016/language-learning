import { request } from './client';

export type GrammarRow = {
  id: number;
  title_mn: string;
  title_jp: string;
  grammar_point: string;
  jlpt_level: number;
  order_num: number;
  best_accuracy?: number | null;
  progress_completed_at?: string | null;
  exercise_count: number;
};

export type GrammarExercise = {
  id: number;
  exercise_type: string;
  question_jp: string;
  question_mn: string;
  options: unknown[];
  explanation_mn: string;
  order_num: number;
};

export type GrammarDetail = {
  id: number;
  title_mn: string;
  title_jp: string;
  grammar_point: string;
  explanation_mn: string;
  pattern: string;
  examples: unknown;
  jlpt_level: number;
  order_num: number;
  progress: { best_accuracy?: number; completed_at?: string | null } | null;
  exercises: GrammarExercise[];
};

export const grammar = {
  list: (token: string) => request<{ data: GrammarRow[] }>('/api/grammar', { token }),
  get: (token: string, id: number) => request<{ data: GrammarDetail }>(`/api/grammar/${id}`, { token }),
  complete: (token: string, id: number, answers: Record<number, string | boolean>) =>
    request<{ ok: boolean; accuracy: number; graded: number; total: number }>(
      `/api/grammar/${id}/complete`,
      { method: 'POST', token, body: JSON.stringify({ answers }) }
    ),
};
