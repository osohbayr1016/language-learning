import { useState, type FormEvent } from 'react';
import { adminApi } from '../api';

type Props = {
  token: string;
  onCreated: (cartoonId: number) => void;
};

export function CartoonForm({ token, onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [hsk, setHsk] = useState('1');
  const [video, setVideo] = useState<File | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);
  const [duration, setDuration] = useState('60');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !video) {
      setStatus('Гарчиг ба видео шаардлагатай');
      return;
    }
    setBusy(true);
    try {
      setStatus('Видео хуулж байна...');
      const v = await adminApi.upload(token, video, 'video');
      let t: { key: string } | null = null;
      if (thumb) {
        setStatus('Зураг хуулж байна...');
        t = await adminApi.upload(token, thumb, 'thumbnail');
      }
      setStatus('Хадгалж байна...');
      const c = await adminApi.cartoons.create(token, {
        title_mn: title,
        description_mn: desc,
        video_key: v.key,
        thumbnail_key: t?.key,
        hsk_level: parseInt(hsk, 10),
        duration_s: parseInt(duration, 10) || 0,
        is_published: 1,
      });
      setStatus(`Амжилттай үүслээ #${c.data.id}`);
      onCreated(c.data.id);
      setTitle(''); setDesc(''); setVideo(null); setThumb(null);
    } catch (e) {
      setStatus(`Алдаа: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h2 style={{ marginBottom: 16 }}>Шинэ хүүхэлдэй</h2>
      <form onSubmit={submit}>
        <Field label="Гарчиг (MN)">
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Тайлбар">
          <textarea className="form-control" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </Field>
        <Field label="HSK Түвшин">
          <select className="form-control" value={hsk} onChange={(e) => setHsk(e.target.value)}>
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>HSK {n}</option>)}
          </select>
        </Field>
        <Field label="Үргэлжлэх хугацаа (сек)">
          <input className="form-control" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </Field>
        <Field label="Видео файл (MP4)">
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] ?? null)} />
        </Field>
        <Field label="Thumbnail (зураг)">
          <input type="file" accept="image/*" onChange={(e) => setThumb(e.target.files?.[0] ?? null)} />
        </Field>
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="btn-primary" type="submit" disabled={busy}>Хадгалах</button>
          {status ? <span style={{ color: status.startsWith('Алдаа') ? 'var(--error)' : 'var(--text-secondary)' }}>{status}</span> : null}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}
