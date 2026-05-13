import { useEffect, useRef, useState, useCallback } from 'react';
import { adminApi } from '../adminApi';
import type { AdminChapter, Word } from '../types';

type Props = { token: string };

type Tab = 'basic' | 'listening' | 'writing' | 'lesson';

const HSK_COLORS: Record<number, string> = {
  1: '#10B981', 2: '#3B82F6', 3: '#8B5CF6',
  4: '#F59E0B', 5: '#EF4444', 6: '#EC4899',
};

const POS_OPTIONS = [
  'noun', 'verb', 'adjective', 'adverb', 'pronoun',
  'measure word', 'conjunction', 'preposition', 'particle', 'interjection', 'numeral', 'other',
];

/* ─── helpers ─── */
function hskBadge(level: number) {
  const color = HSK_COLORS[level] ?? '#94A3B8';
  return (
    <span className="hsk-badge" style={{ background: color + '22', color, borderColor: color + '55' }}>
      HSK {level}
    </span>
  );
}

/* ─── Lesson picker inside the Lesson tab ─── */
function LessonTab({
  token, wordId, tree,
}: { token: string; wordId: number; tree: AdminChapter[] }) {
  const [searchQ, setSearchQ] = useState('');
  const [addLessonId, setAddLessonId] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // flatten lessons for search
  const allLessons = tree.flatMap((ch) =>
    (ch.lessons ?? []).map((ls) => ({ ...ls, chapterTitle: ch.title_mn, hsk: ch.hsk_level }))
  );
  const filtered = searchQ.trim()
    ? allLessons.filter((l) =>
        l.title_mn.toLowerCase().includes(searchQ.toLowerCase()) ||
        l.chapterTitle.toLowerCase().includes(searchQ.toLowerCase())
      )
    : allLessons;

  const addToLesson = async () => {
    if (!addLessonId) return;
    setMsg(null);
    setSuccess(null);
    try {
      await adminApi.lessonWords.add(token, addLessonId, wordId);
      setSuccess('Хичээлд нэмэгдлээ ✓');
      setAddLessonId(null);
    } catch (e) {
      setMsg((e as Error).message);
    }
  };

  return (
    <div className="tab-section">
      <p className="tab-hint">Энэ үгийг аль хичээлд нэмэх вэ?</p>
      <div className="form-group">
        <label className="form-label">Хичээл хайх</label>
        <input
          className="form-control"
          placeholder="Хичээлийн нэр..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
        />
      </div>
      <div className="lesson-picker-list">
        {filtered.slice(0, 20).map((ls) => (
          <div
            key={ls.id}
            className={`lesson-picker-item ${addLessonId === ls.id ? 'selected' : ''}`}
            onClick={() => setAddLessonId(ls.id)}
          >
            <span className="lesson-picker-hsk" style={{ color: HSK_COLORS[ls.hsk] ?? '#94A3B8' }}>
              HSK{ls.hsk}
            </span>
            <span className="lesson-picker-chapter">{ls.chapterTitle}</span>
            <span className="lesson-picker-sep">›</span>
            <span className="lesson-picker-name">{ls.title_mn}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, padding: '8px 0' }}>
            Хичээл олдсонгүй
          </p>
        )}
      </div>
      {addLessonId && (
        <button type="button" className="btn-primary" style={{ marginTop: 12 }} onClick={() => void addToLesson()}>
          Нэмэх
        </button>
      )}
      {msg && <p className="form-error">{msg}</p>}
      {success && <p className="form-success">{success}</p>}
    </div>
  );
}

