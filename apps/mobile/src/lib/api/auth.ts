import { request } from './client';

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type RegisterBody = { email: string; password: string; display_name: string };
export type LoginBody = { email: string; password: string };

export const auth = {
  register: (body: RegisterBody) =>
    request<{ data: AuthTokens }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (body: LoginBody) =>
    request<{ data: AuthTokens }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  refresh: (refresh_token: string) =>
    request<{ data: { access_token: string; expires_in: number } }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token }),
    }),
  logout: (refresh_token: string) =>
    request<{ data: null }>('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token }),
    }),
};
