import { useState } from 'react';
import { Bell, Send, CheckCircle2, AlertCircle, Sparkles, Radio, Users } from 'lucide-react';
import db from '../../services/db';

export default function ManageNotifications() {
  const [broadcasts, setBroadcasts] = useState(() => {
    try {
      return db.getNotifications().slice(0, 6);
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Registered Students');
  const [priority, setPriority] = useState('standard');
  const [actionPath, setActionPath] = useState('/roadmap');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotif = {
      id: 'notif_admin_' + Date.now(),
      type: priority === 'high' ? 'system' : 'roadmap',
      title,
      message,
      time: 'Just now',
      unread: true,
      actionPath,
      actionLabel: 'View Announcement',
      actionDetails: `Broadcast sent to ${targetAudience}`
    };

    const existing = db.getNotifications();
    const updated = [newNotif, ...existing];
    db.saveNotifications(updated);
    setBroadcasts(updated.slice(0, 8));

    setTitle('');
    setMessage('');
    triggerToast(`System broadcast "${title}" sent successfully to ${targetAudience}!`);
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

      <header>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Broadcast Notification Dispatcher</h1>
        <p className="text-muted">Schedule and push real-time system alerts directly to student dashboards.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Broadcast Creation Form */}
        <div className="glass-panel p-lg flex flex-col gap-md" style={{ padding: '2rem' }}>
          <div className="flex items-center gap-xs font-700 text-primary">
            <Radio size={16} className="animate-pulse" /> Create New Broadcast Alert
          </div>

          <form onSubmit={handleSendBroadcast} className="flex flex-col gap-md">
            <div>
              <label className="input-label" style={{ fontSize: '0.8rem' }}>Alert Title</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Google Summer Cloud Internship Registration Open"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-sm">
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Target Audience</label>
                <select 
                  className="input-field w-full"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                >
                  <option value="All Registered Students">All Registered Students</option>
                  <option value="Full-Stack Developers">Full-Stack Track</option>
                  <option value="AI & Data Scientists">AI & Data Science Track</option>
                  <option value="Cloud DevOps">Cloud & DevOps Track</option>
                </select>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Alert Priority</label>
                <select 
                  className="input-field w-full"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="standard">Standard Informative</option>
                  <option value="high">High Alert / Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="input-label" style={{ fontSize: '0.8rem' }}>Deep-Link Redirect Path</label>
              <select 
                className="input-field w-full"
                value={actionPath}
                onChange={(e) => setActionPath(e.target.value)}
              >
                <option value="/roadmap">Career Roadmap (/roadmap)</option>
                <option value="/jobs">Internships & Jobs (/jobs)</option>
                <option value="/scholarships">Scholarships (/scholarships)</option>
                <option value="/mock-interview">Mock Interview Studio (/mock-interview)</option>
                <option value="/resume">Resume Analyzer (/resume)</option>
              </select>
            </div>

            <div>
              <label className="input-label" style={{ fontSize: '0.8rem' }}>Broadcast Message Content</label>
              <textarea 
                rows={4}
                className="input-field w-full"
                placeholder="Write the detailed broadcast announcement to appear in student notification inboxes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary mt-sm"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              <Send size={16} /> Broadcast Alert Immediately
            </button>
          </form>
        </div>

        {/* Live Broadcast History */}
        <div className="glass-panel p-lg flex flex-col gap-md" style={{ padding: '2rem' }}>
          <div className="flex items-center gap-xs font-700">
            <Bell size={16} className="text-secondary" /> Recent System Broadcasts
          </div>

          <div className="flex flex-col gap-sm overflow-y-auto" style={{ maxHeight: '420px' }}>
            {broadcasts.map((b) => (
              <div 
                key={b.id} 
                className="glass-panel p-md flex flex-col gap-xs"
                style={{ background: 'var(--card-bg)', borderLeft: '3px solid var(--primary)', padding: '12px 16px' }}
              >
                <div className="flex justify-between items-center">
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{b.title}</span>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>{b.time}</span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                  {b.message}
                </p>
                <div className="flex justify-between items-center mt-xs text-muted" style={{ fontSize: '0.74rem' }}>
                  <span>Target: <strong>{b.actionPath}</strong></span>
                  <span className="text-success font-600">Delivered ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
