import { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Users } from 'lucide-react';
import db from '../../services/db';

export default function ManageStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(() => {
    try {
      const all = db.getUsers();
      if (all && all.length > 0) {
        return all.map(u => ({
          id: u.id || u.email,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Enrolled Student',
          email: u.email || u.contact || 'student@nexora.edu',
          path: u.dreamJob || 'Full-Stack Developer',
          progress: u.xp ? Math.min(100, Math.round((u.xp / 2000) * 100)) : 45
        }));
      }
    } catch {}
    return [];
  });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Manage Students</h1>
          <p className="text-muted">View and manage authenticated student profiles.</p>
        </div>
      </header>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="flex justify-between items-center p-md" style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 12 }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', padding: '10px 10px 10px 2.5rem' }} 
            />
          </div>
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '10px 16px' }}>
            <Filter size={18} /> Filter
          </button>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-xl text-center flex flex-col items-center justify-center gap-xs">
            <Users size={36} className="text-muted opacity-40 mb-xs" />
            <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>No Registered Students Found</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem', maxWidth: '380px' }}>
              Student accounts will appear here automatically when candidates register or complete onboarding.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--input-bg)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px' }}>Name</th>
                <th style={{ padding: '16px' }}>Career Path</th>
                <th style={{ padding: '16px' }}>Progress</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="interactive" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.3s' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600' }}>{student.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{student.email}</div>
                  </td>
                  <td style={{ padding: '16px' }}>{student.path}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '100px', height: '6px', background: 'var(--input-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${student.progress}%`, height: '100%', background: 'var(--primary)' }} />
                      </div>
                      <span style={{ fontSize: '0.85rem' }}>{student.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button style={{ padding: '8px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(student.id)}
                      style={{ padding: '8px', color: 'var(--secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
