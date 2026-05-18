import type { LegalDocOpts, LegalSection } from "./legalSectionTypes";
import { termsSectionsIntro } from "./termsSectionsIntro";
import { termsSectionsTail } from "./termsSectionsTail";

export function buildTermsSections(opts: LegalDocOpts): LegalSection[] {
  return [...termsSectionsIntro(opts), ...termsSectionsTail(opts)];
}
