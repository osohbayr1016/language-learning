import { useLocalSearchParams } from 'expo-router';
import TranslateScreen from '../../src/features/games/translate/TranslateScreen';
import { lessonIdFromParams } from './lessonRouteParams';

export default function TranslateRoute() {
  const p = useLocalSearchParams();
  return <TranslateScreen lessonId={lessonIdFromParams(p)} />;
}
