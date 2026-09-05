import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, Paperclip, ArrowUp, Copy, Check, 
  ChevronRight, FileCode2, X, RotateCcw,
  FileText, ArrowLeft, MessageSquare, Plus, Trash2,
  ChevronDown, Bot, Terminal, Play, Download,
  RefreshCw, CornerDownLeft, Compass, Video, Users
} from 'lucide-react';
import db from '../services/db';

export default function Chatbot() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = db.getCurrentUser() || { firstName: 'Alex', dreamJob: 'Full Stack Engineer' };

  // NEXORA AI Model Families
  const models = [
    { 
      id: 'nexora-3-5-sonnet', 
      name: 'NEXORA 3.5 Sonnet', 
      tag: 'Neural Core • Frontier Coding & System Architecture', 
      speed: 'Ultra-Low Latency', 
      tokens: '200K Context' 
    },
    { 
      id: 'nexora-3-opus', 
      name: 'NEXORA 3.0 Opus', 
      tag: 'Deep Contextual Reasoning & Executive STAR Synthesis', 
      speed: 'High Precision', 
      tokens: '200K Context' 
    },
    { 
      id: 'nexora-3-5-haiku', 
      name: 'NEXORA 3.5 Haiku', 
      tag: 'Lightning Fast Technical Insights', 
      speed: 'Fastest', 
      tokens: '200K Context' 
    }
  ];
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Sidebar & Chat Sessions
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_ai_mentor_chats');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'session_1',
        title: 'Full-Stack ATS Resume Calibration',
        date: 'Today',
        preview: 'Reviewing metrics and STAR bullet points for Google...'
      },
      {
        id: 'session_2',
        title: 'Distributed Rate Limiting Architecture',
        date: 'Yesterday',
        preview: 'Token bucket and sliding window log in Redis...'
      },
      {
        id: 'session_3',
        title: 'Amazon Leadership STAR Mock Scenario',
        date: 'Previous 7 Days',
        preview: 'Customer Obsession & Disagree and Commit...'
      }
    ];
  });
  const [activeSessionId, setActiveSessionId] = useState('session_1');

  // Messages State
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'nexora',
      time: 'Just now',
      thought: `Candidate profile initialized:
- Target Role: ${currentUser.dreamJob || 'Software Professional'}
- Current Level: ${currentUser.level || 5}
- Memory Context: Calibrating responses for high-velocity software engineering interviews, ATS scanning benchmarks, and production distributed system architecture.`,
      text: `Hello ${currentUser.firstName || 'Alex'}! I am your **NEXORA AI MENTOR**, powered by frontier architectural intelligence.\n\nI can assist you in auditing resume bullet points against live recruiter ATS algorithms, running proctored behavioral & system design simulations, optimizing algorithmic complexity, or architecting distributed cloud systems. What would you like to explore or build today?`,
      code: null,
      codeTitle: null,
      codeLang: null,
      followUps: [
        'Audit my resume for high-leverage ATS keywords',
        'Architect a distributed rate limiter in Redis',
        'Simulate an Amazon Leadership STAR interview'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedThoughtIds, setExpandedThoughtIds] = useState(['m1']);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { 
    if (messages.length > 1 || isTyping) {
      scrollToBottom(); 
    }
  }, [messages, isTyping]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem('nexora_ai_mentor_chats', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to persist NEXORA chats:', e);
    }
  }, [sessions]);

  // Handle Initial Prompt passed from Dashboard or navigation
  useEffect(() => {
    if (location.state?.initialPrompt) {
      const initialText = location.state.initialPrompt;
      setInput(initialText);
      window.history.replaceState({}, document.title);
      setTimeout(() => {
        executePrompt(initialText);
      }, 300);
    }
  }, [location.state]);

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleNewChat = () => {
    const newSession = {
      id: `session_${Date.now()}`,
      title: 'New Conversation',
      date: 'Just now',
      preview: 'Fresh engineering dialogue...'
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'nexora',
        time: 'Just now',
        thought: `Conversation reset. Active Engine: ${selectedModel.name}. Context primed. Ready for new technical queries or architecture reviews.`,
        text: `Starting a fresh workspace with **${selectedModel.name}**. How can I assist your ${currentUser.dreamJob || 'engineering'} goals right now?`,
        code: null,
        codeTitle: null,
        codeLang: null,
        followUps: [
          'Explain React 19 compiler optimizations',
          'Review database indexing for PostgreSQL',
          'Design an idempotent payment webhook service'
        ]
      }
    ]);
    setAttachedFiles([]);
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId && updated.length > 0) {
      setActiveSessionId(updated[0].id);
    }
  };

  const handleAttachMock = () => {
    const options = ['Resume_2026_ATS.pdf', 'DistributedGateway.go', 'SystemArchitecture.drawio', 'BenchmarkResults.csv'];
    const chosen = options[Math.floor(Math.random() * options.length)];
    if (!attachedFiles.includes(chosen)) {
      setAttachedFiles([...attachedFiles, chosen]);
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(f => f.name);
      setAttachedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const handleCopyCode = (codeText, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  const handleCopyMessage = (text, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMsgId(id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    }
  };

  const toggleThought = (id) => {
    if (expandedThoughtIds.includes(id)) {
      setExpandedThoughtIds(expandedThoughtIds.filter(i => i !== id));
    } else {
      setExpandedThoughtIds([...expandedThoughtIds, id]);
    }
  };

  // Dynamic NEXORA AI Response Synthesis Engine
  const generateMentorReply = (userPrompt) => {
    const prompt = userPrompt.toLowerCase();
    const dreamJob = currentUser.dreamJob || 'Software Professional';

    if (prompt.includes('resume') || prompt.includes('ats') || prompt.includes('cv') || prompt.includes('keyword')) {
      return {
        thought: `Evaluating candidate query on ATS resume optimization:
1. Target role: ${dreamJob} across Tier-1 Tech (FAANG / Fortune 500).
2. Deconstructing resume parsing heuristics:
   - High ATS parsing failures stem from non-standard fonts, 2-column tables, and lack of quantifiable outcomes.
   - Formulating recommendations around the Google XYZ framework: Accomplished [X] as measured by [Y], by doing [Z].
3. Injecting high-impact keywords: Kubernetes, Distributed Tracing, Redis, TypeScript, CI/CD pipelines.`,
        text: `I've performed a comprehensive ATS audit against 2026 technical recruitment benchmarks for **${dreamJob}** positions.\n\n### 3 High-Leverage Adjustments:\n\n1. **Adopt Google's XYZ Formula**: Replace passive duties (*"Responsible for backend APIs"*) with hard operational results (*"Architected 14 RESTful microservices in Node/Go, reducing p99 latency from 480ms to 42ms for 3.4M daily requests"*).\n\n2. **Pass Strict AST Table Parsers**: Applicant Tracking Systems like Greenhouse and Workday frequently scramble multi-column layouts. Use a clean, single-column markdown/PDF structure with standard section headers (*Experience*, *Projects*, *Technical Skills*, *Education*).\n\n3. **Keyword Density Matrix**: Embed specific tools in the context of business impact rather than an unverified list at the bottom.`,
        codeTitle: 'High_Impact_Experience_Bullets.md',
        codeLang: 'markdown',
        code: `# Production Experience Bullets (${dreamJob})

* Spearheaded the migration of 8 monolithic services into Kubernetes-orchestrated microservices,
  slashing cloud compute expenditure by $42,000/yr while maintaining 99.98% service uptime.

* Engineered an automated regression and end-to-end testing pipeline with GitHub Actions & Docker,
  accelerating bi-weekly deployment frequency by 35% with zero production regressions.

* Implemented distributed Redis caching and optimized PostgreSQL composite indexes,
  eliminating query timeouts and absorbing 4.2x Black Friday traffic surge without degradation.`,
        followUps: [
          'How do I tailor this for Staff / Lead Engineer roles?',
          'Audit my project descriptions for technical depth',
          'What are the top 10 ATS red flags to avoid?'
        ]
      };
    }

    if (prompt.includes('rate limit') || prompt.includes('system design') || prompt.includes('architect') || prompt.includes('distributed')) {
      return {
        thought: `Synthesizing distributed rate limiting gateway design:
1. Requirements: High throughput (100k+ RPS), multi-region active-active, millisecond precision, atomic execution.
2. Trade-off Analysis:
   - Fixed Window Counter: Susceptible to 2x burst at boundary limits.
   - Leaky Bucket: Smooths traffic, but delays requests instead of immediate feedback.
   - Sliding Window Log: Highest precision, higher memory footprint.
   - Redis Sliding Window with ZSET + atomic Lua script is the industry gold standard.
3. Formulating runnable production-grade Lua script for Redis cluster.`,
        text: `Here is the architectural blueprint for an enterprise **Distributed Sliding-Window Rate Limiter**:\n\n### Architectural Guarantees:\n- **Atomic Guarantee**: Executes directly in Redis via Lua scripts to eliminate race conditions between reading and updating keys.\n- **Precision**: Uses Unix millisecond timestamps stored inside Redis Sorted Sets (\`ZSET\`).\n- **Memory Self-Pruning**: Automatically evicts expired requests older than the sliding window before checking the quota.\n- **Fail-Open Policy**: If the Redis cluster experiences network partitions, local in-memory token buckets take over to protect gateway throughput.`,
        codeTitle: 'sliding_window_rate_limiter.lua',
        codeLang: 'lua',
        code: `-- Atomic Redis Sliding Window Rate Limiter
local key = KEYS[1]
local now = tonumber(ARGV[1])        -- Current timestamp in milliseconds
local window = tonumber(ARGV[2])     -- Window size in milliseconds (e.g. 60000)
local limit = tonumber(ARGV[3])      -- Max requests allowed per window

local clearBefore = now - window

-- 1. Remove expired entries older than the current window
redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)

-- 2. Fetch current active count within the window
local currentCount = redis.call('ZCARD', key)

if currentCount < limit then
  -- 3. Quota available: Record request with current timestamp as both score and value
  redis.call('ZADD', key, now, now)
  redis.call('EXPIRE', key, math.ceil(window / 1000) + 1)
  return { 1, limit - currentCount - 1 } -- 1 = ALLOWED, remaining quota
else
  -- 4. Quota exceeded: Reject request
  return { 0, 0 } -- 0 = RATE_LIMITED
end`,
        followUps: [
          'How do we handle multi-region Redis replication lag?',
          'Write a Node.js/Express middleware using this script',
          'Compare Sliding Window Log vs Token Bucket algorithms'
        ]
      };
    }

    if (prompt.includes('interview') || prompt.includes('star') || prompt.includes('behavioral') || prompt.includes('amazon')) {
      return {
        thought: `Preparing Amazon Leadership Principle STAR behavioral framework:
1. Targeted Principle: Customer Obsession & Ownership.
2. Context: Technical disagreement with product scope vs technical debt.
3. Structuring STAR response:
   - Situation: Critical database bottleneck impacting user checkout.
   - Task: Resolve incident while balancing upcoming marketing launch.
   - Action: Profiling slow queries, deploying interim connection pooling, negotiating timeline with data.
   - Result: 0 downtime, 350ms checkout latency, launched 2 days early.`,
        text: `Let's practice an **Amazon Leadership Principles (LP)** behavioral scenario. A favorite MNC question is:\n\n> *"Tell me about a time you had to make a technical decision with incomplete information or under intense time pressure."*\n\n### The STAR Execution Framework:\n\n- **Situation (15%)**: Frame the context succinctly. Set the business stakes and constraints without getting bogged down in trivial backstories.\n- **Task (10%)**: Clarify your exact responsibility (e.g. *"I was the primary on-call engineer responsible for preventing checkout failure during peak traffic"*).\n- **Action (60%)**: This is the heart of the answer. Emphasize *your* technical intuition, data gathering, risk mitigation, and cross-functional leadership.\n- **Result (15%)**: Conclude with quantifiable metrics and lasting organizational learning.`,
        codeTitle: 'STAR_Response_Blueprint.md',
        codeLang: 'markdown',
        code: `### Model Answer: Amazon "Customer Obsession & Bias for Action"

* **Situation**: During a flash sale event handling 85,000 concurrent checkouts, our payment gateway began throwing 504 Gateway Timeouts on 4.2% of transactions.
* **Task**: As the lead infrastructure on-call, I needed to restore transaction health within 10 minutes without dropping in-flight payments.
* **Action**:
  1. Isolated the bottleneck to database connection pool exhaustion via Datadog metrics.
  2. Implemented dynamic query rate-limiting on non-essential search filters to prioritize checkout transactions.
  3. Deployed an ephemeral Redis queue to asynchronously buffer payment confirmations with idempotency keys.
* **Result**: Restored 100% checkout completion in 6 minutes, salvaging an estimated $180,000 in revenue, and subsequently codified the queuing pattern across 6 partner services.`,
        followUps: [
          'Give me a mock question on "Disagree and Commit"',
          'How do I quantify impact if exact revenue numbers are confidential?',
          'Roleplay an interviewer and ask me a follow-up question'
        ]
      };
    }

    if (prompt.includes('react') || prompt.includes('compiler') || prompt.includes('reconciliation')) {
      return {
        thought: `Analyzing React 19 architecture:
1. React Compiler (formerly React Forget): Automatic memoization via AST transformation.
2. Eradication of manual useMemo, useCallback, and React.memo overhead.
3. Server Actions and useActionState integration.
4. Synthesizing concise technical explanation with side-by-side compilation snippet.`,
        text: `The **React 19 Compiler** introduces an automatic compile-time memoization pipeline that fundamentally simplifies component performance tuning:\n\n### Key Architectural Shifts:\n\n1. **Automated Memoization**: The compiler analyzes JavaScript semantics and dependency graphs at build time, inserting fine-grained memoization instructions automatically without requiring manual \`useMemo\` or \`useCallback\` hooks.\n\n2. **Fine-Grained Value Tracking**: Unlike previous React reconciliation which invalidated entire functional components on state change, the compiler caches intermediate sub-expressions.\n\n3. **Preservation of React Rules**: The compiler relies on Strict Mode invariants (pure rendering functions, immutable state updates).`,
        codeTitle: 'React19CompilerOutput.jsx',
        codeLang: 'javascript',
        code: `// Developer Source Code (React 19)
export function CandidateAnalytics({ metrics, onSelectMetric }) {
  const sortedMetrics = metrics.filter(m => m.score > 80).sort((a, b) => b.score - a.score);
  
  return (
    <div className="metrics-dashboard">
      <h3>High-Performance Milestones</h3>
      {sortedMetrics.map(m => (
        <MetricCard key={m.id} data={m} onClick={() => onSelectMetric(m.id)} />
      ))}
    </div>
  );
}

// Conceptual Compiler Optimization (Automated Cache Slots)
// The compiler automatically wraps 'sortedMetrics' and the mapped JSX in internal cache checks [$]
// eliminating re-renders when 'metrics' hasn't changed.`,
        followUps: [
          'How does the React 19 Compiler handle closures?',
          'What are React Server Actions and useOptimistic?',
          'Benchmark comparison of React 18 vs React 19 rendering latency'
        ]
      };
    }

    // Default intelligent response tailored to user's dream job
    return {
      thought: `Parsing prompt: "${userPrompt}".
Context: ${dreamJob} engineering trajectory.
Formulating structured, actionable breakdown with engineering principles, industry best practices, and next steps.`,
      text: `That is an essential topic in modern **${dreamJob}** engineering.\n\n### Technical Breakdown & Strategy:\n\n1. **Core Execution Model**: Always isolate the underlying primitives (concurrency models, memory allocations, network overhead) before choosing high-level abstractions.\n\n2. **Production Reliability**: Ensure observability is built in from day one using structured logging, OpenTelemetry tracing, and canary deployment pipelines.\n\n3. **MNC Interview Framing**: When answering this in an MNC technical interview, first clarify requirements, state edge cases, discuss algorithmic space/time complexity, and validate with test cases.\n\nWould you like me to walk through a complete code implementation, design a mock interview question around this, or audit your system architecture diagram?`,
      codeTitle: null,
      codeLang: null,
      code: null,
      followUps: [
        `Write a production code example for ${dreamJob}`,
        'What are common edge cases and failure modes?',
        'Give me a 3-question quiz on this topic'
      ]
    };
  };

  const executePrompt = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      time: 'Just now',
      text: textToSend.trim(),
      files: [...attachedFiles]
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate NEXORA AI Mentor's reasoning and response
    setTimeout(() => {
      const reply = generateMentorReply(textToSend);
      const mentorMsg = {
        id: `c_${Date.now()}`,
        sender: 'nexora',
        time: 'Just now',
        thought: reply.thought,
        text: reply.text,
        code: reply.code,
        codeTitle: reply.codeTitle,
        codeLang: reply.codeLang,
        followUps: reply.followUps
      };

      setMessages(prev => [...prev, mentorMsg]);
      setIsTyping(false);
      setExpandedThoughtIds(prev => [...prev, mentorMsg.id]);
    }, 1100);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    executePrompt(input);
  };

  const handleRegenerate = (msgIndex) => {
    const previousUserMsg = [...messages].slice(0, msgIndex).reverse().find(m => m.sender === 'user');
    if (previousUserMsg) {
      setIsTyping(true);
      setTimeout(() => {
        const reply = generateMentorReply(previousUserMsg.text);
        const updated = [...messages];
        updated[msgIndex] = {
          ...updated[msgIndex],
          time: 'Just now (Regenerated)',
          thought: reply.thought,
          text: reply.text,
          code: reply.code,
          codeTitle: reply.codeTitle,
          codeLang: reply.codeLang,
          followUps: reply.followUps
        };
        setMessages(updated);
        setIsTyping(false);
      }, 900);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div 
      className="flex w-full overflow-hidden animate-fade-in" 
      style={{ 
        height: 'calc(100vh - 65px)', 
        background: 'var(--bg-main)', 
        color: 'var(--text-main)',
        position: 'relative'
      }}
    >
      
      {/* ── MOBILE BACKDROP FOR SESSIONS DRAWER ── */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── LEFT NEXORA AI SESSIONS SIDEBAR ── */}
      <aside 
        className={`flex flex-col justify-between transition-all duration-200 shrink-0 ${
          isSidebarOpen 
            ? 'w-72 max-w-[85vw] fixed lg:static inset-y-0 left-0 z-30 shadow-2xl lg:shadow-none h-full' 
            : 'w-0 -translate-x-full lg:translate-x-0 overflow-hidden'
        }`}
        style={{ 
          background: 'var(--bg-card)', 
          borderRight: '1px solid var(--border-color)',
          zIndex: 30
        }}
      >
        <div className="flex flex-col p-md gap-md overflow-hidden flex-1">
          {/* Top Brand & Hide Sidebar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-xs">
              <div 
                style={{ 
                  width: 32, height: 32, borderRadius: 10, 
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '0.92rem',
                  boxShadow: '0 4px 12px var(--primary-glow)'
                }}
              >
                ✦
              </div>
              <span className="font-extrabold text-sm tracking-tight text-main uppercase">
                NEXORA AI MENTOR
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="btn-icon-tactile p-1 text-muted hover:text-main"
              title="Close Sessions Drawer"
            >
              <X size={16} />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="flex items-center justify-between p-sm rounded-xl skeuo-convex interactive transition-all font-bold text-xs"
            style={{ 
              background: 'var(--input-bg)', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              padding: '10px 14px'
            }}
          >
            <span className="flex items-center gap-xs font-bold">
              <Plus size={16} className="text-primary" /> Start New Session
            </span>
            <span className="text-[10px] text-muted font-mono bg-[var(--bg-card)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
              +N
            </span>
          </button>

          {/* Quick Prompts Drawer List */}
          <div className="flex flex-col gap-xs mt-xs">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider px-1">Curated Prompts</span>
            {[
              { label: '📄 Audit Resume for ATS', prompt: 'Audit my resume for high-leverage ATS keywords and metrics.' },
              { label: '🏗️ Distributed Rate Limiter', prompt: 'Architect a distributed sliding-window rate limiter in Redis.' },
              { label: '💼 Amazon Leadership STAR', prompt: 'Give me a mock interview scenario on Amazon Customer Obsession and Ownership.' },
              { label: '⚡ React 19 Compiler Internals', prompt: 'Explain the React 19 compiler optimizations and automatic memoization.' },
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(p.prompt);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsSidebarOpen(false);
                  if (textareaRef.current) textareaRef.current.focus();
                }}
                className="text-left text-xs p-2.5 rounded-lg hover:bg-[var(--input-bg)] text-muted hover:text-main transition-colors truncate font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Recent Sessions List */}
          <div className="flex flex-col gap-xs mt-sm flex-1 overflow-y-auto custom-scroll">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider px-1">Recent Sessions</span>
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setActiveSessionId(s.id);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors group ${
                  activeSessionId === s.id 
                    ? 'bg-[var(--input-bg)] font-bold text-primary border border-[var(--border-color)] shadow-sm' 
                    : 'text-muted hover:bg-[var(--input-bg)] hover:text-main'
                }`}
              >
                <div className="flex items-center gap-xs min-w-0">
                  <MessageSquare size={14} className="shrink-0 text-muted" />
                  <span className="text-[13px] truncate">{s.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-muted hover:text-error p-1 transition-opacity"
                  title="Delete Chat"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Model Indicator in Sidebar */}
        <div className="p-md" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div 
            className="flex items-center justify-between p-2.5 rounded-xl"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-xs">
              <span className="text-primary text-xs font-bold">✦</span>
              <span className="text-xs font-bold text-main">{selectedModel.name}</span>
            </div>
            <span 
              className="badge text-[10px] font-bold"
              style={{ background: 'rgba(99, 102, 241, 0.14)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 4 }}
            >
              {selectedModel.tokens}
            </span>
          </div>
        </div>
      </aside>

      {/* ── MAIN NEXORA AI WORKSPACE CANVAS ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top NEXORA Sub-Toolbar */}
        <header 
          className="h-14 flex items-center justify-between px-md shrink-0 backdrop-blur-md z-10"
          style={{ 
            background: 'var(--bg-card)', 
            borderBottom: '1px solid var(--border-color)' 
          }}
        >
          <div className="flex items-center gap-sm">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="btn-icon-tactile p-1.5 text-muted hover:text-main"
                title="Open Sessions Drawer"
              >
                <MessageSquare size={18} />
              </button>
            )}

            {/* Model Selector Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-xs px-3.5 py-1.5 rounded-full skeuo-convex interactive text-xs font-bold text-main transition-all"
                style={{ 
                  background: 'var(--input-bg)', 
                  border: '1px solid var(--border-color)' 
                }}
              >
                <span className="text-primary font-bold">✦</span>
                <span className="tracking-tight">{selectedModel.name}</span>
                <ChevronDown size={14} className="text-muted ml-0.5" />
              </button>

              {showModelDropdown && (
                <div 
                  className="absolute top-10 left-0 w-80 glass-panel p-2.5 rounded-2xl shadow-2xl z-50 animate-scale-up"
                  style={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-color)' 
                  }}
                >
                  <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider px-2 py-1">
                    Select NEXORA AI Engine
                  </div>
                  {models.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setShowModelDropdown(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                        selectedModel.id === m.id 
                          ? 'bg-[var(--input-bg)] text-main font-bold border border-[var(--border-color)]' 
                          : 'hover:bg-[var(--input-bg)] text-muted hover:text-main'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-main">{m.name}</span>
                        {selectedModel.id === m.id && <Check size={14} className="text-primary" />}
                      </div>
                      <p className="text-[11px] text-muted m-0 mt-1 leading-snug">{m.tag}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sub-Actions */}
          <div className="flex items-center gap-xs">
            <button
              onClick={handleNewChat}
              className="btn btn-secondary flex items-center gap-xs"
              style={{ padding: '7px 14px', fontSize: '0.78rem', width: 'auto', borderRadius: 'var(--radius-md)' }}
              title="Reset Conversation"
            >
              <Plus size={14} /> New Chat
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary flex items-center gap-xs"
              style={{ padding: '7px 14px', fontSize: '0.78rem', width: 'auto', borderRadius: 'var(--radius-md)' }}
            >
              <ArrowLeft size={14} /> Home
            </button>
          </div>
        </header>

        {/* Conversation Stream & Welcoming State */}
        <div className="flex-1 overflow-y-auto custom-scroll p-md md:p-xl flex flex-col items-center">
          <div className="w-full max-w-3xl flex flex-col gap-xl py-sm">
            
            {/* NEXORA AI Welcoming Hero (Shown when conversation is short or fresh) */}
            {messages.length <= 1 && (
              <div className="flex flex-col items-center text-center gap-sm my-md animate-fade-in">
                <div 
                  style={{ 
                    width: 64, height: 64, borderRadius: 22, 
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '2rem', fontWeight: 800,
                    boxShadow: '0 10px 30px var(--primary-glow)'
                  }}
                >
                  ✦
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 2px 0', letterSpacing: '-0.5px' }}>
                  {getGreeting()}, {currentUser.firstName || 'Alex'}.
                </h2>
                <p className="text-muted" style={{ fontSize: '1.02rem', margin: 0, lineHeight: 1.6, maxWidth: 620 }}>
                  How can <strong className="text-main">NEXORA AI MENTOR</strong> accelerate your {currentUser.dreamJob || 'engineering'} trajectory today? Select a topic below or type your inquiry.
                </p>

                {/* 4 Prompt Starter Cards with enhanced font sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md w-full mt-lg">
                  <div 
                    onClick={() => executePrompt('Architect a distributed sliding-window rate limiter with Redis and Lua scripts')}
                    className="skeuo-convex rounded-2xl text-left cursor-pointer hover:border-[var(--primary)] hover:translate-y-[-2px] transition-all flex flex-col gap-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '18px 20px' }}
                  >
                    <div className="flex items-center gap-xs font-bold text-main" style={{ fontSize: '0.98rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>🏗️</span> System Architecture
                    </div>
                    <p className="text-muted m-0 leading-relaxed" style={{ fontSize: '0.88rem' }}>
                      Design a low-latency sliding window rate limiter with atomic Redis Lua scripts.
                    </p>
                  </div>

                  <div 
                    onClick={() => executePrompt('Audit my resume for high-leverage ATS keywords and metrics')}
                    className="skeuo-convex rounded-2xl text-left cursor-pointer hover:border-[var(--primary)] hover:translate-y-[-2px] transition-all flex flex-col gap-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '18px 20px' }}
                  >
                    <div className="flex items-center gap-xs font-bold text-main" style={{ fontSize: '0.98rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>📄</span> ATS Resume Audit
                    </div>
                    <p className="text-muted m-0 leading-relaxed" style={{ fontSize: '0.88rem' }}>
                      Review experience bullet points using Google's XYZ formula and high-density keywords.
                    </p>
                  </div>

                  <div 
                    onClick={() => executePrompt('Simulate an Amazon Leadership STAR interview on Customer Obsession')}
                    className="skeuo-convex rounded-2xl text-left cursor-pointer hover:border-[var(--primary)] hover:translate-y-[-2px] transition-all flex flex-col gap-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '18px 20px' }}
                  >
                    <div className="flex items-center gap-xs font-bold text-main" style={{ fontSize: '0.98rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>💼</span> STAR Behavioral Prep
                    </div>
                    <p className="text-muted m-0 leading-relaxed" style={{ fontSize: '0.88rem' }}>
                      Simulate MNC behavioral questions on Customer Obsession and Ownership.
                    </p>
                  </div>

                  <div 
                    onClick={() => executePrompt('Explain the React 19 compiler optimizations and automatic memoization')}
                    className="skeuo-convex rounded-2xl text-left cursor-pointer hover:border-[var(--primary)] hover:translate-y-[-2px] transition-all flex flex-col gap-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '18px 20px' }}
                  >
                    <div className="flex items-center gap-xs font-bold text-main" style={{ fontSize: '0.98rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>⚡</span> React 19 Compiler
                    </div>
                    <p className="text-muted m-0 leading-relaxed" style={{ fontSize: '0.88rem' }}>
                      Deep-dive into compiler-driven memoization and elimination of manual hooks.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Render Messages */}
            {messages.map((msg, idx) => (
              <div key={msg.id} className="flex flex-col gap-xs animate-fade-in">
                {msg.sender === 'user' ? (
                  /* User Message Card */
                  <div className="self-end max-w-xl flex flex-col items-end">
                    <div 
                      className="p-4 px-5 rounded-2xl text-white shadow-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                        lineHeight: 1.65,
                        fontSize: '1rem',
                        borderBottomRightRadius: '4px'
                      }}
                    >
                      <p className="m-0 whitespace-pre-wrap">{msg.text}</p>
                      {msg.files?.length > 0 && (
                        <div className="flex flex-wrap gap-xs mt-2 pt-2 border-t border-white/20">
                          {msg.files.map((f, i) => (
                            <span key={i} className="text-xs bg-black/20 px-2 py-0.5 rounded flex items-center gap-1">
                              <FileText size={12} /> {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted mt-1 mr-1 font-medium">{currentUser.firstName || 'You'} • {msg.time}</span>
                  </div>
                ) : (
                  /* NEXORA AI Response Card */
                  <div className="flex flex-col gap-sm">
                    {/* NEXORA Avatar Header */}
                    <div className="flex items-center gap-xs">
                      <div 
                        style={{ 
                          width: 26, height: 26, borderRadius: 8, 
                          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 800, fontSize: '0.82rem',
                          boxShadow: '0 2px 8px var(--primary-glow)'
                        }}
                      >
                        ✦
                      </div>
                      <span className="text-xs font-extrabold text-main uppercase tracking-wider">
                        NEXORA AI MENTOR
                      </span>
                      <span className="text-[11px] text-muted">• {msg.time}</span>
                    </div>

                    {/* Reasoning Accordion ("Thought for 3 seconds") */}
                    {msg.thought && (
                      <div 
                        className="rounded-xl overflow-hidden transition-all"
                        style={{ 
                          background: 'var(--input-bg)', 
                          border: '1px solid var(--border-color)' 
                        }}
                      >
                        <button
                          onClick={() => toggleThought(msg.id)}
                          className="w-full flex items-center justify-between p-2.5 px-3.5 text-left text-xs font-semibold text-muted hover:text-main transition-colors"
                          style={{ fontSize: '0.86rem' }}
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={14} className="text-warning" />
                            Thought for 3 seconds
                          </span>
                          <ChevronRight 
                            size={14} 
                            className={`transition-transform ${expandedThoughtIds.includes(msg.id) ? 'rotate-90' : ''}`} 
                          />
                        </button>
                        {expandedThoughtIds.includes(msg.id) && (
                          <div 
                            className="p-3.5 px-4 pt-1 font-mono whitespace-pre-wrap leading-relaxed"
                            style={{ 
                              borderTop: '1px solid var(--border-color)', 
                              color: 'var(--text-muted)',
                              fontSize: '0.86rem',
                              lineHeight: 1.65
                            }}
                          >
                            {msg.thought}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Body with comfortable, enhanced font size */}
                    <div 
                      className="whitespace-pre-wrap pl-1"
                      style={{ 
                        color: 'var(--text-main)', 
                        lineHeight: 1.78,
                        fontSize: '1.02rem'
                      }}
                    >
                      {msg.text}
                    </div>

                    {/* Formatted Copyable Code Block Artifact */}
                    {msg.code && (
                      <div 
                        className="rounded-2xl overflow-hidden my-2" 
                        style={{ 
                          background: '#090d16', 
                          border: '1px solid var(--border-color)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.25)' 
                        }}
                      >
                        <div 
                          className="flex items-center justify-between px-3.5 py-2.5"
                          style={{ 
                            background: '#111827', 
                            borderBottom: '1px solid rgba(255,255,255,0.08)' 
                          }}
                        >
                          <span className="font-mono text-zinc-300 flex items-center gap-1.5" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                            <FileCode2 size={14} className="text-primary" /> {msg.codeTitle || 'artifact.code'}
                            {msg.codeLang && (
                              <span className="badge text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md uppercase font-bold">
                                {msg.codeLang}
                              </span>
                            )}
                          </span>
                          <button
                            onClick={() => handleCopyCode(msg.code, msg.id)}
                            className="flex items-center gap-1 text-zinc-300 hover:text-white px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors font-medium"
                            style={{ fontSize: '0.82rem' }}
                          >
                            {copiedCodeId === msg.id ? (
                              <><Check size={13} className="text-success" /> Copied</>
                            ) : (
                              <><Copy size={13} /> Copy Code</>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-zinc-200 overflow-x-auto leading-relaxed m-0 custom-scroll font-mono" style={{ fontSize: '0.90rem', lineHeight: 1.7 }}>
                          <code>{msg.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Response Action Pills & Follow-up Chips */}
                    <div className="flex flex-col gap-xs mt-1 pl-1">
                      {/* Interactive Follow-up Prompt Chips */}
                      {msg.followUps && msg.followUps.length > 0 && (
                        <div className="flex flex-wrap gap-xs mb-xs">
                          {msg.followUps.map((chip, i) => (
                            <button
                              key={i}
                              onClick={() => executePrompt(chip)}
                              className="text-left rounded-full skeuo-convex interactive transition-all font-semibold"
                              style={{ 
                                background: 'var(--input-bg)', 
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.86rem',
                                padding: '7px 16px'
                              }}
                            >
                              <span className="text-primary font-bold">✦</span> {chip}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Tool Actions */}
                      <div className="flex items-center gap-sm mt-1">
                        <button
                          onClick={() => handleCopyMessage(msg.text, msg.id)}
                          className="text-muted hover:text-main flex items-center gap-1 transition-colors font-medium"
                          style={{ fontSize: '0.84rem' }}
                          title="Copy Full Response"
                        >
                          {copiedMsgId === msg.id ? (
                            <><Check size={13} className="text-success" /> Copied</>
                          ) : (
                            <><Copy size={13} /> Copy</>
                          )}
                        </button>
                        <span className="text-muted text-xs">•</span>
                        <button
                          onClick={() => handleRegenerate(idx)}
                          className="text-muted hover:text-main flex items-center gap-1 transition-colors font-medium"
                          style={{ fontSize: '0.84rem' }}
                          title="Regenerate Response"
                        >
                          <RefreshCw size={13} /> Regenerate
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Live Thinking Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted pl-1 animate-pulse" style={{ fontSize: '0.92rem' }}>
                <span className="text-primary font-bold">✦</span>
                <span>NEXORA AI MENTOR is reasoning and formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── NEXORA FLOATING BOTTOM INPUT CAPSULE ── */}
        <div 
          className="p-md shrink-0 flex flex-col items-center"
          style={{ 
            background: 'var(--bg-card)', 
            borderTop: '1px solid var(--border-color)' 
          }}
        >
          <div className="w-full max-w-3xl flex flex-col gap-xs">
            
            {/* Attached files chips */}
            {attachedFiles.length > 0 && (
              <div className="flex items-center gap-xs px-2 mb-1">
                {attachedFiles.map((file, i) => (
                  <span 
                    key={i} 
                    className="badge px-3 py-1 rounded-md flex items-center gap-1 font-medium"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.84rem' }}
                  >
                    <FileText size={13} className="text-primary" /> {file}
                    <X 
                      size={12} 
                      className="cursor-pointer ml-1 text-muted hover:text-main" 
                      onClick={() => setAttachedFiles(attachedFiles.filter(f => f !== file))} 
                    />
                  </span>
                ))}
              </div>
            )}

            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              multiple 
            />

            {/* Input Capsule Box with comfortable font size */}
            <form 
              onSubmit={handleSendMessage}
              className="relative flex items-end gap-2 rounded-2xl p-2.5 px-3.5 skeuo-convex transition-all"
              style={{ 
                background: 'var(--input-bg)', 
                border: '1px solid var(--border-color)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)' 
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-muted hover:text-main rounded-xl hover:bg-[var(--bg-card)] transition-colors"
                title="Attach Document or Resume (PDF, Code, Text)"
              >
                <Paperclip size={20} />
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Ask NEXORA AI MENTOR anything about ${currentUser.dreamJob || 'engineering'}... (Enter to send, Shift+Enter for new line)`}
                className="flex-1 bg-transparent border-none outline-none placeholder:text-[var(--text-muted)] resize-none py-2 max-h-48"
                style={{ 
                  color: 'var(--text-main)', 
                  lineHeight: 1.5,
                  fontSize: '1rem'
                }}
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-2.5 rounded-xl transition-all ${
                  input.trim() 
                    ? 'bg-[var(--primary)] text-white hover:opacity-90 shadow-md' 
                    : 'bg-[var(--bg-card)] text-muted cursor-not-allowed opacity-50'
                }`}
                title="Send Message to NEXORA AI MENTOR"
              >
                <ArrowUp size={18} />
              </button>
            </form>

            <span className="text-center text-muted mt-1" style={{ fontSize: '0.78rem' }}>
              NEXORA AI MENTOR provides advanced career, ATS & system architecture intelligence. Always verify production configurations.
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}
