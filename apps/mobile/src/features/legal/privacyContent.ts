import type { LegalDocOpts, LegalSection } from "./legalSectionTypes";
import { privacySectionsPart1 } from "./privacySections";

export function buildPrivacySections(opts: LegalDocOpts): LegalSection[] {
  return privacySectionsPart1(opts);
}
