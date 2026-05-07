import { getApiBase } from './client';

export const audio = {
  url: (wordId: number, speed: 'normal' | 'slow' = 'normal') =>
    `${getApiBase()}/api/audio/${wordId}?speed=${speed}`,
};
