import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Paperclip, ArrowUp, Copy, Check, 
  ChevronRight, FileCode2, X, RotateCcw,
  FileText, ArrowLeft, MessageSquare, Plus, Trash2,
  Cpu, Compass, ShieldCheck, ChevronDown, Bot, Terminal
} from 'lucide-react';
import db from '../services/db';

export default function Chatbot() {
  const navigate = useNavigate();
  const currentUser = db.getCurrentUser() || {};

  // Claude Model Selector
  const models = [
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', tag: 'Most Intelligent • Frontier' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', tag: 'Deep Analysis & Reasoning' },
    { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', tag: 'Lightning Fast' }
  ];
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Sidebar & Sessions
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
      thought: `Target role identified as ${currentUser.dreamJob || 'Software Professional'}. Calibrating response with Fortune 500 production standards, ATS keyword density, and practical code implementations.`,
      text: `Hello ${currentUser.firstName || 'Alex'}! I am your **NEXORA AI Mentor**, powered by Claude's architectural and career intelligence.\n\nI can help you audit your resume against MNC benchmarks, conduct mock technical interviews, architect distributed systems, or explain complex algorithmic concepts. What would you like to build or prepare for today?`,
      code: null,
      codeTitle: null
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedThoughtIds, setExpandedThoughtIds] = useState(['m1']);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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
      preview: 'Started a new career session...'
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'claude',
        time: 'Just now',
        thought: 'Fresh conversation initiated. Memory state primed for technical questions.',
        text: `Starting a new workspace. How can I assist your ${currentUser.dreamJob || 'engineering'} journey right now?`,
        code: null,
        codeTitle: null
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
    const options = ['Resume_2026_ATS.pdf', 'SystemArchitecture.drawio', 'LeetCode_Solution.py'];
    const chosen = options[Math.floor(Math.random() * options.length)];
    if (!attachedFiles.includes(chosen)) {
      setAttachedFiles([...attachedFiles, chosen]);
    }
  };

  const handleCopyCode = (codeText, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    }
  };

  const toggleThought = (id) => {
    if (expandedThoughtIds.includes(id)) {
      setExpandedThoughtIds(expandedThoughtIds.filter(i => i !== id));
    } else {
      setExpandedThoughtIds([...expandedThoughtIds, id]);
    }
  };

  // Dynamic Prompt Response Generator
  const generateClaudeReply = (userPrompt) => {
    const prompt = userPrompt.toLowerCase();
    const dreamJob = currentUser.dreamJob || 'Software Professional';

    if (prompt.includes('resume') || prompt.includes('ats') || prompt.includes('cv')) {
      return {
        text: `I've analyzed your resume requirements against 2026 MNC hiring bars for **${dreamJob}**.\n\n### Critical Observations:\n1. **Metrics Over Tasks**: Recruiters scan for quantifiable delta (e.g. *reduced latency by 38%* or *handled 250k daily active users*) rather than generic responsibilities.\n2. **High-Density Tech Keywords**: Ensure modern toolchains such as Docker, Kubernetes, Redis, and TypeScript are contextualized inside your accomplishments.\n3. **Active Verbs**: Open bullet points with words like *Spearheaded*, *Architected*, *Optimized*, and *Deconstructed*.`,
        thought: `Evaluating candidate query on ATS resume optimization:\n- Matching target role ${dreamJob} against Fortune 500 keyword distributions.\n- Structuring recommendations using the Google XYZ resume framework: Accomplished [X] as measured by [Y], by doing [Z].\n- Generating ready-to-copy bullet point templates.`,
        codeTitle: 'OptimizedResumeBullets.md',
        code: `# Production Experience Bullets (${dreamJob})\n\n* Spearheaded the decomposition of legacy monolithic services into containerized microservices,\n  reducing 95th-percentile API response latency from 320ms to 48ms across 2M daily queries.\n\n* Engineered an automated regression and end-to-end testing pipeline with GitHub Actions & Docker,\n  accelerating weekly sprint deployment frequency by 35% with zero regressions.\n\n* Implemented distributed Redis caching and optimized PostgreSQL index strategies,\n  preventing database connection starvation during peak traffic spikes.`
      };
    }

    if (prompt.includes('system design') || prompt.includes('rate limit') || prompt.includes('architect')) {
      return {
        text: `Here is the production architecture blueprint for a **Distributed Rate Limiting Gateway**:\n\n- **Algorithm**: Sliding Window Log using Redis Sorted Sets (ZSET).\n- **Concurrency**: Leverages atomic Redis Lua scripts to evaluate timestamps without race conditions.\n- **Fail-Open Strategy**: If the caching cluster is unreachable, fall back to localized in-memory token buckets to ensure service availability.`,
        thought: `Synthesizing distributed system design response:\n1. Comparing Leaky Bucket, Token Bucket, and Sliding Window algorithms.\n2. Selecting Sliding Window with Redis for exact boundary precision.\n3. Formulating an atomic Lua script implementation.`,
        codeTitle: 'rateLimiter.lua',
        code: `-- Atomic Redis Sliding Window Rate Limiter\nlocal key = KEYS[1]\nlocal now = tonumber(ARGV[1])\nlocal window = tonumber(ARGV[2])\nlocal limit = tonumber(ARGV[3])\n\nlocal clearBefore = now - window\nredis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)\nlocal currentRequests = redis.call('ZCARD', key)\n\nif currentRequests < limit then\n  redis.call('ZADD', key, now, now)\n  redis.call('EXPIRE', key, math.ceil(window / 1000))\n  return 1 -- Allowed\nelse\n  return 0 -- Rate Limited\nend`
      };
    }

    return {
      text: `That is an excellent topic in **${dreamJob}** engineering.\n\nTo master this, break down the core components into fundamental execution primitives, identify common trade-offs (e.g. latency vs consistency, memory vs CPU), and validate with automated test cases.\n\nWould you like me to walk through a code implementation, design a mock interview question around this, or audit relevant documentation?`,
      thought: `Parsing prompt: "${userPrompt}". Formulating clear, concise explanation with actionable follow-up options suited for ${dreamJob}.`,
      codeTitle: null,
      code: null
    };
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = {
      id: `u_${Date.now()}`,
      sender: 'user',
      time: 'Just now',
      text: userText,
      files: [...attachedFiles]
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate Claude thoughtful streaming response
    setTimeout(() => {
      const reply = generateClaudeReply(userText);
      const claudeMsg = {
        id: `c_${Date.now()}`,
        sender: 'claude',
        time: 'Just now',
        thought: reply.thought,
        text: reply.text,
        code: reply.code,
        codeTitle: reply.codeTitle
      };

      setMessages(prev => [...prev, claudeMsg]);
      setIsTyping(false);
      setExpandedThoughtIds(prev => [...prev, claudeMsg.id]);
    }, 1100);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: '#09090b', color: '#e4e4e7', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ── LEFT SIDEBAR (Claude-Style Collapsible Navigation) ── */}
      <aside 
        className={`flex flex-col justify-between transition-all duration-200 shrink-0 border-r border-zinc-800 ${isSidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}
        style={{ background: '#0d0d10' }}
      >
        <div className="flex flex-col p-md gap-md overflow-hidden">
          {/* Top Brand & New Chat */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-xs">
              <span style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>✦</span>
              <span className="font-bold text-sm tracking-tight text-white">Claude AI Mentor</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="btn-icon-tactile text-zinc-400 hover:text-white p-1"
              title="Close Sidebar"
            >
              <X size={16} />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="flex items-center justify-between p-sm rounded-lg glass-panel hover:bg-zinc-800/60 transition-colors text-white font-semibold text-sm"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="flex items-center gap-xs">
              <Plus size={16} className="text-primary" /> Start New Chat
            </span>
            <span className="text-xs text-zinc-500 font-mono">⌘N</span>
          </button>

          {/* Prompt Starter Chips */}
          <div className="flex flex-col gap-xs mt-xs">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Quick Prompts</span>
            {[
              { label: '📄 Audit My Resume for ATS', prompt: 'Audit my resume for high-leverage ATS keywords and metrics.' },
              { label: '🏗️ Distributed Rate Limiter', prompt: 'Architect a distributed sliding-window rate limiter in Redis.' },
              { label: '💡 Explain React Reconciliation', prompt: 'Explain the React 19 reconciliation algorithm and how to minimize re-renders.' },
              { label: '💼 Amazon Leadership STAR Prep', prompt: 'Give me a mock interview scenario on Amazon Customer Obsession and Ownership.' },
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(p.prompt);
                  if (textareaRef.current) textareaRef.current.focus();
                }}
                className="text-left text-xs p-2 rounded-md hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 transition-colors truncate"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Recent Chat History */}
          <div className="flex flex-col gap-xs mt-sm flex-1 overflow-y-auto custom-scroll">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Recent Sessions</span>
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors group ${activeSessionId === s.id ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'}`}
              >
                <div className="flex items-center gap-xs min-w-0">
                  <MessageSquare size={13} className="shrink-0 text-zinc-500" />
                  <span className="text-xs truncate">{s.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-1 transition-opacity"
                  title="Delete Chat"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Model Selector in Sidebar */}
        <div className="p-md border-t border-zinc-800">
          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center gap-xs">
              <span className="text-primary text-xs">✦</span>
              <span className="text-xs font-semibold text-zinc-300">{selectedModel.name}</span>
            </div>
            <span className="badge text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">Active</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CHAT CANVAS ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-14 flex items-center justify-between px-md border-b border-zinc-800 shrink-0 bg-zinc-950/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-sm">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="btn-icon-tactile p-1.5 text-zinc-400 hover:text-white"
                title="Open Sidebar"
              >
                <Compass size={18} />
              </button>
            )}

            {/* Model Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-xs px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/60 text-xs font-semibold text-zinc-200 hover:border-zinc-500 transition-colors"
              >
                <span className="text-primary">✦</span>
                <span>{selectedModel.name}</span>
                <ChevronDown size={13} className="text-zinc-400" />
              </button>

              {showModelDropdown && (
                <div 
                  className="absolute top-9 left-0 w-64 glass-panel p-1 rounded-xl shadow-2xl z-50 animate-scale-up"
                  style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {models.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setShowModelDropdown(false);
                      }}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${selectedModel.id === m.id ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/60 text-zinc-300'}`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{m.name}</span>
                        {selectedModel.id === m.id && <Check size={12} className="text-primary" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 m-0 mt-0.5">{m.tag}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action */}
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary flex items-center gap-xs"
            style={{ padding: '6px 14px', fontSize: '0.78rem', width: 'auto' }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </header>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto custom-scroll p-md md:p-lg flex flex-col items-center">
          <div className="w-full max-w-3xl flex flex-col gap-lg py-sm">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-xs animate-fade-in">
                {msg.sender === 'user' ? (
                  /* User Message Card */
                  <div className="self-end max-w-xl flex flex-col items-end">
                    <div 
                      className="p-3 px-4 rounded-2xl text-white text-sm"
                      style={{ background: 'var(--primary)', lineHeight: 1.55 }}
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
                    <span className="text-[10px] text-zinc-500 mt-1 mr-1">{currentUser.firstName || 'You'} • {msg.time}</span>
                  </div>
                ) : (
                  /* Claude AI Response Card */
                  <div className="flex flex-col gap-sm">
                    {/* Claude Avatar Header */}
                    <div className="flex items-center gap-xs">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary bg-indigo-500/10 border border-indigo-500/20">
                        ✦
                      </div>
                      <span className="text-xs font-bold text-zinc-300">Claude 3.5 Sonnet</span>
                      <span className="text-[10px] text-zinc-500">• {msg.time}</span>
                    </div>

                    {/* Reasoning / Thought Accordion ("Thought for 3 seconds") */}
                    {msg.thought && (
                      <div 
                        className="rounded-lg border border-zinc-800/80 overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.02)' }}
                      >
                        <button
                          onClick={() => toggleThought(msg.id)}
                          className="w-full flex items-center justify-between p-2 px-3 text-left text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={12} className="text-amber-400" />
                            Thought for 3 seconds
                          </span>
                          <ChevronRight 
                            size={13} 
                            className={`transition-transform ${expandedThoughtIds.includes(msg.id) ? 'rotate-90' : ''}`} 
                          />
                        </button>
                        {expandedThoughtIds.includes(msg.id) && (
                          <div className="p-3 px-4 pt-1 text-xs text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed border-t border-zinc-800/60 bg-zinc-950/40">
                            {msg.thought}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Body with clean typography */}
                    <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap pl-1">
                      {msg.text}
                    </div>

                    {/* Formatted Copyable Code Block Artifact */}
                    {msg.code && (
                      <div className="rounded-xl overflow-hidden border border-zinc-800 my-2" style={{ background: '#000' }}>
                        <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800">
                          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                            <FileCode2 size={13} className="text-primary" /> {msg.codeTitle || 'script.js'}
                          </span>
                          <button
                            onClick={() => handleCopyCode(msg.code, msg.id)}
                            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
                          >
                            {copiedCodeId === msg.id ? (
                              <><Check size={12} className="text-success" /> Copied</>
                            ) : (
                              <><Copy size={12} /> Copy Code</>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed m-0">
                          <code>{msg.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Live Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs pl-1">
                <span className="text-primary animate-pulse">✦</span>
                <span className="animate-pulse">Claude is thinking and formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── FLOATING BOTTOM PROMPT BAR ── */}
        <div className="p-md shrink-0 flex flex-col items-center border-t border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl flex flex-col gap-xs">
            {/* Attached files indicator */}
            {attachedFiles.length > 0 && (
              <div className="flex items-center gap-xs px-2">
                {attachedFiles.map((file, i) => (
                  <span key={i} className="badge bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    <FileText size={11} className="text-primary" /> {file}
                    <X size={10} className="cursor-pointer ml-1 text-zinc-400 hover:text-white" onClick={() => setAttachedFiles(attachedFiles.filter(f => f !== file))} />
                  </span>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form 
              onSubmit={handleSendMessage}
              className="relative flex items-end gap-2 rounded-2xl p-2 px-3 border border-zinc-700/80 focus-within:border-indigo-500/80 transition-all"
              style={{ background: '#121215', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
            >
              <button
                type="button"
                onClick={handleAttachMock}
                className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                title="Attach Context Document"
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
                placeholder={`Ask Claude anything about ${currentUser.dreamJob || 'your technical career'}... (Enter to send, Shift+Enter for new line)`}
                className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-200 placeholder-zinc-500 resize-none py-1.5 max-h-40"
                style={{ lineHeight: 1.5 }}
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-2 rounded-xl transition-all ${input.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                title="Send Message"
              >
                <ArrowUp size={17} />
              </button>
            </form>

            <span className="text-[11px] text-center text-zinc-500 mt-1">
              Claude 3.5 Sonnet may generate creative suggestions. Always verify critical production configurations.
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}
