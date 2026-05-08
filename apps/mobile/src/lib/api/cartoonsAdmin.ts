import { getApiBase, request } from './client';
import { pickCartoonBinary } from './cartoonPick';

export async function uploadCartoonRaw(
  token: string,
  filename: string,
  kind: 'video' | 'thumbnail',
  buffer: ArrayBuffer,
  contentType: string
): Promise<{ key: string; url: string }> {
  const base = getApiBase();
  const qs = new URLSearchParams({
    filename: filename || 'upload',
    kind,
  });
  const res = await fetch(`${base}/api/cartoons/upload?${qs}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': contentType,
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
  const parsed = JSON.parse(text) as { data?: { key: string; url: string } };
  const key = parsed.data?.key;
  const url = parsed.data?.url;
  if (!key || !url) throw new Error('Хариу буруу');
  return { key, url };
}

export async function uploadCartoonWithPicker(token: string, kind: 'video' | 'thumbnail') {
  const picked = await pickCartoonBinary(kind);
  return uploadCartoonRaw(token, picked.filename, kind, picked.buffer, picked.mime);
}

export const cartoonsAdmin = {
  create: (
    token: string,
    body: {
      title_mn: string;
      description_mn?: string;
      video_key: string;
      thumbnail_key?: string;
      hsk_level?: number;
      duration_s?: number;
      is_published?: boolean;
    }
  ) =>
    request<{ data: { id: number }; message: string }>('/api/cartoons', {
      method: 'POST',
      token,
      body: JSON.stringify({
        ...body,
        is_published: body.is_published !== false,
      }),
    }),

  update: (
    token: string,
    id: number,
    body: Partial<{
      title_mn: string;
      description_mn: string;
      thumbnail_key: string | null;
      hsk_level: number;
      duration_s: number;
      is_published: boolean;
    }>
  ) =>
    request<{ message: string }>(`/api/cartoons/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(body),
    }),

  attachWords: (
    token: string,
    id: number,
    items: { word_id: number; start_s: number; end_s: number }[]
  ) =>
    request<{ message: string }>(`/api/cartoons/${id}/words`, {
      method: 'POST',
      token,
      body: JSON.stringify({ items }),
    }),

  remove: (token: string, id: number) =>
    request<{ message: string }>(`/api/cartoons/${id}`, { method: 'DELETE', token }),

  uploadRaw: uploadCartoonRaw,
  uploadWithPicker: uploadCartoonWithPicker,
};
