import type { ExamDraftQuestion } from './examDraftTypes';
import { blockBetweenNum, collapseWs, parseThreeOptions, sliceBetween } from './hsk2TextHelpers';

const LETS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
const LET_SET = new Set<string>(LETS);

export function buildListeningDraft(
  exam: string,
  answers: Map<number, string>
): ExamDraftQuestion[] {
  const listen = sliceBetween(exam, /一、[听聆]/, /二、阅/) || exam;
  const out: ExamDraftQuestion[] = [];
  let ord = 0;

  for (let n = 1; n <= 10; n++) {
    const ca = answers.get(n);
    if (!ca || (ca !== '√' && ca !== '×')) throw new Error(`Сонгоно уу √/× — ${n}`);
    out.push({
      section: 'listening',
      part_num: 1,
      question_num: n,
      audio_text: '',
      question_text: `听力 第一部分 第${n}题。请听录音，判断对错（√ / ×）。`,
      question_pinyin: '',
      options: ['√', '×'],
      correct_answer: ca,
      order_num: ++ord,
    });
  }

  for (let n = 11; n <= 20; n++) {
    const ca = answers.get(n);
    if (!ca || !LET_SET.has(ca)) throw new Error(`A–F алга — ${n}`);
    out.push({
      section: 'listening',
      part_num: 2,
      question_num: n,
      audio_text: '',
      question_text: `听力 第二部分 第${n}题。请听录音选图（A–F）。`,
      question_pinyin: '',
      options: [...LETS],
      correct_answer: ca,
      order_num: ++ord,
    });
  }

  for (let n = 21; n <= 35; n++) {
    const ca = answers.get(n);
    if (!ca || !['A', 'B', 'C'].includes(ca)) throw new Error(`ABC — ${n}`);
    const nextNum = n < 35 ? n + 1 : null;
    const endM = n === 35 ? /二、阅/ : undefined;
    const blk = blockBetweenNum(listen, n, nextNum, endM);
    const tri = parseThreeOptions(blk);
    if (!tri) throw new Error(`Сонголт задлах — ${n}`);
    const opts = [`A ${tri[0]}`, `B ${tri[1]}`, `C ${tri[2]}`];
    const ix = ca === 'A' ? 0 : ca === 'B' ? 1 : 2;
    const pre = collapseWs((blk.split(/A\s+/)[0] ?? '').replace(/^(\d+\s*[．.])\s*/, ''));
    out.push({
      section: 'listening',
      part_num: n <= 30 ? 3 : 4,
      question_num: n,
      audio_text: pre || `听力 第${n}题。`,
      question_text: '',
      question_pinyin: '',
      options: opts,
      correct_answer: opts[ix]!,
      order_num: ++ord,
    });
  }

  return out;
}
