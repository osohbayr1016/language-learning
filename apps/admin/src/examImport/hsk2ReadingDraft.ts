import type { ExamDraftQuestion } from './examDraftTypes';
import {
  blockBetweenNum,
  collapseWs,
  extractSixLetterLabels,
  sliceBetween,
} from './hsk2TextHelpers';

const LET_SET = new Set(['A', 'B', 'C', 'D', 'E', 'F']);

function pickSix(correctLetter: string, opts: string[]): string {
  const row =
    opts.find((o) => o.startsWith(`${correctLetter} `)) ?? opts.find((o) => o[0] === correctLetter);
  if (!row) throw new Error(`Сонголт байхгүй: ${correctLetter}`);
  return row;
}

export function buildReadingDraft(
  exam: string,
  answers: Map<number, string>,
  startOrder: number
): ExamDraftQuestion[] {
  const read = sliceBetween(exam, /二、阅/, /$/) || exam;
  const out: ExamDraftQuestion[] = [];
  let ord = startOrder;

  const p1 = sliceBetween(read, /第\s*36-40\s*题/, /第\s*二\s*部\s*分/);
  const ex1 = p1.split(/例如：/);
  const six1 = extractSixLetterLabels(ex1[0] || '');
  const sent1 = ex1[1] || '';
  for (let n = 36; n <= 40; n++) {
    const ca = answers.get(n);
    if (!ca || !LET_SET.has(ca)) throw new Error(`36–40 алдаа (${n})`);
    const blk = blockBetweenNum(sent1, n, n < 40 ? n + 1 : null, /第\s*二\s*部\s*分/);
    const stem = collapseWs((blk || '').replace(/^\d+\s*[．.]\s*/, ''));
    out.push({
      section: 'reading',
      part_num: 1,
      question_num: n,
      audio_text: '',
      question_text: stem || `阅读 第${n}题`,
      question_pinyin: '',
      options: six1,
      correct_answer: pickSix(ca, six1),
      order_num: ++ord,
    });
  }

  const p2 = sliceBetween(read, /第\s*41-45\s*题/, /第\s*三\s*部\s*分/);
  const ex2 = p2.split(/例如：/);
  const six2 = extractSixLetterLabels(ex2[0] || '');
  const sent2 = ex2[1] || '';
  for (let n = 41; n <= 45; n++) {
    const ca = answers.get(n);
    if (!ca || !LET_SET.has(ca)) throw new Error(`41–45 алдаа (${n})`);
    const blk = blockBetweenNum(sent2, n, n < 45 ? n + 1 : null, /第\s*三\s*部\s*分/);
    const stem = collapseWs((blk || '').replace(/^\d+\s*[．.]\s*/, ''));
    out.push({
      section: 'reading',
      part_num: 2,
      question_num: n,
      audio_text: '',
      question_text: stem || `阅读 第${n}题`,
      question_pinyin: '',
      options: six2,
      correct_answer: pickSix(ca, six2),
      order_num: ++ord,
    });
  }

  const p3 = sliceBetween(read, /第\s*46-50\s*题/, /第\s*四\s*部\s*分/);
  const [, sent46 = ''] = p3.split(/例如：/);
  const optsTf = ['√', '×'];
  for (let n = 46; n <= 50; n++) {
    const ca = answers.get(n);
    if (!ca || (ca !== '√' && ca !== '×')) throw new Error(`46–50 алдаа (${n})`);
    const blk = blockBetweenNum(sent46, n, n < 50 ? n + 1 : null, /第\s*四\s*部\s*分/);
    let stem = collapseWs((blk || '').replace(/^\d+\s*[．.]\s*/, ''));
    if (stem.length < 6)
      stem = `阅读第三部分 第${n}题。根据陈述判断与原句陈述是否一致（√ / ×）。`;
    out.push({
      section: 'reading',
      part_num: 3,
      question_num: n,
      audio_text: '',
      question_text: stem,
      question_pinyin: '',
      options: optsTf,
      correct_answer: ca,
      order_num: ++ord,
    });
  }

  const c51 = sliceBetween(read, /第\s*51-55\s*题/, /第\s*56-60\s*题/);
  const [ltr51 = '', rst51 = ''] = c51.split(/例如：/) as [string, string];
  const six51 = extractSixLetterLabels(ltr51);
  const s51 = rst51.split(/第\s*56-60\s*题/)[0] || rst51;
  for (let n = 51; n <= 55; n++) {
    const ca = answers.get(n);
    if (!ca || !LET_SET.has(ca)) throw new Error(`51–55 алдаа (${n})`);
    const blk = blockBetweenNum(s51, n, n < 55 ? n + 1 : null, /第\s*56-60\s*题/);
    const stem = collapseWs((blk || '').replace(/^\d+\s*[．.]\s*/, ''));
    out.push({
      section: 'reading',
      part_num: 4,
      question_num: n,
      audio_text: '',
      question_text: stem || `阅读 第${n}题`,
      question_pinyin: '',
      options: six51,
      correct_answer: pickSix(ca, six51),
      order_num: ++ord,
    });
  }

  const c56 = sliceBetween(read, /第\s*56-60\s*题/, /$/) || '';
  const ex56 = c56.split(/例如：/);
  const six56 = extractSixLetterLabels(ex56[0] || '');
  const tail56 = ex56[1] || '';
  for (let n = 56; n <= 60; n++) {
    const ca = answers.get(n);
    if (!ca || !LET_SET.has(ca)) throw new Error(`56–60 алдаа (${n})`);
    const blk = blockBetweenNum(tail56, n, n < 60 ? n + 1 : null, undefined);
    const stem = collapseWs((blk || '').replace(/^\d+\s*[．.]\s*/, ''));
    out.push({
      section: 'reading',
      part_num: 4,
      question_num: n,
      audio_text: '',
      question_text: stem || `阅读 第${n}题`,
      question_pinyin: '',
      options: six56,
      correct_answer: pickSix(ca, six56),
      order_num: ++ord,
    });
  }

  return out;
}