/* ─── Word Detail Panel ─── */
function WordDetail({
  token, word: initialWord, tree, onSaved, onDeleted, onClose,
}: {
  token: string;
  word: Word | null; // null = new word mode
  tree: AdminChapter[];
  onSaved: (w: Word) => void;
  onDeleted: (id: number) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>('basic');
  const [draft, setDraft] = useState<Partial<Word>>(initialWord ?? { hsk_level: 1, part_of_speech: 'noun' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<number | null>(initialWord?.id ?? null);

  const isNew = !savedId;

  useEffect(() => {
    setDraft(initialWord ?? { hsk_level: 1, part_of_speech: 'noun' });
    setSavedId(initialWord?.id ?? null);
    setTab('basic');
    setMsg(null);
  }, [initialWord]);

  const set = (k: keyof Word, v: unknown) => setDraft((d) => ({ ...d, [k]: v }));

  const save = async () => {
    if (!draft.hanzi?.trim() || !draft.pinyin?.trim() || !draft.meaning_mn?.trim()) {
      setMsg('Ханз, Pinyin, Утга заавал байна.');
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      if (isNew) {
        const res = await adminApi.words.createFull(token, draft as Record<string, unknown>);
        const newId = res.data.id;
        const full = await adminApi.words.get(newId);
        setSavedId(newId);
        onSaved(full.data);
      } else {
        await adminApi.words.update(token, savedId!, draft);
        const full = await adminApi.words.get(savedId!);
        onSaved(full.data);
      }
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!savedId) return;
    if (!window.confirm(`"${draft.hanzi}" үгийг устгах уу?`)) return;
    await adminApi.words.delete(token, savedId);
    onDeleted(savedId);
  };

  const TABS: { key: Tab; label: string; icon: string; disabled?: boolean }[] = [
    { key: 'basic', label: 'Үндсэн', icon: '📝' },
    { key: 'listening', label: 'Сонсох', icon: '🔊', disabled: isNew },
    { key: 'writing', label: 'Бичих', icon: '✍️', disabled: isNew },
    { key: 'lesson', label: 'Хичээл', icon: '📚', disabled: isNew },
  ];

  return (
    <div className="word-detail">
      {/* Header */}
      <div className="word-detail-header">
        <div className="word-detail-title-row">
          {draft.hanzi ? (
            <span className="word-detail-hanzi">{draft.hanzi}</span>
          ) : (
            <span className="word-detail-hanzi placeholder">新</span>
          )}
          <div className="word-detail-meta">
            {draft.pinyin && <span className="word-detail-pinyin">{draft.pinyin}</span>}
            {draft.hsk_level && hskBadge(draft.hsk_level)}
          </div>
          {draft.meaning_mn && <p className="word-detail-meaning">{draft.meaning_mn}</p>}
        </div>
        <button type="button" className="word-detail-close" onClick={onClose} title="Хаах">✕</button>
      </div>

      {/* Tabs */}
      <div className="word-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`word-tab ${tab === t.key ? 'active' : ''}`}
            disabled={t.disabled}
            onClick={() => setTab(t.key)}
            title={t.disabled ? 'Эхлээд үгийг хадгална уу' : undefined}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="word-tab-body">
        {/* ── BASIC ── */}
        {tab === 'basic' && (
          <div className="tab-section">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Ханз *</label>
                <input
                  className="form-control hanzi-input"
                  placeholder="e.g. 你好"
                  value={draft.hanzi ?? ''}
                  onChange={(e) => set('hanzi', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">HSK түвшин *</label>
                <select
                  className="form-control"
                  value={draft.hsk_level ?? 1}
                  onChange={(e) => set('hsk_level', Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>HSK {n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Pinyin *</label>
                <input
                  className="form-control"
                  placeholder="e.g. nǐ hǎo"
                  value={draft.pinyin ?? ''}
                  onChange={(e) => set('pinyin', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pinyin (тоогоор)</label>
                <input
                  className="form-control"
                  placeholder="e.g. ni3 hao3"
                  value={draft.pinyin_numbered ?? ''}
                  onChange={(e) => set('pinyin_numbered', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Утга (Монгол) *</label>
                <input
                  className="form-control"
                  placeholder="e.g. Сайн уу"
                  value={draft.meaning_mn ?? ''}
                  onChange={(e) => set('meaning_mn', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Утга (Англи)</label>
                <input
                  className="form-control"
                  placeholder="e.g. Hello"
                  value={draft.meaning_en ?? ''}
                  onChange={(e) => set('meaning_en', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Үгийн аймаг</label>
                <select
                  className="form-control"
                  value={draft.part_of_speech ?? 'noun'}
                  onChange={(e) => set('part_of_speech', e.target.value)}
                >
                  {POS_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Цохилтын тоо</label>
                <input
                  type="number"
                  min={0}
                  className="form-control"
                  placeholder="0"
                  value={draft.stroke_count ?? ''}
                  onChange={(e) => set('stroke_count', Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Тоны дараалал (JSON)</label>
              <input
                className="form-control"
                placeholder='e.g. [3,3]'
                value={draft.tones ?? ''}
                onChange={(e) => set('tones', e.target.value)}
              />
              <span className="form-hint">Tone тоонуудыг JSON array хэлбэрт бичнэ үү: [1,2,3,4,0]</span>
            </div>
          </div>
        )}

        {/* ── LISTENING ── */}
        {tab === 'listening' && (
          <div className="tab-section">
            <div className="form-group">
              <label className="form-label">Audio URL / R2 key</label>
              <input
                className="form-control"
                placeholder="e.g. audio/ni-hao.mp3"
                value={draft.audio_url ?? ''}
                onChange={(e) => set('audio_url', e.target.value || null)}
              />
              <span className="form-hint">R2 bucket дахь аудио файлын зам эсвэл public URL</span>
            </div>
            {draft.audio_url && (
              <div className="audio-preview">
                <p className="form-label" style={{ marginBottom: 8 }}>Урьдчилан харах</p>
                <audio controls src={draft.audio_url} style={{ width: '100%' }} />
              </div>
            )}
            <div className="info-box">
              <span>💡</span>
              <p>
                Аудио бичлэгийг Cloudflare R2 bucket-д байршуулаад файлын замыг дээрх хэсэгт бичнэ үү.
                Мобайл апп дээр <strong>Сонсох</strong> хэсэгт ашиглагдана.
              </p>
            </div>
          </div>
        )}

        {/* ── WRITING ── */}
        {tab === 'writing' && (
          <div className="tab-section">
            <div className="form-group">
              <label className="form-label">Өгүүлбэр (Хятад)</label>
              <input
                className="form-control"
                placeholder="e.g. 你好吗？"
                value={draft.example_zh ?? ''}
                onChange={(e) => set('example_zh', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Өгүүлбэр (Pinyin)</label>
              <input
                className="form-control"
                placeholder="e.g. Nǐ hǎo ma?"
                value={draft.example_pinyin ?? ''}
                onChange={(e) => set('example_pinyin', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Өгүүлбэр (Монгол)</label>
              <input
                className="form-control"
                placeholder="e.g. Та сайн уу?"
                value={draft.example_mn ?? ''}
                onChange={(e) => set('example_mn', e.target.value)}
              />
            </div>
            <div className="info-box">
              <span>💡</span>
              <p>
                Өгүүлбэрүүд нь <strong>Уншиж бичих</strong> болон <strong>Цээжлэх</strong> хэсгүүдэд
                ашиглагдана. Гурван хэлний хувилбарыг зэрэг оруулна уу.
              </p>
            </div>
          </div>
        )}

        {/* ── LESSON ── */}
        {tab === 'lesson' && savedId && (
          <LessonTab token={token} wordId={savedId} tree={tree} />
        )}
      </div>

      {/* Footer actions */}
      {msg && <p className="form-error" style={{ margin: '0 24px 0' }}>{msg}</p>}
      <div className="word-detail-footer">
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="btn-primary"
            disabled={saving}
            onClick={() => void save()}
          >
            {saving ? 'Хадгалж байна...' : isNew ? '✓ Үг үүсгэх' : '✓ Хадгалах'}
          </button>
          {!isNew && (
            <button type="button" className="btn-danger-sm" onClick={() => void del()}>
              Устгах
            </button>
          )}
        </div>
        {isNew && (
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Хадгалсны дараа аудио, бичих, хичээл табууд нээгдэнэ
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Main WordsView ─── */
export function WordsView({ token }: Props) {
  const [words, setWords] = useState<Word[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [hsk, setHsk] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState<Word | null | 'new'>('new'); // 'new' = new form
  const [tree, setTree] = useState<AdminChapter[]>([]);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadWords = useCallback((qVal: string, hskVal: number | '') => {
    setLoading(true);
    adminApi.words
      .list(qVal || undefined, hskVal === '' ? undefined : Number(hskVal), 80, 0)
      .then((r) => {
        setWords(Array.isArray(r.data) ? r.data : []);
        setTotal(typeof r.total === 'number' ? r.total : 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadWords('', '');
    adminApi.lessonTree(token).then((r) => setTree(r.data ?? [])).catch(console.error);
  }, [token, loadWords]);

  const handleSearch = (val: string) => {
    setQ(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => loadWords(val, hsk), 350);
  };

  const handleHskChange = (val: number | '') => {
    setHsk(val);
    loadWords(q, val);
  };

  const handleSaved = (w: Word) => {
    setWords((prev) => {
      const idx = prev.findIndex((x) => x.id === w.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = w;
        return next;
      }
      return [w, ...prev];
    });
    setTotal((t) => (words.findIndex((x) => x.id === w.id) >= 0 ? t : t + 1));
    setSelectedWord(w);
  };

  const handleDeleted = (id: number) => {
    setWords((prev) => prev.filter((x) => x.id !== id));
    setTotal((t) => t - 1);
    setSelectedWord('new');
  };

  const currentWord = selectedWord === 'new' ? null : selectedWord;

  return (
    <div className="words-view">
      {/* ── Left: Word List ── */}
      <div className="word-list-panel">
        <div className="word-list-header">
          <h1 className="word-list-title">Үгийн сан</h1>
          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => setSelectedWord('new')}
          >
            + Шинэ үг
          </button>
        </div>

        {/* Filters */}
        <div className="word-list-filters">
          <input
            className="form-control"
            placeholder="Хайх (ханз, pinyin...)"
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="hsk-filter-pills">
            <button
              type="button"
              className={`hsk-pill ${hsk === '' ? 'active' : ''}`}
              onClick={() => handleHskChange('')}
            >Бүх</button>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                className={`hsk-pill ${hsk === n ? 'active' : ''}`}
                style={hsk === n ? { background: HSK_COLORS[n] + '33', color: HSK_COLORS[n], borderColor: HSK_COLORS[n] } : {}}
                onClick={() => handleHskChange(hsk === n ? '' : n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="word-count-bar">
          {loading ? 'Уншиж байна...' : `${total} үг`}
        </div>

        {/* New word shortcut card */}
        <div
          className={`word-list-item new-word-item ${selectedWord === 'new' ? 'selected' : ''}`}
          onClick={() => setSelectedWord('new')}
        >
          <span className="word-item-hanzi new-icon">+</span>
          <div className="word-item-info">
            <span className="word-item-meaning">Шинэ үг нэмэх</span>
          </div>
        </div>

        <div className="word-list-scroll">
          {words.map((w) => (
            <div
              key={w.id}
              className={`word-list-item ${selectedWord !== 'new' && selectedWord?.id === w.id ? 'selected' : ''}`}
              onClick={() => setSelectedWord(w)}
            >
              <span className="word-item-hanzi">{w.hanzi}</span>
              <div className="word-item-info">
                <span className="word-item-pinyin">{w.pinyin}</span>
                <span className="word-item-meaning">{w.meaning_mn}</span>
              </div>
              <span
                className="word-item-hsk"
                style={{ color: HSK_COLORS[w.hsk_level] ?? '#94A3B8' }}
              >
                {w.hsk_level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Word Detail ── */}
      <div className="word-detail-panel">
        <WordDetail
          token={token}
          word={currentWord}
          tree={tree}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          onClose={() => setSelectedWord('new')}
        />
      </div>
    </div>
  );
}
