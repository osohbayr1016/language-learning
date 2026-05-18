import { LegalDocumentShell } from "../src/features/legal/LegalDocumentShell";
import { buildLegalDocOpts, privacyMetaLines } from "../src/features/legal/legalDocOpts";
import { buildPrivacySections } from "../src/features/legal/privacyContent";
import { privacyLeadParagraph } from "../src/features/legal/privacyLead";

export default function PrivacyRoute() {
  const opts = buildLegalDocOpts();
  return (
    <LegalDocumentShell
      mnTitle="Нууцлалын бодлого"
      enKicker="PRIVACY POLICY"
      metaLines={privacyMetaLines()}
      leadParagraph={privacyLeadParagraph(opts)}
      sections={buildPrivacySections(opts)}
    />
  );
}
