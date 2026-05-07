const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers as Record<string, string> ?? {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }

  return data as T;
}

export const api = {
  // AUTH
  auth: {
    register: (body: { email: string; password: string; display_name: string }) =>
      request<{ data: { access_token: string; refresh_token: string; expires_in: number } }>(
        '/api/auth/register', { method: 'POST', body: JSON.stringify(body) }
      ),
    login: (body: { email: string; password: string }) =>
      request<{ data: { access_token: string; refresh_token: string; expires_in: number } }>(
        '/api/auth/login', { method: 'POST', body: JSON.stringify(body) }
      ),
    refresh: (refresh_token: string) =>
      request<{ data: { access_token: string; expires_in: number } }>(
        '/api/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token }) }
      ),
    logout: (refresh_token: string) =>
      request('/api/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token }) }),
  },

  // USER
  user: {
    dashboard: (token: string) =>
      request<{ data: any }>('/api/user/dashboard', { token }),
    profile: (token: string) =>
      request<{ data: any }>('/api/user/profile', { token }),
    streak: (token: string) =>
      request<{ data: any }>('/api/user/streak', { token }),
    stats: (token: string) =>
      request<{ data: any }>('/api/user/stats', { token }),
    dueWords: (token: string, limit = 20) =>
      request<{ data: any[] }>(`/api/user/due-words?limit=${limit}`, { token }),
    saveProgress: (token: string, body: any) =>
      request('/api/user/progress', { method: 'POST', token, body: JSON.stringify(body) }),
  },

  // WORDS
  words: {
    list: (params: { hsk?: number; limit?: number; offset?: number; q?: string } = {}) => {
      const filtered = Object.entries(params).filter(([, v]) => v != null) as [string, string | number][];
      const record: Record<string, string> = {};
      filtered.forEach(([k, v]) => { record[k] = String(v); });
      const qs = new URLSearchParams(record).toString();
      return request<{ data: any[]; total: number; has_more: boolean }>(`/api/words?${qs}`);
    },
    get: (id: number) => request<{ data: any }>(`/api/words/${id}`),
  },

  // AUDIO
  audio: {
    url: (wordId: number, speed: 'normal' | 'slow' = 'normal') =>
      `${API_BASE}/api/audio/${wordId}?speed=${speed}`,
  },

  // COURSES
  courses: {
    list: (hsk?: number) =>
      request<{ data: any[] }>(`/api/courses${hsk ? `?hsk=${hsk}` : ''}`),
    get: (id: number) =>
      request<{ data: any }>(`/api/courses/${id}`),
    words: (id: number) =>
      request<{ data: any[] }>(`/api/courses/${id}/words`),
  },

  // GAMES
  games: {
    saveSession: (token: string, body: any) =>
      request('/api/games/session', { method: 'POST', token, body: JSON.stringify(body) }),
    leaderboard: (token: string) =>
      request<{ data: any[] }>('/api/games/leaderboard', { token }),
  },
};
