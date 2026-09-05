import { useState } from 'react';
import { 
  Users, Code, MessageSquare, Search, Filter, CheckCircle2, 
  Sparkles, ExternalLink, X, UserPlus, Radio, Code2, Globe, 
  Award, BookOpen, Send, UserCheck, Mic, MicOff, Play, ArrowLeft,
  Share2, Terminal, Check, Clock, Plus
} from 'lucide-react';
import db from '../services/db';

export default function PeerLearning() {
  const currentUser = db.getCurrentUser() || {};

  // Comprehensive active peers directory
  const peersList = [
    {
      id: 'peer_1',
      name: 'Jordan Lee',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      role: 'Full-Stack Developer',
      university: 'Carnegie Mellon University',
      matchingSkill: 'React & TypeScript',
      similarity: 94,
      online: true,
      bio: 'Junior CS student passionate about distributed systems and accessible React interfaces. Currently grinding LeetCode 75 and building a microservice payment gateway.',
      currentMilestone: 'Milestone 4: PostgreSQL Indexing & Optimization',
      completedProjects: ['Real-Time Chat App with WebSockets', 'Idempotent Payment Microservice'],
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'peer_2',
      name: 'Casey Smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      role: 'AI & Data Scientist',
      university: 'Stanford University',
      matchingSkill: 'PyTorch & MLOps',
      similarity: 89,
      online: true,
      bio: 'Exploring transformer architectures, vector embeddings, and RAG pipelines. Looking for a partner to collaborate on LLM hackathons.',
      currentMilestone: 'Milestone 5: Vector DB Indexing & Retrieval',
      completedProjects: ['Semantic Search Engine with Pinecone', 'Computer Vision Object Detection'],
      skills: ['Python', 'PyTorch', 'FastAPI', 'Pandas', 'Docker'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'peer_3',
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      role: 'Cloud & DevOps Engineer',
      university: 'IIT Bombay',
      matchingSkill: 'Kubernetes & Terraform',
      similarity: 91,
      online: false,
      bio: 'Enthusiastic about infrastructure as code, multi-region Kubernetes clusters, and automated blue-green CI/CD pipelines.',
      currentMilestone: 'Milestone 6: Multi-Cluster Service Mesh',
      completedProjects: ['Automated K8s Cluster on AWS', 'Zero-Downtime Deployment Pipeline'],
      skills: ['Kubernetes', 'Terraform', 'AWS', 'Linux', 'Go'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'peer_4',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      role: 'UI/UX Product Designer',
      university: 'ETH Zurich',
      matchingSkill: 'Design Systems & Figma',
      similarity: 86,
      online: true,
      bio: 'Design engineer bridging the gap between Figma token architecture and React Tailwind implementations.',
      currentMilestone: 'Milestone 3: WCAG 2.1 Accessibility Audit',
      completedProjects: ['FinTech Design System', 'E-Commerce Mobile Checkout UX'],
      skills: ['Figma', 'Design Tokens', 'HTML/CSS', 'User Research'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 'peer_5',
      name: 'Aarav Patel',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
      role: 'Full-Stack Developer',
      university: 'BITS Pilani',
      matchingSkill: 'Next.js & REST APIs',
      similarity: 93,
      online: true,
      bio: 'Full-stack builder passionate about developer tools and high-throughput databases. Seeking team members for upcoming global hackathons.',
      currentMilestone: 'Milestone 4: Redis Caching Strategies',
      completedProjects: ['Developer Snippet Manager', 'Algorithmic Trading Dashboard'],
      skills: ['Next.js', 'PostgreSQL', 'Redis', 'Tailwind', 'Go'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  ];

  // Active virtual study rooms
  const studyRooms = [
    { 
      id: 'room_1', 
      title: 'LeetCode 75 Algorithms Grind', 
      topic: 'Data Structures & Algorithms', 
      members: 4, 
      maxMembers: 6,
      activeProblem: {
        title: 'Problem 146: LRU Cache Implementation',
        difficulty: 'Medium',
        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get(key) and put(key, value) both in O(1) average time complexity.',
        starterCode: {
          javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      const oldest = this.cache.keys().next().value;\n      this.cache.delete(oldest);\n    }\n    this.cache.set(key, value);\n  }\n}`,
          python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = {}\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        val = self.cache.pop(key)\n        self.cache[key] = val\n        return val\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.pop(key)\n        elif len(self.cache) >= self.capacity:\n            oldest = next(iter(self.cache))\n            del self.cache[oldest]\n        self.cache[key] = value`
        }
      }
    },
    { 
      id: 'room_2', 
      title: 'Distributed System Design & API Sprint', 
      topic: 'System Architecture', 
      members: 3, 
      maxMembers: 5,
      activeProblem: {
        title: 'System Design: Dynamic Rate Limiter (Token Bucket)',
        difficulty: 'Hard',
        description: 'Design a high-throughput distributed rate-limiter service handling 50,000 req/sec across decentralized API gateways using Redis sliding window log.',
        starterCode: {
          javascript: `// Distributed Sliding Window Rate Limiter\nclass RateLimiter {\n  constructor(redisClient, limit = 100, windowMs = 60000) {\n    this.redis = redisClient;\n    this.limit = limit;\n    this.windowMs = windowMs;\n  }\n\n  async isAllowed(clientId) {\n    const now = Date.now();\n    const clearBefore = now - this.windowMs;\n    // Atomic Redis pipeline\n    return true;\n  }\n}`
        }
      }
    },
    { 
      id: 'room_3', 
      title: 'AI Prompt Engineering & RAG Lab', 
      topic: 'Artificial Intelligence', 
      members: 2, 
      maxMembers: 4,
      activeProblem: {
        title: 'Vector Cosine Similarity & Chunk Reranking',
        difficulty: 'Medium',
        description: 'Implement a semantic retrieval pipeline that computes cosine similarity between a user query vector and candidate chunk embeddings.',
        starterCode: {
          python: `import numpy as np\n\ndef cosine_similarity(v1, v2):\n    dot = np.dot(v1, v2)\n    norm = np.linalg.norm(v1) * np.linalg.norm(v2)\n    return dot / (norm + 1e-9)\n\ndef rerank_chunks(query_vec, candidate_chunks):\n    return sorted(candidate_chunks, key=lambda c: cosine_similarity(query_vec, c['embedding']), reverse=True)`
        }
      }
    }
  ];

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState('all');
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [connectPeer, setConnectPeer] = useState(null);
  const [connectionType, setConnectionType] = useState('Pair Programming');
  const [inviteMessage, setInviteMessage] = useState('');
  
  const [connectedPeerIds, setConnectedPeerIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexora_connected_peers') || '["peer_1", "peer_2"]');
    } catch {
      return ['peer_1', 'peer_2'];
    }
  });

  // Dedicated Virtual Room Studio Navigation
  const [activeStudioRoom, setActiveStudioRoom] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [roomCodeLanguage, setRoomCodeLanguage] = useState('javascript');
  const [roomCode, setRoomCode] = useState('');
  const [testOutput, setTestOutput] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showInvitePeerModal, setShowInvitePeerModal] = useState(false);
  const [roomChatMessages, setRoomChatMessages] = useState([
    { user: 'Jordan Lee', text: 'Hey team! Let’s implement the cache eviction logic first.', time: '2m ago' },
    { user: 'Casey Smith', text: 'Agreed. Map keys order preserves insertion in modern JS runtimes.', time: '1m ago' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [sharedNotes, setSharedNotes] = useState('# Collaborative Session Notes\n\n- [x] O(1) Get Operation verified\n- [x] Eviction on capacity boundary\n- [ ] Edge cases: duplicate keys & capacity = 1');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenConnect = (peer, e) => {
    if (e) e.stopPropagation();
    setConnectPeer(peer);
    setInviteMessage(`Hi ${peer.name}! I saw you're also working on ${peer.currentMilestone}. Would love to pair up for ${connectionType.toLowerCase()} on NEXORA.`);
    setSelectedPeer(null);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!connectPeer) return;

    const updated = [...new Set([...connectedPeerIds, connectPeer.id])];
    setConnectedPeerIds(updated);
    localStorage.setItem('nexora_connected_peers', JSON.stringify(updated));

    setConnectPeer(null);
    triggerToast(`Collaboration connection established with ${connectPeer.name}!`);
  };

  const handleJoinStudioRoom = (room) => {
    setActiveStudioRoom(room);
    setRoomCode(room.activeProblem?.starterCode?.javascript || room.activeProblem?.starterCode?.python || '// Enter your solution');
    setTestOutput(null);
    triggerToast(`Navigated to Virtual Studio: "${room.title}". Real-time collaborative environment active!`);
  };

  const handleLeaveStudioRoom = () => {
    setActiveStudioRoom(null);
    triggerToast('Left Virtual Room. Returned to DevConnect Hub.');
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      setIsRunningTests(false);
      setTestOutput({
        passed: 3,
        total: 3,
        runtime: '42ms (Faster than 91% of solutions)',
        memory: '48.2 MB',
        logs: [
          '✓ Test Case 1: cache.put(1, 1), cache.put(2, 2), cache.get(1) => 1 [PASSED]',
          '✓ Test Case 2: cache.put(3, 3) evicts key 2, cache.get(2) => -1 [PASSED]',
          '✓ Test Case 3: High-capacity concurrency stress test [PASSED]'
        ]
      });
      triggerToast('All test cases executed successfully!');
    }, 700);
  };

  const handleSubmitSolution = () => {
    db.updateUserProfile({
      xp: (currentUser.xp || 1200) + 50
    });
    triggerToast('Solution committed to cohort repo! +50 XP awarded.');
  };

  const handleSendRoomChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setRoomChatMessages(prev => [
      ...prev,
      { user: currentUser.firstName || 'Alex', text: chatInput.trim(), time: 'Just now' }
    ]);
    setChatInput('');
  };

  const handleInvitePeerToRoom = (peer) => {
    triggerToast(`Live room invite dispatched to ${peer.name}!`);
    setShowInvitePeerModal(false);
  };

  const filteredPeers = peersList.filter(peer => {
    const matchesSearch = 
      peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peer.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peer.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTrack === 'web') return peer.role.includes('Full-Stack') || peer.role.includes('Frontend');
    if (activeTrack === 'ai') return peer.role.includes('AI') || peer.role.includes('Data');
    if (activeTrack === 'cloud') return peer.role.includes('Cloud') || peer.role.includes('DevOps');
    if (activeTrack === 'connected') return connectedPeerIds.includes(peer.id);

    return true;
  });

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
            zIndex: 99999,
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

      {/* ─────────────────────────────────────────────────────────────
          STATE A: ACTIVE VIRTUAL ROOM STUDIO WORKSPACE
         ───────────────────────────────────────────────────────────── */}
      {activeStudioRoom ? (
        <div className="flex flex-col gap-md animate-fade-in">
          {/* Top Studio Control Bar */}
          <div className="glass-panel p-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md" style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex items-center gap-sm">
              <button
                onClick={handleLeaveStudioRoom}
                className="btn btn-secondary flex items-center gap-xs"
                style={{ padding: '6px 14px', fontSize: '0.8rem', width: 'auto' }}
              >
                <ArrowLeft size={15} /> Leave Room
              </button>
              <div>
                <div className="flex items-center gap-xs">
                  <Radio size={14} className="text-secondary animate-pulse" />
                  <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700 }}>
                    {activeStudioRoom.topic}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0' }}>{activeStudioRoom.title}</h2>
              </div>
            </div>

            <div className="flex items-center gap-xs flex-wrap">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`btn ${isMicMuted ? 'btn-danger' : 'btn-secondary'} flex items-center gap-xs`}
                style={{ padding: '6px 14px', fontSize: '0.8rem', width: 'auto' }}
              >
                {isMicMuted ? <MicOff size={15} /> : <Mic size={15} />}
                <span>{isMicMuted ? 'Muted' : 'Voice Connected'}</span>
              </button>

              <button
                onClick={() => setShowInvitePeerModal(true)}
                className="btn btn-primary flex items-center gap-xs"
                style={{ padding: '6px 16px', fontSize: '0.8rem', width: 'auto' }}
              >
                <UserPlus size={15} /> Invite Connected Peer
              </button>
            </div>
          </div>

          {/* 3-Column Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
            
            {/* COLUMN 1: Peers in Room & Audio Status (3 Columns) */}
            <div className="lg:col-span-3 flex flex-col gap-md">
              <div className="glass-panel p-md flex flex-col gap-sm" style={{ borderRadius: 'var(--radius-lg)' }}>
                <div className="flex justify-between items-center pb-xs" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <span className="text-muted font-700" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Active In Studio (3)
                  </span>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', fontSize: '0.7rem' }}>
                    ● 28ms Ping
                  </span>
                </div>

                {/* You */}
                <div className="flex items-center justify-between p-xs rounded" style={{ background: 'var(--input-bg)' }}>
                  <div className="flex items-center gap-xs">
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                      {(currentUser.firstName || 'A').charAt(0)}
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.82rem' }}>{currentUser.firstName || 'Alex'} (You)</strong>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.7rem' }}>Host • Coding</p>
                    </div>
                  </div>
                  {isMicMuted ? <MicOff size={14} className="text-danger" /> : <Mic size={14} className="text-success" />}
                </div>

                {/* Connected Peers in room */}
                {[
                  { name: 'Jordan Lee', role: 'Full-Stack Dev', speaking: true },
                  { name: 'Casey Smith', role: 'AI Specialist', speaking: false }
                ].map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-xs rounded">
                    <div className="flex items-center gap-xs">
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.82rem' }}>{p.name}</strong>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.7rem' }}>{p.role}</p>
                      </div>
                    </div>
                    {p.speaking ? (
                      <span className="text-success text-xs font-700 animate-pulse">● Speaking</span>
                    ) : (
                      <Mic size={14} className="text-muted" />
                    )}
                  </div>
                ))}
              </div>

              {/* Shared Notes Scratchpad */}
              <div className="glass-panel p-md flex flex-col gap-xs" style={{ borderRadius: 'var(--radius-lg)' }}>
                <span className="text-muted font-700" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  Live Shared Scratchpad
                </span>
                <textarea
                  rows={8}
                  className="input-field font-mono"
                  value={sharedNotes}
                  onChange={(e) => setSharedNotes(e.target.value)}
                  style={{ fontSize: '0.78rem', resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>

            {/* COLUMN 2: Practice Problem & Interactive Code Editor (6 Columns) */}
            <div className="lg:col-span-6 flex flex-col gap-md">
              {/* Problem Brief */}
              <div className="glass-panel p-md" style={{ borderRadius: 'var(--radius-lg)' }}>
                <div className="flex justify-between items-center mb-xs">
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', fontSize: '0.72rem', fontWeight: 700 }}>
                    {activeStudioRoom.activeProblem?.difficulty || 'Medium'} Challenge
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>MNC Interview Practice Standard</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 6px 0' }}>
                  {activeStudioRoom.activeProblem?.title}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.55, margin: 0 }}>
                  {activeStudioRoom.activeProblem?.description}
                </p>
              </div>

              {/* Code Editor */}
              <div className="glass-panel flex flex-col" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <div className="flex justify-between items-center px-md py-xs" style={{ background: 'var(--input-bg)', borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.78rem' }}>
                    <Code2 size={15} className="text-primary" />
                    <span>Collaborative Code Editor</span>
                  </div>

                  <select
                    className="input-field"
                    value={roomCodeLanguage}
                    onChange={(e) => setRoomCodeLanguage(e.target.value)}
                    style={{ padding: '2px 8px', fontSize: '0.75rem', width: 'auto', background: 'transparent' }}
                  >
                    <option value="javascript">JavaScript (Node 22)</option>
                    <option value="python">Python (3.12)</option>
                  </select>
                </div>

                <textarea
                  rows={14}
                  className="input-field font-mono"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  style={{
                    border: 'none',
                    borderRadius: 0,
                    fontSize: '0.84rem',
                    background: '#09090b',
                    color: '#e4e4e7',
                    lineHeight: 1.6,
                    padding: '16px'
                  }}
                />

                {/* Test Runner Actions */}
                <div className="flex justify-between items-center p-sm" style={{ background: 'var(--input-bg)', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={handleRunTests}
                    disabled={isRunningTests}
                    className="btn btn-secondary flex items-center gap-xs"
                    style={{ padding: '6px 16px', fontSize: '0.8rem', width: 'auto' }}
                  >
                    <Play size={14} />
                    <span>{isRunningTests ? 'Running Test Cases...' : 'Run Test Cases'}</span>
                  </button>

                  <button
                    onClick={handleSubmitSolution}
                    className="btn btn-primary flex items-center gap-xs"
                    style={{ padding: '6px 18px', fontSize: '0.8rem', width: 'auto' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Submit Solution (+50 XP)</span>
                  </button>
                </div>
              </div>

              {/* Test Case Output Console */}
              {testOutput && (
                <div className="glass-panel p-md animate-fade-in flex flex-col gap-xs" style={{ borderRadius: 'var(--radius-lg)', background: '#09090b' }}>
                  <div className="flex justify-between items-center pb-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <span className="text-success font-700 flex items-center gap-xs" style={{ fontSize: '0.82rem' }}>
                      <CheckCircle2 size={15} /> All {testOutput.passed}/{testOutput.total} Test Cases Passed!
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{testOutput.runtime}</span>
                  </div>
                  <div className="flex flex-col gap-xs mt-xs">
                    {testOutput.logs.map((log, i) => (
                      <span key={i} className="font-mono text-muted" style={{ fontSize: '0.78rem' }}>{log}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* COLUMN 3: Live Cohort Room Chat (3 Columns) */}
            <div className="lg:col-span-3 flex flex-col gap-sm">
              <div className="glass-panel p-md flex flex-col justify-between" style={{ height: '580px', borderRadius: 'var(--radius-lg)' }}>
                <div>
                  <div className="flex items-center gap-xs pb-xs mb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <MessageSquare size={16} className="text-primary" />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Room Chat Stream</span>
                  </div>

                  {/* Messages */}
                  <div className="flex flex-col gap-xs overflow-y-auto custom-scroll" style={{ maxHeight: '460px' }}>
                    {roomChatMessages.map((msg, i) => (
                      <div key={i} className="glass-panel p-xs rounded" style={{ background: 'var(--input-bg)' }}>
                        <div className="flex justify-between items-center mb-1">
                          <strong style={{ fontSize: '0.78rem', color: msg.user === (currentUser.firstName || 'Alex') ? 'var(--primary)' : 'var(--text-main)' }}>
                            {msg.user}
                          </strong>
                          <span className="text-muted" style={{ fontSize: '0.68rem' }}>{msg.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSendRoomChat} className="flex gap-xs pt-xs mt-xs" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <input
                    type="text"
                    className="input-field flex-1"
                    placeholder="Type message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '6px 10px', width: 'auto' }}>
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            STATE B: DEVCONNECT PEER DIRECTORY & STUDY ROOMS BROWSER
           ───────────────────────────────────────────────────────────── */
        <div className="flex flex-col gap-lg">
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div>
              <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                <Users size={15} /> DEVCONNECT COMMUNITY GUILD
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
                Peer Nexus: Collaborative Cohort Hub
              </h1>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                Match with peers at your exact roadmap milestone, join live virtual study rooms to practice together, and build projects.
              </p>
            </div>

            <span className="badge glass-panel" style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.82rem' }}>
              ● 240+ Engineers Online Now
            </span>
          </header>

          {/* Live Virtual Study Rooms Banner */}
          <div className="glass-panel p-lg flex flex-col gap-md" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.05))', borderRadius: 'var(--radius-lg)' }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-xs">
                <Radio size={18} className="text-secondary animate-pulse" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Live Collaborative Study & Coding Rooms</h3>
              </div>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>3 Rooms Running Live</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {studyRooms.map(room => (
                <div 
                  key={room.id}
                  className="glass-panel flex flex-col justify-between"
                  style={{ padding: '1.25rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                >
                  <div>
                    <div className="flex justify-between items-center mb-xs">
                      <span className="badge" style={{ background: 'var(--input-bg)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700 }}>
                        {room.topic}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {room.members}/{room.maxMembers} Active
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '4px 0 6px 0' }}>{room.title}</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.4, margin: 0 }}>
                      Practice: {room.activeProblem?.title}
                    </p>
                  </div>

                  <button
                    className="btn btn-primary mt-md flex items-center justify-center gap-xs"
                    onClick={() => handleJoinStudioRoom(room)}
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    <Play size={14} /> Join Virtual Room
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Track Filter Controls */}
          <div className="flex flex-col md:flex-row gap-md items-center justify-between">
            <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
              <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 14 }} />
              <input 
                type="text" 
                className="input-field w-full"
                placeholder="Search peers by name, role, or matching skill..."
                style={{ paddingLeft: '2.6rem', fontSize: '0.88rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-xs overflow-x-auto w-full md:w-auto pb-xs">
              {[
                { key: 'all', label: `All Peers (${peersList.length})` },
                { key: 'connected', label: `Connected (${connectedPeerIds.length})` },
                { key: 'web', label: 'Full-Stack' },
                { key: 'ai', label: 'AI & Data' },
                { key: 'cloud', label: 'Cloud & DevOps' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTrack(tab.key)}
                  className="skeuo-pill"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: activeTrack === tab.key ? 'var(--primary)' : 'var(--card-bg)',
                    color: activeTrack === tab.key ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Peers Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {filteredPeers.map(peer => {
              const isConnected = connectedPeerIds.includes(peer.id);
              return (
                <div 
                  key={peer.id}
                  onClick={() => setSelectedPeer(peer)}
                  className="glass-panel interactive flex flex-col justify-between cursor-pointer"
                  style={{
                    padding: '18px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)'
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-sm">
                      <div className="flex items-center gap-sm">
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={peer.avatar} 
                            alt={peer.name}
                            style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          {peer.online && (
                            <span 
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: 'var(--success)',
                                border: '2px solid var(--bg-card)'
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0 }}>{peer.name}</h4>
                          <span className="text-muted" style={{ fontSize: '0.74rem' }}>{peer.role}</span>
                        </div>
                      </div>

                      <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700 }}>
                        {peer.similarity}% Match
                      </span>
                    </div>

                    <p className="text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.45, margin: '6px 0 10px 0' }}>
                      {peer.bio.length > 95 ? `${peer.bio.substring(0, 95)}...` : peer.bio}
                    </p>

                    <div className="flex flex-wrap gap-xs mb-sm">
                      {peer.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-xs" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                      {peer.university}
                    </span>

                    {isConnected ? (
                      <span className="text-success font-600 flex items-center gap-xs" style={{ fontSize: '0.76rem' }}>
                        <CheckCircle2 size={13} /> Connected
                      </span>
                    ) : (
                      <button
                        onClick={(e) => handleOpenConnect(peer, e)}
                        className="btn btn-secondary flex items-center gap-xs"
                        style={{ padding: '5px 12px', fontSize: '0.76rem', width: 'auto' }}
                      >
                        <UserPlus size={12} /> Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODAL 1: INVITE CONNECTED PEER TO VIRTUAL ROOM ── */}
      {showInvitePeerModal && activeStudioRoom && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowInvitePeerModal(false)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-md w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="badge text-primary font-700 mb-xs" style={{ background: 'rgba(99, 102, 241, 0.12)', fontSize: '0.72rem' }}>
                  INVITE TO VIRTUAL ROOM
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Invite Connected Friends</h3>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setShowInvitePeerModal(false)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-sm py-xs">
              {peersList.filter(p => connectedPeerIds.includes(p.id)).length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>No connected peers yet. Connect with developers from the directory first!</p>
              ) : (
                peersList.filter(p => connectedPeerIds.includes(p.id)).map(peer => (
                  <div key={peer.id} className="flex justify-between items-center p-sm glass-panel" style={{ background: 'var(--input-bg)' }}>
                    <div className="flex items-center gap-xs">
                      <img src={peer.avatar} alt={peer.name} style={{ width: 34, height: 34, borderRadius: '50%' }} />
                      <div>
                        <strong style={{ fontSize: '0.84rem' }}>{peer.name}</strong>
                        <span className="text-muted block" style={{ fontSize: '0.72rem' }}>{peer.role}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInvitePeerToRoom(peer)}
                      className="btn btn-primary"
                      style={{ padding: '5px 12px', fontSize: '0.75rem', width: 'auto' }}
                    >
                      Send Invite
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: SEND CONNECTION INVITE ── */}
      {connectPeer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setConnectPeer(null)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-md w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="text-primary font-600" style={{ fontSize: '0.78rem' }}>COLLABORATION INVITE</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Connect with {connectPeer.name}</h3>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setConnectPeer(null)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="flex flex-col gap-md py-xs">
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Collaboration Format</label>
                <div className="grid grid-cols-2 gap-xs">
                  {['Pair Programming', 'Mock Interview Partner', 'Hackathon Teammate', 'Code Review'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setConnectionType(type)}
                      className="skeuo-pill"
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        background: connectionType === type ? 'var(--primary)' : 'var(--input-bg)',
                        color: connectionType === type ? '#fff' : 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Personalized Note</label>
                <textarea 
                  rows={3}
                  className="input-field"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  style={{ fontSize: '0.82rem', resize: 'vertical' }}
                />
              </div>

              <div className="flex justify-end gap-sm pt-sm">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setConnectPeer(null)}
                  style={{ width: 'auto', padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: 'auto', padding: '8px 20px', fontSize: '0.84rem' }}
                >
                  <Send size={14} /> Send Connection Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: VIEW PEER PROFILE ── */}
      {selectedPeer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedPeer(null)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-lg w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-md">
                <img src={selectedPeer.avatar} alt={selectedPeer.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedPeer.name}</h3>
                  <span className="text-muted" style={{ fontSize: '0.82rem' }}>{selectedPeer.role} • {selectedPeer.university}</span>
                </div>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setSelectedPeer(null)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-md py-xs">
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '4px' }}>Candidate Bio</h4>
                <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: 0 }}>{selectedPeer.bio}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '4px' }}>Active Roadmap Trajectory</h4>
                <div className="glass-panel p-sm text-primary font-600" style={{ background: 'var(--input-bg)', fontSize: '0.82rem' }}>
                  {selectedPeer.currentMilestone}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '4px' }}>Completed Projects</h4>
                <div className="flex flex-col gap-xs">
                  {selectedPeer.completedProjects.map((p, i) => (
                    <div key={i} className="flex items-center gap-xs text-muted" style={{ fontSize: '0.8rem' }}>
                      <CheckCircle2 size={14} className="text-success" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedPeer(null)}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.82rem' }}
              >
                Close
              </button>
              <button
                className="btn btn-primary flex items-center gap-xs"
                onClick={(e) => handleOpenConnect(selectedPeer, e)}
                style={{ width: 'auto', padding: '8px 20px', fontSize: '0.82rem' }}
              >
                <UserPlus size={14} /> Send Collaboration Invite
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
