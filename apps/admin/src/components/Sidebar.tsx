import type { ViewKey } from '../views';

type Props = {
  current: ViewKey;
  onSelect: (v: ViewKey) => void;
  onSignOut: () => void;
};

type NavItem = { key: ViewKey; label: string; icon: string; group?: string };

const NAV: NavItem[] = [
  { key: 'dashboard', label: 'Хянах самбар', icon: '📊' },
  { key: 'words', label: 'Үгийн сан', icon: '📖', group: 'Контент' },
  { key: 'learningPath', label: 'Суралцах зам', icon: '🗂', group: 'Контент' },
  { key: 'cartoons', label: 'Хүүхэлдэйн кино', icon: '🎬', group: 'Контент' },
  { key: 'examImport', label: 'HSK Шалгалт', icon: '📋', group: 'Контент' },
  { key: 'users', label: 'Хэрэглэгчид', icon: '👥', group: 'Систем' },
];

export function Sidebar({ current, onSelect, onSignOut }: Props) {
  const groups = Array.from(new Set(NAV.map((n) => n.group ?? '')));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🀄</span>
        <span className="sidebar-logo-text">Админ</span>
      </div>
      <nav className="nav-menu">
        {groups.map((g) => {
          const items = NAV.filter((n) => (n.group ?? '') === g);
          return (
            <div key={g} className="nav-group">
              {g && <div className="nav-group-label">{g}</div>}
              {items.map((n) => (
                <a
                  key={n.key}
                  href="#"
                  className={`nav-link ${current === n.key ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(n.key);
                  }}
                >
                  <span className="nav-icon">{n.icon}</span>
                  {n.label}
                </a>
              ))}
            </div>
          );
        })}
      </nav>
      <button
        type="button"
        className="sidebar-signout"
        onClick={onSignOut}
      >
        <span>🚪</span> Гарах
      </button>
    </aside>
  );
}
