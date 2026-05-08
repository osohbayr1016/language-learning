/** Дахин санах огноог хэрэглэгчийн орон нутгийн форматаар (UB timezone). */
export function formatNextReviewDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      timeZone: 'Asia/Ulaanbaatar',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return new Date(iso).toLocaleDateString();
  }
}
