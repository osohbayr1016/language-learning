import { useEffect, useState } from 'react';
import { adminApi } from '../api';

type Props = { token: string };

type Row = {
  id: number;
  email: string;
  display_name: string;
  is_admin: number;
};

export function UsersAdminView({ token }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.display_name}</td>
                    <td>{u.is_admin ? 'Тийм' : 'Үгүй'}</td>
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
