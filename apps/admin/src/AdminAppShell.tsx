import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { LearningPathView } from './components/LearningPathView';
import { WordsView } from './components/WordsView';
import { VocabularyAdminView } from './components/VocabularyAdminView';
import { UsersAdminView } from './components/UsersAdminView';
import { CartoonsView } from './components/CartoonsView';
import { ExamImportView } from './components/ExamImportView';
import type { ViewKey } from './views';
import { adminApi } from './adminApi';

type Props = {
  token: string;
  onForbidden: () => void;
};

export function AdminAppShell({ token, onForbidden }: Props) {
  const [view, setView] = useState<ViewKey>('words');
  const [gateOk, setGateOk] = useState(false);

  const forbidden = useCallback(() => {
    onForbidden();
  }, [onForbidden]);

  useEffect(() => {
    let cancelled = false;
    setGateOk(false);
    void adminApi
      .profile(token)
      .then((p) => {
        if (cancelled) return;
        if (Number(p.data?.is_admin) !== 1) forbidden();
        else setGateOk(true);
      })
      .catch(() => {
        if (!cancelled) forbidden();
      });
    return () => {
      cancelled = true;
    };
  }, [token, forbidden]);

  const signOut = () => forbidden();

  if (!gateOk) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Нэвтрэлт шалгаж байна...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar current={view} onSelect={setView} onSignOut={signOut} />
      <main className="main-content">
        {view === 'dashboard' && <DashboardView token={token} />}
        {view === 'words' && <WordsView token={token} />}
        {view === 'learningPath' && <LearningPathView token={token} />}
        {view === 'vocabulary' && <VocabularyAdminView token={token} />}
        {view === 'users' && <UsersAdminView token={token} />}
        {view === 'cartoons' && <CartoonsView token={token} />}
        {view === 'examImport' && <ExamImportView token={token} />}
      </main>
    </div>
  );
}
