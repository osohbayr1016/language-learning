import { useCallback, useState } from 'react';
import type * as DocumentPicker from 'expo-document-picker';
import { api } from '../../lib/api';
import type { LessonHtmlImportResult, LessonHtmlPreview } from '../../lib/api/admin';
import { adminNotify } from './adminNotify';
import { buildZipFormDataForImport, buildZipFormDataForPreview } from './adminZipImportFormData';

type Token = string | null;

export function useAdminLessonZipImportFlow(
  token: Token,
  zipAsset: DocumentPicker.DocumentPickerAsset | null,
  setPreview: (p: LessonHtmlPreview | null) => void,
  setResult: (r: LessonHtmlImportResult | null) => void,
  onImportSuccess?: (lessonId: number) => void
) {
  const [zipPreviewPercent, setZipPreviewPercent] = useState<number | null>(null);
  const [zipUploadBusy, setZipUploadBusy] = useState(false);
  const [zipImportPercent, setZipImportPercent] = useState<number | null>(null);
  const [zipImportBusy, setZipImportBusy] = useState(false);

  const runZipPreview = useCallback(async () => {
    if (!token || !zipAsset) return;
    setZipUploadBusy(true);
    setZipPreviewPercent(0);
    try {
      const r = await api.admin.previewLessonPackageZipWithProgress(
        token,
        () => buildZipFormDataForPreview(zipAsset),
        (p) => setZipPreviewPercent(p)
      );
      setPreview(r.data);
      setResult(null);
    } catch (e) {
      adminNotify('Preview алдаа', (e as Error).message);
    } finally {
      setZipUploadBusy(false);
      setZipPreviewPercent(null);
    }
  }, [token, zipAsset, setPreview, setResult]);

  const runZipImport = useCallback(
    async (chapterId: number) => {
      if (!token || !zipAsset) return;
      setZipImportBusy(true);
      setZipImportPercent(0);
      try {
        const r = await api.admin.importLessonPackageZipWithProgress(
          token,
          () => buildZipFormDataForImport(zipAsset, chapterId, true),
          (p) => setZipImportPercent(p)
        );
        setResult(r.data);
        onImportSuccess?.(r.data.lesson_id);
      } catch (e) {
        adminNotify('Import алдаа', (e as Error).message);
      } finally {
        setZipImportBusy(false);
        setZipImportPercent(null);
      }
    },
    [token, zipAsset, setResult, onImportSuccess]
  );

  return {
    zipPreviewPercent,
    zipUploadBusy,
    zipImportPercent,
    zipImportBusy,
    runZipPreview,
    runZipImport,
  };
}
