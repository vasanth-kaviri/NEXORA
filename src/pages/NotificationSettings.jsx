import { useState } from 'react';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    jobAlerts: true,
    courseReminders: true,
    mentorshipMessages: true
  });

  const toggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Notifications</h1>
        <p className="text-muted">Manage how we contact you.</p>
      </header>

      <div className="glass-panel" style={{ padding: '0 var(--space-md)' }}>
        
        <div className="flex items-center justify-between" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontWeight: '600', display: 'block' }}>Push Notifications</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Receive alerts on your device</span>
          </div>
          <div onClick={() => toggle('push')} style={{ width: 44, height: 24, borderRadius: 12, background: settings.push ? 'var(--primary)' : 'var(--input-bg)', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: settings.push ? 22 : 2, transition: 'all 0.3s ease' }} />
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontWeight: '600', display: 'block' }}>Email Updates</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Weekly career insights</span>
          </div>
          <div onClick={() => toggle('email')} style={{ width: 44, height: 24, borderRadius: 12, background: settings.email ? 'var(--primary)' : 'var(--input-bg)', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: settings.email ? 22 : 2, transition: 'all 0.3s ease' }} />
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontWeight: '600', display: 'block' }}>Job & Internship Alerts</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>When a matching role opens</span>
          </div>
          <div onClick={() => toggle('jobAlerts')} style={{ width: 44, height: 24, borderRadius: 12, background: settings.jobAlerts ? 'var(--primary)' : 'var(--input-bg)', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: settings.jobAlerts ? 22 : 2, transition: 'all 0.3s ease' }} />
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ padding: 'var(--space-md) 0', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontWeight: '600', display: 'block' }}>Course Reminders</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Daily task notifications</span>
          </div>
          <div onClick={() => toggle('courseReminders')} style={{ width: 44, height: 24, borderRadius: 12, background: settings.courseReminders ? 'var(--primary)' : 'var(--input-bg)', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: settings.courseReminders ? 22 : 2, transition: 'all 0.3s ease' }} />
          </div>
        </div>

        <div className="flex items-center justify-between" style={{ padding: 'var(--space-md) 0' }}>
          <div>
            <span style={{ fontWeight: '600', display: 'block' }}>Mentorship Messages</span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Messages from AI Mentor</span>
          </div>
          <div onClick={() => toggle('mentorshipMessages')} style={{ width: 44, height: 24, borderRadius: 12, background: settings.mentorshipMessages ? 'var(--primary)' : 'var(--input-bg)', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: settings.mentorshipMessages ? 22 : 2, transition: 'all 0.3s ease' }} />
          </div>
        </div>

      </div>
    </div>
  );
}
