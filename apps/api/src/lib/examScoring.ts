/** Section weights aligned with templates using max_score=200 (listening 100 + reading 100). */
export const SECTION_SCORE_CAPS = {
  listening: 100,
  reading: 100,
} as const;

type MinimalQ = { id: number; section: string };

export function sectionalScores<
  Q extends MinimalQ & { correct_answer?: string },
>(questions: Q[], correctnessById: Map<number, boolean>): {
  listening: number;
  reading: number;
  total: number;
} {
  let lHits = 0;
  let lTot = 0;
  let rHits = 0;
  let rTot = 0;
  for (const q of questions) {
    if (q.section === 'listening') {
      lTot++;
      if (correctnessById.get(q.id)) lHits++;
    } else if (q.section === 'reading') {
      rTot++;
      if (correctnessById.get(q.id)) rHits++;
    }
  }
  const capL = SECTION_SCORE_CAPS.listening;
  const capR = SECTION_SCORE_CAPS.reading;

  const listening = lTot > 0 ? Math.round((lHits / lTot) * capL) : capL;
  const reading = rTot > 0 ? Math.round((rHits / rTot) * capR) : capR;
  const total = Math.min(capL + capR, listening + reading);
  return { listening, reading, total };
}

export function examAnswerOk(type: string, userRaw: unknown, correct: string): boolean {
  const u = String(userRaw ?? '').trim();
  const c = String(correct ?? '').trim();
  if (type === 'word_picture') {
    const ok = ['true', 'false'].includes(u.toLowerCase()) && u.toLowerCase() === c.toLowerCase();
    return ok;
  }
  if (type === 'picture_match')
    return u.toLowerCase() === c.toLowerCase();
  return u === c;
}
