import Constants from "expo-constants";

function env(key: string): string | undefined {
  const v = process.env[key];
  return typeof v === "string" ? v.trim() || undefined : undefined;
}

function extra(key: string): string | undefined {
  const raw = Constants.expoConfig?.extra?.[key];
  return typeof raw === "string" ? raw.trim() || undefined : undefined;
}

/** Prefer app.config extra (Metro), then process.env at build time. */
export function legalPublisherName(): string {
  return (
    extra("legalPublisherName") ??
    env("EXPO_PUBLIC_LEGAL_PUBLISHER_NAME") ??
    "[Танай компанийн нэр]"
  );
}

export function legalSupportEmail(): string {
  return extra("legalSupportEmail") ?? env("EXPO_PUBLIC_LEGAL_SUPPORT_EMAIL") ?? "[support@yourdomain.mn]";
}

export function legalPrivacyEmail(): string {
  return extra("legalPrivacyEmail") ?? env("EXPO_PUBLIC_LEGAL_PRIVACY_EMAIL") ?? "[privacy@yourdomain.mn]";
}

export function legalContactPhone(): string {
  return extra("legalContactPhone") ?? env("EXPO_PUBLIC_LEGAL_CONTACT_PHONE") ?? "[утас]";
}

export function legalWebsiteUrl(): string {
  return extra("legalWebsiteUrl") ?? env("EXPO_PUBLIC_LEGAL_WEBSITE_URL") ?? "[website]";
}

export function legalAppDisplayName(): string {
  return (
    extra("legalAppDisplayName") ??
    env("EXPO_PUBLIC_LEGAL_APP_DISPLAY_NAME") ??
    "Бөөндөө Study / Buunduu Study"
  );
}

export function legalLastUpdated(): string {
  return extra("legalLastUpdated") ?? env("EXPO_PUBLIC_LEGAL_LAST_UPDATED") ?? "2026-05-18";
}
