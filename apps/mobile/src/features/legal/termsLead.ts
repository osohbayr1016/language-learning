import type { LegalDocOpts } from "./legalSectionTypes";

export function termsLeadParagraph(opts: LegalDocOpts): string {
  return `Энэхүү үйлчилгээний нөхцөл нь ${opts.appName} аппликейшнийг ашиглахтай холбоотой хэрэглэгч болон үйлчилгээ үзүүлэгчийн хоорондын эрх, үүргийг зохицуулна.`;
}
