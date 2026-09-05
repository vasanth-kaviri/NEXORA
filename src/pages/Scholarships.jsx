import { GraduationCap, FileCheck } from 'lucide-react';

export default function Scholarships() {
  const scholarships = [
    { title: 'Women in AI Scholarship', amount: '$5,000', deadline: 'Oct 15, 2026', eligible: true },
    { title: 'Global Tech Innovators Grant', amount: '$10,000', deadline: 'Nov 01, 2026', eligible: false },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Scholarship Finder</h1>
        <p className="text-muted">Funding opportunities with auto-eligibility checks.</p>
      </header>

      <div className="flex flex-col gap-md">
        {scholarships.map((sch, i) => (
          <div key={i} className={`glass-panel interactive delay-${(i + 1) * 100}`} style={{ padding: 'var(--space-md)' }}>
            <div className="flex justify-between items-start">
              <div className="flex gap-sm">
                <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                  <GraduationCap size={24} className="text-warning" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{sch.title}</h3>
                  <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '2px' }}>
                    Amount: <strong className="text-success">{sch.amount}</strong>
                  </div>
                </div>
              </div>
              <div>
                {sch.eligible ? (
                  <div className="flex items-center gap-xs" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                    <FileCheck size={14} /> Eligible
                  </div>
                ) : (
                  <div className="flex items-center gap-xs" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                    Not Eligible
                  </div>
                )}
              </div>
            </div>
            <div className="mt-sm text-muted" style={{ fontSize: '0.8rem' }}>
              Deadline: {sch.deadline}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
