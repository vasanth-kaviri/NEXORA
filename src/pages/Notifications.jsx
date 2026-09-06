import { 
  Bell, Award, Calendar, Compass, FileText, 
  Sparkles, Search, Check, ArrowRight, Clock, Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import db from '../services/db';
import realtimeDb from '../services/realtimeDb';
import { useToast } from '../contexts/ToastContext';

export default function Notifications() {
  const navigate = useNavigate();
  const toast = useToast();

  const [notifications, setNotifications] = useState(() => db.getNotifications());
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'resume' | 'interview'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotif, setSelectedNotif] = useState(() => {
    const list = db.getNotifications();
    return list.length > 0 ? list[0] : null;
  });
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const user = db.getCurrentUser();
    const uid = user?.id || user?.uid;
    let unsubscribe = null;

    if (uid) {
      unsubscribe = realtimeDb.subscribeToNotifications(uid, (remoteList) => {
        if (remoteList && remoteList.length > 0) {
          setNotifications(remoteList);
          setSelectedNotif(prev => {
            if (prev) {
              return remoteList.find(n => n.id === prev.id) || remoteList[0];
            }
            return remoteList[0];
          });
        }
      });
    }

    const handleUpdate = () => {
      const list = db.getNotifications();
      setNotifications(list);
    };
    window.addEventListener('notifications_updated', handleUpdate);

    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener('notifications_updated', handleUpdate);
    };
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

  const handleSelect = (notif) => {
    setSelectedNotif(notif);
    if (notif.unread) {
      db.markNotificationAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    }
  };

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (n.unread) db.markNotificationAsRead(n.id);
    });
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('All alerts marked as read');
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedNotif) return;
    
    db.addChatToNotification(selectedNotif.id, replyText);
    setReplyText('');
    toast.success('Reply submitted to AI Mentor');
    
    // Instant AI reply synchronized to database
    setTimeout(() => {
      db.addChatToNotification(selectedNotif.id, 'I have noted your update and adjusted your career trajectory accordingly! Keep up the great work.', 'system');
    }, 800);
  };

  const filtered = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'unread') return n.unread;
    if (filter === 'resume') return n.type === 'resume';
    if (filter === 'interview') return n.type === 'reminder';
    return true;
  });

  const unreadTotal = notifications.filter(n => n.unread).length;

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-md">
      
      {/* ── Inbox Header ── */}
      <header className="glass-panel skeuo-convex" style={{ padding: '18px 24px', borderRadius: 'var(--radius-lg)' }}>
        <div className="flex justify-between items-center flex-wrap gap-sm">
          <div>
            <div className="flex items-center gap-xs mb-xs">
              <Bell size={18} className="text-primary" />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary)' }}>
                ENTERPRISE INBOX & ACTION HUB
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0', letterSpacing: '-0.3px' }}>
              Notification Workstation
            </h1>
            <p className="text-muted" style={{ fontSize: '0.86rem', margin: 0 }}>
              {unreadTotal} unread action items requiring your attention
            </p>
          </div>

          <div className="flex items-center gap-xs">
            <button
              onClick={handleMarkAllRead}
              className="btn btn-secondary flex items-center gap-xs"
              style={{ fontSize: '0.82rem', padding: '7px 14px' }}
            >
              <Check size={15} />
              <span>Mark All as Read</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex justify-between items-center flex-wrap gap-sm mt-md pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex gap-xs flex-wrap">
            {[
              { key: 'all', label: `All (${notifications.length})` },
              { key: 'unread', label: `Unread (${unreadTotal})` },
              { key: 'resume', label: 'ATS Audits' },
              { key: 'interview', label: 'Mock Interviews' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`tab-pill ${filter === f.key ? 'active' : ''}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-xs skeuo-well" style={{ padding: '5px 12px', borderRadius: 'var(--radius-full)', width: '220px' }}>
            <Search size={14} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '0.8rem', width: '100%' }}
            />
          </div>
        </div>
      </header>

      {/* ── Split Inbox Workstation (Left: Feed, Right: Live Resolution Canvas) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md" style={{ alignItems: 'start' }}>
        
        {/* ── LEFT PANE: Notification List (5 Columns on Desktop) ── */}
        <div className="lg:col-span-5 flex flex-col gap-xs">
          {filtered.length === 0 ? (
            <div className="glass-panel p-lg text-center" style={{ borderRadius: 'var(--radius-md)' }}>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.88rem' }}>No notifications match the filter.</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const isSelected = selectedNotif?.id === notif.id;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleSelect(notif)}
                  className={`skeuo-convex interactive transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-card)' : 'var(--skeuo-surface-grad)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 16px var(--primary-glow)' : 'var(--skeuo-bevel-light)'
                  }}
                >
                  <div className="flex items-start gap-sm">
                    <div className="skeuo-well" style={{ padding: '8px', borderRadius: '50%', flexShrink: 0 }}>
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-xs">
                        <span className="badge" style={{ fontSize: '0.66rem', fontWeight: 700, background: 'var(--input-bg)' }}>
                          {notif.type.toUpperCase()}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {notif.time}
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', fontWeight: notif.unread ? 800 : 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notif.title}
                      </h4>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {notif.message}
                      </p>
                    </div>

                    {notif.unread && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '6px', boxShadow: '0 0 6px var(--primary)' }} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── RIGHT PANE: Live Resolution Canvas (7 Columns on Desktop - Full Space Utilized) ── */}
        <div className="lg:col-span-7 flex flex-col" style={{ height: '100%' }}>
          {selectedNotif ? (
            <div 
              className="glass-panel skeuo-convex flex flex-col justify-between" 
              style={{ 
                padding: '24px', 
                borderRadius: 'var(--radius-lg)', 
                minHeight: '640px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              
              {/* Top Meta & Action */}
              <div className="flex flex-col gap-sm">
                <div className="flex justify-between items-start flex-wrap gap-sm">
                  <div>
                    <div className="flex items-center gap-xs mb-xs">
                      <span className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700 }}>
                        ACTIVE RESOLUTION CANVAS
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.78rem' }}>•</span>
                      <span className="text-muted" style={{ fontSize: '0.78rem' }}>{selectedNotif.time}</span>
                    </div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 6px 0', letterSpacing: '-0.3px' }}>
                      {selectedNotif.title}
                    </h2>
                  </div>

                  {selectedNotif.actionPath && (
                    <button
                      onClick={() => navigate(selectedNotif.actionPath)}
                      className="btn btn-primary flex items-center gap-xs"
                      style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                    >
                      <span>{selectedNotif.actionLabel || 'Launch Tool'}</span>
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>

                {/* Message Body */}
                <p className="text-main" style={{ fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                  {selectedNotif.message}
                </p>

                {/* Specific Widget based on alert type */}
                {selectedNotif.type === 'resume' && (
                  <div className="skeuo-well" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div className="flex justify-between items-center mb-xs">
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                        AI ATS AUDIT TELEMETRY
                      </span>
                      <span className="tabular-numbers text-success font-bold" style={{ fontSize: '1.1rem' }}>
                        78 / 100
                      </span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #10b981, var(--primary))', borderRadius: '9999px' }} />
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.78rem', margin: 0 }}>
                      Detected 3 high-leverage technical keyword opportunities: <strong>PyTorch Quantization</strong>, <strong>FastAPI Async Inference</strong>, and <strong>Docker Containerization</strong>.
                    </p>
                  </div>
                )}

                {selectedNotif.type === 'reminder' && (
                  <div className="skeuo-well" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <div className="flex items-center gap-xs mb-xs">
                      <Clock size={16} className="text-accent" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>AI Mock Interview Chamber Ready</span>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>
                      Topics: Machine Learning System Design, Algorithm Latency, and Python Concurrency. Ensure camera & microphone permissions are enabled.
                    </p>
                  </div>
                )}
              </div>

              {/* Interactive AI Chat Thread - Expanded to utilize full height */}
              <div 
                className="flex-1 flex flex-col justify-between pt-md mt-md" 
                style={{ borderTop: '1px solid var(--border-color)', minHeight: '340px' }}
              >
                <div className="flex items-center gap-xs mb-xs">
                  <Sparkles size={16} className="text-primary" />
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800 }}>In-Place AI Resolution Thread</h4>
                </div>

                {/* Expanded Scrollable Messages Feed */}
                <div 
                  className="flex-1 flex flex-col gap-sm p-sm custom-scroll rounded-lg my-xs" 
                  style={{ 
                    maxHeight: '380px', 
                    overflowY: 'auto',
                    background: 'var(--input-bg)'
                  }}
                >
                  {(selectedNotif.chatHistory || []).map((chat, idx) => (
                    <div 
                      key={idx}
                      className={`p-sm rounded-md ${chat.sender === 'user' ? 'self-end bg-primary text-white' : 'self-start glass-panel text-main'}`}
                      style={{ 
                        maxWidth: '82%', 
                        padding: '10px 14px', 
                        fontSize: '0.84rem', 
                        borderRadius: 'var(--radius-md)',
                        boxShadow: chat.sender === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
                      }}
                    >
                      <p style={{ margin: 0, lineHeight: 1.45 }}>{chat.text}</p>
                      <span style={{ fontSize: '0.68rem', opacity: 0.7, display: 'block', marginTop: '4px' }}>{chat.time}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Reply Form Docked at Bottom */}
                <form onSubmit={handleSendReply} className="flex gap-xs pt-xs">
                  <input 
                    type="text"
                    placeholder="Type your response or request AI to implement changes..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="skeuo-well flex-1"
                    style={{ 
                      padding: '10px 16px', 
                      borderRadius: 'var(--radius-full)', 
                      border: '1px solid var(--border-color)', 
                      color: 'var(--text-main)',
                      fontSize: '0.84rem',
                      outline: 'none'
                    }}
                  />
                  <button 
                    type="submit"
                    className="btn btn-primary flex items-center justify-center"
                    style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0 }}
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="glass-panel flex items-center justify-center p-xl text-center" style={{ minHeight: '520px', height: '100%', borderRadius: 'var(--radius-lg)' }}>
              <p className="text-muted">Select an alert from the left feed to resolve it in-place.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
