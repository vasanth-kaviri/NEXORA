import { Bell, Award, Calendar, Compass, FileText, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import db from '../services/db';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'alerts'

  const loadNotifications = () => {
    const list = db.getNotifications();
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('notifications_updated', loadNotifications);
    return () => window.removeEventListener('notifications_updated', loadNotifications);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'resume':
        return <FileText size={18} className="text-primary" />;
      case 'achievement':
        return <Award size={18} style={{ color: '#f59e0b' }} />;
      case 'reminder':
        return <Calendar size={18} style={{ color: '#14b8a6' }} />;
      case 'roadmap':
        return <Compass size={18} style={{ color: '#f43f5e' }} />;
      default:
        return <Bell size={18} className="text-primary" />;
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    if (filter === 'alerts') return n.type === 'resume' || n.type === 'reminder';
    return true;
  });

  return (
    <div className="animate-fade-in flex flex-col gap-md" style={{ maxWidth: '850px', margin: '0 auto' }}>
      
      {/* ── Header ── */}
      <header className="flex justify-between items-center flex-wrap gap-xs">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Notification Inbox</h1>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '2px' }}>
            Click any alert to launch its interactive chat & action room.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-xs">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'alerts', label: 'Action Items' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                border: filter === tab.key ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                background: filter === tab.key ? 'rgba(99, 102, 241, 0.12)' : 'var(--input-bg)',
                color: filter === tab.key ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Notification List ── */}
      <div className="flex flex-col gap-xs">
        {filtered.length === 0 ? (
          <div className="glass-panel text-center" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-muted" style={{ margin: 0 }}>No notifications found for this filter.</p>
          </div>
        ) : (
          filtered.map((notif, i) => (
            <div 
              key={notif.id || i} 
              className={`glass-panel interactive delay-${Math.min((i + 1) * 100, 400)} flex gap-md items-start`} 
              style={{ 
                padding: '12px 16px', 
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                borderLeft: notif.unread ? '3px solid var(--primary)' : '1px solid var(--border-color)'
              }}
              onClick={() => navigate(`/notification/${notif.id}`)}
            >
              <div 
                style={{ 
                  padding: '9px', 
                  background: 'var(--input-bg)', 
                  borderRadius: '50%',
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                {getIcon(notif.type)}
                {notif.unread && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0, 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 'var(--primary)',
                      boxShadow: '0 0 6px var(--primary-glow)' 
                    }} 
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex justify-between items-center gap-xs mb-xs">
                  <h3 style={{ fontSize: '0.94rem', fontWeight: notif.unread ? '700' : '600', margin: 0, color: 'var(--text-main)' }}>
                    {notif.title}
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {notif.time}
                  </span>
                </div>

                <p 
                  className="text-muted" 
                  style={{ 
                    fontSize: '0.83rem', 
                    margin: '0 0 6px 0', 
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {notif.message}
                </p>

                <div className="flex justify-between items-center gap-xs flex-wrap">
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '2px 8px', 
                    borderRadius: '999px', 
                    background: 'rgba(99, 102, 241, 0.08)', 
                    color: 'var(--primary)', 
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <MessageSquare size={12} />
                    Open Chat Thread
                  </span>

                  <span className="text-primary interactive" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                    {notif.actionLabel || 'View Details'} →
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
