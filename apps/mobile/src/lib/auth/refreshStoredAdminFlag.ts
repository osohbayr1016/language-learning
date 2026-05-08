import { getItem, removeItem, setItem } from '../storage';
import { syncAdminFromServer } from './syncAdminFromServer';
import { AUTH_ACCESS_TOKEN_KEY } from './tokenStorageKeys';

export async function refreshStoredAdminFlag(): Promise<boolean> {
  const token = await getItem(AUTH_ACCESS_TOKEN_KEY);
  if (!token) return false;
  return syncAdminFromServer(token);
}
