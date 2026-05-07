import { useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import type { GameSessionBody } from '../lib/api/games';

export function useGameSession() {
  const { token } = useAuth();
  const { addLocalXp, refresh } = useGamification();

  const save = useCallback(
    async (body: GameSessionBody) => {
      if (!token) return;
      try {
        await api.games.saveSession(token, body);
        addLocalXp(body.xp_earned);
        void refresh();
      } catch (e) {
        console.warn('game session save failed', e);
      }
    },
    [token, addLocalXp, refresh]
  );

  return { save };
}
