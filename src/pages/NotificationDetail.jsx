import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Send, Sparkles, 
  Bot, ArrowUpRight
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import db from '../services/db';

function getAdvisorInsight(type) {
  switch (type) {
    case 'resume':
      return "I've completed your comprehensive resume audit. Quantifiable results and domain-specific keywords make the difference between an interview invite and an automated rejection. Click the button below to view your interactive breakdown:";
    case 'reminder':
      return "I've set up your interactive mock interview environment with live feedback. Make sure you are in a quiet room with good lighting and your audio input active:";
    case 'achievement':
      return "Congratulations on hitting this milestone! Consistent habit formation is the single highest predictor of landing top-tier tech roles. Claim your rewards below:";
    case 'roadmap':
      return "Your learning trajectory has advanced to the next level. We have unlocked new targeted resources and practice assessments in your roadmap:";
    default:
      return "I am here to help you take direct action on this notification. Choose an option below or ask me any question:";
  }
}

export default function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification] = useState(() => {
    let found = db.getNotificationById(id);
    if (!found) {
      const allNotifs = db.getNotifications();
      if (id === '1') found = allNotifs.find(n => n.type === 'resume') || allNotifs[0];
      else if (id === '2') found = allNotifs.find(n => n.type === 'achievement') || allNotifs[1];
      else if (id === '3') found = allNotifs.find(n => n.type === 'reminder') || allNotifs[2];
      else found = allNotifs[0] || null;
    }
    return found;
  });

  const [messages, setMessages] = useState(() => {
    const found = db.getNotificationById(id);
    if (!found) return [];
    return [
      {
        id: 'm1',
        sender: 'system',
        text: `📢 Alert: ${found.title}\n\n${found.message}`,
        time: found.time,
        isAlertCard: true
      },
      {
        id: 'm2',
        sender: 'assistant',
        text: getAdvisorInsight(found.type),
        time: 'Just now',
        actionButton: {
          label: found.actionLabel || 'Proceed to Destination',
          path: found.actionPath || '/dashboard',
          details: found.actionDetails || 'Tap to navigate directly'
        }
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (notification?.id) {
      db.markNotificationAsRead(notification.id);
    }
  }, [notification?.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Dynamic Redirection based on Notification Type
  const handleDirectAction = (targetPath) => {
    const path = targetPath || notification?.actionPath || '/dashboard';
    navigate(path);
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = {
      id: 'usr_' + (messages.length + 1),
      sender: 'user',
      text: userText,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Dynamic contextual assistant response
    setTimeout(() => {
      setIsTyping(false);
      let responseText = `I understand! Regarding "${notification?.title}": you can directly access the dedicated module using the shortcut button below.`;
      let redirectPath = notification?.actionPath || '/dashboard';
      let buttonLabel = notification?.actionLabel || 'Go to Destination';

      const lower = userText.toLowerCase();
      if (lower.includes('how') || lower.includes('improve') || lower.includes('fix')) {
        if (notification?.type === 'resume') {
          responseText = "To improve your ATS score, replace vague phrases like 'responsible for backend' with 'engineered 4 high-throughput microservices reducing query latency by 35%'. Let's open the Analyzer to apply this right now:";
        } else if (notification?.type === 'reminder') {
          responseText = "Practice talking aloud through your thought process and time complexity (Big-O) before writing code. Let's enter the interview simulator to do a practice question:";
        } else {
          responseText = "Consistently completing your daily action items is key. Let's head over to the recommended module:";
        }
      } else if (lower.includes('take me') || lower.includes('redirect') || lower.includes('go') || lower.includes('open')) {
        responseText = "Navigating you to your destination now. You can also tap the button below:";
        // Auto redirect after short delay if explicitly requested
        setTimeout(() => {
          navigate(redirectPath);
        }, 1200);
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'ast_' + Date.now(),
          sender: 'assistant',
          text: responseText,
          time: 'Just now',
          actionButton: {
            label: buttonLabel,
            path: redirectPath,
            details: 'Click to open now'
          }
        }
      ]);
    }, 1000);
  };

  const sendQuickPrompt = (promptText) => {
    setInput(promptText);
    setTimeout(() => {
      handleSendMessage();
    }, 50);
  };

  if (!notification) {
    return (
      <div className="flex flex-col items-center justify-center gap-md" style={{ minHeight: '60vh' }}>
        <p className="text-muted">Loading notification thread...</p>
        <button onClick={() => navigate('/notifications')} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
          Back to Inbox
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col" style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 120px)' }}>
      
      {/* ── Chat Header ── */}
      <div 
        className="glass-panel flex items-center justify-between"
        style={{ 
          padding: '12px 16px', 
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => navigate('/notifications')}
            className="interactive"
            style={{ 
              padding: '6px', 
              background: 'var(--input-bg)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Back to Notifications"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ padding: '7px', background: 'rgba(99, 102, 241, 0.12)', borderRadius: '50%', color: 'var(--primary)' }}>
            <Bot size={18} />
          </div>

          <div>
            <div className="flex items-center gap-xs">
              <h2 style={{ fontSize: '0.98rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                NEXORA Action Assistant
              </h2>
              <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>
                Live
              </span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.74rem', margin: 0 }}>
              Thread: {notification.title}
            </p>
          </div>
        </div>

        {/* Primary Redirect Action in Header */}
        <button
          onClick={() => handleDirectAction()}
          className="btn btn-primary"
          style={{ padding: '6px 14px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
        >
          <span>{notification.actionLabel || 'Launch'}</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* ── High-Impact Dynamic Notification Hero Banner ── */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(244, 63, 94, 0.08))',
          padding: '12px 18px',
          borderLeft: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary)' }}>
            Direct Action Target ({notification.type.toUpperCase()})
          </span>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: '2px 0 0 0', color: 'var(--text-main)' }}>
            {notification.actionDetails || 'Tap redirect button below to execute action.'}
          </p>
        </div>

        <button
          onClick={() => handleDirectAction()}
          className="interactive btn-secondary"
          style={{
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid var(--primary)',
            color: 'var(--primary)',
            background: 'var(--bg-card)'
          }}
        >
          Redirect Now →
        </button>
      </div>

      {/* ── Chat Messages Canvas ── */}
      <div 
        className="flex-1 overflow-y-auto flex flex-col gap-sm"
        style={{
          padding: 'var(--space-md)',
          background: 'var(--bg-card-glass)',
          borderLeft: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
            style={{ maxWidth: '85%', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
          >
            {/* Sender identity */}
            <div className="flex items-center gap-xs mb-xs" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {msg.sender === 'user' ? (
                <span>You</span>
              ) : (
                <>
                  <Sparkles size={12} className="text-primary" />
                  <span className="font-600 text-primary">NEXORA Advisor</span>
                </>
              )}
              <span>· {msg.time}</span>
            </div>

            {/* Message Bubble */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.sender === 'user' 
                  ? 'linear-gradient(135deg, var(--primary), #4f46e5)' 
                  : 'var(--bg-card)',
                color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                boxShadow: msg.sender === 'user' ? '0 4px 14px var(--primary-glow)' : '0 2px 8px rgba(0,0,0,0.05)',
                fontSize: '0.88rem',
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.text}

              {/* Embedded Action Button inside Assistant Bubble */}
              {msg.actionButton && (
                <div 
                  style={{ 
                    marginTop: '10px', 
                    paddingTop: '10px', 
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    {msg.actionButton.details}
                  </p>
                  <button
                    onClick={() => handleDirectAction(msg.actionButton.path)}
                    className="btn btn-primary"
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '0.82rem', 
                      width: '100%', 
                      borderRadius: 'var(--radius-full)',
                      marginTop: '2px'
                    }}
                  >
                    <span>{msg.actionButton.label}</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-xs" style={{ padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-full)', width: 'fit-content' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s infinite' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--secondary)', animation: 'pulse 1s infinite 0.2s' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s infinite 0.4s' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '4px' }}>Advisor is typing...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* ── Quick Prompts Strip ── */}
      <div 
        className="flex gap-xs flex-wrap"
        style={{
          padding: '8px 14px',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border-color)',
          borderRight: '1px solid var(--border-color)',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        {[
          'How do I improve my score?',
          'Take me to this module now',
          'What are the key requirements?'
        ].map(prompt => (
          <button
            key={prompt}
            onClick={() => sendQuickPrompt(prompt)}
            style={{
              fontSize: '0.74rem',
              padding: '3px 10px',
              borderRadius: '999px',
              background: 'var(--input-bg)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* ── Chat Input Footer ── */}
      <form 
        onSubmit={handleSendMessage}
        className="glass-panel flex items-center gap-sm"
        style={{
          padding: '10px 14px',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          borderTop: '1px solid var(--border-color)'
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask a question or type "take me there"...`}
          className="input-field"
          style={{
            flex: 1,
            padding: '8px 14px',
            fontSize: '0.86rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--input-bg)'
          }}
        />

        <button
          type="submit"
          disabled={!input.trim()}
          className="interactive"
          style={{
            padding: '8px 14px',
            background: input.trim() ? 'var(--primary)' : 'var(--input-bg)',
            color: input.trim() ? '#ffffff' : 'var(--text-muted)',
            borderRadius: 'var(--radius-full)',
            cursor: input.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            border: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <span>Send</span>
          <Send size={14} />
        </button>
      </form>

    </div>
  );
}
