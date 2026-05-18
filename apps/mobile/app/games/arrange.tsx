import { useLocalSearchParams } from 'expo-router';
import ArrangeHanziScreen from '../../src/features/games/arrange/ArrangeHanziScreen';
import { lessonIdFromParams } from './lessonRouteParams';

export default function ArrangeRoute() {
  const lid = lessonIdFromParams(useLocalSearchParams());
  return <ArrangeHanziScreen lessonId={lid} />;
}
