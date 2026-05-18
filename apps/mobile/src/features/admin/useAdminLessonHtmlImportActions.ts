import { useCallback, type Dispatch, type SetStateAction } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import type { LessonHtmlImportResult, LessonHtmlPreview } from '../../lib/api/admin';
import { adminNotify } from './adminNotify';

type Args = {
  token: string | null;
  zipAsset: DocumentPicker.DocumentPickerAsset | null;
  chapterId: number | null;
  setZipAsset: Dispatch<SetStateAction<DocumentPicker.DocumentPickerAsset | null>>;
  setPreview: Dispatch<SetStateAction<LessonHtmlPreview | null>>;
  setResult: Dispatch<SetStateAction<LessonHtmlImportResult | null>>;
  runZipImport: (chapterId: number) => Promise<void>;
};

export function useAdminLessonHtmlImportActions({
  token,
  zipAsset,
  chapterId,
  setZipAsset,
  setPreview,
  setResult,
  runZipImport,
}: Args) {
  const pickZip = useCallback(async () => {
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: ['application/zip', 'application/x-zip-compressed'],
        copyToCacheDirectory: true,
      });
      if (picked.canceled) return;
      const asset = picked.assets[0];
      if (!asset?.uri) return;
      setZipAsset(asset);
      setPreview(null);
      setResult(null);
    } catch (e) {
      adminNotify('ZIP', e instanceof Error ? e.message : 'Сонгоход алдаа');
    }
  }, [setZipAsset, setPreview, setResult]);

  const runImport = useCallback(async () => {
    if (!token || !chapterId) return;
    if (!zipAsset) {
      adminNotify('ZIP', 'ZIP файл сонгон Preview хийнэ үү');
      return;
    }
    await runZipImport(chapterId);
  }, [token, chapterId, zipAsset, runZipImport]);

  return { pickZip, runImport };
}
