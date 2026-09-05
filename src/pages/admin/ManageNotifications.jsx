export default function ManageNotifications() {
  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Manage Notifications</h1>
        <p className="text-muted">Send push notifications to students.</p>
      </header>
      <div className="glass-panel p-xl text-center" style={{ padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
        Admins can schedule and broadcast system-wide alerts here.
      </div>
    </div>
  );
}
