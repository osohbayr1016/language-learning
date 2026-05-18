import type { AuthLocaleStrings } from '../../i18n/authLocales';

export function mapEmailFieldError(strings: AuthLocaleStrings, key: string | undefined): string | undefined {
  if (key === 'required') return strings.requiredEmail;
  if (key === 'invalid') return strings.emailInvalid;
  return undefined;
}

export function mapPasswordFieldError(strings: AuthLocaleStrings, key: string | undefined): string | undefined {
  if (key === 'required') return strings.requiredPassword;
  if (key === 'weak') return strings.weakPassword;
  return undefined;
}

export function mapDisplayNameFieldError(strings: AuthLocaleStrings, key: string | undefined): string | undefined {
  if (key === 'required') return strings.requiredDisplayName;
  if (key === 'tooShort') return strings.displayNameTooShort;
  return undefined;
}
