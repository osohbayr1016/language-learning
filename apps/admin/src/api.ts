export const API_URL = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL ?? 'http://localhost:8787';

async function req<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...rest, headers: finalHeaders });
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data as T;
}

export type Course = {
  id: number;
  title_mn: string;
  title_zh: string;
  description_mn: string;
  hsk_level: number;
  thumbnail_url: string | null;
  video_url: string | null;
  is_published: number;
  created_at: string;
};

export type Cartoon = {
  id: number;
  title_mn: string;
  description_mn: string;
  thumbnail_url: string | null;
  hsk_level: number | null;
  duration_s: number;
  is_published: number;
  created_at: string;
};

export type Word = {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning_mn: string;
  hsk_level: number;
};

export const adminApi = {
  login: (body: { email: string; password: string }) =>
    req<{ data: { access_token: string; refresh_token: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  courses: {
    list: (token: string) => req<{ data: Course[] }>('/api/courses', { token }),
    create: (token: string, body: Partial<Course>) =>
      req<{ data: { id: number } }>('/api/courses', { method: 'POST', token, body: JSON.stringify(body) }),
  },
  cartoons: {
    list: () => req<{ data: Cartoon[] }>('/api/cartoons'),
    create: (token: string, body: Partial<Cartoon> & { video_key: string; thumbnail_key?: string }) =>
      req<{ data: { id: number } }>('/api/cartoons', { method: 'POST', token, body: JSON.stringify(body) }),
    attachWords: (token: string, id: number, items: { word_id: number; start_s: number; end_s: number }[]) =>
      req<{ message: string }>(`/api/cartoons/${id}/words`, {
        method: 'POST', token, body: JSON.stringify({ items }),
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
  words: {
    list: (q?: string, hsk?: number) => {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (hsk) params.append('hsk', String(hsk));
      return req<{ data: Word[] }>(`/api/words?${params.toString()}`);
    },
  },
};
