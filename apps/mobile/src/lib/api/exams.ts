import { request } from './client';

export type ExamTemplate = {
  id: number;
  title: string;
  hsk_level: number;
  total_questions: number;
  duration_minutes: number;
  passing_score: number;
  max_score: number;
};

export type ExamQuestion = {
  id: number;
  section: string;
  part_num: number;
  question_num: number;
  question_type: string;
  listen_zh?: string;
  scenario_mn?: string;
  question_zh?: string;
  question_pinyin?: string;
  options: unknown[];
  order_num?: number;
};

export const exams = {
  templates: (token: string) =>
    request<{
      data: ExamTemplate[];
      my_mock: { best_total_score: number; has_passed: boolean };
    }>('/api/exams/templates', { token }),

  start: (token: string, templateId: number) =>
    request<{
      data: {
        session_id: number;
        duration_minutes: number;
        questions: ExamQuestion[];
      };
    }>(`/api/exams/templates/${templateId}/start`, { method: 'POST', token }),

  submit: (
    token: string,
    sessionId: number,
    body: {
      answers: { question_id: number; answer: string | boolean }[];
      duration_seconds?: number;
    }
  ) =>
    request<{
      ok: boolean;
      data: {
        session_id: number;
        listening_score: number;
        reading_score: number;
        total_score: number;
        passing_score: number;
        passed: boolean;
      };
    }>(`/api/exams/sessions/${sessionId}/submit`, {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
};
