import type { LegalDocOpts } from "./legalSectionTypes";

export function privacyLeadParagraph(opts: LegalDocOpts): string {
  return `Энэхүү нууцлалын бодлого нь ${opts.appName} апп хэрэглэгчийн ямар мэдээлэл цуглуулдаг, хэрхэн ашигладаг, хамгаалдаг, устгадаг талаар тайлбарлана.`;
}
