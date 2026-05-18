import { request } from './client';

export type GameType = 'match' | 'translate' | 'sentence' | 'stroke' | 'writer' | 'arrange';

export type GameSessionBody = {
  game_type: GameType;
  score: number;
  accuracy: number;
  duration_seconds: number;
  words_practiced: number;
  xp_earned: number;
  lesson_id?: number | null;
};

export type LeaderboardRow = {
  user_id: number;
  display_name: string;
  avatar_url: string | null;
  total_xp: number;
  words_mastered: number;
  current_streak: number | null;
};

export const games = {
  saveSession: (token: string, body: GameSessionBody) =>
    request<{ message: string; data: { xp_earned: number } }>('/api/games/session', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
  history: (token: string, limit = 10) =>
    request<{ data: (GameSessionBody & { id: number; created_at: string })[] }>(
      `/api/games/history?limit=${limit}`,
      { token }
    ),
  leaderboard: (token: string) =>
    request<{ data: LeaderboardRow[] }>('/api/games/leaderboard', { token }),
};
