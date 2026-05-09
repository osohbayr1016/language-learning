import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { safeBack } from '../../lib/navigation/safeBack';
import type { AdminChapter, AdminLesson, LessonWordLink } from '../../lib/api/admin';
import { adminNotify } from './adminNotify';

export function useAdminLessonEditor(opts: {
  token: string | null;
  lessonId: number;
}) {
  const { token, lessonId: lid } = opts;
  const router = useRouter();

  const [words, setWords] = useState<LessonWordLink[]>([]);
  const [titleMn, setTitleMn] = useState('');
  const [subMn, setSubMn] = useState('');
  const [icon, setIcon] = useState('book');
  const [pub, setPub] = useState(true);
  const [widAdd, setWidAdd] = useState('');
  const [lesson, setLesson] = useState<AdminLesson | null>(null);
  const [loading, setLoading] = useState(true);

  const findLesson = useCallback(
    (chapters: AdminChapter[]) => {
      for (const ch of chapters) {
        const hit = (ch.lessons ?? []).find((l) => l.id === lid);
        if (hit) return hit;
      }
      return null;
    },
    [lid]
  );

  const reload = useCallback(async () => {
    if (!token || !Number.isFinite(lid)) return;
    setLoading(true);
    try {
      const r = await api.admin.lessonTree(token);
      const ch = Array.isArray(r.data) ? r.data : [];
      const ls = findLesson(ch);
      setLesson(ls);
      if (ls) {
        setTitleMn(ls.title_mn);
        setSubMn(ls.subtitle_mn);
        setIcon(ls.icon);
        setPub(!!ls.is_published);
      }
      const w = await api.admin.lessonWords(token, lid);
      setWords(Array.isArray(w.data) ? w.data : []);
    } catch (e) {
      adminNotify('Алдаа', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token, lid, findLesson]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveMeta = async () => {
    if (!token || !Number.isFinite(lid)) return;
    try {
      await api.admin.patchLesson(token, lid, {
        title_mn: titleMn.trim(),
        subtitle_mn: subMn.trim(),
        icon: icon.trim() || 'book',
        is_published: pub ? 1 : 0,
      });
      adminNotify('Хадгалагдлаа');
      await reload();
    } catch (e) {
      adminNotify('Алдаа', (e as Error).message);
    }
  };

  const delLesson = async () => {
    if (!token || !Number.isFinite(lid)) return;
    try {
      await api.admin.deleteLesson(token, lid);
      safeBack(router, '/admin/learning-path');
    } catch (e) {
      adminNotify('Алдаа', (e as Error).message);
    }
  };

  const addW = async () => {
    const w = Number(widAdd.trim());
    if (!token || !Number.isFinite(w) || !Number.isFinite(lid)) return;
    try {
      await api.admin.addLessonWord(token, lid, w);
      setWidAdd('');
      await reload();
    } catch (e) {
      adminNotify('Алдаа', (e as Error).message);
    }
  };

  const rmW = async (wordId: number) => {
    if (!token || !Number.isFinite(lid)) return;
    try {
      await api.admin.removeLessonWord(token, lid, wordId);
      await reload();
    } catch (e) {
      adminNotify('Алдаа', (e as Error).message);
    }
  };

  const moveWord = useCallback(
    async (fromIdx: number, toIdx: number) => {
      if (!token || !Number.isFinite(lid)) return;
      const ids = words.map((w) => w.word_id);
      if (fromIdx < 0 || fromIdx >= ids.length || toIdx < 0 || toIdx >= ids.length) return;
      const next = [...ids];
      const [it] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, it);
      try {
        await api.admin.reorderLessonWords(token, lid, next);
        await reload();
      } catch (e) {
        adminNotify('Алдаа', (e as Error).message);
      }
    },
    [token, lid, words, reload]
  );

  const moveUp = (idx: number) => void moveWord(idx, idx - 1);
  const moveDown = (idx: number) => void moveWord(idx, idx + 1);

  return {
    words,
    titleMn,
    subMn,
    icon,
    pub,
    widAdd,
    lesson,
    loading,
    setTitleMn,
    setSubMn,
    setIcon,
    setPub,
    setWidAdd,
    saveMeta,
    delLesson,
    addW,
    rmW,
    moveUp,
    moveDown,
  };
}
