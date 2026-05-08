import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import type { AdminChapter } from '../types';
import { LessonEditorPanel } from './LessonEditorPanel';

type Props = { token: string };

export function LearningPathView({ token }: Props) {
  const [tree, setTree] = useState<AdminChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selLessonId, setSelLessonId] = useState<number | null>(null);
  const [draftTitles, setDraftTitles] = useState<Record<number, string>>({});

  const reloadTree = () => {
    adminApi.lessonTree(token).then((r) => setTree(r.data ?? [])).catch((e) => setError((e as Error).message));
  };

  useEffect(() => {
    setLoading(true);
    adminApi
      .lessonTree(token)
      .then((r) => setTree(r.data ?? []))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [token]);

  const saveChapterDelay = async (ch: AdminChapter, days: number) => {
    await adminApi.chapters.patch(token, ch.id, { flashcard_delay_days: days });
    reloadTree();
  };

  const toggleChapterPub = async (ch: AdminChapter) => {
    await adminApi.chapters.patch(token, ch.id, { is_published: ch.is_published ? 0 : 1 });
    reloadTree();
  };

  const addLesson = async (chapterId: number) => {
    const title = draftTitles[chapterId]?.trim();
    if (!title) return;
    await adminApi.lessons.create(token, { chapter_id: chapterId, title_mn: title });
    setDraftTitles((d) => ({ ...d, [chapterId]: '' }));
    reloadTree();
  };

  const selLesson =
    selLessonId === null
      ? null
      : tree.flatMap((c) => c.lessons ?? []).find((l) => l.id === selLessonId) ?? null;

  if (loading) return <p>Уншиж байна...</p>;
  if (error) return <p style={{ color: 'var(--error)' }}>{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Суралцах зам (HSK бүлэг)</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
          Цээжлэх картанд орох хүлээлт — бүлэг тус бүрээр (хоног).
        </p>
      </div>

      {tree.map((ch) => (
        <div key={ch.id} className="card">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <strong>{ch.title_mn}</strong>
            <span className="badge badge-success">HSK {ch.hsk_level}</span>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              Карт хүлээлт (хоног)
              <input
                type="number"
                min={0}
                max={365}
                className="form-control"
                style={{ width: 72 }}
                defaultValue={ch.flashcard_delay_days}
                key={`delay-${ch.id}-${ch.flashcard_delay_days}`}
                onBlur={(e) => void saveChapterDelay(ch, Number(e.target.value))}
              />
            </label>
            <button type="button" className="btn-secondary" onClick={() => void toggleChapterPub(ch)}>
              {ch.is_published ? 'Нууцлах' : 'Нийтлэх'}
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4 style={{ marginBottom: 8 }}>Хичээлүүд</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Гарчиг</th>
                    <th>Үг</th>
                    <th>Төлөв</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {(ch.lessons ?? []).map((ls) => (
                    <tr key={ls.id}>
                      <td>{ls.id}</td>
                      <td>{ls.title_mn}</td>
                      <td>{ls.word_count}</td>
                      <td>{ls.is_published ? 'Нээлттэй' : 'Нууцлагдсан'}</td>
                      <td>
                        <button type="button" className="btn-small" onClick={() => setSelLessonId(ls.id)}>
                          Засах
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                className="form-control"
                style={{ maxWidth: 280 }}
                placeholder="Шинэ хичээлийн гарчиг"
                value={draftTitles[ch.id] ?? ''}
                onChange={(e) => setDraftTitles((d) => ({ ...d, [ch.id]: e.target.value }))}
              />
              <button type="button" className="btn-primary" onClick={() => void addLesson(ch.id)}>
                Хичээл нэмэх
              </button>
            </div>
          </div>
        </div>
      ))}

      {selLesson && (
        <LessonEditorPanel
          token={token}
          lesson={selLesson}
          onClose={() => setSelLessonId(null)}
          reloadTree={reloadTree}
        />
      )}
    </div>
  );
}
