import { Platform } from 'react-native';

/** Web: Noto (Cyrillic + Latin + CJK). Native: undefined → platform UI font. */
export const sansFontFamily =
  Platform.OS === 'web'
    ? '"Noto Sans", "Noto Sans SC", system-ui, -apple-system, sans-serif'
    : undefined;
