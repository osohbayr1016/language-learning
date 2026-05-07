export function DashboardView() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Хянах самбар</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        <Stat label="Нийт хичээл" value="—" />
        <Stat label="Нийт үг" value="—" />
        <Stat label="Хэрэглэгчид" value="—" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{label}</h3>
      <div style={{ fontSize: '32px', fontWeight: 700 }}>{value}</div>
    </div>
  );
}
