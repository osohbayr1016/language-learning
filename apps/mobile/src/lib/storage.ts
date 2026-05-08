import { Platform } from 'react-native';

type SecureStoreModule = typeof import('expo-secure-store');

let secureStore: SecureStoreModule | null = null;
if (Platform.OS !== 'web') {
  try {
    secureStore = require('expo-secure-store') as SecureStoreModule;
  } catch {
    secureStore = null;
  }
}

function webStorage(): Storage | null {
  try {
    const ls = (globalThis as unknown as { localStorage?: Storage }).localStorage;
    return ls ?? null;
  } catch {
    return null;
  }
}

function webGet(key: string): string | null {
  const ls = webStorage();
  if (!ls) return null;
  try { return ls.getItem(key); } catch { return null; }
}
function webSet(key: string, value: string): void {
  const ls = webStorage();
  if (!ls) return;
  try { ls.setItem(key, value); } catch (e) {
    console.error('[storage] web setItem failed', key, e);
  }
}
function webRemove(key: string): void {
  const ls = webStorage();
  if (!ls) return;
  try { ls.removeItem(key); } catch { /* ignore */ }
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') return webGet(key);
  if (!secureStore) return null;
  try { return await secureStore.getItemAsync(key); } catch { return null; }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') return webSet(key, value);
  if (!secureStore) return;
  try { await secureStore.setItemAsync(key, value); } catch (e) {
    console.error('[storage] SecureStore setItem failed', key, e);
  }
}

export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') return webRemove(key);
  if (!secureStore) return;
  try { await secureStore.deleteItemAsync(key); } catch { /* ignore */ }
}
