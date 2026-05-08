import { api } from '../api';
import { getJwtIsAdmin } from './accessToken';
import { isTruthyAdmin } from './isTruthyAdmin';

/** D1 `users.is_admin`-тай sync — JWT уналтыг UI-д бүү найда. */
export async function syncAdminFromServer(token: string | null): Promise<boolean> {
  if (!token) return false;
  try {
    const r = await api.user.profile(token);
    return isTruthyAdmin(r.data?.is_admin);
  } catch {
    return getJwtIsAdmin(token);
  }
}
