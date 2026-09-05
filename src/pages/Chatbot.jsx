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

  // Claude Model Families
  const models = [
    { 
      id: 'claude-3-5-sonnet', 
      name: 'Claude 3.5 Sonnet', 
      tag: 'Most Intelligent • Frontier Coding', 
      speed: 'High', 
      tokens: '200K Context' 
    },
    { 
      id: 'claude-3-opus', 
      name: 'Claude 3 Opus', 
      tag: 'Deep Contextual Reasoning & System Design', 
      speed: 'Moderate', 
      tokens: '200K Context' 
    },
    { 
      id: 'claude-3-5-haiku', 
      name: 'Claude 3.5 Haiku', 
      tag: 'Lightning Fast Technical Answers', 
      speed: 'Fastest', 
      tokens: '200K Context' 
    }
  ];
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Sidebar & Chat Sessions
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_claude_chats');
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
      sender: 'claude',
      time: 'Just now',
      thought: `Candidate profile initialized:
- Target Role: ${currentUser.dreamJob || 'Software Professional'}
- Current Level: ${currentUser.level || 5}
- Memory Context: Calibrating responses for high-velocity software engineering interviews, ATS scanning benchmarks, and production distributed system architecture.`,
      text: `Hello ${currentUser.firstName || 'Alex'}! I am your **NEXORA AI Mentor**, architected with Claude 3.5 Sonnet's technical reasoning engine.\n\nI can assist you in auditing resume bullets against live ATS parsers, conducting real-time mock behavioral & system design interviews, optimizing algorithmic complexity, or architecting distributed cloud systems. What would you like to explore or build today?`,
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
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem('nexora_claude_chats', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to persist Claude chats:', e);
    }
  }, [sessions]);

  // Handle Initial Prompt passed from Dashboard navigation
  useEffect(() => {
    if (location.state?.initialPrompt) {
      const initialText = location.state.initialPrompt;
      setInput(initialText);
      // Clean location state to avoid re-triggering
      window.history.replaceState({}, document.title);
      // Trigger execution automatically after short delay
      setTimeout(() => {
        executePrompt(initialText);
      }, 300);
    }
  }, [location.state]);

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
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
        sender: 'claude',
        time: 'Just now',
        thought: `Conversation reset. Model: ${selectedModel.name}. Context cleared. Ready for new technical queries or architecture reviews.`,
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

  // Dynamic Claude Response Synthesis Engine
  const generateClaudeReply = (userPrompt) => {
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

    // Simulate Claude's realistic reasoning + streaming response time
    setTimeout(() => {
      const reply = generateClaudeReply(textToSend);
      const claudeMsg = {
        id: `c_${Date.now()}`,
        sender: 'claude',
        time: 'Just now',
        thought: reply.thought,
        text: reply.text,
        code: reply.code,
        codeTitle: reply.codeTitle,
        codeLang: reply.codeLang,
        followUps: reply.followUps
      };

      setMessages(prev => [...prev, claudeMsg]);
      setIsTyping(false);
      setExpandedThoughtIds(prev => [...prev, claudeMsg.id]);
    }, 1100);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    executePrompt(input);
  };

  const handleRegenerate = (msgIndex) => {
    // Find last user message
    const previousUserMsg = [...messages].slice(0, msgIndex).reverse().find(m => m.sender === 'user');
    if (previousUserMsg) {
      setIsTyping(true);
      setTimeout(() => {
        const reply = generateClaudeReply(previousUserMsg.text);
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
      
      {/* ── LEFT CLAUDE SESSIONS SIDEBAR ── */}
      <aside 
        className={`flex flex-col justify-between transition-all duration-200 shrink-0 ${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}
        style={{ 
          background: 'var(--bg-card)', 
          borderRight: '1px solid var(--border-color)',
          zIndex: 10
        }}
      >
        <div className="flex flex-col p-md gap-md overflow-hidden flex-1">
          {/* Top Brand & Hide Sidebar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-xs">
              <div 
                style={{ 
                  width: 28, height: 28, borderRadius: 8, 
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '0.85rem'
                }}
              >
                ✦
              </div>
              <span className="font-bold text-sm tracking-tight text-main">Claude AI Mentor</span>
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
            className="flex items-center justify-between p-sm rounded-lg skeuo-convex interactive transition-all font-semibold text-xs"
            style={{ 
              background: 'var(--input-bg)', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)'
            }}
          >
            <span className="flex items-center gap-xs">
              <Plus size={15} className="text-primary" /> Start New Chat
            </span>
            <span className="text-[10px] text-muted font-mono bg-[var(--bg-card)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
              +N
            </span>
          </button>

          {/* Quick Prompts Drawer List */}
          <div className="flex flex-col gap-xs mt-xs">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider px-1">Curated Prompts</span>
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
                  if (textareaRef.current) textareaRef.current.focus();
                }}
                className="text-left text-xs p-2 rounded-md hover:bg-[var(--input-bg)] text-muted hover:text-main transition-colors truncate"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Recent Sessions List */}
          <div className="flex flex-col gap-xs mt-sm flex-1 overflow-y-auto custom-scroll">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider px-1">Recent Sessions</span>
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group ${
                  activeSessionId === s.id 
                    ? 'bg-[var(--input-bg)] font-semibold text-primary border border-[var(--border-color)]' 
                    : 'text-muted hover:bg-[var(--input-bg)] hover:text-main'
                }`}
              >
                <div className="flex items-center gap-xs min-w-0">
                  <MessageSquare size={13} className="shrink-0 text-muted" />
                  <span className="text-xs truncate">{s.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-muted hover:text-error p-1 transition-opacity"
                  title="Delete Chat"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Model Indicator in Sidebar */}
        <div className="p-md" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div 
            className="flex items-center justify-between p-2 rounded-lg"
            style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-xs">
              <span className="text-primary text-xs">✦</span>
              <span className="text-xs font-semibold text-main">{selectedModel.name}</span>
            </div>
            <span 
              className="badge text-[10px]"
              style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 4 }}
            >
              {selectedModel.tokens}
            </span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CLAUDE WORKSPACE CANVAS ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Claude Sub-Toolbar */}
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
                className="flex items-center gap-xs px-3 py-1.5 rounded-full skeuo-convex interactive text-xs font-semibold text-main transition-all"
                style={{ 
                  background: 'var(--input-bg)', 
                  border: '1px solid var(--border-color)' 
                }}
              >
                <span className="text-primary font-bold">✦</span>
                <span>{selectedModel.name}</span>
                <ChevronDown size={13} className="text-muted" />
              </button>

              {showModelDropdown && (
                <div 
                  className="absolute top-10 left-0 w-72 glass-panel p-2 rounded-xl shadow-2xl z-50 animate-scale-up"
                  style={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-color)' 
                  }}
                >
                  <div className="text-[10px] font-bold text-muted uppercase tracking-wider px-2 py-1">
                    Select Claude Model
                  </div>
                  {models.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setShowModelDropdown(false);
                      }}
                      className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                        selectedModel.id === m.id 
                          ? 'bg-[var(--input-bg)] text-main font-medium border border-[var(--border-color)]' 
                          : 'hover:bg-[var(--input-bg)] text-muted hover:text-main'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-main">{m.name}</span>
                        {selectedModel.id === m.id && <Check size={13} className="text-primary" />}
                      </div>
                      <p className="text-[11px] text-muted m-0 mt-0.5">{m.tag}</p>
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
              style={{ padding: '6px 12px', fontSize: '0.76rem', width: 'auto' }}
              title="Reset Conversation"
            >
              <Plus size={13} /> New Chat
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary flex items-center gap-xs"
              style={{ padding: '6px 12px', fontSize: '0.76rem', width: 'auto' }}
            >
              <ArrowLeft size={13} /> Home
            </button>
          </div>
        </header>

        {/* Conversation Stream & Claude Welcoming State */}
        <div className="flex-1 overflow-y-auto custom-scroll p-md md:p-lg flex flex-col items-center">
          <div className="w-full max-w-3xl flex flex-col gap-lg py-sm">
            
            {/* Claude Welcoming Hero (Shown when conversation is short or fresh) */}
            {messages.length <= 1 && (
              <div className="flex flex-col items-center text-center gap-sm my-md animate-fade-in">
                <div 
                  style={{ 
                    width: 56, height: 56, borderRadius: 18, 
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '1.75rem', fontWeight: 800,
                    boxShadow: '0 8px 24px var(--primary-glow)'
                  }}
                >
                  ✦
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '6px 0 2px 0' }}>
                  {getGreeting()}, {currentUser.firstName || 'Alex'}.
                </h2>
                <p className="text-muted text-sm max-w-lg" style={{ margin: 0, lineHeight: 1.6 }}>
                  How can Claude assist your {currentUser.dreamJob || 'engineering'} preparation today? Select a technical topic below or type your inquiry.
                </p>

                {/* 4 Prompt Starter Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm w-full mt-md">
                  <div 
                    onClick={() => executePrompt('Architect a distributed sliding-window rate limiter with Redis and Lua scripts')}
                    className="skeuo-convex p-md rounded-xl text-left cursor-pointer hover:border-[var(--primary)] transition-all flex flex-col gap-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                  >
                    <div className="flex items-center gap-xs font-bold text-xs text-main">
                      <span style={{ fontSize: '1.1rem' }}>🏗️</span> System Architecture
                    </div>
                    <p className="text-muted text-[12px] m-0 leading-relaxed">
                      Design a low-latency sliding window rate limiter with atomic Redis Lua scripts.
                    </p>
                  </div>

                  <div 
                    onClick={() => executePrompt('Audit my resume for high-leverage ATS keywords and metrics')}
                    className="skeuo-convex p-md rounded-xl text-left cursor-pointer hover:border-[var(--primary)] transition-all flex flex-col gap-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                  >
                    <div className="flex items-center gap-xs font-bold text-xs text-main">
                      <span style={{ fontSize: '1.1rem' }}>📄</span> ATS Resume Audit
                    </div>
                    <p className="text-muted text-[12px] m-0 leading-relaxed">
                      Review experience bullet points using Google's XYZ formula and high-density keywords.
                    </p>
                  </div>

                  <div 
                    onClick={() => executePrompt('Simulate an Amazon Leadership STAR interview on Customer Obsession')}
                    className="skeuo-convex p-md rounded-xl text-left cursor-pointer hover:border-[var(--primary)] transition-all flex flex-col gap-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                  >
                    <div className="flex items-center gap-xs font-bold text-xs text-main">
                      <span style={{ fontSize: '1.1rem' }}>💼</span> STAR Behavioral Prep
                    </div>
                    <p className="text-muted text-[12px] m-0 leading-relaxed">
                      Simulate MNC behavioral questions on Customer Obsession and Ownership.
                    </p>
                  </div>

                  <div 
                    onClick={() => executePrompt('Explain the React 19 compiler optimizations and automatic memoization')}
                    className="skeuo-convex p-md rounded-xl text-left cursor-pointer hover:border-[var(--primary)] transition-all flex flex-col gap-xs"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                  >
                    <div className="flex items-center gap-xs font-bold text-xs text-main">
                      <span style={{ fontSize: '1.1rem' }}>⚡</span> React 19 Compiler
                    </div>
                    <p className="text-muted text-[12px] m-0 leading-relaxed">
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
                      className="p-3 px-4 rounded-2xl text-white text-sm shadow-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                        lineHeight: 1.6 
                      }}
                    >
                      <p className="m-0 whitespace-pre-wrap">{msg.text}</p>
                      {msg.files?.length > 0 && (
                        <div className="flex flex-wrap gap-xs mt-2 pt-2 border-t border-white/20">
                          {msg.files.map((f, i) => (
                            <span key={i} className="text-[11px] bg-black/20 px-2 py-0.5 rounded flex items-center gap-1">
                              <FileText size={11} /> {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-muted mt-1 mr-1">{currentUser.firstName || 'You'} • {msg.time}</span>
                  </div>
                ) : (
                  /* Claude AI Response Card */
                  <div className="flex flex-col gap-sm">
                    {/* Claude Avatar Header */}
                    <div className="flex items-center gap-xs">
                      <div 
                        style={{ 
                          width: 24, height: 24, borderRadius: 6, 
                          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 800, fontSize: '0.78rem'
                        }}
                      >
                        ✦
                      </div>
                      <span className="text-xs font-bold text-main">{selectedModel.name}</span>
                      <span className="text-[10px] text-muted">• {msg.time}</span>
                    </div>

                    {/* Reasoning Accordion ("Thought for 3 seconds") */}
                    {msg.thought && (
                      <div 
                        className="rounded-lg overflow-hidden transition-all"
                        style={{ 
                          background: 'var(--input-bg)', 
                          border: '1px solid var(--border-color)' 
                        }}
                      >
                        <button
                          onClick={() => toggleThought(msg.id)}
                          className="w-full flex items-center justify-between p-2 px-3 text-left text-xs font-medium text-muted hover:text-main transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={12} className="text-warning" />
                            Thought for 3 seconds
                          </span>
                          <ChevronRight 
                            size={13} 
                            className={`transition-transform ${expandedThoughtIds.includes(msg.id) ? 'rotate-90' : ''}`} 
                          />
                        </button>
                        {expandedThoughtIds.includes(msg.id) && (
                          <div 
                            className="p-3 px-4 pt-1 text-xs font-mono whitespace-pre-wrap leading-relaxed"
                            style={{ 
                              borderTop: '1px solid var(--border-color)', 
                              color: 'var(--text-muted)' 
                            }}
                          >
                            {msg.thought}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Claude Message Body */}
                    <div 
                      className="text-sm leading-relaxed whitespace-pre-wrap pl-1"
                      style={{ color: 'var(--text-main)', lineHeight: 1.7 }}
                    >
                      {msg.text}
                    </div>

                    {/* Formatted Copyable Code Block Artifact */}
                    {msg.code && (
                      <div 
                        className="rounded-xl overflow-hidden my-2" 
                        style={{ 
                          background: '#090d16', 
                          border: '1px solid var(--border-color)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.25)' 
                        }}
                      >
                        <div 
                          className="flex items-center justify-between px-3 py-2"
                          style={{ 
                            background: '#111827', 
                            borderBottom: '1px solid rgba(255,255,255,0.08)' 
                          }}
                        >
                          <span className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                            <FileCode2 size={13} className="text-primary" /> {msg.codeTitle || 'artifact.code'}
                            {msg.codeLang && (
                              <span className="badge text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                                {msg.codeLang}
                              </span>
                            )}
                          </span>
                          <button
                            onClick={() => handleCopyCode(msg.code, msg.id)}
                            className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
                          >
                            {copiedCodeId === msg.id ? (
                              <><Check size={12} className="text-success" /> Copied</>
                            ) : (
                              <><Copy size={12} /> Copy Code</>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed m-0 custom-scroll">
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
                              className="text-left text-xs px-3 py-1.5 rounded-full skeuo-convex interactive transition-all"
                              style={{ 
                                background: 'var(--input-bg)', 
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <span className="text-primary font-bold">✦</span> {chip}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Tool Actions */}
                      <div className="flex items-center gap-sm">
                        <button
                          onClick={() => handleCopyMessage(msg.text, msg.id)}
                          className="text-xs text-muted hover:text-main flex items-center gap-1 transition-colors"
                          title="Copy Full Response"
                        >
                          {copiedMsgId === msg.id ? (
                            <><Check size={12} className="text-success" /> Copied</>
                          ) : (
                            <><Copy size={12} /> Copy</>
                          )}
                        </button>
                        <span className="text-muted text-xs">•</span>
                        <button
                          onClick={() => handleRegenerate(idx)}
                          className="text-xs text-muted hover:text-main flex items-center gap-1 transition-colors"
                          title="Regenerate Response"
                        >
                          <RefreshCw size={12} /> Regenerate
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Live Thinking Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted text-xs pl-1 animate-pulse">
                <span className="text-primary font-bold">✦</span>
                <span>Claude is thinking and reasoning through the response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── CLAUDE FLOATING BOTTOM INPUT CAPSULE ── */}
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
                    className="badge text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                  >
                    <FileText size={12} className="text-primary" /> {file}
                    <X 
                      size={11} 
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

            {/* Input Capsule Box */}
            <form 
              onSubmit={handleSendMessage}
              className="relative flex items-end gap-2 rounded-2xl p-2 px-3 skeuo-convex transition-all"
              style={{ 
                background: 'var(--input-bg)', 
                border: '1px solid var(--border-color)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)' 
              }}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-muted hover:text-main rounded-lg hover:bg-[var(--bg-card)] transition-colors"
                title="Attach Document or Resume (PDF, Code, Text)"
              >
                <Paperclip size={18} />
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
                placeholder={`Ask Claude anything about ${currentUser.dreamJob || 'engineering'}... (Enter to send, Shift+Enter for new line)`}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[var(--text-muted)] resize-none py-1.5 max-h-40"
                style={{ 
                  color: 'var(--text-main)', 
                  lineHeight: 1.5 
                }}
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-2 rounded-xl transition-all ${
                  input.trim() 
                    ? 'bg-[var(--primary)] text-white hover:opacity-90 shadow-md' 
                    : 'bg-[var(--bg-card)] text-muted cursor-not-allowed opacity-50'
                }`}
                title="Send Message to Claude"
              >
                <ArrowUp size={17} />
              </button>
            </form>

            <span className="text-[11px] text-center text-muted mt-1">
              Claude 3.5 Sonnet provides career & system architecture intelligence. Verify production configurations.
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}
