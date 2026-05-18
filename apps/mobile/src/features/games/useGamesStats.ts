import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import type { GameSessionBody, GameType } from '../../lib/api/games';

export type GameSessionRow = GameSessionBody & { id: number; created_at: string };

export type GamesStats = {
  total: number;
  bestByType: Record<GameType, number>;
  lastPlayed: GameSessionRow | null;
  avgAccuracy: number;
  recent: GameSessionRow[];
};

const EMPTY: GamesStats = {
  total: 0,
  bestByType: { match: 0, translate: 0, sentence: 0, stroke: 0, writer: 0, arrange: 0 },
  lastPlayed: null,
  avgAccuracy: 0,
  recent: [],
};

function reduce(rows: GameSessionRow[]): GamesStats {
  if (rows.length === 0) return EMPTY;
  const best: Record<GameType, number> = { ...EMPTY.bestByType };
  let sumAcc = 0;
  for (const r of rows) {
    if (r.score > (best[r.game_type] ?? 0)) best[r.game_type] = r.score;
    sumAcc += r.accuracy ?? 0;
  }
  const sorted = [...rows].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return {
    total: rows.length,
    bestByType: best,
    lastPlayed: sorted[0] ?? null,
    avgAccuracy: sumAcc / rows.length,
    recent: sorted.slice(0, 5),
  };
}

export function useGamesStats() {
  const { token } = useAuth();
  const [data, setData] = useState<GamesStats>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) {
      setData(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.games.history(token, 50);
      setData(reduce((res.data ?? []) as GameSessionRow[]));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { data, loading, error, refresh };
}
