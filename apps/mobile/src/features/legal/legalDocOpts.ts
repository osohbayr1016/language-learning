import { absoluteLegalUrl } from "../../lib/siteUrl";
import {
  legalAppDisplayName,
  legalContactPhone,
  legalLastUpdated,
  legalPrivacyEmail,
  legalPublisherName,
  legalSupportEmail,
  legalWebsiteUrl,
} from "./legalConfig";
import type { LegalDocOpts } from "./legalSectionTypes";

export function buildLegalDocOpts(): LegalDocOpts {
  const appName = legalAppDisplayName();
  return {
    appName,
    publisher: legalPublisherName(),
    supportEmail: legalSupportEmail(),
    privacyEmail: legalPrivacyEmail(),
    phone: legalContactPhone(),
    website: legalWebsiteUrl(),
    deleteAccountUrl: absoluteLegalUrl("/delete-account"),
  };
}

export function termsMetaLines(): string[] {
  return [
    `Сүүлд шинэчилсэн огноо: ${legalLastUpdated()}`,
    `App нэр: ${legalAppDisplayName()}`,
    `Developer / Байгууллага: ${legalPublisherName()}`,
    `Холбоо барих: ${legalSupportEmail()} · ${legalContactPhone()} · ${legalWebsiteUrl()}`,
  ];
}

export function privacyMetaLines(): string[] {
  return [
    `Сүүлд шинэчилсэн огноо: ${legalLastUpdated()}`,
    `App нэр: ${legalAppDisplayName()}`,
    `Developer: ${legalPublisherName()}`,
  ];
}
