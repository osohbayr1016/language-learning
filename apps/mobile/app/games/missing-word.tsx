import { Redirect } from 'expo-router';

/** «Дутуу үг» advertised name → `games/sentence`. */
export default function GamesMissingWordRedirect() {
  return <Redirect href="/games/sentence" />;
}
