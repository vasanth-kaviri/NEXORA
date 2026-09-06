import { useState } from 'react';
import { Search, Plus, Trash2, X, Sparkles } from 'lucide-react';

export default function ManageResources() {
  const [resources, setResources] = useState([
    { id: 'res_1', title: 'Modern React Architecture & Concurrency', type: 'Course', source: 'Frontend Masters', category: 'Frontend', accessCount: 1420 },
    { id: 'res_2', title: 'PostgreSQL Deep Dive: Query Planning & B-Trees', type: 'Article', source: 'Postgres Guide', category: 'Database', accessCount: 980 },
    { id: 'res_3', title: 'Distributed Systems & Docker Containerization', type: 'Course', source: 'Coursera', category: 'DevOps', accessCount: 1150 },
    { id: 'res_4', title: 'PyTorch Deep Learning & Transformer Implementation', type: 'Course', source: 'DeepLearning.AI', category: 'AI/ML', accessCount: 890 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Course');
  const [newSource, setNewSource] = useState('');
  const [newCategory, setNewCategory] = useState('Frontend');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRes = {
      id: 'res_' + Date.now(),
      title: newTitle,
      type: newType,
      source: newSource || 'NEXORA Curated',
      category: newCategory,
      accessCount: 0
    };

    setResources([newRes, ...resources]);
    setShowAddModal(false);
    setNewTitle('');
    setNewSource('');
    triggerToast(`Resource "${newTitle}" added to curriculum repository!`);
  };

  const handleDelete = (id) => {
    setResources(resources.filter(r => r.id !== id));
    triggerToast('Resource deleted.');
  };

  const filtered = resources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Manage Curriculum Resources</h1>
          <p className="text-muted">Curate and maintain learning modules, video lectures, and documentation.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          <Plus size={16} /> Add New Resource
        </button>
      </header>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="flex justify-between items-center p-md" style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 12 }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search resources by title or category..." 
              style={{ paddingLeft: '2.5rem', padding: '10px 10px 10px 2.5rem' }} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--input-bg)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px' }}>Resource Title</th>
              <th style={{ padding: '16px' }}>Type</th>
              <th style={{ padding: '16px' }}>Category</th>
              <th style={{ padding: '16px' }}>Source Provider</th>
              <th style={{ padding: '16px' }}>Learner Accesses</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{r.title}</td>
                <td style={{ padding: '16px' }}>
                  <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '3px 8px', borderRadius: 4, fontSize: '0.74rem' }}>
                    {r.type}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>{r.category}</td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{r.source}</td>
                <td style={{ padding: '16px' }}><strong>{r.accessCount}</strong> hits</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(r.id)} style={{ padding: '8px', color: 'var(--secondary)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Learning Resource</h3>
              <button className="btn-icon-tactile" onClick={() => setShowAddModal(false)} style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddResource} className="flex flex-col gap-md py-xs">
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Resource Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Masterclass: System Design at Scale"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Format Type</label>
                  <select 
                    className="input-field w-full"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  >
                    <option value="Course">Video Course</option>
                    <option value="Article">Technical Article</option>
                    <option value="Lab">Hands-on Lab</option>
                  </select>
                </div>

                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Category</label>
                  <select 
                    className="input-field w-full"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="AI/ML">AI & Data Science</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Source / Author</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Coursera, MIT OpenCourseWare"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-sm pt-sm">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)} style={{ width: 'auto', padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto', padding: '8px 20px' }}>
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
