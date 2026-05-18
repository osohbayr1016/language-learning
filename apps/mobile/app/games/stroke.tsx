import { useLocalSearchParams } from 'expo-router';
import StrokeScreen from '../../src/features/games/stroke/StrokeScreen';
import { lessonIdFromParams } from './lessonRouteParams';

export default function StrokeRoute() {
  const lessonId = lessonIdFromParams(useLocalSearchParams());
  return <StrokeScreen lessonId={lessonId ?? undefined} />;
}
