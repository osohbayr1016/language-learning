import { Alert, Platform } from 'react-native';
import { mn } from '../../i18n/mn';

/** Шалгалт илэрхий бөглөлтгүй нэхэмжилгүйгээр салгах логик. */
export function confirmQuitMockExam(onConfirm: () => void): void {
  const title = mn.study.mockExamQuitTitle;
  const body = mn.study.mockExamQuitBody;
  const msg = `${title}\n\n${body}`;
  if (Platform.OS === 'web') {
    const g = globalThis as unknown as { confirm?: (message?: string) => boolean };
    if (typeof g.confirm === 'function' && g.confirm(msg)) onConfirm();
    return;
  }
  Alert.alert(title, body, [
    { text: mn.common.cancel, style: 'cancel' },
    { text: mn.study.mockExamExit, style: 'destructive', onPress: onConfirm },
  ]);
}
