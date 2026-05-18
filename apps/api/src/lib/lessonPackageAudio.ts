import type { ImportedLessonContent } from './lessonImportTypes';

function normRel(p: string): string {
  return p.trim().replace(/^\/+/, '');
}

/** Unique relative audio paths referenced by content (before URL rewrite). */
export function collectRelativeAudioPaths(content: ImportedLessonContent): string[] {
  const set = new Set<string>();
  const add = (p: string | undefined) => {
    if (!p || p.startsWith('http://') || p.startsWith('https://')) return;
    set.add(normRel(p));
  };
  for (const d of content.dialogues) {
    add(d.audio_url);
  }
  for (const s of content.workbook.sections) {
    for (const it of s.items) {
      add(it.audio_url);
      add(it.full_track_url);
    }
  }
  return [...set];
}

/** Replace relative paths with public API URLs. */
export function rewriteLessonAudioUrls(content: ImportedLessonContent, urlByRel: Record<string, string>): void {
  const map = (p: string | undefined): string | undefined => {
    if (!p || p.startsWith('http://') || p.startsWith('https://')) return p;
    const key = normRel(p);
    return urlByRel[key] ?? p;
  };
  for (const d of content.dialogues) {
    if (d.audio_url) d.audio_url = map(d.audio_url);
  }
  for (const s of content.workbook.sections) {
    for (const it of s.items) {
      if (it.audio_url) it.audio_url = map(it.audio_url);
      if (it.full_track_url) it.full_track_url = map(it.full_track_url);
    }
  }
}
