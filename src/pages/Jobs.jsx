import { Briefcase, Building, DollarSign } from 'lucide-react';

export default function Jobs() {
  const jobs = [
    { title: 'Junior Data Analyst Intern', company: 'TechCorp', salary: '$20/hr', type: 'Internship', match: 95 },
    { title: 'Machine Learning Entry Role', company: 'AI Solutions Inc', salary: '$85k - $100k', type: 'Full-Time', match: 88 },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Internships & Jobs</h1>
        <p className="text-muted">Recommended based on your skills and interests.</p>
      </header>

      <div className="flex flex-col gap-md">
        {jobs.map((job, i) => (
          <div key={i} className={`glass-panel interactive delay-${(i + 1) * 100}`} style={{ padding: 'var(--space-md)' }}>
            <div className="flex justify-between items-start mb-sm">
              <div className="flex gap-sm">
                <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <Briefcase size={24} className="text-success" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{job.title}</h3>
                  <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                    <Building size={12} /> {job.company}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-success font-600">{job.match}% Match</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{job.type}</div>
              </div>
            </div>
            <div className="flex items-center gap-xs mt-sm" style={{ padding: '8px 12px', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              <DollarSign size={14} className="text-muted" /> 
              <strong>Compensation:</strong> {job.salary}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
