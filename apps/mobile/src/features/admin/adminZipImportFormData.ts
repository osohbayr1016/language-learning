import { Platform } from 'react-native';
import type * as DocumentPicker from 'expo-document-picker';

export async function buildZipFormDataForPreview(
  asset: DocumentPicker.DocumentPickerAsset
): Promise<FormData> {
  const fd = new FormData();
  if (Platform.OS === 'web') {
    const res = await fetch(asset.uri);
    if (!res.ok) throw new Error(`ZIP унших боломжгүй (${res.status})`);
    fd.append('file', await res.blob(), asset.name ?? 'lesson.zip');
  } else {
    fd.append('file', {
      uri: asset.uri,
      name: asset.name ?? 'lesson.zip',
      type: 'application/zip',
    } as unknown as Blob);
  }
  return fd;
}

export async function buildZipFormDataForImport(
  asset: DocumentPicker.DocumentPickerAsset,
  chapterId: number,
  isPublished: boolean
): Promise<FormData> {
  const fd = await buildZipFormDataForPreview(asset);
  fd.append('chapter_id', String(chapterId));
  if (!isPublished) fd.append('is_published', 'false');
  return fd;
}
