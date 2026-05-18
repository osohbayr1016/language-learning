import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import {
  legalAppDisplayName,
  legalPublisherName,
  legalSupportEmail,
} from "./legalConfig";
import { absoluteLegalUrl } from "../../lib/siteUrl";
import { ProfileScreenBackBar } from "../profile/ProfileScreenBackBar";
import { Screen } from "../../primitives";
import { colors, radius, spacing, typography } from "../../theme";

export function DeleteAccountPublicScreen() {
  const appName = legalAppDisplayName();
  const publisher = legalPublisherName();
  const support = legalSupportEmail();
  const mailto = `mailto:${support}?subject=${encodeURIComponent(`${appName} — Бүртгэл устгах хүсэлт`)}`;

  return (
    <Screen scroll>
      <ProfileScreenBackBar title="Бүртгэл устгах" fallback="/(tabs)/home" style={{ marginBottom: spacing.md }} />
      <Text style={styles.pageTitle}>{`${appName} — Account Deletion`}</Text>
      <Text style={styles.lead}>
        {`${appName} аппын хэрэглэгч та өөрийн бүртгэл болон холбогдох мэдээллээ устгуулах хүсэлт гаргах боломжтой.`}
      </Text>

      <Text style={styles.h}>App дотроос устгах</Text>
      <Text style={styles.p}>• App нээнэ</Text>
      <Text style={styles.p}>• Profile хэсэг рүү орно</Text>
      <Text style={styles.p}>• Settings дарна</Text>
      <Text style={styles.p}>• Delete Account сонгоно</Text>
      <Text style={styles.p}>• Баталгаажуулсны дараа хүсэлт илгээгдэнэ</Text>

      <Text style={[styles.h, styles.mt]}>Website-ээр хүсэлт гаргах</Text>
      <Text style={styles.p}>
        Та дараах мэдээллийг илгээж бүртгэл устгах хүсэлт гаргаж болно: бүртгэлтэй email эсвэл утасны дугаар;
        хэрэглэгчийн нэр; устгах хүсэлт гаргаж буй шалтгаан (заавал биш); баталгаажуулах contact.
      </Text>

      <Pressable
        accessibilityRole="link"
        onPress={() => void Linking.openURL(mailto)}
        style={({ pressed }) => [styles.mailBtn, pressed && styles.mailBtnPressed]}
      >
        <Text style={styles.mailBtnLabel}>{support}</Text>
      </Pressable>

      <Text style={[styles.h, styles.mt]}>Ямар мэдээлэл устах вэ?</Text>
      <Text style={styles.p}>• Profile мэдээлэл</Text>
      <Text style={styles.p}>• Learning progress</Text>
      <Text style={styles.p}>• Saved words</Text>
      <Text style={styles.p}>• Test results</Text>
      <Text style={styles.p}>• App дотор хадгалсан хэрэглэгчийн тохиргоо</Text>

      <Text style={[styles.h, styles.mt]}>Ямар мэдээлэл түр хадгалагдаж болох вэ?</Text>
      <Text style={styles.p}>
        Security, fraud prevention, payment record, legal obligation, accounting purpose зэрэг шаардлагаар зарим мэдээллийг хуульд зөвшөөрөгдөх хугацаанд хадгалж болно.
      </Text>

      <Text style={[styles.h, styles.mt]}>Хугацаа</Text>
      <Text style={styles.p}>Бүртгэл устгах хүсэлтийг хүлээн авснаас хойш 7–30 хоногийн дотор боловсруулна.</Text>

      <Text style={[styles.h, styles.mt]}>Холбоо барих</Text>
      <Text style={styles.p}>{`Хөгжүүлэгч / байгууллага: ${publisher}`}</Text>
      <Text style={styles.p}>{`Нээлттэй хуудасны хаяг: ${absoluteLegalUrl("/delete-account")}`}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageTitle: { ...typography.heading.md, color: colors.text.primary, marginBottom: spacing.sm },
  lead: { ...typography.body.md, color: colors.text.secondary, lineHeight: 22, marginBottom: spacing.lg },
  h: { ...typography.heading.sm, color: colors.text.primary, marginBottom: spacing.xs },
  mt: { marginTop: spacing.lg },
  p: { ...typography.body.md, color: colors.text.secondary, lineHeight: 22, marginBottom: 2 },
  mailBtn: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mailBtnPressed: { opacity: 0.85 },
  mailBtnLabel: { ...typography.body.md, color: colors.brand.primary },
});
