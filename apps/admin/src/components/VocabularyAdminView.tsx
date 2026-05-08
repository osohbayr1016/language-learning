import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import type { Word } from '../types';

type Props = { token: string };

export function VocabularyAdminView({ token }: Props) {
  const [rows, setRows] = useState<Word[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [hsk, setHsk] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState<Word | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.words
      .list(q || undefined, hsk === '' ? undefined : Number(hsk), 50, 0)
      .then((r) => {
        setRows(Array.isArray(r.data) ? r.data : []);
        setTotal(typeof r.total === 'number' ? r.total : 0);
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const saveEdit = async () => {
    if (!edit) return;
    await adminApi.words.update(token, edit.id, edit);
    setEdit(null);
    load();
  };

  const del = async (id: number) => {
    if (!globalThis.confirm?.('Устгах уу?')) return;
    await adminApi.words.delete(token, id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Үгийн сан</h1>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <input className="form-control" style={{ flex: 1, minWidth: 160 }} placeholder="Хайх..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="form-control" style={{ width: 120 }} value={hsk} onChange={(e) => setHsk(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">Бүх HSK</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                HSK {n}
              </option>
            ))}
          </select>
          <button type="button" className="btn-primary" onClick={() => load()}>
            Шүүх
          </button>
        </div>
        {loading ? <p>Уншиж байна...</p> : error ? <p style={{ color: 'var(--error)' }}>{error}</p> : null}
        {!loading && !error && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>Нийт: {total}</p>
        )}
        {!loading && !error && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ханз</th>
                  <th>Pinyin</th>
                  <th>Утга</th>
                  <th>HSK</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((w) => (
                  <tr key={w.id}>
                    <td>{w.id}</td>
                    <td>{w.hanzi}</td>
                    <td>{w.pinyin}</td>
                    <td>{w.meaning_mn}</td>
                    <td>{w.hsk_level}</td>
                    <td>
                      <button type="button" className="btn-small" style={{ marginRight: 8 }} onClick={() => setEdit(w)}>
                        Засах
                      </button>
                      <button type="button" className="btn-small" onClick={() => void del(w.id)}>
                        Устгах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {edit && (
        <div className="card">
          <h3>Засах #{edit.id}</h3>
          <div className="form-group">
            <label className="form-label">Ханз</label>
            <input className="form-control" value={edit.hanzi} onChange={(e) => setEdit({ ...edit, hanzi: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Pinyin</label>
            <input className="form-control" value={edit.pinyin} onChange={(e) => setEdit({ ...edit, pinyin: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Утга (MN)</label>
            <input className="form-control" value={edit.meaning_mn} onChange={(e) => setEdit({ ...edit, meaning_mn: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">HSK</label>
            <input
              type="number"
              min={1}
              max={6}
              className="form-control"
              value={edit.hsk_level}
              onChange={(e) => setEdit({ ...edit, hsk_level: Number(e.target.value) || 1 })}
            />
          </div>
          <button type="button" className="btn-primary" style={{ marginRight: 8 }} onClick={() => void saveEdit()}>
            Хадгалах
          </button>
          <button type="button" className="btn-secondary" onClick={() => setEdit(null)}>
            Цуцлах
          </button>
        </div>
      )}
    </div>
  );
}
