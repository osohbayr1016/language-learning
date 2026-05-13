import { useCallback, useState } from 'react';
import { api } from '../../lib/api';
import type { AdminChapter } from '../../lib/api/admin';
import { colors } from '../../theme';
import { adminNotify } from './adminNotify';
import { firstSelectableChapterId } from './adminLessonHtmlChapterRows';

export function useLessonHtmlImportChapters(token: string | null) {
  const [chapters, setChapters] = useState<AdminChapter[]>([]);
  const [chapterId, setChapterId] = useState<number | null>(null);
  const [creatingHsk, setCreatingHsk] = useState<number | null>(null);

  const loadTree = useCallback(
    async (opts?: { selectId?: number }) => {
      if (!token) return;
      const r = await api.admin.lessonTree(token);
      const list = Array.isArray(r.data) ? r.data : [];
      setChapters(list);
      setChapterId((old) => {
        const want = opts?.selectId;
        if (want != null && list.some((c) => c.id === want)) return want;
        if (old != null && list.some((c) => c.id === old)) return old;
        return firstSelectableChapterId(list);
      });
    },
    [token]
  );

  const ensureChapterForHsk = useCallback(
    async (hsk: number) => {
      if (!token) return;
      setCreatingHsk(hsk);
      try {
        const maxOrder = chapters.reduce((m, c) => Math.max(m, c.order_num), 0);
        const k = Math.min(6, Math.max(1, hsk)) as 1 | 2 | 3 | 4 | 5 | 6;
        const res = await api.admin.createChapter(token, {
          title_mn: `HSK ${hsk}`,
          subtitle_mn: 'HTML импорт',
          hsk_level: hsk,
          color: colors.hsk[k],
          order_num: maxOrder + 1,
        });
        await loadTree({ selectId: res.data.id });
      } catch (e) {
        adminNotify('Бүлэг үүсгэх', (e as Error).message);
      } finally {
        setCreatingHsk(null);
      }
    },
    [token, chapters, loadTree]
  );

  return {
    chapters,
    chapterId,
    setChapterId,
    creatingHsk,
    loadTree,
    ensureChapterForHsk,
  };
}
