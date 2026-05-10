import type { ExpoConfig } from 'expo/config';

/** Bump with every App Store / TestFlight submission. */
const IOS_BUILD_NUMBER = '1';
/** Bump with every Play submission (integer). */
const ANDROID_VERSION_CODE = 1;

export default (): ExpoConfig => ({
  name: 'Хятад Хэл',
  slug: 'chinese-learning',
  owner: 'twissu',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  scheme: 'chineseapp',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0F0F1A',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.chineselearning.app',
    buildNumber: IOS_BUILD_NUMBER,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSMicrophoneUsageDescription:
        'Хятад өгүүлбэр хэлэх дасгалд микрофон шаардлагатай.',
      NSSpeechRecognitionUsageDescription:
        'Таны хэлсэн үгийг таних зөвшөөрөл шаардлагатай.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0F0F1A',
    },
    package: 'com.chineselearning.app',
    versionCode: ANDROID_VERSION_CODE,
    permissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.MODIFY_AUDIO_SETTINGS',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    ['expo-router', { sitemap: false }],
    'expo-font',
    [
      'expo-av',
      {
        microphonePermission:
          'Дуудлагаа сонсож сурахын тулд микрофон ашиглана.',
      },
    ],
    'expo-secure-store',
    [
      'expo-speech-recognition',
      {
        microphonePermission:
          'Хятад өгүүлбэр хэлэх дасгалд микрофон шаардлагатай.',
        speechRecognitionPermission:
          'Таны хэлсэн үгийг таних зөвшөөрөл шаардлагатай.',
        androidSpeechServicePackages: ['com.google.android.googlequicksearchbox'],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiUrl: 'https://chinese-learning-api.osohoo691016.workers.dev',
    eas: {
      projectId: 'f37b493b-0499-4d37-a234-6b2abefdc319',
    },
  },
});
