import { useState, type FormEvent } from 'react';
import { adminApi } from '../api';

export function LoginView({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.login({ email, password });
      const access = res.data.access_token;
      const prof = await adminApi.profile(access);
      if (Number(prof.data?.is_admin) !== 1) {
        setError('Admin эрх шаардлагатай (is_admin)');
        return;
      }
      onLogin(access);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Админ Нэвтрэх</h2>
        {error ? (
          <div style={{
            color: 'var(--error)', marginBottom: '16px', padding: '12px',
            backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px',
          }}>{error}</div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Имэйл</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Нууц үг</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Уншиж байна...' : 'Нэвтрэх'}
          </button>
        </form>
      </div>
    </div>
  );
}
