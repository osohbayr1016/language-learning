import { useEffect, useState } from 'react';
import { adminApi, type Cartoon } from '../api';
import { CartoonForm } from './CartoonForm';
import { CartoonWordsForm } from './CartoonWordsForm';

export function CartoonsView({ token }: { token: string }) {
  const [items, setItems] = useState<Cartoon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    adminApi.cartoons
      .list()
      .then((r) => setItems(r.data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Хүүхэлдэйн кино</h1>
      </div>

      <CartoonForm
        token={token}
        onCreated={(id) => {
          setEditing(id);
          setRefreshKey((k) => k + 1);
        }}
      />

      {editing ? (
        <CartoonWordsForm token={token} cartoonId={editing} onDone={() => setEditing(null)} />
      ) : null}

      <div className="card" style={{ marginTop: 24 }}>
        {loading ? <p>Уншиж байна...</p> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Гарчиг</th>
                  <th>Түвшин</th>
                  <th>Үргэлжлэх (сек)</th>
                  <th>Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32 }}>Хүүхэлдэй алга</td></tr>
                ) : (
                  items.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td>{c.title_mn}</td>
                      <td>{c.hsk_level ? `HSK ${c.hsk_level}` : '—'}</td>
                      <td>{c.duration_s}</td>
                      <td>
                        <button onClick={() => setEditing(c.id)} style={{ color: 'var(--accent)' }}>
                          Үг нэмэх
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
