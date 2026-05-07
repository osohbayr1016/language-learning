import type { ViewKey } from '../views';

type Props = {
  current: ViewKey;
  onSelect: (v: ViewKey) => void;
  onSignOut: () => void;
};

const NAV: { key: ViewKey; label: string }[] = [
  { key: 'dashboard', label: 'Хянах самбар' },
  { key: 'courses', label: 'Хичээлүүд' },
  { key: 'cartoons', label: 'Хүүхэлдэйн кино' },
];

export function Sidebar({ current, onSelect, onSignOut }: Props) {
  return (
    <aside className="sidebar">
      <div className="logo">Админ Панел</div>
      <nav className="nav-menu">
        {NAV.map((n) => (
          <a
            key={n.key}
            href="#"
            className={`nav-link ${current === n.key ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onSelect(n.key); }}
          >
            {n.label}
          </a>
        ))}
        <a
          href="#"
          className="nav-link"
          onClick={(e) => { e.preventDefault(); onSignOut(); }}
          style={{ color: 'var(--error)', marginTop: 'auto' }}
        >
          Гарах
        </a>
      </nav>
    </aside>
  );
}
