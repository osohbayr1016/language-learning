import { Platform } from 'react-native';

/**
 * Web: Noto (+ system CJK fallback) — Metro dev дээр font stylesheet оройлолтод хоцорвол ханз харагдана.
 * Native: undefined → платформ өөрийнх нь үсэг.
 */
export const sansFontFamily =
  Platform.OS === 'web'
    ? '"Noto Sans", "Noto Sans SC", system-ui, -apple-system, "PingFang SC", "Heiti SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
    : undefined;
