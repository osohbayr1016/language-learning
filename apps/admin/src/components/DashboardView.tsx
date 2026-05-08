import { useEffect, useState } from 'react';
import { adminApi } from '../api';

type Props = { token: string };

export function DashboardView({ token }: Props) {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminApi.stats>>['data'] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .stats(token)
      .then((r) => setStats(r.data ?? null))
      .catch((e) => setErr((e as Error).message));
  }, [token]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Хянах самбар</h1>
      </div>
      {err && <p style={{ color: 'var(--error)' }}>{err}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
        <Stat label="Хэрэглэгчид" value={stats ? String(stats.users) : '—'} />
        <Stat label="Нийт үг" value={stats ? String(stats.words) : '—'} />
        <Stat label="Бүлэг (нийт)" value={stats ? String(stats.chapters_total) : '—'} />
        <Stat label="Хичээл (нийт)" value={stats ? String(stats.lessons_total) : '—'} />
        <Stat label="Хичээл дуусгасан (ниөлөн)" value={stats ? String(stats.lesson_completions) : '—'} />
        <Stat label="Дуусгалт (7 хоног)" value={stats ? String(stats.lesson_completions_last_7_days) : '—'} />
        <Stat label="Тоглоомын Session" value={stats ? String(stats.game_sessions) : '—'} />
        <Stat label="Хүүхэлдэйн кино" value={stats ? String(stats.cartoons) : '—'} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{label}</h3>
      <div style={{ fontSize: '28px', fontWeight: 700 }}>{value}</div>
    </div>
  );
}
