import { examImportAdmin, inferExamAudioContentType } from '../../../lib/api/examImportAdmin';
import type { ExamDraftQuestion } from './examDraftTypes';
import { readPickBuffer } from './readPickBuffer';
import type { PickedDoc } from './pickedAsset';

export async function uploadListeningPicksToDrafts(
  token: string,
  drafts: ExamDraftQuestion[],
  picks: PickedDoc[]
): Promise<ExamDraftQuestion[]> {
  const idxs = drafts.map((d, i) => ({ d, i })).filter((x) => x.d.section === 'listening');
  const next = drafts.map((q) => ({ ...q }));
  for (let k = 0; k < Math.min(picks.length, idxs.length); k++) {
    const p = picks[k]!;
    const ab = await readPickBuffer(p);
    const name = p.name || `q${k + 1}.wav`;
    const { key } = await examImportAdmin.uploadExamAudioRaw(
      token,
      name,
      ab,
      inferExamAudioContentType(name, p.mime)
    );
    next[idxs[k]!.i]!.audio_key = key;
  }
  return next;
}
