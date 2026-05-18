import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import type { LessonHtmlImportResult, LessonHtmlPreview } from '../../lib/api/admin';
import { useAuth } from '../../context/AuthContext';
import { adminNotify } from './adminNotify';
import {
  AdminLessonImportSuccessDialog,
  useAdminLessonImportSuccess,
} from './adminLessonImportSuccess';
import { AdminLessonImportSubmitBlock } from './AdminLessonImportSubmitBlock';
import { AdminLessonHtmlChapterPickSection } from './AdminLessonHtmlChapterPickSection';
import { lessonHtmlImportStyles as styles } from './AdminLessonHtmlImportStyles';
import { AdminLessonZipImportBar } from './AdminLessonZipImportBar';
import { openLessonEditHref, PreviewCard, ResultCard } from './AdminLessonHtmlImportWidgets';
import { useAdminLessonHtmlImportActions } from './useAdminLessonHtmlImportActions';
import { useLessonHtmlImportChapters } from './useLessonHtmlImportChapters';
import { useAdminLessonZipImportFlow } from './useAdminLessonZipImportFlow';

export function AdminLessonHtmlImportScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [zipAsset, setZipAsset] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [preview, setPreview] = useState<LessonHtmlPreview | null>(null);
  const [result, setResult] = useState<LessonHtmlImportResult | null>(null);

  const importSuccess = useAdminLessonImportSuccess();
  const {
    zipPreviewPercent,
    zipUploadBusy,
    zipImportPercent,
    zipImportBusy,
    runZipPreview,
    runZipImport,
  } = useAdminLessonZipImportFlow(token ?? null, zipAsset, setPreview, setResult, importSuccess.show);

  const { chapters, chapterId, setChapterId, creatingHsk, loadTree, ensureChapterForHsk } =
    useLessonHtmlImportChapters(token ?? null);

  const { pickZip, runImport } = useAdminLessonHtmlImportActions({
    token: token ?? null,
    zipAsset,
    chapterId,
    setZipAsset,
    setPreview,
    setResult,
    runZipImport,
  });

  useEffect(() => {
    void loadTree().catch((e) => adminNotify('Алдаа', (e as Error).message));
  }, [loadTree]);

  const blockUi = !token || zipUploadBusy || zipImportBusy;

  return (
    <>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <AdminLessonZipImportBar
          disabled={blockUi}
          zipName={zipAsset?.name ?? null}
          onPickZip={() => void pickZip()}
          onUploadZip={() => void runZipPreview()}
          uploadPercent={zipPreviewPercent}
          uploadBusy={zipUploadBusy}
        />
        <AdminLessonHtmlChapterPickSection
          token={token ?? null}
          chapters={chapters}
          chapterId={chapterId}
          creatingHsk={creatingHsk}
          onSelectChapter={setChapterId}
          onCreateChapterForHsk={(hsk) => void ensureChapterForHsk(hsk)}
        />
        {preview ? <PreviewCard p={preview} /> : null}
        {preview ? (
          <AdminLessonImportSubmitBlock
            disabled={!chapterId || zipImportBusy}
            importPercent={zipImportPercent}
            onImport={() => void runImport()}
            showImportProgress={Boolean(zipAsset && zipImportBusy)}
            zipImportBusy={zipImportBusy}
          />
        ) : null}
        {result ? <ResultCard r={result} onOpen={() => router.push(openLessonEditHref(result.lesson_id))} /> : null}
      </ScrollView>
      <AdminLessonImportSuccessDialog
        visible={importSuccess.visible}
        lessonId={importSuccess.lessonId}
        onClose={importSuccess.dismiss}
      />
    </>
  );
}
