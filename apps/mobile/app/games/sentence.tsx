import { useLocalSearchParams } from 'expo-router';
import SentenceScreen from '../../src/features/games/sentence/SentenceScreen';
import { lessonIdFromParams } from './lessonRouteParams';

export default function SentenceRoute() {
  const p = useLocalSearchParams();
  return <SentenceScreen lessonId={lessonIdFromParams(p)} />;
}
