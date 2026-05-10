import type { PickedDoc } from './pickedAsset';

export async function readPickBuffer(p: PickedDoc): Promise<ArrayBuffer> {
  const res = await fetch(p.uri);
  if (!res.ok) throw new Error(`Файлыг уншиж чадсангүй: ${p.name}`);
  return res.arrayBuffer();
}
