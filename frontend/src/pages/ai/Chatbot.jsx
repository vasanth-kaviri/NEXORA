import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, Paperclip, ArrowUp, Copy, Check, 
  ChevronRight, FileCode2, X, FileText, ArrowLeft, 
  MessageSquare, Plus, Trash2, ChevronDown, RefreshCw,
  PanelLeftClose, PanelLeftOpen, ThumbsUp, ThumbsDown,
  ShieldCheck, Zap, Code2, Layers,
  Search
} from 'lucide-react';
import db from '../../services/db';
import geminiApi from '../../services/geminiApi';

function renderInlineMarkdown(str) {
  if (!str) return '';
  const parts = str.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-main">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-input border border-border/80 font-mono text-xs text-indigo-400 font-semibold">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-muted">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function renderFormattedMarkdown(text) {
  if (!text) return null;
  const blocks = text.split('\n\n');

  return (
    <div className="flex flex-col gap-2.5 leading-relaxed text-sm sm:text-base text-main pl-0.5">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={bIdx} className="text-base font-bold text-main m-0 mt-2 mb-1 tracking-tight">
              {renderInlineMarkdown(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={bIdx} className="text-lg font-extrabold text-main m-0 mt-3 mb-1 tracking-tight">
              {renderInlineMarkdown(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={bIdx} className="border-l-2 border-indigo-500 pl-3.5 py-1.5 my-1 text-muted italic bg-input/40 rounded-r-xl">
              {renderInlineMarkdown(trimmed.replace(/^>\s+/, ''))}
            </blockquote>
          );
        }
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const lines = trimmed.split('\n');
          return (
            <ul key={bIdx} className="list-disc pl-5 my-1 space-y-1 text-main/90">
              {lines.map((l, lIdx) => (
                <li key={lIdx} className="leading-relaxed">
                  {renderInlineMarkdown(l.replace(/^[-*]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <ol key={bIdx} className="list-decimal pl-5 my-1 space-y-1.5 text-main/90">
              {lines.map((l, lIdx) => (
                <li key={lIdx} className="leading-relaxed">
                  {renderInlineMarkdown(l.replace(/^\d+\.\s+/, ''))}
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={bIdx} className="m-0 leading-relaxed whitespace-pre-wrap">
            {renderInlineMarkdown(block)}
          </p>
        );
      })}
    </div>
  );
}

export default function Chatbot() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useMemo(() => db.getCurrentUser() || {}, []);

  // NEXORA AI Model Families
  const models = [
    { 
      id: 'gemini-2-flash', 
      name: 'Gemini 2.0 Flash', 
      tag: 'Google DeepMind • Live Reasoning & Multimodal Telemetry', 
      speed: geminiApi.isConfigured() ? 'Live Stream Active' : 'Calibrated Neural Engine', 
      tokens: '1M Context' 
    },
    { 
      id: 'nexora-3-5-sonnet', 
      name: 'NEXORA 3.5 Sonnet', 
      tag: 'Neural Core • Frontier Coding & System Architecture', 
      speed: 'Ultra-Low Latency', 
      tokens: '200K Context' 
    },
    { 
      id: 'nexora-3-5-flash', 
      name: 'NEXORA 3.5 Flash', 
      tag: 'Lightning Fast Technical Insights & Instant Fixes', 
      speed: 'Fastest (0.4s)', 
      tokens: '128K Context' 
    }
  ];
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Sidebar & Chat Sessions
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1280;
    }
    return true;
  });

  const [sessionSearch, setSessionSearch] = useState('');
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
        preview: 'Reviewing metrics and STAR bullet points for Tier-1 Tech...'
      },
      {
        id: 'session_2',
        title: 'Distributed Rate Limiting Architecture',
        date: 'Yesterday',
        preview: 'Redis sliding window and Lua atomic evaluation...'
      },
      {
        id: 'session_3',
        title: 'Amazon Leadership STAR Mock Scenario',
        date: 'Previous 7 Days',
        preview: 'Customer Obsession and Disagree and Commit framing...'
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
      thought: `Candidate Context Synchronized:
• Target Trajectory: ${currentUser.dreamJob || 'Software Professional'}
• Mastery Benchmark: Level ${currentUser.level || 1}
• Calibration: Frontier system design, high-frequency algorithms, ATS scoring, and behavioral STAR synthesis.`,
      text: `Hello ${currentUser.firstName || 'Candidate'}! I am your **NEXORA AI MENTOR**, calibrated for high-bar software engineering standards.\n\nI can assist you in auditing ATS resume bullets, architecting distributed microservices, working through LeetCode algorithm challenges, or practicing live MNC behavioral scenarios. What are we building or mastering today?`,
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
  const [expandedThoughtIds, setExpandedThoughtIds] = useState([]);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [likedMsgIds, setLikedMsgIds] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      title: 'New Engineering Dialogue',
      date: 'Just now',
      preview: 'Fresh architecture session...'
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setMessages([
      {
        id: `m_${Date.now()}`,
        sender: 'nexora',
        time: 'Just now',
        thought: `Workspace initialized with ${selectedModel.name}. Context cache cleared. Ready for new technical queries or code reviews.`,
        text: `Starting a fresh workspace with **${selectedModel.name}**. How can I assist your ${currentUser.dreamJob || 'engineering'} goals right now?`,
        code: null,
        codeTitle: null,
        codeLang: null,
        followUps: [
          'Review database indexing for PostgreSQL',
          'Explain React 19 compiler optimizations',
          'Design an idempotent payment webhook service'
        ]
      }
    ]);
    setAttachedFiles([]);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId && updated.length > 0) {
      setActiveSessionId(updated[0].id);
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

  const toggleLike = (id) => {
    if (likedMsgIds.includes(id)) {
      setLikedMsgIds(likedMsgIds.filter(i => i !== id));
    } else {
      setLikedMsgIds([...likedMsgIds, id]);
    }
  };

  // ── INTELLIGENT SEMANTIC MOCK CONVERSATIONAL ENGINE ──
  const generateMentorReply = useCallback((userPrompt) => {
    const prompt = userPrompt.toLowerCase().trim();
    const dreamJob = currentUser.dreamJob || 'Software Engineer';

    // 1. RESUME & ATS AUDIT INTENT
    if (prompt.includes('resume') || prompt.includes('ats') || prompt.includes('cv') || prompt.includes('bullet') || prompt.includes('keyword')) {
      return {
        thought: `Synthesizing ATS Evaluation:
• Evaluated candidate query against Tier-1 ATS engines (Greenhouse, Workday, Lever).
• Formulated Google's XYZ Framework: "Accomplished [X], measured by [Y], by doing [Z]".
• Embedded high-leverage technical density: microservices, p99 latency, caching, and CI/CD pipelines.`,
        text: `Here is your high-leverage **ATS Calibration Plan** for **${dreamJob}** positions:\n\n### 3 Non-Negotiable Upgrades:\n\n1. **Adopt Google's XYZ Formula**: Replace task descriptions (*"Responsible for backend APIs"*) with quantifiable operational impact (*"Architected 12 microservices in Go, reducing p99 latency by 68% for 4.2M daily users"*).\n\n2. **Defeat AST Table Parsers**: Enterprise ATS scanners scramble multi-column layouts. Use a clean, single-column layout with standard headers: *Experience*, *Technical Projects*, *Core Competencies*, *Education*.\n\n3. **Contextual Keyword Density**: Weave tools directly into problem-solving descriptions rather than an unverified laundry list at the bottom of the page.`,
        codeTitle: 'High_Impact_Experience_Bullets.md',
        codeLang: 'markdown',
        code: `# Calibrated Experience Bullets (${dreamJob})

* Spearheaded the decomposition of legacy monolith into 8 Kubernetes microservices,
  reducing infrastructure cloud spend by $52,000/yr while guaranteeing 99.99% availability.

* Engineered an automated regression and end-to-end testing pipeline with GitHub Actions & Docker,
  accelerating bi-weekly deployment frequency by 40% with zero critical rollbacks.

* Implemented Redis distributed caching and optimized PostgreSQL composite indexes,
  slashing p95 query latency from 850ms to 45ms and preventing database connection pool exhaustion.`,
        followUps: [
          'How do I tailor this for Staff / Lead Engineer roles?',
          'Audit my project descriptions for technical depth',
          'What are the top 10 ATS red flags to avoid?'
        ]
      };
    }

    // 2. SYSTEM DESIGN & DISTRIBUTED RATE LIMITING
    if (prompt.includes('rate limit') || prompt.includes('system design') || prompt.includes('architect') || prompt.includes('distributed') || prompt.includes('scalab')) {
      return {
        thought: `Architecting Distributed System:
• Target Requirements: 100k+ RPS, sub-5ms evaluation latency, distributed concurrency safety.
• Selected Pattern: Sliding Window Log via Redis Sorted Sets (ZSET) + atomic Lua scripts.
• Eviction strategy: ZREMRANGEBYSCORE on expired millisecond timestamps.`,
        text: `Here is the architectural blueprint for a production-grade **Distributed Sliding-Window Rate Limiter**:\n\n### Architectural Guarantees:\n\n- **Atomic Execution**: Runs as a single atomic Lua script directly inside Redis to prevent race conditions without requiring distributed locks.\n- **Sub-Millisecond Precision**: Evaluates timestamps using Unix millisecond scores stored in a Redis Sorted Set (\`ZSET\`).\n- **Self-Cleaning Eviction**: Automatically purges timestamps older than the active sliding window before checking remaining quota.\n- **Fail-Open Policy**: If the Redis cluster encounters a partition, a local in-memory fallback engages to preserve gateway availability.`,
        codeTitle: 'sliding_window_rate_limiter.lua',
        codeLang: 'lua',
        code: `-- Atomic Redis Sliding Window Rate Limiter
local key = KEYS[1]
local now = tonumber(ARGV[1])        -- Current timestamp (ms)
local window = tonumber(ARGV[2])     -- Window duration (ms, e.g. 60000)
local limit = tonumber(ARGV[3])      -- Max requests allowed

local clearBefore = now - window

-- 1. Remove expired timestamps outside the sliding window
redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)

-- 2. Count active requests in window
local currentCount = redis.call('ZCARD', key)

if currentCount < limit then
  -- 3. Allow request: record timestamp as both score and member
  redis.call('ZADD', key, now, now)
  redis.call('EXPIRE', key, math.ceil(window / 1000) + 1)
  return { 1, limit - currentCount - 1 } -- [1 = ALLOWED, remaining quota]
else
  -- 4. Exceeded: reject with 429 Too Many Requests
  return { 0, 0 } -- [0 = REJECTED]
end`,
        followUps: [
          'How do we handle multi-region Redis replication lag?',
          'Write a Node.js / Express middleware wrapping this script',
          'Compare Sliding Window Log vs Token Bucket algorithms'
        ]
      };
    }

    // 3. BEHAVIORAL & AMAZON LEADERSHIP PRINCIPLES (STAR METHOD)
    if (prompt.includes('interview') || prompt.includes('star') || prompt.includes('behavioral') || prompt.includes('amazon') || prompt.includes('leadership')) {
      return {
        thought: `Synthesizing MNC Behavioral Strategy:
• Focus: Amazon Leadership Principles (Customer Obsession, Ownership, Bias for Action).
• Structure: Situation (15%), Task (10%), Action (60%), Result (15%).
• Key Metric: Quantified trade-offs between rapid delivery and long-term maintainability.`,
        text: `Let's work through a high-frequency **Behavioral Interview Scenario**:\n\n> *"Tell me about a time you had to make an urgent technical decision with incomplete information or severe time constraints."*\n\n### The Senior STAR Execution Model:\n\n- **Situation (15%)**: Frame the business context succinctly. State what was at risk (revenue, customer trust, uptime) without getting lost in trivial lore.\n- **Task (10%)**: Clarify your precise individual responsibility (e.g., *"I was the lead on-call engineer responsible for triaging payment failures during our flash sale launch"*).\n- **Action (60%)**: The meat of your answer. Highlight data-driven diagnosis, technical trade-offs considered, stakeholder communication, and decisive mitigation.\n- **Result (15%)**: Conclude with hard numbers (latency restored, revenue saved, zero data loss) and lasting systemic safeguards implemented.`,
        codeTitle: 'STAR_Response_Blueprint.md',
        codeLang: 'markdown',
        code: `### Amazon LP STAR Model: "Customer Obsession & Bias for Action"

* **Situation**: During a Tier-1 retail campaign handling 75,000 requests/sec, our third-party tax calculation API began returning 504 Gateway Timeouts, blocking checkout for 3.8% of users.
* **Task**: As lead on-call infrastructure engineer, I needed to restore checkout throughput within 10 minutes without risking compliance fines or erroneous orders.
* **Action**:
  1. Verified with Datadog metrics that only non-EU tax lookups were failing due to vendor throttling.
  2. Implemented an emergency fallback to estimate cached regional tax brackets with a 1.5% buffer for seller adjustment.
  3. Dispatched an idempotent SQS message queue to reconcile exact tax receipts asynchronously post-purchase.
* **Result**: Restored 100% checkout completion in 4.5 minutes, protected ~$240,000 in at-risk revenue, and subsequently authored a platform-wide asynchronous payment fallback SDK.`,
        followUps: [
          'Give me a mock scenario on "Disagree and Commit"',
          'How do I quantify impact if revenue data is confidential?',
          'Roleplay an interviewer and challenge my answer'
        ]
      };
    }

    // 4. FRONTEND ARCHITECTURE & REACT 19 COMPILER
    if (prompt.includes('react') || prompt.includes('compiler') || prompt.includes('frontend') || prompt.includes('next') || prompt.includes('hooks')) {
      return {
        thought: `Analyzing React 19 Engine:
• React Compiler (Forget): Automates AST-level memoization.
• Elimination of manual useMemo, useCallback, and React.memo boilerplate.
• Context preservation and fine-grained sub-expression caching.`,
        text: `The **React 19 Compiler** introduces automatic compile-time memoization, fundamentally altering performance optimization in modern React applications:\n\n### Key Architectural Shifts:\n\n1. **Automated Memoization Slots**: The compiler parses your JavaScript code into an Intermediate Representation (IR), identifying mutable subgraphs and inserting memoization slots automatically.\n\n2. **Elimination of Hook Overhead**: You no longer need to manually write \`useMemo\` and \`useCallback\` to preserve reference stability across renders.\n\n3. **Fine-Grained Reactivity**: When component state changes, React only re-evaluates the specific sub-expressions that depend on that state, bypassing unnecessary subtree recalculations.`,
        codeTitle: 'React19CompilerOutput.jsx',
        codeLang: 'javascript',
        code: `// 1. Developer Source Code (Clean React 19 — No useMemo / useCallback)
export function MetricsPipeline({ records, filterTag, onSelect }) {
  const filtered = records
    .filter(r => r.tag === filterTag)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="metrics-grid">
      {filtered.map(item => (
        <MetricCard key={item.id} data={item} onClick={() => onSelect(item.id)} />
      ))}
    </div>
  );
}

// 2. What React 19 Compiler Generates Internally:
// It allocates an array of cache slots [$] and automatically checks
// if [records, filterTag] changed before recomputing 'filtered',
// and verifies [filtered, onSelect] before re-rendering the JSX tree.`,
        followUps: [
          'How does the React 19 Compiler handle closures?',
          'Explain React Server Actions vs standard API routes',
          'Benchmark comparison between React 18 and React 19 rendering speeds'
        ]
      };
    }

    // 5. ALGORITHMS & DATA STRUCTURES (LEETCODE / DSA)
    if (prompt.includes('algorithm') || prompt.includes('leetcode') || prompt.includes('dsa') || prompt.includes('binary search') || prompt.includes('cache') || prompt.includes('tree') || prompt.includes('lru')) {
      return {
        thought: `Formulating Algorithmic Solution:
• Problem: LRU Cache (Least Recently Used) with O(1) Get and Put.
• Data Structure: Doubly Linked List + Hash Map.
• Invariants: Head points to most recently used, Tail points to least recently used.`,
        text: `Here is the optimal implementation of an **LRU (Least Recently Used) Cache** with strict **O(1) time complexity** for both \`get\` and \`put\` operations:\n\n### Data Structure Design:\n\n- **Hash Map**: Provides O(1) key-to-node lookup.\n- **Doubly Linked List**: Provides O(1) node insertion and removal without shifting array elements.\n- **Dummy Head & Tail**: Eliminates boundary null-pointer checks during node splicing.`,
        codeTitle: 'lru_cache.py',
        codeLang: 'python',
        code: `class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> Node
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: Node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _insert_to_head(self, node: Node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert_to_head(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._insert_to_head(node)
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
        followUps: [
          'How do we make this thread-safe in a multi-threaded server?',
          'What is the space complexity breakdown?',
          'Implement LFU (Least Frequently Used) Cache comparison'
        ]
      };
    }

    // 6. DATABASES & SQL OPTIMIZATION
    if (prompt.includes('database') || prompt.includes('sql') || prompt.includes('postgres') || prompt.includes('index') || prompt.includes('acid') || prompt.includes('mongo')) {
      return {
        thought: `Database Architecture Evaluation:
• Core Focus: Relational indexing, B-Tree lookups, and query plan optimization.
• Composite index rule: Leftmost prefix matching.
• Tooling: EXPLAIN (ANALYZE, BUFFERS).`,
        text: `Here is a senior-level breakdown of **PostgreSQL Index Optimization & Execution Planning**:\n\n### The 3 Rules of High-Performance Indexing:\n\n1. **The Leftmost Prefix Principle**: For a composite index on \`(tenant_id, created_at, status)\`, queries filtering by \`tenant_id\` or \`(tenant_id, created_at)\` will hit the index. Filtering solely by \`status\` will result in a full table scan.\n\n2. **Avoid Index Wrappers**: Functions applied to indexed columns (e.g. \`WHERE LOWER(email) = '...' \`) bypass standard B-Trees. Use an expression index (\`CREATE INDEX ON users (LOWER(email))\`).\n\n3. **Covering Indexes**: Use \`INCLUDE\` clauses to store auxiliary columns in leaf nodes, enabling **Index-Only Scans** without secondary table heap lookups.`,
        codeTitle: 'optimized_indexing.sql',
        codeLang: 'sql',
        code: `-- 1. Inefficient query causing Sequential Scan
-- SELECT id, full_name, email FROM users WHERE tenant_id = 42 AND created_at > NOW() - INTERVAL '7 days';

-- 2. Create high-leverage Composite Covering Index
CREATE INDEX CONCURRENTLY idx_users_tenant_created_covering
ON users (tenant_id, created_at DESC)
INCLUDE (full_name, email);

-- 3. Verify Execution Plan
EXPLAIN (ANALYZE, BUFFERS)
SELECT full_name, email 
FROM users 
WHERE tenant_id = 42 
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
-- Expected: Index Only Scan, 0 Heap Fetches, execution time < 1.2ms`,
        followUps: [
          'What is the difference between B-Tree, GIN, and BRIN indexes?',
          'How do optimistic and pessimistic locking compare in PostgreSQL?',
          'Explain database connection pooling with PgBouncer'
        ]
      };
    }

    // 7. DEVOPS, DOCKER & KUBERNETES
    if (prompt.includes('docker') || prompt.includes('kubernetes') || prompt.includes('k8s') || prompt.includes('devops') || prompt.includes('ci/cd') || prompt.includes('pipeline')) {
      return {
        thought: `DevOps Architecture Analysis:
• Container Optimization: Multi-stage Docker build, unprivileged user, slim runtime.
• Security & Size: Alpine/Distroless base, layer caching.`,
        text: `Here is a production-hardened **Multi-Stage Dockerfile Blueprint** engineered for minimal image size and zero root vulnerabilities:\n\n### Production Best Practices Implemented:\n\n- **Multi-Stage Isolation**: Build dependencies (compilers, npm packages) never touch the production runtime container.\n- **Non-Root Execution**: Runs under a dedicated unprivileged user (\`nodejs\`) to prevent container escape exploits.\n- **Optimized Layer Caching**: \`package.json\` and lockfiles are copied before source files to maximize Docker layer cache hits.`,
        codeTitle: 'Dockerfile.production',
        codeLang: 'dockerfile',
        code: `# Stage 1: Build Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline
COPY . .
RUN npm run build

# Stage 2: Production Minimal Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Add unprivileged non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
        followUps: [
          'Write a Kubernetes Deployment with liveness & readiness probes',
          'How do we implement blue-green deployments in GitHub Actions?',
          'Explain horizontal pod autoscaling based on custom Prometheus metrics'
        ]
      };
    }

    // 8. DYNAMIC CONTEXTUAL FALLBACK FOR ANY CUSTOM QUESTION
    // Extracts subject tokens and generates a structured, high-grade answer
    const cleanedQuery = userPrompt.trim();
    const topicTitle = cleanedQuery.length > 50 ? cleanedQuery.slice(0, 48) + '...' : cleanedQuery;

    return {
      thought: `Deconstructing query: "${topicTitle}"
• Domain Trajectory: ${dreamJob}
• Intent Analysis: Conceptual mechanism, production trade-offs, and technical implementation.
• Synthesizing structured response with executive clarity and code guidance.`,
      text: `Let's analyze **${topicTitle}** from a senior **${dreamJob}** perspective.\n\n### 1. Conceptual Foundation\nWhen evaluating this problem in a high-scale production environment, you must separate the fundamental execution mechanics from surface abstractions. The primary goal is maintaining predictable latency, bounded memory utilization, and clear failure boundaries.\n\n### 2. Architectural Trade-offs\n- **Throughput vs. Latency**: Choosing synchronous execution yields immediate guarantees at the expense of client thread blocking. Asynchronous processing buffers traffic but introduces eventual consistency.\n- **State Management**: Ephemeral in-memory caches provide sub-millisecond lookups but require distributed synchronization or failover fallbacks.\n\n### 3. Senior Implementation Principle\nAlways build in observability (structured logging, tracing spans, and health checks) and ensure failure modes default safely rather than cascading across upstream services.`,
      codeTitle: 'architecture_pattern.ts',
      codeLang: 'typescript',
      code: `// Senior Engineering Design Pattern: Resilient Service Wrapper
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  latencyMs: number;
}

export async function executeWithTelemetry<T>(
  operationName: string,
  fn: () => Promise<T>,
  fallbackValue: T
): Promise<ServiceResponse<T>> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = Math.round(performance.now() - start);
    return { success: true, data: result, latencyMs: duration };
  } catch (err: any) {
    const duration = Math.round(performance.now() - start);
    console.error(\`[Telemetry] Operation \${operationName} failed after \${duration}ms:\`, err.message);
    return { success: false, data: fallbackValue, error: err.message, latencyMs: duration };
  }
}`,
      followUps: [
        `How is this pattern tested in enterprise ${dreamJob} teams?`,
        'What are the common edge cases and bottleneck traps?',
        'Walk me through a live interview defense of this approach'
      ]
    };
  }, [currentUser.dreamJob]);

  const handledPromptRef = useRef(false);

  const executePrompt = useCallback(async (textToSend) => {
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

    if (geminiApi.isConfigured() || selectedModel.id === 'gemini-2-flash') {
      try {
        const responseText = await geminiApi.sendMessage(textToSend, messages, currentUser);
        const mentorMsg = {
          id: `c_${Date.now()}`,
          sender: 'nexora',
          time: 'Just now',
          thought: `Synthesized via Google Gemini 2.0 Flash:\n• Evaluated candidate query against ${currentUser.dreamJob || 'Software Engineering'} competency bar\n• Generated real-time architectural solution and code insights`,
          text: responseText,
          followUps: [
            'Break down the performance tradeoffs in depth',
            'How would I defend this in a Staff Engineer interview?',
            'What are the key failure modes and bottleneck traps?'
          ]
        };
        setMessages(prev => [...prev, mentorMsg]);
        setIsTyping(false);
        return;
      } catch (err) {
        console.warn('[Chatbot] Gemini live response notice, using local mentor model:', err);
      }
    }

    // Realistic typing delay (750ms)
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
    }, 750);
  }, [attachedFiles, currentUser, generateMentorReply, messages, selectedModel.id]);

  useEffect(() => {
    if (location.state?.initialPrompt && !handledPromptRef.current) {
      handledPromptRef.current = true;
      const initialText = location.state.initialPrompt;
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        executePrompt(initialText);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.state, executePrompt]);

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
      }, 850);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Filtered sessions
  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(sessionSearch.toLowerCase()) ||
    s.preview.toLowerCase().includes(sessionSearch.toLowerCase())
  );

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
      
      {/* ── MOBILE / TABLET BACKDROP FOR SESSIONS DRAWER ── */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 xl:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SESSIONS SIDEBAR DRAWER (ChatGPT / Claude Style) ── */}
      <aside 
        className={`flex flex-col justify-between transition-all duration-200 shrink-0 z-40 ${
          isSidebarOpen 
            ? 'w-72 max-w-[85vw] fixed xl:static inset-y-0 left-0 shadow-2xl xl:shadow-none h-full' 
            : 'w-0 -translate-x-full xl:translate-x-0 overflow-hidden'
        }`}
        style={{ 
          background: 'var(--bg-card)', 
          borderRight: '1px solid var(--border-color)'
        }}
      >
        <div className="flex flex-col p-4 gap-4 overflow-hidden flex-1">
          
          {/* Header & Close Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-indigo-500/20">
                ✦
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-main m-0 uppercase tracking-wider">
                  AI Dialogues
                </h3>
                <span className="text-[10px] text-muted font-mono">{sessions.length} Saved Sessions</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-input transition-colors"
              title="Close Sessions Drawer"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* New Chat Primary Trigger */}
          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center justify-between p-3 rounded-xl bg-input hover:bg-input/80 border border-border transition-all font-bold text-xs group text-main"
          >
            <span className="flex items-center gap-2">
              <Plus size={16} className="text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>New Conversation</span>
            </span>
            <span className="text-[10px] text-muted font-mono bg-card px-2 py-0.5 rounded-md border border-border">
              Ctrl+N
            </span>
          </button>

          {/* Search Sessions */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-muted pointer-events-none" />
            <input
              type="text"
              value={sessionSearch}
              onChange={(e) => setSessionSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-input text-main text-xs pl-8 pr-3 py-2 rounded-xl border border-border outline-none placeholder:text-muted focus:border-indigo-500/60 transition-all"
            />
          </div>

          {/* Recent Sessions List */}
          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto custom-scroll pr-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted px-1 mt-1 mb-1">
              History
            </span>

            {filteredSessions.map((s) => {
              const isActive = activeSessionId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSessionId(s.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all group ${
                    isActive 
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold' 
                      : 'text-muted hover:bg-input hover:text-main'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare size={14} className={isActive ? 'text-indigo-400' : 'text-muted'} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs truncate m-0 font-medium leading-tight">
                        {s.title}
                      </p>
                      <span className="text-[10px] text-muted truncate block mt-0.5 opacity-80">
                        {s.preview}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-rose-400 rounded transition-all"
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Model Info Card in Drawer */}
        <div className="p-3 border-t border-border">
          <div className="p-3 rounded-xl bg-input border border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Zap size={14} className="text-indigo-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-main truncate m-0">{selectedModel.name}</p>
                <span className="text-[10px] text-muted truncate block">{selectedModel.speed}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md">
              Pro
            </span>
          </div>
        </div>
      </aside>

      {/* ── MAIN AI CHAT WORKSPACE CANVAS ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Workspace Header Bar */}
        <header className="h-14 flex items-center justify-between px-4 sm:px-6 shrink-0 bg-card border-b border-border z-20">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-muted hover:text-main hover:bg-input transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title={isSidebarOpen ? "Collapse Chat History" : "Open Chat History"}
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
              <span className="hidden sm:inline text-xs">{isSidebarOpen ? 'Hide' : 'Chats'}</span>
            </button>

            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-input hover:bg-input/80 border border-border text-xs font-bold text-main transition-all shadow-xs"
              >
                <span className="text-indigo-400 font-bold">✦</span>
                <span>{selectedModel.name}</span>
                <ChevronDown size={14} className="text-muted" />
              </button>

              {showModelDropdown && (
                <div className="absolute top-10 left-0 w-80 p-2 rounded-2xl shadow-2xl z-50 animate-scale-up bg-card border border-border">
                  <div className="text-[10px] font-extrabold text-muted uppercase tracking-wider px-2 py-1">
                    Select AI Engine
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
                          ? 'bg-indigo-500/10 text-main font-bold border border-indigo-500/30' 
                          : 'hover:bg-input text-muted hover:text-main'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-main">{m.name}</span>
                        {selectedModel.id === m.id && <Check size={14} className="text-indigo-400" />}
                      </div>
                      <p className="text-[11px] text-muted m-0 mt-0.5 leading-snug">{m.tag}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewChat}
              className="btn btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl"
              title="Start fresh chat"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </header>

        {/* ── Scrollable Chat Message Feed ── */}
        <div className="flex-1 overflow-y-auto custom-scroll flex flex-col items-center">
          <div className="w-full max-w-3xl flex flex-col gap-6 px-4 sm:px-6 py-6 pb-40">
            
            {/* Fresh Conversation Greeting Hero */}
            {messages.length <= 1 && (
              <div className="flex flex-col items-center text-center gap-3 my-6 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center text-2xl font-extrabold shadow-xl shadow-indigo-500/25">
                  ✦
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-main m-0">
                  {getGreeting()}, {currentUser.firstName || 'Candidate'}.
                </h2>
                <p className="text-muted text-sm sm:text-base max-w-xl leading-relaxed m-0">
                  How can <strong className="text-main">NEXORA AI MENTOR</strong> accelerate your {currentUser.dreamJob || 'engineering'} trajectory today? Pick a quick starter or type any technical question.
                </p>

                {/* 4 Clean Prompt Starters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mt-4">
                  {[
                    {
                      icon: Layers,
                      title: 'System Architecture',
                      desc: 'Design a low-latency sliding window rate limiter with atomic Redis Lua scripts.',
                      prompt: 'Architect a distributed sliding-window rate limiter with Redis and Lua scripts'
                    },
                    {
                      icon: FileText,
                      title: 'ATS Resume Audit',
                      desc: 'Review experience bullets using Google’s XYZ formula and high-leverage metrics.',
                      prompt: 'Audit my resume for high-leverage ATS keywords and metrics'
                    },
                    {
                      icon: ShieldCheck,
                      title: 'STAR Behavioral Prep',
                      desc: 'Simulate Amazon Leadership Principle questions on Customer Obsession.',
                      prompt: 'Simulate an Amazon Leadership STAR interview on Customer Obsession'
                    },
                    {
                      icon: Code2,
                      title: 'React 19 Compiler',
                      desc: 'Deep-dive into compiler-driven memoization and elimination of manual hooks.',
                      prompt: 'Explain the React 19 compiler optimizations and automatic memoization'
                    }
                  ].map((starter, i) => {
                    const Icon = starter.icon;
                    return (
                      <div 
                        key={i}
                        onClick={() => executePrompt(starter.prompt)}
                        className="p-4 rounded-2xl bg-card hover:bg-input/60 border border-border hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col gap-2 text-left group shadow-xs"
                      >
                        <div className="flex items-center gap-2 font-bold text-main text-sm">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Icon size={16} />
                          </div>
                          <span className="group-hover:text-indigo-400 transition-colors">{starter.title}</span>
                        </div>
                        <p className="text-xs text-muted leading-relaxed m-0 pl-9">
                          {starter.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Render Conversation Messages */}
            {messages.map((msg, idx) => (
              <div key={msg.id} className="flex flex-col gap-2 animate-fade-in">
                {msg.sender === 'user' ? (
                  
                  /* USER MESSAGE BUBBLE */
                  <div className="self-end max-w-xl flex flex-col items-end">
                    <div className="p-4 px-5 rounded-2xl bg-indigo-600 text-white rounded-br-xs shadow-md shadow-indigo-500/15 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                      {msg.files?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-white/20">
                          {msg.files.map((f, i) => (
                            <span key={i} className="text-xs bg-white/15 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                              <FileText size={12} /> {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-muted mt-1 mr-1 font-medium">
                      {currentUser.firstName || 'You'} • {msg.time}
                    </span>
                  </div>

                ) : (

                  /* NEXORA AI RESPONSE CARD */
                  <div className="flex flex-col gap-3">
                    {/* Model Header */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        ✦
                      </div>
                      <span className="text-xs font-extrabold text-main uppercase tracking-wider">
                        NEXORA AI MENTOR
                      </span>
                      <span className="text-[11px] text-muted">• {msg.time}</span>
                    </div>

                    {/* Subtle Collapsible Reasoning Accordion */}
                    {msg.thought && (
                      <div className="rounded-xl overflow-hidden border border-border/80 bg-input/50 transition-all">
                        <button
                          type="button"
                          onClick={() => toggleThought(msg.id)}
                          className="w-full flex items-center justify-between p-2.5 px-3.5 text-left text-xs font-semibold text-muted hover:text-main transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Sparkles size={13} className="text-indigo-400" />
                            <span>Reasoning Process (0.8s)</span>
                          </span>
                          <ChevronRight 
                            size={14} 
                            className={`transition-transform ${expandedThoughtIds.includes(msg.id) ? 'rotate-90' : ''}`} 
                          />
                        </button>

                        {expandedThoughtIds.includes(msg.id) && (
                          <div className="p-3.5 px-4 pt-1 font-mono text-xs leading-relaxed text-muted whitespace-pre-wrap border-t border-border/60 bg-input/80">
                            {msg.thought}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Clean Formatted Message Text with Rich Markdown */}
                    {renderFormattedMarkdown(msg.text)}

                    {/* Formatted Copyable Code Block Artifact */}
                    {msg.code && (
                      <div className="rounded-2xl overflow-hidden my-2 border border-border/80 shadow-lg bg-[#090d16]">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-white/10">
                          <span className="font-mono text-zinc-300 text-xs font-semibold flex items-center gap-2">
                            <FileCode2 size={14} className="text-indigo-400" />
                            <span>{msg.codeTitle || 'artifact.code'}</span>
                            {msg.codeLang && (
                              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase font-bold">
                                {msg.codeLang}
                              </span>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopyCode(msg.code, msg.id)}
                            className="flex items-center gap-1.5 text-zinc-300 hover:text-white px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-semibold"
                          >
                            {copiedCodeId === msg.id ? (
                              <><Check size={13} className="text-emerald-400" /> Copied</>
                            ) : (
                              <><Copy size={13} /> Copy Code</>
                            )}
                          </button>
                        </div>

                        <pre className="p-4 text-zinc-200 overflow-x-auto text-xs sm:text-sm leading-relaxed m-0 custom-scroll font-mono">
                          <code>{msg.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Follow-Up Suggestion Chips */}
                    {msg.followUps && msg.followUps.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.followUps.map((chip, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => executePrompt(chip)}
                            className="px-3.5 py-1.5 rounded-full bg-input hover:bg-input/80 border border-border hover:border-indigo-500/40 text-xs font-semibold text-main transition-all flex items-center gap-1.5 shadow-xs"
                          >
                            <span className="text-indigo-400">✦</span>
                            <span>{chip}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Message Actions Bar */}
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted pl-1">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.text, msg.id)}
                        className="hover:text-main flex items-center gap-1 transition-colors"
                        title="Copy message"
                      >
                        {copiedMsgId === msg.id ? (
                          <><Check size={13} className="text-emerald-400" /> Copied</>
                        ) : (
                          <><Copy size={13} /> Copy</>
                        )}
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleRegenerate(idx)}
                        className="hover:text-main flex items-center gap-1 transition-colors"
                        title="Regenerate reply"
                      >
                        <RefreshCw size={13} /> Regenerate
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => toggleLike(msg.id)}
                        className={`hover:text-main transition-colors ${likedMsgIds.includes(msg.id) ? 'text-indigo-400' : ''}`}
                        title="Helpful"
                      >
                        <ThumbsUp size={13} />
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ))}

            {/* Live Thinking Status */}
            {isTyping && (
              <div className="flex items-center gap-2 text-muted text-xs font-medium pl-1 animate-pulse">
                <span className="text-indigo-400 font-bold">✦</span>
                <span>NEXORA AI MENTOR is reasoning and formulating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── FIXED BOTTOM INPUT BAR (ChatGPT / Claude Style) ── */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-card via-card/95 to-transparent backdrop-blur-md z-20 flex flex-col items-center">
          <div className="w-full max-w-3xl flex flex-col gap-2">
            
            {/* Attached files preview bar */}
            {attachedFiles.length > 0 && (
              <div className="flex items-center gap-2 px-2 flex-wrap">
                {attachedFiles.map((file, i) => (
                  <span 
                    key={i} 
                    className="text-xs px-3 py-1 rounded-lg bg-input border border-border text-main flex items-center gap-1.5 font-medium shadow-xs"
                  >
                    <FileText size={13} className="text-indigo-400" /> {file}
                    <X 
                      size={12} 
                      className="cursor-pointer text-muted hover:text-main" 
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

            {/* Main Input Capsule */}
            <form 
              onSubmit={handleSendMessage}
              className="relative flex items-end gap-2 rounded-2xl p-2.5 px-4 bg-input border border-border focus-within:border-indigo-500/60 shadow-xl shadow-black/5 transition-all"
            >
              {/* File Upload Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-muted hover:text-main rounded-xl hover:bg-card transition-colors flex-shrink-0"
                title="Attach Document or Resume (PDF, Code, Text)"
              >
                <Paperclip size={18} />
              </button>

              {/* Auto-Resizing Textarea */}
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
                placeholder={`Ask NEXORA AI MENTOR anything about ${currentUser.dreamJob || 'engineering'}...`}
                className="flex-1 bg-transparent border-none outline-none text-main placeholder:text-muted resize-none py-1.5 max-h-44 text-sm sm:text-base leading-relaxed"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim()}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  input.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/30 cursor-pointer' 
                    : 'bg-card text-muted/40 cursor-not-allowed border border-border/50'
                }`}
                title="Send message"
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </form>

            <p className="text-center text-muted text-[11px] m-0">
              NEXORA AI MENTOR provides advanced career, ATS & system architecture intelligence. Always verify production configurations.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
