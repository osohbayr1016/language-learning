/** Profile JWT/API — админ эсэхийг тэгш хэмжээнд уншина. */
export function isTruthyAdmin(v: unknown): boolean {
  if (v === true) return true;
  return Number(v) === 1;
}
