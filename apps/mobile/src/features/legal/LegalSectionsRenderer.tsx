import { StyleSheet, Text, View } from "react-native";

import type { LegalSection } from "./legalSectionTypes";
import { colors, spacing, typography } from "../../theme";

export function LegalSectionsRenderer({ sections }: { sections: LegalSection[] }) {
  return (
    <View style={styles.wrap}>
      {sections.map((sec, i) => (
        <View key={sec.title + String(i)} style={styles.block}>
          <Text style={styles.secTitle}>{sec.title}</Text>
          {sec.paragraphs.map((p, j) => (
            <Text key={`${sec.title}-${j}`} style={styles.p}>
              {p}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg, paddingBottom: spacing.xxl },
  block: { gap: spacing.sm },
  secTitle: { ...typography.heading.md, color: colors.text.primary },
  p: { ...typography.body.md, color: colors.text.secondary, lineHeight: 22 },
});
