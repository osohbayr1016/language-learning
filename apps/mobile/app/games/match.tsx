import { useLocalSearchParams } from 'expo-router';
import MatchScreen from '../../src/features/games/match/MatchScreen';
import { lessonIdFromParams } from './lessonRouteParams';

export default function MatchRoute() {
  const p = useLocalSearchParams();
  return <MatchScreen lessonId={lessonIdFromParams(p)} />;
}
