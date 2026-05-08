import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import type { LessonWordRow } from '../types';

type Props = { token: string; lessonId: number | null };

export function LessonWordsPanel({ token, lessonId }: Props) {
  const [rows, setRows] = useState<LessonWordRow[]>([]);
  const [addId, setAddId] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const load = () => {
    if (!lessonId) {
      setRows([]);
      return;
    }
    adminApi.lessonWords
      .list(token, lessonId)
      .then((r) => setRows(r.data ?? []))
      .catch((e) => setMsg((e as Error).message));
  };

  useEffect(() => {
    setMsg(null);
    load();
  }, [token, lessonId]);

  if (!lessonId) return null;

  const add = async () => {
    const id = Number(addId.trim());
    if (!Number.isFinite(id)) return;
    setMsg(null);
    try {
      await adminApi.lessonWords.add(token, lessonId, id);
      setAddId('');
      load();
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  const remove = async (wid: number) => {
    try {
      await adminApi.lessonWords.remove(token, lessonId, wid);
      load();
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 className="page-title" style={{ fontSize: 18 }}>Хичээлийн үгс</h3>
      {msg && <p style={{ color: 'var(--error)' }}>{msg}</p>}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input
          className="form-control"
          style={{ maxWidth: 120 }}
          placeholder="word_id"
          value={addId}
          onChange={(e) => setAddId(e.target.value)}
        />
        <button type="button" className="btn-primary" onClick={() => void add()}>
          Нэмэх
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Үг ID</th>
              <th>Ханз</th>
              <th>Pinyin</th>
              <th>Утга</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.lesson_id}-${r.word_id}`}>
                <td>{r.order_num}</td>
                <td>{r.word_id}</td>
                <td>{r.hanzi}</td>
                <td>{r.pinyin}</td>
                <td>{r.meaning_mn}</td>
                <td>
                  <button type="button" className="btn-small" onClick={() => void remove(r.word_id)}>
                    Хасах
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
