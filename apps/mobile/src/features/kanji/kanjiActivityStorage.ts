import AsyncStorage from '@react-native-async-storage/async-storage';

export type KanjiActivityKey = 'listen' | 'write' | 'sentence';

export function kanjiActivitiesStorageKey(wordId: number) {
  return `kanji_activity_progress_${wordId}`;
}

export async function loadKanjiActivities(wordId: number): Promise<Set<KanjiActivityKey>> {
  try {
    const raw = await AsyncStorage.getItem(kanjiActivitiesStorageKey(wordId));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as KanjiActivityKey[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export async function saveKanjiActivities(wordId: number, set: Set<KanjiActivityKey>) {
  try {
    await AsyncStorage.setItem(kanjiActivitiesStorageKey(wordId), JSON.stringify([...set]));
  } catch {}
}

export async function clearKanjiActivities(wordId: number) {
  try {
    await AsyncStorage.removeItem(kanjiActivitiesStorageKey(wordId));
  } catch {}
}

export async function addKanjiActivity(wordId: number, key: KanjiActivityKey): Promise<void> {
  const next = await loadKanjiActivities(wordId);
  next.add(key);
  await saveKanjiActivities(wordId, next);
}
