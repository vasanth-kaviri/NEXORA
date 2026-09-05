import { useState } from 'react';
import { Compass, Search, Filter, Plus, Edit2, Trash2, CheckCircle2, X, Sparkles } from 'lucide-react';

export default function ManagePaths() {
  const [paths, setPaths] = useState([
    { id: 'path_1', title: 'Full-Stack Web Engineering', domain: 'Engineering', students: 542, milestones: 8, status: 'Active', updated: '2 days ago' },
    { id: 'path_2', title: 'AI & Machine Learning Foundations', domain: 'Data & AI', students: 418, milestones: 9, status: 'Active', updated: 'Yesterday' },
    { id: 'path_3', title: 'Cloud DevOps & SRE Masterclass', domain: 'Infrastructure', students: 285, milestones: 7, status: 'Active', updated: '1 week ago' },
    { id: 'path_4', title: 'Cybersecurity Analyst & SOC Operations', domain: 'Security', students: 164, milestones: 6, status: 'Active', updated: '3 days ago' },
    { id: 'path_5', title: 'Autonomous Robotic Systems (ROS 2)', domain: 'Robotics', students: 82, milestones: 5, status: 'Draft', updated: '4 days ago' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState('Engineering');
  const [newMilestones, setNewMilestones] = useState(6);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAddPath = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPath = {
      id: 'path_' + Date.now(),
      title: newTitle,
      domain: newDomain,
      students: 0,
      milestones: Number(newMilestones),
      status: 'Active',
      updated: 'Just now'
    };

    setPaths([newPath, ...paths]);
    setShowAddModal(false);
    setNewTitle('');
    triggerToast(`Career path "${newTitle}" created successfully!`);
  };

  const handleToggleStatus = (id) => {
    setPaths(paths.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Draft' : 'Active' } : p));
    triggerToast('Path status updated.');
  };

  const handleDelete = (id) => {
    setPaths(paths.filter(p => p.id !== id));
    triggerToast('Career path removed.');
  };

  const filtered = paths.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>
      {toastMessage && (
        <div 
          className="glass-panel animate-slide-up"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            background: 'rgba(16, 185, 129, 0.95)',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}
        >
          <Sparkles size={16} /> {toastMessage}
        </div>
      )}

      <header className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Manage Career Paths</h1>
          <p className="text-muted">Create, edit, and configure AI-generated student roadmaps.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          <Plus size={16} /> Create New Path
        </button>
      </header>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="flex justify-between items-center p-md" style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 12 }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search pathways..." 
              style={{ paddingLeft: '2.5rem', padding: '10px 10px 10px 2.5rem' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--input-bg)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px' }}>Path Name</th>
              <th style={{ padding: '16px' }}>Domain</th>
              <th style={{ padding: '16px' }}>Active Enrolled</th>
              <th style={{ padding: '16px' }}>Milestones</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>Updated {p.updated}</div>
                </td>
                <td style={{ padding: '16px' }}>{p.domain}</td>
                <td style={{ padding: '16px' }}><strong>{p.students}</strong> learners</td>
                <td style={{ padding: '16px' }}>{p.milestones} Milestones</td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => handleToggleStatus(p.id)}
                    style={{
                      border: 'none',
                      background: p.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'var(--input-bg)',
                      color: p.status === 'Active' ? 'var(--success)' : 'var(--text-muted)',
                      padding: '4px 10px',
                      borderRadius: 4,
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {p.status}
                  </button>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(p.id)} style={{ padding: '8px', color: 'var(--secondary)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-md w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add New Career Path</h3>
              <button className="btn-icon-tactile" onClick={() => setShowAddModal(false)} style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPath} className="flex flex-col gap-md py-xs">
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Path Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Blockchain & Smart Contract Engineering"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Domain Specialization</label>
                <select 
                  className="input-field w-full"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                >
                  <option value="Engineering">Engineering & Web</option>
                  <option value="Data & AI">Data & Artificial Intelligence</option>
                  <option value="Infrastructure">Infrastructure & Cloud</option>
                  <option value="Security">Cybersecurity</option>
                  <option value="Design">Product Design</option>
                </select>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Milestone Steps Count</label>
                <input 
                  type="number" 
                  min="3" 
                  max="15"
                  className="input-field"
                  value={newMilestones}
                  onChange={(e) => setNewMilestones(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-sm pt-sm">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} style={{ width: 'auto', padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '8px 20px' }}>
                  Save & Publish Path
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
