import { useCallback, useState } from 'react';
import { LoginView } from './components/LoginView';
import { AdminAppShell } from './AdminAppShell';

const TOKEN_KEY = 'admin_token';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  if (!token) {
    return (
      <LoginView
        onLogin={(t) => {
          localStorage.setItem(TOKEN_KEY, t);
          setToken(t);
        }}
      />
    );
  }

  return <AdminAppShell token={token} onForbidden={clearSession} />;
}
