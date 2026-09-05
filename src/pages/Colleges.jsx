import { GraduationCap, MapPin, Star } from 'lucide-react';

export default function Colleges() {
  const colleges = [
    { name: 'Stanford University', location: 'Stanford, CA', program: 'MS in Computer Science (AI Track)', match: 98 },
    { name: 'MIT', location: 'Cambridge, MA', program: 'Master of Business Analytics', match: 95 },
    { name: 'Carnegie Mellon', location: 'Pittsburgh, PA', program: 'MS in Machine Learning', match: 92 }
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Best Colleges</h1>
        <p className="text-muted">Top programs for Data Science & AI.</p>
      </header>

      <div className="flex flex-col gap-md">
        {colleges.map((college, i) => (
          <div key={i} className={`glass-panel interactive delay-${(i + 1) * 100}`} style={{ padding: 'var(--space-md)' }}>
            <div className="flex justify-between items-start mb-sm">
              <div className="flex gap-sm">
                <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                  <GraduationCap size={24} className="text-primary" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{college.name}</h3>
                  <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                    <MapPin size={12} /> {college.location}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-xs text-warning" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  <Star size={14} fill="currentColor" /> {college.match}%
                </div>
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Match</span>
              </div>
            </div>
            <div style={{ padding: '8px 12px', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              <strong>Program:</strong> {college.program}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
