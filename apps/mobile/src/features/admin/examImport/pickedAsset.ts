import type { DocumentPickerAsset } from 'expo-document-picker';

export type PickedDoc = { uri: string; name: string; mime?: string };

export function assetToPick(a: DocumentPickerAsset): PickedDoc {
  const raw = typeof a.name === 'string' && a.name.trim() ? a.name.trim() : 'file.bin';
  return {
    uri: a.uri,
    name: raw,
    mime: a.mimeType ?? undefined,
  };
}
