import { useEffect, useState, type FormEvent } from 'react';
import { adminApi, type Word } from '../api';

type Row = { word_id: number; start_s: number; end_s: number };

type Props = { token: string; cartoonId: number; onDone?: () => void };

export function CartoonWordsForm({ token, cartoonId, onDone }: Props) {
  const [words, setWords] = useState<Word[]>([]);
  const [rows, setRows] = useState<Row[]>([{ word_id: 0, start_s: 0, end_s: 5 }]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    adminApi.words.list(undefined, 1)
      .then((r) => setWords(r.data ?? []))
      .catch(() => setWords([]));
  }, []);

  const update = (i: number, key: keyof Row, value: number) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const items = rows.filter((r) => r.word_id > 0);
    if (items.length === 0) { setStatus('Дор хаяж нэг үг сонгоно уу'); return; }
    try {
      await adminApi.cartoons.attachWords(token, cartoonId, items);
      setStatus(`${items.length} үг нэмэгдлээ`);
      onDone?.();
    } catch (e) {
      setStatus(`Алдаа: ${(e as Error).message}`);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, marginTop: 16 }}>
      <h3>Үгсийг цаг хугацаатай нэмэх (#{cartoonId})</h3>
      <form onSubmit={submit}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <select className="form-control" value={row.word_id} onChange={(e) => update(i, 'word_id', parseInt(e.target.value, 10))}>
              <option value={0}>— Үг сонгох —</option>
              {words.map((w) => <option key={w.id} value={w.id}>{w.hanzi} ({w.meaning_mn})</option>)}
            </select>
            <input className="form-control" type="number" step={0.1} placeholder="start" style={{ width: 90 }}
              value={row.start_s} onChange={(e) => update(i, 'start_s', parseFloat(e.target.value))} />
            <input className="form-control" type="number" step={0.1} placeholder="end" style={{ width: 90 }}
              value={row.end_s} onChange={(e) => update(i, 'end_s', parseFloat(e.target.value))} />
          </div>
        ))}
        <button type="button" onClick={() => setRows((r) => [...r, { word_id: 0, start_s: 0, end_s: 5 }])}>
          + Мөр нэмэх
        </button>
        <div style={{ marginTop: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <button type="submit" className="btn-primary">Хадгалах</button>
          {status ? <span style={{ color: status.startsWith('Алдаа') ? 'var(--error)' : 'var(--text-secondary)' }}>{status}</span> : null}
        </div>
      </form>
    </div>
  );
}
