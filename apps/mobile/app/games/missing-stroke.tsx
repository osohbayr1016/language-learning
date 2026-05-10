import { Redirect } from 'expo-router';

/** «Дутуу зураас» advertised name → `games/stroke`. */
export default function GamesMissingStrokeRedirect() {
  return <Redirect href="/games/stroke" />;
}
