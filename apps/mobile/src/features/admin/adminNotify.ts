import { Alert, Platform } from 'react-native';

export function adminNotify(title: string, msg?: string) {
  if (Platform.OS === 'web') {
    const g = globalThis as { alert?: (s: string) => void };
    g.alert?.(msg ? `${title}\n${msg}` : title);
    return;
  }
  Alert.alert(title, msg);
}
