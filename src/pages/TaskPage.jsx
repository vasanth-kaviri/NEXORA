import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  CheckCircle2, ArrowLeft, PlayCircle, BookOpen, Terminal, Code2, 
  Sparkles, ExternalLink, RefreshCw, Check, Lightbulb 
} from 'lucide-react';
import db from '../services/db';
import realtimeDb from '../services/realtimeDb';

// Enriched task database keyed by ID or domain
const defaultTaskTemplates = {
  '1': {
    id: 1,
    title: 'Build Resilient JWT Authentication Middleware',
    domain: 'Backend Security & APIs',
    duration: '45 mins',
    xp: 50,
    scenario: 'In production systems at companies like Stripe and Netflix, API endpoints must verify caller identity within 5 milliseconds while protecting against signature tampering, token expiration, and CSRF attacks.',
    objectives: [
      'Extract Bearer token from incoming HTTP Authorization header',
      'Verify cryptographic signature using RS256 public key algorithm',
      'Validate expiration claims (exp) and subject identifier (sub)',
      'Attach sanitized user context to request state before next handler'
    ],
    starterCode: `// Middleware: authenticateToken.js
import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // TODO: Implement signature verification with error handling
  try {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}`,
    hint: 'Remember to verify both the algorithm header to prevent "none" algorithm vulnerabilities and ensure req.headers["authorization"] handles case insensitivity.'
  },
  '2': {
    id: 2,
    title: 'Optimize Database Query with Compound B-Tree Index',
    domain: 'Database Engineering',
    duration: '35 mins',
    xp: 50,
    scenario: 'High-throughput analytics queries at Uber can trigger expensive sequential scans across hundreds of millions of ride rows unless compound indices match the exact WHERE, ORDER BY, and LIMIT query predicates.',
    objectives: [
      'Analyze EXPLAIN ANALYZE query plans before and after indexing',
      'Construct a composite B-Tree index respecting left-to-right column selectivity',
      'Verify query execution time drops below 15 milliseconds'
    ],
    starterCode: `-- PostgreSQL Migration: optimize_trips_query.sql
-- Before: Sequential scan on 25,000,000 rows (~480ms)
EXPLAIN ANALYZE 
SELECT id, user_id, pickup_time, fare_amount 
FROM trips 
WHERE city_id = 'nyc_01' 
  AND status = 'COMPLETED' 
ORDER BY pickup_time DESC 
LIMIT 50;

-- TODO: Create the optimal composite index
CREATE INDEX CONCURRENTLY idx_trips_city_status_time 
ON trips (city_id, status, pickup_time DESC);`,
    hint: 'Equality columns (city_id, status) should always precede range or ordering columns (pickup_time DESC) in compound B-Tree indexes.'
  }
};

