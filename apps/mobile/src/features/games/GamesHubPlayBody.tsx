import React from 'react';
import type { GameType } from '../../lib/api/games';
import ArrangeHanziScreen from './arrange/ArrangeHanziScreen';
import MatchScreen from './match/MatchScreen';
import SentenceScreen from './sentence/SentenceScreen';
import StrokeScreen from './stroke/StrokeScreen';
import TranslateScreen from './translate/TranslateScreen';

type Props = {
  gameKey: GameType;
  lessonId: number;
};

export function GamesHubPlayBody({ gameKey, lessonId }: Props) {
  const lid = String(lessonId);
  switch (gameKey) {
    case 'match':
      return <MatchScreen lessonId={lid} />;
    case 'translate':
      return <TranslateScreen lessonId={lid} />;
    case 'sentence':
      return <SentenceScreen lessonId={lid} />;
    case 'arrange':
      return <ArrangeHanziScreen lessonId={lid} />;
    case 'stroke':
      return <StrokeScreen lessonId={lid} />;
    default:
      return <MatchScreen lessonId={lid} />;
  }
}
