export default function ManageResources() {
  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Manage Resources</h1>
        <p className="text-muted">Curate the learning repository.</p>
      </header>
      <div className="glass-panel p-xl text-center" style={{ padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
        This module allows admins to upload courses, articles, and configure mock interviews.
      </div>
    </div>
  );
}
