export default function Reports() {
  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Reports & Analytics</h1>
        <p className="text-muted">Platform performance insights.</p>
      </header>
      <div className="glass-panel p-xl text-center" style={{ padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
        Detailed charts and CSV exports for system usage and student success rates will be shown here.
      </div>
    </div>
  );
}
