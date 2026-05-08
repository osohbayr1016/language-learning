import { api } from '../api';
import { getItem, removeItem, setItem } from '../storage';
import { accessTokenNeedsRefresh } from './accessToken';
import {
  AUTH_ACCESS_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
} from './tokenStorageKeys';

/** AsyncStorage-аас access авна; шаардлагатай бол refresh-ээр шинэчилнэ. */
export async function restoreStoredAccessToken(): Promise<string | null> {
  let token = await getItem(AUTH_ACCESS_TOKEN_KEY);
  const refresh = await getItem(AUTH_REFRESH_TOKEN_KEY);
  if (refresh && (!token || accessTokenNeedsRefresh(token, 60))) {
    try {
      const res = await api.auth.refresh(refresh);
      token = res.data.access_token;
      await setItem(AUTH_ACCESS_TOKEN_KEY, token);
    } catch {
      await removeItem(AUTH_ACCESS_TOKEN_KEY);
      await removeItem(AUTH_REFRESH_TOKEN_KEY);
      token = null;
    }
  }
  return token;
}
