import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import type { AdminLesson } from '../types';
import { LessonWordsPanel } from './LessonWordsPanel';

type Props = {
  token: string;
  lesson: AdminLesson;
  onClose: () => void;
  reloadTree: () => void;
};

export function LessonEditorPanel({ token, lesson: initial, onClose, reloadTree }: Props) {
  const [sel, setSel] = useState(initial);

  useEffect(() => {
    setSel(initial);
  }, [initial]);

  const saveLesson = async () => {
    await adminApi.lessons.patch(token, sel.id, {
      title_mn: sel.title_mn,
      subtitle_mn: sel.subtitle_mn,
      icon: sel.icon,
      is_published: sel.is_published,
    });
    reloadTree();
  };

  const del = async () => {
    await adminApi.lessons.delete(token, sel.id);
    onClose();
    reloadTree();
  };

  return (
    <div className="card">
      <h3>Хичээл #{sel.id}</h3>
      <div className="form-group">
        <label className="form-label">Гарчиг</label>
        <input
          className="form-control"
          value={sel.title_mn}
          onChange={(e) => setSel({ ...sel, title_mn: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Дэд гарчиг</label>
        <input
          className="form-control"
          value={sel.subtitle_mn}
          onChange={(e) => setSel({ ...sel, subtitle_mn: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Icon</label>
        <input
          className="form-control"
          value={sel.icon}
          onChange={(e) => setSel({ ...sel, icon: e.target.value })}
        />
      </div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        <input
          type="checkbox"
          checked={!!sel.is_published}
          onChange={(e) => setSel({ ...sel, is_published: e.target.checked ? 1 : 0 })}
        />
        Нийтлэх
      </label>
      <button type="button" className="btn-primary" style={{ marginRight: 8 }} onClick={() => void saveLesson()}>
        Хадгалах
      </button>
      <button type="button" className="btn-secondary" style={{ marginRight: 8 }} onClick={onClose}>
        Хаах
      </button>
      <button type="button" className="btn-secondary" onClick={() => void del()}>
        Устгах
      </button>
      <LessonWordsPanel token={token} lessonId={sel.id} />
    </div>
  );
}
