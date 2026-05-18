import type { LessonDetail, Word } from '../../../lib/types';

export type LessonShadowTarget = {
  key: string;
  dialogueTitle: string;
  meaningMn: string;
  hanzi: string;
  audioUrl?: string;
  word: Word;
};

function synthShadowWord(hanzi: string, meaningMn: string, index: number): Word {
  return {
    id: -(800000 + index),
    hanzi,
    pinyin: '',
    pinyin_numbered: null,
    tones: '',
    meaning_mn: meaningMn.trim() || '…',
    meaning_en: null,
    hsk_level: 1,
    part_of_speech: null,
    example_zh: null,
    example_pinyin: null,
    example_mn: null,
    audio_url: null,
    stroke_count: null,
  };
}

/** Dialogue lines and full-text blocks for listen-and-repeat practice. */
export function buildLessonShadowTargets(detail: LessonDetail): LessonShadowTarget[] {
  const imp = detail.imported_content;
  if (!imp?.dialogues?.length) return [];
  const out: LessonShadowTarget[] = [];
  let idx = 0;

  for (const d of imp.dialogues) {
    const audio = d.audio_url?.trim();
    if (d.lines?.length) {
      for (let li = 0; li < d.lines.length; li++) {
        const line = d.lines[li]!;
        const cn = line.cn.trim();
        if (!cn) continue;
        const key = `dlg-${d.no}-${li}-${idx}`;
        out.push({
          key,
          dialogueTitle: d.title,
          meaningMn: line.mn?.trim() ?? '',
          hanzi: cn,
          audioUrl: audio || undefined,
          word: synthShadowWord(cn, line.mn ?? '', idx++),
        });
      }
    } else if (d.text_cn?.trim()) {
      const cn = d.text_cn.trim();
      const key = `ez-${d.no}-${idx}`;
      out.push({
        key,
        dialogueTitle: d.title,
        meaningMn: d.text_mn?.trim() ?? '',
        hanzi: cn,
        audioUrl: audio || undefined,
        word: synthShadowWord(cn, d.text_mn ?? '', idx++),
      });
    }
  }

  return out;
}
