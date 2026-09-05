import { Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function ManageStudents() {
  const students = [
    { id: '101', name: 'Alex Johnson', email: 'alex.j@example.com', path: 'Data Scientist', progress: 45 },
    { id: '102', name: 'Sarah Miller', email: 'sarah.m@example.com', path: 'UX Designer', progress: 80 },
    { id: '103', name: 'David Chen', email: 'david.c@example.com', path: 'Frontend Dev', progress: 12 },
    { id: '104', name: 'Emily Davis', email: 'emily.d@example.com', path: 'Product Manager', progress: 60 }
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Manage Students</h1>
          <p className="text-muted">View and manage student profiles.</p>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>Add Student</button>
      </header>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="flex justify-between items-center p-md" style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 12 }} />
            <input type="text" className="input-field" placeholder="Search students..." style={{ paddingLeft: '2.5rem', padding: '10px 10px 10px 2.5rem' }} />
          </div>
          <button className="btn btn-secondary" style={{ width: 'auto', padding: '10px 16px' }}><Filter size={18} /> Filter</button>
        </div>

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
            {students.map((student, i) => (
              <tr key={i} className="interactive" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.3s' }}>
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
                  <button style={{ padding: '8px', color: 'var(--text-muted)' }}><Edit2 size={18} /></button>
                  <button style={{ padding: '8px', color: 'var(--secondary)' }}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
