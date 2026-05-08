/** Compare user answer with stored correct_answer for grammar exercises */
export function grammarAnswerCorrect(
  exerciseType: string,
  userAnswerRaw: unknown,
  correctAnswer: string
): boolean {
  const c = String(correctAnswer ?? '').trim();
  if (!c) return false;
  if (exerciseType === 'true_false') {
    let u: string;
    if (typeof userAnswerRaw === 'boolean') u = userAnswerRaw ? 'true' : 'false';
    else u = String(userAnswerRaw ?? '').trim();
    return u.toLowerCase() === c.toLowerCase();
  }
  const u = String(userAnswerRaw ?? '').trim();
  return u === c;
}
