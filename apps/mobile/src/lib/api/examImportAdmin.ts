import { getApiBase, request } from './client';

export function inferExamAudioContentType(filename: string, mimeHint?: string | null): string {
  const lower = filename.toLowerCase();
  const m = mimeHint?.trim();
  if (m && m.startsWith('audio/')) return m;
  if (lower.endsWith('.mp3')) return 'audio/mpeg';
  if (lower.endsWith('.wav') || lower.endsWith('.wave')) return 'audio/wav';
  return m || 'audio/wav';
}

export async function uploadExamAudioRaw(
  token: string,
  filename: string,
  buffer: ArrayBuffer,
  contentType: string
): Promise<{ key: string }> {
  const base = getApiBase();
  const fn = filename || 'listening.wav';
  const ct = inferExamAudioContentType(fn, contentType || undefined);
  const qs = new URLSearchParams({ filename: fn });
  const res = await fetch(`${base}/api/admin/exams/upload-audio?${qs}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': ct,
    },
    body: buffer,
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (typeof j?.error === 'string' && j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const parsed = JSON.parse(text) as { data?: { key: string } };
  const key = parsed.data?.key;
  if (!key) throw new Error('Хариу буруу (audio upload)');
  return { key };
}

export const examImportAdmin = {
  uploadExamAudioRaw,
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
    request<{ data: { template_id: number } }>('/api/admin/exams/import', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
};
