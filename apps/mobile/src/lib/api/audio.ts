import { API_BASE } from './client';

export const audio = {
  url: (wordId: number, speed: 'normal' | 'slow' = 'normal') =>
    `${API_BASE}/api/audio/${wordId}?speed=${speed}`,
};
