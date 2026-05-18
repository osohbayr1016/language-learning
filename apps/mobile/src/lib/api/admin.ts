import { request, buildQuery } from './client';
import { postFormDataWithUploadProgress } from './formDataUploadProgress';
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

export type LessonHtmlPreview = {
  external_lesson_id: string;
  title_cn: string;
  title_mn: string;
  source: string;
  vocab_count: number;
  dialogue_count: number;
  grammar_count: number;
  workbook_count: number;
  warnings: string[];
};

export type LessonHtmlImportResult = LessonHtmlPreview & {
  lesson_id: number;
  inserted_words: number;
  reused_words: number;
  linked_words: number;
};

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
  previewLessonHtml: (token: string, html: string) =>
    request<{ data: LessonHtmlPreview }>('/api/admin/lessons/import-html/preview', {
      method: 'POST',
      token,
      body: JSON.stringify({ html }),
    }),
  importLessonHtml: (
    token: string,
    body: { html: string; chapter_id: number; is_published?: boolean }
  ) =>
    request<{ data: LessonHtmlImportResult }>('/api/admin/lessons/import-html', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
  previewLessonPackageZip: (token: string, formData: FormData) =>
    request<{ data: LessonHtmlPreview }>('/api/admin/lessons/import-zip/preview', {
      method: 'POST',
      token,
      body: formData as unknown as RequestInit['body'],
    }),
  importLessonPackageZip: (token: string, formData: FormData) =>
    request<{ data: LessonHtmlImportResult }>('/api/admin/lessons/import-zip', {
      method: 'POST',
      token,
      body: formData as unknown as RequestInit['body'],
    }),
  /** ZIP → server preview with upload % (XHR). */
  previewLessonPackageZipWithProgress: (
    token: string,
    buildBody: () => FormData | Promise<FormData>,
    onProgress?: (percent: number) => void
  ) =>
    postFormDataWithUploadProgress<{ data: LessonHtmlPreview }>({
      path: '/api/admin/lessons/import-zip/preview',
      token,
      buildBody,
      onProgress,
    }),
  /** ZIP → full import with upload % (XHR). */
  importLessonPackageZipWithProgress: (
    token: string,
    buildBody: () => FormData | Promise<FormData>,
    onProgress?: (percent: number) => void
  ) =>
    postFormDataWithUploadProgress<{ data: LessonHtmlImportResult }>({
      path: '/api/admin/lessons/import-zip',
      token,
      buildBody,
      onProgress,
    }),
};
