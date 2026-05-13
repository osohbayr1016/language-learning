import { api } from '../../lib/api';
import type { LessonDetail } from '../../lib/types';

export async function fetchLessonSessionDetail(opts: {
  lessonId: number;
  token: string | null | undefined;
  adminPreview: boolean;
}): Promise<{ data: LessonDetail }> {
  const { lessonId, token, adminPreview } = opts;
  if (adminPreview) {
    if (!token) throw new Error('Нэвтрэх шаардлагатай');
    return api.admin.lessonPreview(token, lessonId);
  }
  if (token) return api.lessons.get(token, lessonId);
  return api.lessons.publicDetail(lessonId);
}
