import { Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import type { PickedBinary } from './cartoonPick.types';

function base64ToBuffer(b64: string): ArrayBuffer {
  const bin = globalThis.atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

async function pickNative(kind: 'video' | 'thumbnail'): Promise<PickedBinary> {
  const res = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    type: kind === 'video' ? 'video/*' : 'image/*',
  });
  if (res.canceled || !res.assets?.[0]) {
    throw new Error('Цуцлагдсан');
  }
  const asset = res.assets[0];
  const uri = asset.uri;
  const filename = asset.name ?? 'upload';
  const mime =
    asset.mimeType ?? (kind === 'video' ? 'video/mp4' : 'image/jpeg');
  const b64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  return { buffer: base64ToBuffer(b64), filename, mime };
}

type WebFile = { arrayBuffer: () => Promise<ArrayBuffer>; name?: string; type?: string };

async function pickWeb(kind: 'video' | 'thumbnail'): Promise<PickedBinary> {
  const doc = (globalThis as Record<string, unknown>).document as
    | {
        createElement: (tag: string) => {
          type: string;
          accept: string;
          click: () => void;
          onchange: (() => void) | null;
          files: { readonly length: number; [n: number]: WebFile } | null;
        };
      }
    | undefined;
  if (!doc?.createElement) throw new Error('DOM алга');
  return new Promise((resolve, reject) => {
    const input = doc.createElement('input');
    input.type = 'file';
    input.accept = kind === 'video' ? 'video/*' : 'image/*';
    input.onchange = async () => {
      const files = input.files;
      const file = files && files.length > 0 ? files[0] : undefined;
      if (!file || typeof file.arrayBuffer !== 'function') {
        reject(new Error('Цуцлагдсан'));
        return;
      }
      const buf = await file.arrayBuffer();
      resolve({
        buffer: buf,
        filename: file.name || 'upload',
        mime: file.type || (kind === 'video' ? 'video/mp4' : 'image/jpeg'),
      });
    };
    input.click();
  });
}

export async function pickCartoonBinary(kind: 'video' | 'thumbnail'): Promise<PickedBinary> {
  return Platform.OS === 'web' ? pickWeb(kind) : pickNative(kind);
}
