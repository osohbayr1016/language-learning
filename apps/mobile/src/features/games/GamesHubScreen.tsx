import React from 'react';
import { Screen } from '../../primitives';
import { GamesHubHeader } from './GamesHubHeader';
import { GamesHero } from './GamesHero';
import { GamesStatsStrip } from './GamesStatsStrip';
import { GameModeGrid } from './GameModeGrid';
import { useGamesStats } from './useGamesStats';

export default function GamesHubScreen() {
  const { data } = useGamesStats();

  return (
    <Screen scroll scrollBottomInset={70}>
      <GamesHubHeader />
      <GamesHero lastPlayed={data.lastPlayed} />
      <GamesStatsStrip data={data} />
      <GameModeGrid stats={data} />
    </Screen>
  );
}
