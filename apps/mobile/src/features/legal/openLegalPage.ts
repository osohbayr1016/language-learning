import * as Linking from "expo-linking";
import type { Router } from "expo-router";
import { Platform } from "react-native";

import { absoluteLegalUrl, resolveSiteBase, type LegalHrefPath } from "../../lib/siteUrl";

export function openLegalPage(router: Router, path: LegalHrefPath): void {
  if (Platform.OS === "web") {
    router.push(path);
    return;
  }
  const base = resolveSiteBase();
  if (base && /^https?:\/\//i.test(base)) {
    void Linking.openURL(absoluteLegalUrl(path));
    return;
  }
  router.push(path);
}
