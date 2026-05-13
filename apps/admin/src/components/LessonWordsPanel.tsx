import { useEffect, useRef, useState } from 'react';
import { adminApi } from '../adminApi';
import type { LessonWordRow, Word } from '../types';

type Props = { token: string; lessonId: number | null };

export function LessonWordsPanel({ token, lessonId }: Props) {
  const [rows, setRows] = useState<LessonWordRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  // Search-by-hanzi word picker
  const [pickerQ, setPickerQ] = useState('');
  const [pickerResults, setPickerResults] = useState<Word[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = () => {
    if (!lessonId) { setRows([]); return; }
    adminApi.lessonWords
      .list(token, lessonId)
      .then((r) => setRows(r.data ?? []))
      .catch((e) => setMsg((e as Error).message));
  };

  useEffect(() => {
    setMsg(null);
    setPickerQ('');
    setPickerResults([]);
    setSelectedWord(null);
    load();
  }, [token, lessonId]);

  if (!lessonId) return null;

  const handlePickerSearch = (val: string) => {
    setPickerQ(val);
    setSelectedWord(null);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!val.trim()) { setPickerResults([]); return; }
    searchTimer.current = setTimeout(() => {
      setPickerLoading(true);
      adminApi.words
        .list(val.trim(), undefined, 10, 0)
        .then((r) => setPickerResults(Array.isArray(r.data) ? r.data : []))
        .catch(console.error)
        .finally(() => setPickerLoading(false));
    }, 300);
  };

  const add = async () => {
    if (!selectedWord) return;
    setMsg(null);
    try {
      await adminApi.lessonWords.add(token, lessonId, selectedWord.id);
      setPickerQ('');
      setPickerResults([]);
      setSelectedWord(null);
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
      <h3 className="page-title" style={{ fontSize: 18, marginBottom: 16 }}>Хичээлийн үгс</h3>
      {msg && <p style={{ color: 'var(--error)', marginBottom: 8 }}>{msg}</p>}

      {/* Hanzi search picker */}
      <div style={{ marginBottom: 16 }}>
        <label className="form-label">Үг нэмэх (ханзаар хайх)</label>
        <div style={{ position: 'relative' }}>
          <input
            className="form-control"
            placeholder="Ханз бичнэ үү... e.g. 你好"
            value={pickerQ}
            onChange={(e) => handlePickerSearch(e.target.value)}
          />
          {pickerResults.length > 0 && !selectedWord && (
            <div className="picker-dropdown">
              {pickerLoading && <div className="picker-loading">Хайж байна...</div>}
              {pickerResults.map((w) => (
                <div
                  key={w.id}
                  className="picker-option"
                  onClick={() => {
                    setSelectedWord(w);
                    setPickerQ(`${w.hanzi} — ${w.pinyin} (${w.meaning_mn})`);
                    setPickerResults([]);
                  }}
                >
                  <span className="picker-hanzi">{w.hanzi}</span>
                  <span className="picker-pinyin">{w.pinyin}</span>
                  <span className="picker-meaning">{w.meaning_mn}</span>
                  <span className="picker-hsk">HSK{w.hsk_level}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedWord && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
            <span className="picker-selected-tag">
              ✓ {selectedWord.hanzi} ({selectedWord.pinyin})
            </span>
            <button type="button" className="btn-primary btn-sm" onClick={() => void add()}>
              Нэмэх
            </button>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => { setSelectedWord(null); setPickerQ(''); }}
            >
              Болих
            </button>
          </div>
        )}
      </div>

      {/* Word table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Ханз</th>
              <th>Pinyin</th>
              <th>Утга</th>
              <th>HSK</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.lesson_id}-${r.word_id}`}>
                <td style={{ color: 'var(--text-secondary)' }}>{r.order_num}</td>
                <td style={{ fontSize: 20, fontWeight: 700 }}>{r.hanzi}</td>
                <td>{r.pinyin}</td>
                <td>{r.meaning_mn}</td>
                <td>{r.hsk_level}</td>
                <td>
                  <button type="button" className="btn-small" onClick={() => void remove(r.word_id)}>
                    Хасах
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 24 }}>
                  Үг байхгүй байна
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
