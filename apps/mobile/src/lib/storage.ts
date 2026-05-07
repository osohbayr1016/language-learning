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

function webGet(key: string): string | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function webSet(key: string, value: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try { window.localStorage.setItem(key, value); } catch { /* quota / privacy mode */ }
}
function webRemove(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try { window.localStorage.removeItem(key); } catch { /* ignore */ }
}

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') return webGet(key);
  if (!secureStore) return null;
  try { return await secureStore.getItemAsync(key); } catch { return null; }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') return webSet(key, value);
  if (!secureStore) return;
  try { await secureStore.setItemAsync(key, value); } catch { /* ignore */ }
}

export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') return webRemove(key);
  if (!secureStore) return;
  try { await secureStore.deleteItemAsync(key); } catch { /* ignore */ }
}
