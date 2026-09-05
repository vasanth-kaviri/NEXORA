import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Paperclip, ArrowUp, Copy, Check, 
  ChevronRight, FileCode2, LayoutTemplate, X, RotateCcw,
  FileText, Compass, Video, Code2, DollarSign
} from 'lucide-react';
import ChatbotLayout from '../layouts/ChatbotLayout';
import db from '../services/db';

export default function Chatbot() {
  const currentUser = db.getCurrentUser();
  const [messages, setMessages] = useState([
    { 
      text: `Hello ${currentUser?.firstName || 'Alex'}! I am your NEXORA AI Career Mentor. I've analyzed your profile trajectory toward becoming a ${currentUser?.dreamJob || 'Software Professional'}. How can I assist you with your career goals today?`, 
      sender: "agent",
      time: "Just now",
      thought: `Candidate profile loaded: target role "${currentUser?.dreamJob || 'Software Professional'}". Ready to review ATS resumes, conduct technical mock interviews, advise on roadmap milestones, or explain system architectures.`,
      code: null,
      codeTitle: null
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  // Layout states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const terminalEndRef = useRef(null);

  const [terminalLogs, setTerminalLogs] = useState([
    "[SYSTEM] NEXORA Neural Career Engine initialized",
    `[INFO] Target Career Domain: ${currentUser?.dreamJob || 'Software Professional'}`,
    "[INFO] Resume & Portfolio context active"
  ]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollTerminal = () => terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
  useEffect(() => { scrollTerminal(); }, [terminalLogs, isTerminalOpen]);

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleAttachFile = () => {
    const mockFiles = ['Resume_2026.pdf', 'CoverLetter.docx', 'Portfolio.link', 'Job_Description.txt', 'SystemDesign.md'];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    if (!attachedFiles.includes(randomFile)) {
      setAttachedFiles([...attachedFiles, randomFile]);
      setTerminalLogs(prev => [...prev, `[INFO] Attached context file: ${randomFile}`]);
    }
  };

  const removeFile = (fileName) => {
    setAttachedFiles(attachedFiles.filter(f => f !== fileName));
  };

  const resetChat = () => {
    setMessages([
      { 
        text: `Chat session reset. What career topic or technical challenge would you like to explore next, ${currentUser?.firstName || 'there'}?`, 
        sender: "agent",
        time: "Just now",
        thought: "Memory context flushed. Awaiting fresh query from candidate.",
        code: null,
        codeTitle: null
      }
    ]);
    setAttachedFiles([]);
    setTerminalLogs(prev => [...prev, "[SYSTEM] Session cleared and re-indexed."]);
  };

  // Intelligent Context-Aware Response Engine
  const generateAgentResponse = (userPrompt) => {
    const prompt = userPrompt.toLowerCase();
    const dreamJob = currentUser?.dreamJob || 'Software Engineer';

    // 1. Resume / ATS queries
    if (prompt.includes('resume') || prompt.includes('ats') || prompt.includes('bullet') || prompt.includes('audit')) {
      return {
        text: `I've performed a targeted ATS scan on your profile for the ${dreamJob} trajectory. Your technical depth is solid, but recruiters look for quantifiable impact over task lists.\n\nHere are the 3 critical adjustments to maximize your ATS match score:\n1. **Lead with Metrics:** Replace 'Worked on model training' with 'Architected deep learning pipeline improving inference latency by 38%'.\n2. **Include High-Value Keyword Density:** Add modern tooling (e.g. PyTorch, Docker, Kubernetes, CI/CD) into your Skills and Experience sections.\n3. **Action Verb Alignment:** Use active verbs like *Spearheaded*, *Engineered*, *Optimized*, and *Deconstructed*.`,
        thought: `CRITICAL INSTRUCTION: Analyze resume against ATS indexing rules.\n1. Scanned keyword frequencies against 2026 hiring benchmarks for ${dreamJob}.\n2. Found opportunities to add quantifiable impact metrics and modern tool chains.\n3. Outputting optimized bullet point templates.`,
        codeTitle: 'OptimizedResumeBullets.md',
        code: `# High-Impact Experience Bullets for ${dreamJob}\n\n* Spearheaded the migration from monolithic architecture to containerized microservices,\n  reducing cold-start response times by 42% across 2.5M daily requests.\n\n* Engineered automated end-to-end regression test suites with Playwright & GitHub Actions,\n  catching 18 critical regressions and accelerating sprint velocity by 25%.\n\n* Implemented distributed Redis caching layer and optimized PostgreSQL execution plans,\n  slashing 95th-percentile API response latency from 450ms to 85ms.`
      };
    }

    // 2. Mock Interview queries
    if (prompt.includes('mock') || prompt.includes('interview') || prompt.includes('question') || prompt.includes('coding problem')) {
      return {
        text: `Let's run a technical mock interview simulation for your ${dreamJob} preparation.\n\n### Technical Challenge: In-Memory LRU Cache with O(1) Eviction\n**Problem:** Design a data structure that implements the Least Recently Used (LRU) cache protocol with \`get(key)\` and \`put(key, value)\` operations, both operating in strict **O(1)** time complexity.\n\n**Key Interviewer Expectations:**\n- Clarify capacity constraints and thread-safety requirements.\n- Identify why a Hash Map combined with a Doubly Linked List achieves O(1) removals.\n- Walk through edge cases (duplicate keys, capacity overflow, empty cache).`,
        thought: `INTERVIEW MODE ACTIVATED.\n- Difficulty: Hard / Senior Technical Screen\n- Core Competency: Hash Maps + Doubly Linked Lists + Pointer Manipulation.\n- Candidate should articulate time & space trade-offs before implementing.`,
        codeTitle: 'LRUCacheSolution.ts',
        code: `class DNode {\n  key: number;\n  val: number;\n  prev: DNode | null = null;\n  next: DNode | null = null;\n  constructor(k: number, v: number) { this.key = k; this.val = v; }\n}\n\nclass LRUCache {\n  private capacity: number;\n  private map = new Map<number, DNode>();\n  private head = new DNode(0, 0);\n  private tail = new DNode(0, 0);\n\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n\n  get(key: number): number {\n    const node = this.map.get(key);\n    if (!node) return -1;\n    this.moveToHead(node);\n    return node.val;\n  }\n\n  put(key: number, val: number): void {\n    if (this.map.has(key)) {\n      const node = this.map.get(key)!;\n      node.val = val;\n      this.moveToHead(node);\n    } else {\n      const newNode = new DNode(key, val);\n      this.map.set(key, newNode);\n      this.addToHead(newNode);\n      if (this.map.size > this.capacity) {\n        const lru = this.tail.prev!;\n        this.removeNode(lru);\n        this.map.delete(lru.key);\n      }\n    }\n  }\n}`
      };
    }

    // 3. Roadmap queries
    if (prompt.includes('roadmap') || prompt.includes('next step') || prompt.includes('learn next') || prompt.includes('milestone')) {
      return {
        text: `Based on your personalized ${dreamJob} curriculum on NEXORA, here is your prioritized milestone progression for the upcoming 6 weeks:\n\n1. **Core Architectural Milestone (In Progress):** Finalize distributed patterns and container orchestration.\n2. **Specialization Subset Track (Active):** Dive into the elective subset modules on your roadmap to gain an unfair advantage in portfolio reviews.\n3. **Real-World Capstone Integration:** Build an end-to-end deployed production project showcasing comprehensive tests, CI/CD, and live URL demos.`,
        thought: `ROADMAP ENGINE: Querying user progression data.\n- Detected active subset track.\n- Recommending progression path linking foundational milestones to demonstrable capstones.`,
        codeTitle: 'RecommendedStudySchedule.json',
        code: `{\n  "targetRole": "${dreamJob}",\n  "currentFocus": "High-Throughput Distributed Architecture",\n  "weeklySchedule": [\n    { "week": 1, "topic": "Event Sourcing & Asynchronous Message Queues" },\n    { "week": 2, "topic": "Database Indexing & Sharding Strategies" },\n    { "week": 3, "topic": "Container Orchestration with Docker & Kubernetes" },\n    { "week": 4, "topic": "Production Deployment, CI/CD & Chaos Testing" }\n  ]\n}`
      };
    }

    // 4. System Design / Microservices queries
    if (prompt.includes('system design') || prompt.includes('microservice') || prompt.includes('architecture') || prompt.includes('scale')) {
      return {
        text: `Designing robust microservice architectures requires deliberate decisions around decoupling, fault tolerance, and data consistency.\n\n### The Golden Rules of Scalable Distributed Systems:\n1. **Independent Deployability:** Each service owns its private database. Never share database schemas directly between microservices.\n2. **Asynchronous Decoupling via Events:** Use Apache Kafka or RabbitMQ for non-blocking inter-service updates.\n3. **Resilience Patterns:** Protect downstream services with Circuit Breakers (Resilience4j / Opossum), retries with exponential backoff, and idempotency keys.`,
        thought: `SYSTEM DESIGN MODULE: Analyzing distributed transaction strategies.\n- Highlighted Saga pattern and Outbox pattern for distributed consistency.\n- Generating resilient circuit-breaker boilerplate.`,
        codeTitle: 'ResilientCircuitBreaker.ts',
        code: `import CircuitBreaker from 'opossum';\n\nasync function callDownstreamService(payload: any) {\n  const res = await fetch('https://api.internal.service/process', {\n    method: 'POST',\n    body: JSON.stringify(payload)\n  });\n  if (!res.ok) throw new Error('Downstream 5xx error');\n  return res.json();\n}\n\nconst options = {\n  timeout: 3000,          // 3 second deadline\n  errorThresholdPercentage: 50,\n  resetTimeout: 15000     // 15 seconds cool-down before half-open\n};\n\nexport const breaker = new CircuitBreaker(callDownstreamService, options);\nbreaker.fallback(() => ({ status: 'DEGRADED', message: 'Serving cached response' }));`
      };
    }

    // 5. Salary Negotiation queries
    if (prompt.includes('salary') || prompt.includes('negotiat') || prompt.includes('offer') || prompt.includes('compensation')) {
      return {
        text: `Negotiating tech compensation is not about confrontation—it is about aligning your verified market value with the company's business outcomes.\n\n### The 4-Step Tech Negotiation Framework:\n1. **Express Genuine Enthusiasm First:** Anchor your excitement about the team and mission.\n2. **Never Negotiate Over a Single Number:** Negotiate the total package: Base Salary, Sign-on Bonus, Equity (RSUs), and Performance Bonuses.\n3. **Anchor with Market Research:** Cite reliable percentiles from Levels.fyi and verified peer benchmarks.\n4. **Counter With a Definite Range:** Provide a range where the bottom is your actual target.`,
        thought: `CAREER ADVISORY: Structuring high-converting negotiation dialogue.\n- Focused on total compensation (TC), leverage points, and polite firmness.`,
        codeTitle: 'CounterOfferScript.md',
        code: `Dear [Recruiter Name],\n\nThank you so much for extending the offer to join [Company] as a ${dreamJob}.\nI am thrilled about the team's roadmap and the engineering challenges ahead.\n\nAfter reviewing the complete package and considering competitive market data\nfor this seniority level, I would be ready to sign immediately if we can adjust\nthe base salary to [Target Base] or provide an initial sign-on bonus of [Amount]\nto bridge the gap in unvested equity from my current tenure.\n\nI am eager to finalize this and begin making an immediate impact on the team.\n\nBest regards,\nAlex`
      };
    }

    // Default intelligent career response
    return {
      text: `That is an insightful question regarding your journey as a ${dreamJob}.\n\nTo achieve rapid mastery in this domain:\n1. **Focus on End-to-End Execution:** True expertise comes from shipping complete software artifacts rather than isolated tutorials.\n2. **Build Public Proof of Competence:** Recruiters value GitHub repositories with clean READMEs, unit tests, and interactive demos.\n3. **Leverage NEXORA Modules:** Test your readiness with our AI Mock Interviewer and ATS Resume Analyzer to track measurable improvements.`,
      thought: `GENERAL CAREER STRATEGY: Analyzed query context.\n- Generated personalized advice matching candidate's current career tier.\n- Outlined actionable steps for immediate follow-up.`,
      codeTitle: 'ActionRoadmap.md',
      code: `# Immediate Next Actions\n\n1. Review active milestones in NEXORA Roadmap.\n2. Complete today's daily task streak items.\n3. Run a quick 15-minute practice session in Mock Interview.`
    };
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim() && attachedFiles.length === 0) return;
    
    let userText = input;
    if (attachedFiles.length > 0) {
      userText = `[Context: ${attachedFiles.join(', ')}]\n${userText}`;
    }

    const newMsg = { text: userText, sender: 'user', time: 'Just now' };
    setMessages([...messages, newMsg]);
    const sentText = input;
    setInput('');
    setAttachedFiles([]);
    
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    setIsTyping(true);
    setTerminalLogs(prev => [
      ...prev, 
      `[PROMPT] User query: "${sentText.slice(0, 35)}..."`, 
      "[MENTOR] Synthesizing context & career heuristics..."
    ]);
    
    setTimeout(() => {
      setIsTyping(false);
      const responseData = generateAgentResponse(sentText);
      setTerminalLogs(prev => [...prev, "[SUCCESS] Generated personalized mentor response."]);
      
      setMessages(prev => [
        ...prev, 
        { 
          text: responseData.text, 
          sender: 'agent',
          time: 'Just now',
          thought: responseData.thought,
          code: responseData.code,
          codeTitle: responseData.codeTitle
        }
      ]);
    }, 1400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const highlightCode = (code) => {
    if (!code) return null;
    return code
      .replace(/(".*?")/g, '<span class="text-rose-400">$1</span>')
      .replace(/className=/g, '<span class="text-teal-400">className=</span>')
      .replace(/\b(export|function|return|const|let|import|from|class|private|constructor|async|await)\b/g, '<span class="text-indigo-400 font-bold">$1</span>')
      .replace(/({|})/g, '<span class="text-yellow-400 font-bold">$1</span>');
  };

  const handleChipClick = (prompt) => {
    setInput(prompt);
    const newMsg = { text: prompt, sender: 'user', time: 'Just now' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);
    setTerminalLogs(prev => [
      ...prev, 
      `[PROMPT] User query: "${prompt.slice(0, 35)}..."`, 
      "[MENTOR] Synthesizing context & career heuristics..."
    ]);
    
    setTimeout(() => {
      setIsTyping(false);
      const responseData = generateAgentResponse(prompt);
      setTerminalLogs(prev => [...prev, "[SUCCESS] Generated personalized mentor response."]);
      
      setMessages(prev => [
        ...prev, 
        { 
          text: responseData.text, 
          sender: 'agent',
          time: 'Just now',
          thought: responseData.thought,
          code: responseData.code,
          codeTitle: responseData.codeTitle
        }
      ]);
    }, 1200);
  };

  // Sync sidebar state on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Quick suggestion chips
  const suggestionChips = [
    { label: 'Audit my resume for ATS', prompt: 'Audit my resume for ATS keywords and formatting' },
    { label: 'Give me a mock technical question', prompt: 'Give me a mock technical coding problem for my role' },
    { label: 'What should I learn next?', prompt: 'What are the next recommended milestones in my career roadmap?' },
    { label: 'Explain microservices architecture', prompt: 'Explain microservices architecture best practices and resilience patterns' },
    { label: 'How to negotiate a salary offer?', prompt: 'How do I negotiate a tech compensation offer effectively?' }
  ];

  return (
    <ChatbotLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      isTerminalOpen={isTerminalOpen}
      setIsTerminalOpen={setIsTerminalOpen}
      attachedFiles={attachedFiles}
      setAttachedFiles={setAttachedFiles}
      terminalLogs={terminalLogs}
      terminalEndRef={terminalEndRef}
      onResetChat={resetChat}
    >
      {/* ── Center Chat Canvas ── */}
      <div className="flex-1 flex flex-col h-full relative bg-[#050505]">
        
        {/* Suggestion Chips Header Strip */}
        <div className="w-full px-4 sm:px-6 py-2.5 bg-[#0B0F19]/60 backdrop-blur-md border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto shrink-0 z-10">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles size={12} className="text-indigo-400" /> Suggestions:
          </span>
          {suggestionChips.map(chip => (
            <button
              key={chip.label}
              onClick={() => handleChipClick(chip.prompt)}
              className="text-xs px-3 py-1 rounded-full bg-white/[0.04] hover:bg-indigo-500/15 text-gray-300 hover:text-indigo-300 border border-white/[0.08] hover:border-indigo-500/30 transition-all shrink-0 cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
          <button
            onClick={resetChat}
            className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-rose-500/15 text-gray-400 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 transition-all shrink-0 ml-auto flex items-center gap-1"
            title="Reset conversation"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

        {/* Scrollable Messages */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth">
          <div className="max-w-4xl mx-auto w-full flex flex-col px-4 sm:px-6 pt-6 pb-40">
            <div className="flex flex-col gap-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {msg.sender === 'agent' ? (
                    <div className="flex gap-3.5 items-start w-full max-w-3xl">
                      
                      {/* Agent Avatar */}
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-rose-600 border border-white/20 flex items-center justify-center shrink-0 shadow-md shadow-indigo-900/30 mt-0.5 relative overflow-hidden">
                        <Sparkles size={16} className="text-white relative z-10" />
                      </div>

                      <div className="flex flex-col w-full min-w-0">
                        {/* Agent Header */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[14px] text-gray-200">NEXORA</span>
                          <span className="text-[10px] text-indigo-400 font-mono px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                            AI Career Mentor
                          </span>
                          <span className="text-[10px] text-gray-500 ml-auto">{msg.time}</span>
                        </div>

                        {/* Thought Process */}
                        {msg.thought && (
                          <details className="group mb-2.5 bg-[#0B0F19]/70 rounded-lg overflow-hidden border border-white/[0.04] [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex items-center gap-2 px-3 py-1.5 cursor-pointer select-none text-xs text-gray-400 font-mono hover:bg-white/5 hover:text-gray-200 transition-all">
                              <ChevronRight size={14} className="transition-transform group-open:rotate-90 text-indigo-400" />
                              <span className="flex items-center gap-2">
                                Mentor Reasoning & Strategy
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                              </span>
                            </summary>
                            <div className="px-4 py-2.5 text-xs text-gray-300 font-mono whitespace-pre-wrap border-t border-white/[0.04] bg-black/20 leading-relaxed border-l-2 border-l-indigo-500 mx-2 mb-2">
                              {msg.thought}
                            </div>
                          </details>
                        )}

                        {/* Main Text */}
                        <div className="text-gray-300 leading-[1.7] text-[14.5px] font-normal whitespace-pre-wrap w-full max-w-2xl">
                          {msg.text}
                        </div>

                        {/* Code Block / Structured Deliverable */}
                        {msg.code && (
                          <div className="mt-4 rounded-xl border border-white/10 overflow-hidden bg-[#0B0F19] shadow-xl shadow-black/40">
                            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.06]">
                              <div className="flex items-center gap-2 text-xs text-indigo-300 font-mono font-medium">
                                <LayoutTemplate size={14} className="text-rose-400" />
                                <span>{msg.codeTitle || 'RecommendedTemplate.md'}</span>
                              </div>
                              <button
                                onClick={() => copyCode(msg.code, i)}
                                className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                              >
                                {copiedIndex === i ? <Check size={14} className="text-teal-400" /> : <Copy size={14} />}
                                {copiedIndex === i ? 'Copied!' : 'Copy Code'}
                              </button>
                            </div>
                            <div className="p-4 overflow-x-auto bg-black/40">
                              <pre className="text-[13.5px] font-mono leading-relaxed tracking-wide text-gray-200">
                                <code dangerouslySetInnerHTML={{ __html: highlightCode(msg.code) }} />
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* User Message */
                    <div className="flex justify-end max-w-[85%] group">
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] text-gray-500 font-medium mb-1 mr-1">You</span>
                        <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[14.5px] leading-relaxed shadow-md shadow-indigo-950/40">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3.5 items-start w-full max-w-3xl animate-fade-in">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-rose-600 border border-white/20 flex items-center justify-center shrink-0 shadow-sm mt-0.5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/20 animate-pulse" />
                    <Sparkles size={16} className="text-white relative z-10" />
                  </div>
                  <div className="flex flex-col gap-2 w-full pt-2">
                    <div className="flex items-center gap-2 text-xs text-indigo-300 font-mono">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                      Mentor is formulating career guidance...
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        
        {/* Bottom Floating Console Input */}
        <div className="w-full px-4 sm:px-6 pb-5 pt-2 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent z-20 absolute bottom-0 left-0 right-0 pointer-events-none">
          <div className="max-w-3xl mx-auto relative pointer-events-auto">
            
            <div className="bg-[#0B0F19] rounded-[28px] sm:rounded-full border border-white/10 shadow-2xl focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500/50 transition-all duration-300 relative min-h-[52px] flex flex-col justify-center">
              
              {/* Attach */}
              <button
                onClick={handleAttachFile}
                type="button"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors absolute left-2.5 bottom-[7px] z-10 cursor-pointer"
                title="Attach Context File"
              >
                <Paperclip size={19} />
              </button>

              {/* Input Area */}
              <div className="w-full max-h-[180px] overflow-y-auto pl-12 pr-14 py-1 flex flex-col">
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1.5 pb-1">
                    {attachedFiles.map(file => (
                      <div key={file} className="flex items-center gap-1.5 bg-[#1A2333] border border-white/5 text-gray-300 text-xs py-0.5 px-2 rounded-md animate-fade-in">
                        <FileCode2 size={12} className="text-teal-400" />
                        <span>{file}</span>
                        <button onClick={() => removeFile(file)} className="hover:text-red-400 ml-1 transition-colors">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-transparent outline-none text-gray-200 text-[14.5px] resize-none font-sans leading-relaxed placeholder:text-gray-500 py-2 ${attachedFiles.length > 0 ? 'pt-0.5' : ''}`}
                  placeholder="Ask NEXORA Mentor about resumes, mock questions, or roadmaps..."
                  rows={1}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() && attachedFiles.length === 0}
                className={`p-2.5 rounded-full absolute right-2.5 bottom-[6px] z-10 transition-all flex items-center justify-center cursor-pointer ${
                  (input.trim() || attachedFiles.length > 0)
                    ? 'bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-lg shadow-indigo-900/40 hover:scale-105'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-500 font-sans tracking-wide">
                NEXORA Mentor synthesizes verified industry benchmarks for career advancement.
              </span>
            </div>
          </div>
        </div>
      </div>
    </ChatbotLayout>
  );
}
