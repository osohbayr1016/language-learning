import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { ExamTemplate } from '../../lib/api/exams';
import type { HskLevel, ImportedLessonContent } from '../../lib/types';

export type LessonDoneMockExam = {
  templateId: number | null;
  loading: boolean;
  usedExplicitId: boolean;
  /** Ижил HSK-ийн олон нийтлэг загвараас ID хамгийн ихийг сонгов */
  usedHskMaxIdFallback: boolean;
};

function pickByHsk(templates: ExamTemplate[], hsk: HskLevel): { id: number; multiple: boolean } | null {
  const match = templates.filter((t) => t.jlpt_level === hsk);
  if (!match.length) return null;
  if (match.length === 1) return { id: match[0]!.id, multiple: false };
  const maxId = Math.max(...match.map((t) => t.id));
  return { id: maxId, multiple: true };
}

export function useLessonDoneMockExam(
  token: string | null | undefined,
  imported: ImportedLessonContent | null | undefined,
  chapterHsk: HskLevel | undefined
): LessonDoneMockExam {
  const [templates, setTemplates] = useState<ExamTemplate[] | null>(null);

  useEffect(() => {
    if (!token) {
      setTemplates([]);
      return;
    }
    let cancelled = false;
    void api.exams
      .templates(token)
      .then((r) => {
        if (!cancelled) setTemplates(r.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setTemplates([]);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token || templates === null) {
    return {
      templateId: null,
      loading: true,
      usedExplicitId: false,
      usedHskMaxIdFallback: false,
    };
  }

  const explicit = imported?.mock_exam_template_id;
  if (explicit != null && templates.some((t) => t.id === explicit)) {
    return {
      templateId: explicit,
      loading: false,
      usedExplicitId: true,
      usedHskMaxIdFallback: false,
    };
  }

  if (imported?.mock_exam_template_id != null && !templates.some((t) => t.id === imported.mock_exam_template_id)) {
    if (chapterHsk != null) {
      const picked = pickByHsk(templates, chapterHsk);
      if (picked) {
        return {
          templateId: picked.id,
          loading: false,
          usedExplicitId: false,
          usedHskMaxIdFallback: picked.multiple,
        };
      }
    }
    return {
      templateId: null,
      loading: false,
      usedExplicitId: false,
      usedHskMaxIdFallback: false,
    };
  }

  if (chapterHsk == null) {
    return {
      templateId: null,
      loading: false,
      usedExplicitId: false,
      usedHskMaxIdFallback: false,
    };
  }

  const picked = pickByHsk(templates, chapterHsk);
  if (!picked) {
    return {
      templateId: null,
      loading: false,
      usedExplicitId: false,
      usedHskMaxIdFallback: false,
    };
  }

  return {
    templateId: picked.id,
    loading: false,
    usedExplicitId: false,
    usedHskMaxIdFallback: picked.multiple,
  };
}
