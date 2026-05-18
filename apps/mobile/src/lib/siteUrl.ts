import Constants from "expo-constants";
import { Platform } from "react-native";

function stripTrailingSlashes(base: string): string {
  return base.replace(/\/+$/, "");
}

function webOrigin(): string | undefined {
  if (Platform.OS !== "web") return undefined;
  const w = globalThis as typeof globalThis & {
    window?: { location?: { origin?: string } };
  };
  const origin = w.window?.location?.origin;
  return typeof origin === "string" && origin ? origin : undefined;
}

/**
 * Production marketing site / SPA origin for legal URLs on native (HTTPS).
 * Web falls back to `window.location.origin` when unset.
 */
export function resolveSiteBase(): string {
  const fromEnv = process.env.EXPO_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return stripTrailingSlashes(fromEnv);
  const extraSite = Constants.expoConfig?.extra?.siteUrl;
  if (typeof extraSite === "string" && extraSite.trim()) {
    return stripTrailingSlashes(extraSite.trim());
  }
  const origin = webOrigin();
  if (origin) return stripTrailingSlashes(origin);
  return "";
}

export type LegalHrefPath = "/privacy" | "/terms" | "/delete-account";

export function absoluteLegalUrl(path: LegalHrefPath): string {
  const base = resolveSiteBase();
  if (!base) return path;
  return `${base}${path}`;
}
