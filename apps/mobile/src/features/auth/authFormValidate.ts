const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthEmail(raw: string): string | undefined {
  const t = raw.trim();
  if (!t) return 'required';
  if (!EMAIL_RE.test(t)) return 'invalid';
  return undefined;
}

export function validateAuthPassword(raw: string, mode: 'login' | 'register'): string | undefined {
  if (!raw) return 'required';
  if (mode === 'register' && raw.length < 8) return 'weak';
  return undefined;
}
