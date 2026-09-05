import { Users, Code, MessageSquare } from 'lucide-react';

export default function PeerLearning() {
  const peers = [
    { name: 'Jordan Lee', role: 'Frontend Dev', matchingSkill: 'React', similarity: 90 },
    { name: 'Casey Smith', role: 'Data Enthusiast', matchingSkill: 'Python', similarity: 85 },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Peer Learning</h1>
        <p className="text-muted">Team up for collaborative projects.</p>
      </header>

      <div className="flex flex-col gap-md">
        {peers.map((peer, i) => (
          <div key={i} className={`glass-panel interactive delay-${(i + 1) * 100}`} style={{ padding: 'var(--space-md)' }}>
            <div className="flex justify-between items-start mb-sm">
              <div className="flex gap-sm">
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {peer.name[0]}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{peer.name}</h3>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>{peer.role}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-primary font-600">{peer.similarity}% Match</div>
              </div>
            </div>
            <div className="flex gap-sm mt-md">
              <button className="btn btn-secondary flex-1" style={{ padding: '8px', fontSize: '0.85rem' }}><Code size={16}/> View Profile</button>
              <button className="btn btn-primary flex-1" style={{ padding: '8px', fontSize: '0.85rem' }}><MessageSquare size={16}/> Connect</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
