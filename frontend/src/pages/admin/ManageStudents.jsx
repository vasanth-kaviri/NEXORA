import { useState, useEffect } from 'react';
import { Search, Filter, Edit2, Trash2, Users } from 'lucide-react';
import db from '../../services/db';
import adminService from '../../services/adminService';

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

  useEffect(() => {
    let mounted = true;
    adminService.getStudents().then(res => {
      if (mounted && res && res.length > 0) {
        setStudents(res.map(u => ({
          id: u._id || u.id || u.email,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Enrolled Student',
          email: u.email || 'student@nexora.edu',
          path: u.dreamJob || 'Full-Stack Developer',
          progress: u.xp ? Math.min(100, Math.round((u.xp / 2000) * 100)) : 65
        })));
      }
    });
    return () => { mounted = false; };
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPath, setEditPath] = useState('');

  const handleDelete = (id) => {
    adminService.deleteStudent(id);
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditPath(student.path);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    const all = db.getUsers();
    const updatedUsers = all.map(u => {
      if ((u.id && u.id === editingStudent.id) || u.email === editingStudent.email) {
        const parts = editName.trim().split(' ');
        return {
          ...u,
          firstName: parts[0] || u.firstName,
          lastName: parts.slice(1).join(' ') || u.lastName,
          dreamJob: editPath
        };
      }
      return u;
    });
    db.saveUsers(updatedUsers);
    setStudents(prev => prev.map(s => s.id === editingStudent.id ? { ...s, name: editName, path: editPath } : s));
    setEditingStudent(null);
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
                    <button 
                      onClick={() => openEditModal(student)}
                      style={{ padding: '8px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      title="Edit Student"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(student.id)}
                      style={{ padding: '8px', color: 'var(--secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      title="Delete Student"
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

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
          <div className="glass-panel w-full max-w-md p-lg flex flex-col gap-md" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Edit Student Record</h3>
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-md">
              <div className="input-group mb-0">
                <label className="input-label text-xs font-semibold">Student Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required 
                />
              </div>
              <div className="input-group mb-0">
                <label className="input-label text-xs font-semibold">Career Track</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={editPath}
                  onChange={(e) => setEditPath(e.target.value)}
                  required 
                />
              </div>
              <div className="flex justify-end gap-sm mt-sm">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditingStudent(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
