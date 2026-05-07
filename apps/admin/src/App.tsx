import { useState } from 'react';
import { LoginView } from './components/LoginView';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CoursesView } from './components/CoursesView';
import { CartoonsView } from './components/CartoonsView';
import type { ViewKey } from './views';

const TOKEN_KEY = 'admin_token';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [view, setView] = useState<ViewKey>('dashboard');

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

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return (
    <div className="app-container">
      <Sidebar current={view} onSelect={setView} onSignOut={signOut} />
      <main className="main-content">
        {view === 'dashboard' && <DashboardView />}
        {view === 'courses' && <CoursesView token={token} />}
        {view === 'cartoons' && <CartoonsView token={token} />}
      </main>
    </div>
  );
}
