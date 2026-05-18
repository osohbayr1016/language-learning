import { LegalDocumentShell } from "../src/features/legal/LegalDocumentShell";
import { buildLegalDocOpts, termsMetaLines } from "../src/features/legal/legalDocOpts";
import { buildTermsSections } from "../src/features/legal/termsContent";
import { termsLeadParagraph } from "../src/features/legal/termsLead";

export default function TermsRoute() {
  const opts = buildLegalDocOpts();
  return (
    <LegalDocumentShell
      mnTitle="Үйлчилгээний нөхцөл"
      enKicker="TERMS & CONDITIONS"
      metaLines={termsMetaLines()}
      leadParagraph={termsLeadParagraph(opts)}
      sections={buildTermsSections(opts)}
    />
  );
}