export default function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const currentUser = db.getCurrentUser() || {};

  const template = defaultTaskTemplates[taskId] || defaultTaskTemplates['1'];

  const [task, setTask] = useState(() => {
    try {
      const currentTasks = JSON.parse(localStorage.getItem('nexora_current_tasks') || '[]');
      const foundTask = currentTasks.find(t => t.id.toString() === taskId);
      const savedProgress = JSON.parse(localStorage.getItem('nexora_task_progress') || '{}');
      const isCompleted = !!savedProgress[taskId];
      const tmpl = defaultTaskTemplates[taskId] || defaultTaskTemplates['1'];
      return {
        id: taskId,
        title: foundTask?.title || tmpl.title,
        domain: tmpl.domain,
        duration: tmpl.duration,
        xp: tmpl.xp,
        scenario: tmpl.scenario,
        objectives: tmpl.objectives,
        starterCode: tmpl.starterCode,
        hint: tmpl.hint,
        completed: isCompleted
      };
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('code'); // 'code', 'guide', 'tests'
  const [codeContent, setCodeContent] = useState(() => template.starterCode);
  const [testResults, setTestResults] = useState(null);
  const [runningTests, setRunningTests] = useState(false);
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Review architectural principles and requirements', done: true },
    { id: 2, text: 'Implement robust parameter validation and error boundaries', done: false },
    { id: 3, text: 'Pass all 3 automated integration test assertions', done: false }
  ]);
  const [showHint, setShowHint] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleRunTests = () => {
    setRunningTests(true);
    setTestResults(null);

    setTimeout(() => {
      setRunningTests(false);
      setTestResults([
        { name: 'Assertion 1: Rejects malformed or missing Bearer tokens with HTTP 401', passed: true, latency: '8ms' },
        { name: 'Assertion 2: Validates valid RS256 signed payload and decodes user context', passed: true, latency: '14ms' },
        { name: 'Assertion 3: Correctly rejects expired JWT tokens with HTTP 403', passed: true, latency: '11ms' }
      ]);

      setChecklist(prev => prev.map(item => ({ ...item, done: true })));
      triggerToast('All 3 Test Assertions Passed! Task ready for completion.');
    }, 1200);
  };

  const handleCompleteTask = () => {
    const savedProgress = JSON.parse(localStorage.getItem('nexora_task_progress') || '{}');
    savedProgress[taskId] = true;
    localStorage.setItem('nexora_task_progress', JSON.stringify(savedProgress));

    // Award XP and sync to Realtime Database
    const user = db.getCurrentUser();
    const uid = user?.id || user?.uid;
    if (uid) {
      realtimeDb.setTaskProgress(uid, taskId, true);
    }
    db.updateUserProfile({
      xp: (currentUser.xp || 1200) + 50,
      tasksCompleted: (currentUser.tasksCompleted || 0) + 1
    });

    setTask(prev => ({ ...prev, completed: true }));
    triggerToast('Task Completed! +50 XP awarded to your profile.');

    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  if (!task) return null;

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>
      {/* Toast Notification */}
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

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-xs btn-icon-tactile mb-xs text-muted"
            style={{ fontSize: '0.82rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}
          >
            <ArrowLeft size={15} /> Back to Learning Path
          </button>
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem' }}>
            <BookOpen size={15} /> TASK DEEP DIVE WORKSPACE
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {task.title}
          </h1>
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>
            {task.domain} • Estimated: {task.duration} • Earn <strong>+{task.xp} XP</strong>
          </p>
        </div>

        <div className="flex items-center gap-sm">
          {task.completed ? (
            <span 
              className="badge" 
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--success)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={16} /> Task Completed
            </span>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={handleCompleteTask}
              style={{ width: 'auto', padding: '10px 22px', fontSize: '0.88rem' }}
            >
              <CheckCircle2 size={16} /> Mark as Completed (+50 XP)
            </button>
          )}
        </div>
      </header>

      {/* Main Learning Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left 2 Columns: Code Sandbox & Terminal */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          {/* Workstation Tab Bar */}
          <div className="glass-panel flex justify-between items-center p-xs" style={{ padding: '6px 12px' }}>
            <div className="flex gap-xs">
              <button
                onClick={() => setActiveTab('code')}
                className="skeuo-pill"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: activeTab === 'code' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'code' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer'
                }}
              >
                <Code2 size={14} style={{ display: 'inline', marginRight: 4 }} /> Interactive Code Editor
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className="skeuo-pill"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: activeTab === 'guide' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'guide' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer'
                }}
              >
                <BookOpen size={14} style={{ display: 'inline', marginRight: 4 }} /> Concept Guide
              </button>
            </div>

            <button
              onClick={handleRunTests}
              disabled={runningTests}
              className="btn btn-primary"
              style={{ width: 'auto', padding: '6px 16px', fontSize: '0.82rem' }}
            >
              <PlayCircle size={15} /> {runningTests ? 'Executing Tests...' : 'Run Test Suite'}
            </button>
          </div>

          {/* Active Tab View */}
          {activeTab === 'code' ? (
            <div className="glass-panel flex flex-col overflow-hidden" style={{ background: '#09090c', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              {/* Editor Header */}
              <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  solution_workspace.js
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--success)' }}>
                  ● Syntax Validated
                </span>
              </div>

              {/* Code Textarea */}
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                rows={14}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: '#e2e8f0',
                  border: 'none',
                  padding: '16px',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '0.86rem',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
            </div>
          ) : (
            /* Concept Guide Tab */
            <div className="glass-panel p-lg flex flex-col gap-md" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Real-World Production Scenario</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                {task.scenario}
              </p>

              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}>Key Learning Objectives</h4>
              <ul className="flex flex-col gap-xs" style={{ paddingLeft: '1.2rem', fontSize: '0.86rem' }}>
                {task.objectives?.map((obj, i) => (
                  <li key={i} className="text-muted">{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Runner Terminal Output */}
          <div className="glass-panel flex flex-col overflow-hidden" style={{ background: '#09090c', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={14} className="text-primary" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Automated Test Output Console
              </span>
            </div>

            <div style={{ padding: '14px 16px', minHeight: '110px', fontFamily: 'monospace', fontSize: '0.82rem' }}>
              {runningTests && (
                <div className="text-primary flex items-center gap-xs">
                  <RefreshCw size={14} className="animate-spin" /> Running automated assertions against solution code...
                </div>
              )}

              {!runningTests && !testResults && (
                <div className="text-muted">
                  Click "Run Test Suite" above to execute integration assertions against your implementation.
                </div>
              )}

              {!runningTests && testResults && (
                <div className="flex flex-col gap-xs">
                  <div className="text-success font-600 mb-xs">
                    === Test Suite Finished: 3 of 3 Assertions Passed ===
                  </div>
                  {testResults.map((t, idx) => (
                    <div key={idx} className="flex justify-between items-center text-muted" style={{ padding: '2px 0' }}>
                      <span className="text-success flex items-center gap-xs">
                        <Check size={14} /> {t.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{t.latency}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Checklist & Progressive Hints */}
        <div className="flex flex-col gap-md">
          {/* Checklist Card */}
          <div className="glass-panel p-md flex flex-col gap-sm" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }} className="flex items-center gap-xs">
              <CheckCircle2 size={18} className="text-success" /> Verification Checklist
            </h3>

            <div className="flex flex-col gap-sm mt-xs">
              {checklist.map(item => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setChecklist(prev => prev.map(i => i.id === item.id ? { ...i, done: !i.done } : i));
                  }}
                  className="flex items-start gap-sm cursor-pointer"
                  style={{ fontSize: '0.84rem' }}
                >
                  <div 
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: '1px solid var(--border-color)',
                      background: item.done ? 'var(--success)' : 'var(--input-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      marginTop: 2,
                      shrink: 0
                    }}
                  >
                    {item.done && <Check size={12} />}
                  </div>
                  <span style={{ color: item.done ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: item.done ? 'line-through' : 'none' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Progressive Hint Card */}
          <div className="glass-panel p-md flex flex-col gap-xs" style={{ padding: '1.25rem' }}>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-xs font-700" style={{ fontSize: '0.88rem' }}>
                <Lightbulb size={16} className="text-warning" /> Need Guidance?
              </span>
              <button
                className="btn-icon-tactile"
                onClick={() => setShowHint(!showHint)}
                style={{ fontSize: '0.76rem', padding: '4px 8px', borderRadius: 4 }}
              >
                {showHint ? 'Hide Hint' : 'Reveal Hint'}
              </button>
            </div>

            {showHint ? (
              <p className="text-muted mt-xs animate-fade-in" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                {task.hint}
              </p>
            ) : (
              <p className="text-muted mt-xs" style={{ fontSize: '0.78rem' }}>
                Click "Reveal Hint" for architectural tips on solving this milestone.
              </p>
            )}
          </div>

          {/* External Docs Reference */}
          <div className="glass-panel p-md flex flex-col gap-xs" style={{ padding: '1.25rem' }}>
            <span className="text-muted font-600" style={{ fontSize: '0.78rem' }}>OFFICIAL REFERENCES</span>
            <div className="flex flex-col gap-xs mt-xs">
              <a 
                href="https://developer.mozilla.org" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between text-muted hover:text-primary transition-colors"
                style={{ fontSize: '0.82rem' }}
              >
                <span>MDN Web Security Standards</span>
                <ExternalLink size={13} />
              </a>
              <a 
                href="https://jwt.io" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between text-muted hover:text-primary transition-colors"
                style={{ fontSize: '0.82rem' }}
              >
                <span>JSON Web Token Specification (RFC 7519)</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
