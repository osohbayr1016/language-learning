import { Redirect } from 'expo-router';

/** Legacy alias: «Ханз бичих» used to link here — reuse stroke-writing screen. */
export default function StudyHanziRedirect() {
  return <Redirect href="/study/writer" />;
}
