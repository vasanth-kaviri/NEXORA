import { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';

export default function Reports() {
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const trackMetrics = [
    { track: 'Full-Stack Web Engineering', activeLearners: 542, completionRate: '78%', avgQuizScore: '86%' },
    { track: 'AI & Data Scientist', activeLearners: 418, completionRate: '74%', avgQuizScore: '84%' },
    { track: 'Cloud & DevOps Architect', activeLearners: 285, completionRate: '82%', avgQuizScore: '88%' },
    { track: 'Cybersecurity Analyst', activeLearners: 164, completionRate: '80%', avgQuizScore: '82%' }
  ];

  const handleExportCSV = () => {
    const csvContent = `Track,Active_Learners,Completion_Rate,Avg_Quiz_Score,Audit_Date
Full-Stack Web Engineering,542,78%,86%,${new Date().toISOString()}
AI & Data Scientist,418,74%,84%,${new Date().toISOString()}
Cloud & DevOps Architect,285,82%,88%,${new Date().toISOString()}
Cybersecurity Analyst,164,80%,82%,${new Date().toISOString()}
`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEXORA_Platform_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Analytics CSV report exported successfully.');
  };

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
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Platform Performance & Analytics</h1>
          <p className="text-muted">High-density telemetry on student completion, quiz efficacy, and roadmap velocity.</p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={handleExportCSV}
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          <Download size={16} /> Export CSV Report
        </button>
      </header>

      {/* High-Level Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="glass-panel p-md" style={{ padding: '1.5rem' }}>
          <div className="text-muted text-sm mb-xs">Active Learners</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>1,409</div>
          <div className="text-success text-xs mt-xs">+14% month-over-month</div>
        </div>

        <div className="glass-panel p-md" style={{ padding: '1.5rem' }}>
          <div className="text-muted text-sm mb-xs">Roadmap Completion</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>78.4%</div>
          <div className="text-success text-xs mt-xs">High retention rate</div>
        </div>

        <div className="glass-panel p-md" style={{ padding: '1.5rem' }}>
          <div className="text-muted text-sm mb-xs">Quiz Mastery Avg</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>85.2%</div>
          <div className="text-primary text-xs mt-xs">Across 15-question sessions</div>
        </div>

        <div className="glass-panel p-md" style={{ padding: '1.5rem' }}>
          <div className="text-muted text-sm mb-xs">Mock Interview Pass</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>79.1%</div>
          <div className="text-secondary text-xs mt-xs">MNC hireability benchmark</div>
        </div>
      </div>

      {/* Cohort Performance Breakdown Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div className="p-md font-700" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          Career Track Performance Breakdown
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--input-bg)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '16px' }}>Specialization Track</th>
              <th style={{ padding: '16px' }}>Enrolled Students</th>
              <th style={{ padding: '16px' }}>Milestone Completion Rate</th>
              <th style={{ padding: '16px' }}>Average Technical Accuracy</th>
              <th style={{ padding: '16px', textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {trackMetrics.map((tm, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{tm.track}</td>
                <td style={{ padding: '16px' }}>{tm.activeLearners} Active</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '80px', height: '6px', background: 'var(--input-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: tm.completionRate, height: '100%', background: 'var(--primary)' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem' }}>{tm.completionRate}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--success)' }}>{tm.avgQuizScore}</td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '3px 8px', borderRadius: 4, fontSize: '0.74rem' }}>
                    Optimal
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
