import { Redirect } from 'expo-router';

/** Deep-link alias: plural path used in audits / bookmarks → canonical route. */
export default function StudyFlashcardsRedirect() {
  return <Redirect href="/study/flashcard" />;
}
