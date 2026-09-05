import { useState } from 'react';
import { 
  Users, Code, MessageSquare, Search, Filter, CheckCircle2, 
  Sparkles, ExternalLink, X, UserPlus, Radio, Code2, Globe, 
  Award, BookOpen, Send, UserCheck
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
    { id: 'room_1', title: 'LeetCode 75 Algorithms Grind', topic: 'Data Structures', members: 4, maxMembers: 6, active: true },
    { id: 'room_2', title: 'Full-Stack Portfolio Sprint', topic: 'Web Development', members: 3, maxMembers: 5, active: true },
    { id: 'room_3', title: 'MNC Mock Interview Practice', topic: 'Behavioral & Tech', members: 2, maxMembers: 4, active: true }
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
      return JSON.parse(localStorage.getItem('nexora_connected_peers') || '[]');
    } catch {
      return [];
    }
  });
  const [activeJoinedRoom, setActiveJoinedRoom] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenConnect = (peer, e) => {
    e.stopPropagation();
    setConnectPeer(peer);
    setInviteMessage(`Hi ${peer.name}! I saw you're also working on ${peer.currentMilestone}. Would love to team up for ${connectionType.toLowerCase()} on NEXORA.`);
    setSelectedPeer(null);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!connectPeer) return;

    const updated = [...new Set([...connectedPeerIds, connectPeer.id])];
    setConnectedPeerIds(updated);
    localStorage.setItem('nexora_connected_peers', JSON.stringify(updated));

    setConnectPeer(null);
    triggerToast(`Collaboration invitation sent to ${connectPeer.name}!`);
  };

  const handleJoinRoom = (room) => {
    if (activeJoinedRoom?.id === room.id) {
      setActiveJoinedRoom(null);
      triggerToast(`Left study room "${room.title}".`);
    } else {
      setActiveJoinedRoom(room);
      triggerToast(`Joined "${room.title}"! Live voice channel activated.`);
    }
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
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
            <Users size={15} /> DEVCONNECT COMMUNITY GUILD
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Peer Nexus: Collaborative Cohort Hub
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Match with peers at your exact roadmap milestone, join live virtual study rooms, and build together.
          </p>
        </div>

        <span className="badge glass-panel" style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.82rem' }}>
          ● 240+ Engineers Online Now
        </span>
      </header>

      {/* Live Virtual Study Rooms Banner */}
      <div className="glass-panel p-lg flex flex-col gap-md" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.05))' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-xs">
            <Radio size={16} className="text-secondary animate-pulse" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Virtual Study & Coding Rooms</h3>
          </div>
          {activeJoinedRoom && (
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 600 }}>
              Connected: {activeJoinedRoom.title}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {studyRooms.map(room => {
            const isJoined = activeJoinedRoom?.id === room.id;
            return (
              <div 
                key={room.id}
                className="glass-panel flex flex-col justify-between"
                style={{ padding: '1rem', background: isJoined ? 'rgba(99, 102, 241, 0.12)' : 'var(--card-bg)', border: isJoined ? '1px solid var(--primary)' : '1px solid var(--border-color)' }}
              >
                <div>
                  <div className="flex justify-between items-center mb-xs">
                    <span className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      {room.topic}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {room.members}/{room.maxMembers} Active
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginTop: '4px' }}>{room.title}</h4>
                </div>

                <button
                  className={`btn ${isJoined ? 'btn-secondary' : 'btn-primary'} mt-md`}
                  onClick={() => handleJoinRoom(room)}
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  {isJoined ? 'Leave Voice Channel' : 'Join Virtual Room'}
                </button>
              </div>
            );
          })}
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
            { key: 'web', label: 'Web & Full-Stack' },
            { key: 'ai', label: 'AI & Data Science' },
            { key: 'cloud', label: 'Cloud & DevOps' },
            { key: 'connected', label: `My Cohort (${connectedPeerIds.length})` }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {filteredPeers.map(peer => {
          const isConnected = connectedPeerIds.includes(peer.id);

          return (
            <div
              key={peer.id}
              onClick={() => setSelectedPeer(peer)}
              className="glass-panel interactive flex flex-col justify-between cursor-pointer transition-all"
              style={{
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <div>
                <div className="flex justify-between items-start mb-sm">
                  <div className="flex items-center gap-sm">
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={peer.avatar} 
                        alt={peer.name}
                        style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {peer.online && (
                        <div 
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
                          title="Online Now"
                        />
                      )}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{peer.name}</h3>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{peer.role} • {peer.university}</div>
                    </div>
                  </div>

                  <span 
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {peer.similarity}% Match
                  </span>
                </div>

                <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: '0.5rem 0' }}>
                  {peer.bio.slice(0, 110)}...
                </p>

                {/* Milestone Pill */}
                <div className="p-xs mt-xs" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '0.8rem' }}>
                  <span className="text-muted">Active: </span>
                  <span style={{ fontWeight: 600 }}>{peer.currentMilestone}</span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-xs mt-sm">
                  {peer.skills.map((skill, i) => (
                    <span 
                      key={i}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        padding: '2px 8px',
                        borderRadius: 4
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-sm pt-md mt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  className="btn btn-secondary flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPeer(peer);
                  }}
                  style={{ padding: '8px', fontSize: '0.82rem' }}
                >
                  <Code size={15} /> View Full Profile
                </button>

                {isConnected ? (
                  <span 
                    className="flex-1 flex items-center justify-center gap-xs"
                    style={{
                      color: 'var(--success)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <CheckCircle2 size={15} /> Invite Sent ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary flex-1"
                    onClick={(e) => handleOpenConnect(peer, e)}
                    style={{ padding: '8px', fontSize: '0.82rem' }}
                  >
                    <UserPlus size={15} /> Connect & Invite
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* View Full Matching Profile Modal */}
      {selectedPeer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedPeer(null)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-xl w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-md">
                <img 
                  src={selectedPeer.avatar} 
                  alt={selectedPeer.name}
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedPeer.name}</h3>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>{selectedPeer.role} • {selectedPeer.university}</div>
                  <div className="text-success font-600" style={{ fontSize: '0.78rem' }}>{selectedPeer.similarity}% Trajectory Match</div>
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
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Biography & Collaboration Goals</h4>
                <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{selectedPeer.bio}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>Current Roadmap Focus</h4>
                <div className="glass-panel p-sm" style={{ background: 'var(--input-bg)', fontSize: '0.84rem' }}>
                  {selectedPeer.currentMilestone}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>Completed Showcase Projects</h4>
                <ul className="flex flex-col gap-xs" style={{ paddingLeft: '1.2rem', fontSize: '0.84rem' }}>
                  {selectedPeer.completedProjects.map((p, i) => (
                    <li key={i} className="text-muted">{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>Verified Skills</h4>
                <div className="flex flex-wrap gap-xs">
                  {selectedPeer.skills.map((s, i) => (
                    <span key={i} className="badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', padding: '3px 8px', fontSize: '0.76rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex gap-xs">
                <a href={selectedPeer.github} target="_blank" rel="noreferrer" className="btn-icon-tactile" title="GitHub Profile" style={{ padding: '8px', borderRadius: '50%' }}>
                  <Code2 size={18} />
                </a>
                <a href={selectedPeer.linkedin} target="_blank" rel="noreferrer" className="btn-icon-tactile" title="LinkedIn Profile" style={{ padding: '8px', borderRadius: '50%' }}>
                  <Globe size={18} />
                </a>
              </div>

              <button 
                className="btn btn-primary"
                onClick={(e) => handleOpenConnect(selectedPeer, e)}
                style={{ width: 'auto', padding: '8px 20px', fontSize: '0.85rem' }}
              >
                Send Collaboration Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect & Invite Modal */}
      {connectPeer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setConnectPeer(null)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-lg w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="text-primary font-600" style={{ fontSize: '0.78rem' }}>COLLABORATION DISPATCH</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Connect with {connectPeer.name}</h3>
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
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Collaboration Goal</label>
                <select 
                  className="input-field w-full"
                  value={connectionType}
                  onChange={(e) => {
                    setConnectionType(e.target.value);
                    setInviteMessage(`Hi ${connectPeer.name}! I saw you're working on ${connectPeer.currentMilestone}. Would love to team up for a ${e.target.value.toLowerCase()} session on NEXORA.`);
                  }}
                  style={{ fontSize: '0.84rem' }}
                >
                  <option value="Pair Programming">Pair Programming Session</option>
                  <option value="Code Review">Peer Code Review</option>
                  <option value="Hackathon Teammate">Hackathon Team Building</option>
                  <option value="Mock Interview Partner">Mock Interview Partner</option>
                </select>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Personalized Invitation Message</label>
                <textarea 
                  rows={4}
                  className="input-field w-full"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  style={{ fontSize: '0.84rem', resize: 'vertical' }}
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
                  style={{ width: 'auto', padding: '8px 22px', fontSize: '0.84rem' }}
                >
                  <Send size={15} /> Send Cohort Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
