import type { ExamDraftQuestion } from './examDraftTypes';
import { adminApi } from '../adminApi';

/** Upload audio (WAV or MP3) to R2 in order; binds to listening question rows top-to-bottom. */
export async function uploadListeningWavsToDrafts(
  token: string,
  drafts: ExamDraftQuestion[],
  files: File[]
): Promise<ExamDraftQuestion[]> {
  const idxs = drafts.map((d, i) => ({ d, i })).filter((x) => x.d.section === 'listening');
  const next = drafts.map((q) => ({ ...q }));
  for (let k = 0; k < Math.min(files.length, idxs.length); k++) {
    const { key } = await adminApi.uploadExamAudio(token, files[k]!);
    next[idxs[k]!.i]!.audio_key = key;
  }
  return next;
}
