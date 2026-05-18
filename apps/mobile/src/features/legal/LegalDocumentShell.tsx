import { StyleSheet, Text, View } from "react-native";

import { ProfileScreenBackBar } from "../profile/ProfileScreenBackBar";
import { Screen } from "../../primitives";
import { LegalSectionsRenderer } from "./LegalSectionsRenderer";
import type { LegalSection } from "./legalSectionTypes";
import { colors, spacing, typography } from "../../theme";

type Props = {
  mnTitle: string;
  enKicker?: string;
  metaLines: string[];
  leadParagraph?: string;
  sections: LegalSection[];
};

export function LegalDocumentShell({ mnTitle, enKicker, metaLines, leadParagraph, sections }: Props) {
  return (
    <Screen scroll>
      <ProfileScreenBackBar title={mnTitle} fallback="/(tabs)/home" style={{ marginBottom: spacing.md }} />
      {enKicker ? <Text style={styles.kicker}>{enKicker}</Text> : null}
      {metaLines.map((line, i) => (
        <Text key={`meta-${i}`} style={styles.meta}>
          {line}
        </Text>
      ))}
      {leadParagraph ? <Text style={styles.lead}>{leadParagraph}</Text> : null}
      <LegalSectionsRenderer sections={sections} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.heading.sm,
    color: colors.text.secondary,
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  meta: { ...typography.body.sm, color: colors.text.secondary, marginBottom: 2 },
  lead: {
    ...typography.body.md,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
});
