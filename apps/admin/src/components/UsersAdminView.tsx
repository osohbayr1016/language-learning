import { useEffect, useState } from 'react';
import { adminApi } from '../api';

type Props = { token: string };

type Row = {
  id: number;
  email: string;
  display_name: string;
  is_admin: number;
  premium_until: string | null;
};

export function UsersAdminView({ token }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.users
      .list(token, { limit: 150 })
      .then((r) => setRows((r.data as Row[]) ?? []))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const extend = async (id: number) => {
    setBusyId(id);
    try {
      await adminApi.users.extendPremium(token, id, 1);
      load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Хэрэглэгчид</h1>
      </div>
      <div className="card">
        {loading ? (
          <p>Уншиж байна...</p>
        ) : error ? (
          <p style={{ color: 'var(--error)' }}>{error}</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>И-мэйл</th>
                  <th>Нэр</th>
                  <th>Админ</th>
                  <th>Premium</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.display_name}</td>
                    <td>{u.is_admin ? 'Тийм' : 'Үгүй'}</td>
                    <td>{u.premium_until ?? '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-small"
                        disabled={busyId === u.id}
                        onClick={() => void extend(u.id)}
                      >
                        +1 сар
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
