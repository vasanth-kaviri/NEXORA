export default function ManagePaths() {
  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Manage Career Paths</h1>
        <p className="text-muted">Create and edit AI roadmaps.</p>
      </header>
      <div className="glass-panel p-xl text-center" style={{ padding: 'var(--space-xl)', color: 'var(--text-muted)' }}>
        This module allows admins to edit the roadmap generation algorithms and manual path templates.
      </div>
    </div>
  );
}
