import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Compass, TrendingUp, DollarSign, CheckCircle2, ArrowRight, 
  Sparkles, Briefcase, Building, Layers, Zap, Scale, X 
} from 'lucide-react';
import db from '../services/db';

export default function CareerGoal() {
  const navigate = useNavigate();
  const currentUser = db.getCurrentUser() || {};
  const [selectedGoal, setSelectedGoal] = useState(currentUser.dreamJob || currentUser.careerGoal || 'Full-Stack Developer');
  const [filterCategory, setFilterCategory] = useState('all');
  const [comparisonItems, setComparisonItems] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const careerTracks = [
    {
      id: 'fs_dev',
      title: 'Full-Stack Developer',
      category: 'engineering',
      demand: '96% High Demand',
      salary: '$115k – $165k · ₹14–28 LPA',
      timeline: '4–6 Months',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
      topHiring: ['Google', 'Stripe', 'Amazon', 'Razorpay'],
      desc: 'Build end-to-end cloud platforms, scalable microservices, and high-performance client applications.'
    },
    {
      id: 'ai_ds',
      title: 'AI & Data Scientist',
      category: 'data_ai',
      demand: '98% Exponential Growth',
      salary: '$130k – $185k · ₹16–35 LPA',
      timeline: '5–7 Months',
      skills: ['Python', 'PyTorch', 'NumPy', 'MLOps', 'Vector DBs'],
      topHiring: ['OpenAI', 'Microsoft', 'Google DeepMind', 'Meta'],
      desc: 'Train transformer models, engineer predictive pipelines, and optimize machine learning architectures.'
    },
    {
      id: 'cloud_devops',
      title: 'Cloud & DevOps Architect',
      category: 'infrastructure',
      demand: '94% High Demand',
      salary: '$120k – $175k · ₹15–30 LPA',
      timeline: '4–6 Months',
      skills: ['Kubernetes', 'Terraform', 'AWS / GCP', 'CI/CD', 'Linux'],
      topHiring: ['Netflix', 'Apple', 'Uber', 'Swiggy'],
      desc: 'Architect resilient multi-region infrastructure, zero-downtime deployments, and cloud clusters.'
    },
    {
      id: 'cyber_sec',
      title: 'Cybersecurity Specialist',
      category: 'security',
      demand: '95% Critical Need',
      salary: '$110k – $160k · ₹13–26 LPA',
      timeline: '4–5 Months',
      skills: ['Wireshark', 'Penetration Testing', 'SIEM', 'Cloud Security', 'OWASP'],
      topHiring: ['Palo Alto', 'CrowdStrike', 'Cisco', 'TCS'],
      desc: 'Protect mission-critical networks, conduct vulnerability assessments, and respond to cyber threats.'
    },
    {
      id: 'ui_ux',
      title: 'UI/UX Product Designer',
      category: 'design',
      demand: '89% Steady Growth',
      salary: '$95k – $145k · ₹10–22 LPA',
      timeline: '3–4 Months',
      skills: ['Figma', 'Design Systems', 'User Research', 'Design Tokens', 'WCAG a11y'],
      topHiring: ['Airbnb', 'Spotify', 'Atlassian', 'CRED'],
      desc: 'Craft intuitive customer journeys, user interfaces, design systems, and clickable prototypes.'
    },
    {
      id: 'mobile_dev',
      title: 'Mobile Application Engineer',
      category: 'engineering',
      demand: '91% High Demand',
      salary: '$105k – $155k · ₹12–25 LPA',
      timeline: '4–5 Months',
      skills: ['React Native', 'Flutter', 'Swift / Kotlin', 'State Management', 'APNs'],
      topHiring: ['Uber', 'DoorDash', 'Flipkart', 'Zomato'],
      desc: 'Engineer high-framerate iOS and Android applications with offline-first local synchronization.'
    }
  ];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredTracks = careerTracks.filter(track => {
    if (filterCategory === 'all') return true;
    return track.category === filterCategory;
  });

  const handleSelectGoal = (track) => {
    setSelectedGoal(track.title);
    
    // Persist to user profile in db
    db.updateUserProfile({
      targetRole: track.title,
      careerGoal: track.title,
      dreamJob: track.title
    });

    triggerToast(`Active Goal set to "${track.title}"! Roadmap synchronized.`);

    setTimeout(() => {
      navigate('/roadmap');
    }, 900);
  };

  const handleToggleCompare = (track, e) => {
    e.stopPropagation();
    if (comparisonItems.find(item => item.id === track.id)) {
      setComparisonItems(comparisonItems.filter(item => item.id !== track.id));
    } else {
      if (comparisonItems.length >= 2) {
        triggerToast('You can compare up to 2 careers simultaneously.');
        return;
      }
      setComparisonItems([...comparisonItems, track]);
    }
  };

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
            <Compass size={15} /> CAREER TRAJECTORY CONTROLLER
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Select Target Career Pathway
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Choose your dream role to calibrate your roadmap, skill gap matrix, and AI recruiter interviews.
          </p>
        </div>

        {comparisonItems.length > 0 && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCompareModal(true)}
            style={{ width: 'auto', padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <Scale size={16} /> Compare Selected ({comparisonItems.length}/2)
          </button>
        )}
      </header>

      {/* Category Filter Pills */}
      <div className="flex gap-xs overflow-x-auto pb-xs">
        {[
          { key: 'all', label: 'All Specializations' },
          { key: 'engineering', label: 'Software & Web' },
          { key: 'data_ai', label: 'AI & Data Science' },
          { key: 'infrastructure', label: 'Cloud & DevOps' },
          { key: 'security', label: 'Cybersecurity' },
          { key: 'design', label: 'UI/UX Design' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key)}
            className="skeuo-pill"
            style={{
              padding: '6px 16px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterCategory === cat.key ? 'var(--primary)' : 'var(--card-bg)',
              color: filterCategory === cat.key ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Dynamic Career Track Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {filteredTracks.map((track) => {
          const isActive = selectedGoal.toLowerCase() === track.title.toLowerCase();
          const isComparing = comparisonItems.some(item => item.id === track.id);

          return (
            <div
              key={track.id}
              onClick={() => handleSelectGoal(track)}
              className="glass-panel interactive flex flex-col justify-between cursor-pointer transition-all"
              style={{
                padding: '1.75rem',
                border: isActive ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'var(--card-bg)',
                borderRadius: 'var(--radius-lg)',
                position: 'relative'
              }}
            >
              <div>
                {/* Active Badge */}
                <div className="flex justify-between items-start mb-sm">
                  {isActive ? (
                    <span 
                      className="badge" 
                      style={{
                        background: 'var(--primary)',
                        color: '#fff',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={12} /> ACTIVE CAREER GOAL
                    </span>
                  ) : (
                    <span 
                      className="badge" 
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--success)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      {track.demand}
                    </span>
                  )}

                  {/* Compare Checkbox */}
                  <button 
                    type="button"
                    onClick={(e) => handleToggleCompare(track, e)}
                    className="btn-icon-tactile"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isComparing ? 'rgba(99, 102, 241, 0.2)' : 'var(--input-bg)',
                      color: isComparing ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                  >
                    <Scale size={13} /> {isComparing ? 'Comparing' : 'Compare'}
                  </button>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  {track.title}
                </h3>

                <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {track.desc}
                </p>

                {/* Telemetry Pills */}
                <div className="flex flex-col gap-xs py-xs" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', margin: '0.5rem 0' }}>
                  <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.8rem' }}>
                    <DollarSign size={14} className="text-success" />
                    <span>Compensation: <strong>{track.salary}</strong></span>
                  </div>
                  <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.8rem' }}>
                    <TrendingUp size={14} className="text-primary" />
                    <span>Roadmap Timeline: <strong>{track.timeline}</strong></span>
                  </div>
                  <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.8rem' }}>
                    <Building size={14} className="text-secondary" />
                    <span>Top Hiring: <strong>{track.topHiring.join(', ')}</strong></span>
                  </div>
                </div>

                {/* Core Stack Tags */}
                <div className="flex flex-wrap gap-xs mt-sm">
                  {track.skills.map((skill, i) => (
                    <span 
                      key={i}
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--text-main)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 4
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-md mt-sm">
                <button 
                  className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'} w-full`}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  {isActive ? 'Current Path (Active)' : 'Select This Pathway'}
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Career Comparison Modal */}
      {showCompareModal && comparisonItems.length >= 1 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowCompareModal(false)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-2xl w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Side-by-Side Career Benchmark</h3>
                <p className="text-muted" style={{ fontSize: '0.82rem' }}>Direct comparison of market compensation and prerequisites</p>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setShowCompareModal(false)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-md py-md">
              {comparisonItems.map(item => (
                <div key={item.id} className="glass-panel p-md flex flex-col gap-sm" style={{ background: 'var(--input-bg)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.title}</h4>
                  <div className="text-success font-600" style={{ fontSize: '0.82rem' }}>{item.demand}</div>
                  
                  <div className="flex flex-col gap-xs mt-xs text-muted" style={{ fontSize: '0.82rem' }}>
                    <div><strong>Compensation:</strong> {item.salary}</div>
                    <div><strong>Timeline:</strong> {item.timeline}</div>
                    <div><strong>Key Stack:</strong> {item.skills.join(', ')}</div>
                    <div><strong>Top Employers:</strong> {item.topHiring.join(', ')}</div>
                  </div>

                  <button 
                    className="btn btn-primary mt-sm"
                    onClick={() => {
                      handleSelectGoal(item);
                      setShowCompareModal(false);
                    }}
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    Choose {item.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
