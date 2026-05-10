import { Redirect } from 'expo-router';

/** `/lessons` without id — web URL must match the Study tab path, not group segments. */
export default function LessonsIndexRedirect() {
  return <Redirect href="/study" />;
}
