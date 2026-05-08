import { getItem, removeItem, setItem } from '../storage';
import {
  AUTH_ACCESS_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
} from './tokenStorageKeys';

export async function persistSession(access: string, refresh: string): Promise<void> {
  await setItem(AUTH_ACCESS_TOKEN_KEY, access);
  await setItem(AUTH_REFRESH_TOKEN_KEY, refresh);
  const rAccess = await getItem(AUTH_ACCESS_TOKEN_KEY);
  const rRefresh = await getItem(AUTH_REFRESH_TOKEN_KEY);
  if (rAccess !== access || rRefresh !== refresh) {
    await removeItem(AUTH_ACCESS_TOKEN_KEY);
    await removeItem(AUTH_REFRESH_TOKEN_KEY);
    throw new Error('Нэвтрэлтийн түлхүүр хадгалагдаагүй. Хадгалалтын зай эсвэл тохиргоо шалгана уу.');
  }
}
