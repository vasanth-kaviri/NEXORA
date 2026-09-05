import { Shield, Award, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md text-center" style={{ marginTop: 'var(--space-xl)' }}>
        <div 
          className="flex items-center justify-center mx-auto shadow-lg"
          style={{ width: 80, height: 80, borderRadius: '24px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', marginBottom: 'var(--space-md)' }}
        >
          <Award size={40} className="text-white" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>NEXORA</h1>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Intelligence for your career journey.</p>
        <div className="mt-xs">
          <span style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'var(--input-bg)', borderRadius: 'var(--radius-full)' }}>v1.0.0</span>
        </div>
      </header>

      <section>
        <div className="glass-panel" style={{ padding: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: 'var(--space-sm)' }}>Our Mission</h2>
          <p className="text-muted" style={{ lineHeight: 1.6 }}>
            NEXORA was built to bridge the gap between academic learning and industry expectations. 
            By leveraging advanced AI, we provide personalized pathways, instant feedback, and targeted resources 
            to ensure you land your dream job.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-md">
        <div className="glass-panel flex flex-col items-center justify-center text-center gap-xs" style={{ padding: 'var(--space-md)' }}>
          <Shield size={24} className="text-primary" />
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Secure & Private</span>
        </div>
        <div className="glass-panel flex flex-col items-center justify-center text-center gap-xs" style={{ padding: 'var(--space-md)' }}>
          <Users size={24} className="text-secondary" />
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Community Driven</span>
        </div>
      </section>

      <footer className="text-center mt-xl mb-xl">
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Made with <Heart size={14} className="text-error" style={{ display: 'inline', margin: '0 4px' }} /> by the NEXORA Team.</p>
        <div className="flex justify-center gap-md mt-sm">
          <button 
            onClick={() => alert('NEXORA Terms of Service: By using NEXORA, you agree to respect academic integrity, collaborate constructively, and utilize AI career recommendations ethically.')} 
            className="text-primary interactive" 
            style={{ fontSize: '0.8rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Terms of Service
          </button>
          <button 
            onClick={() => navigate('/settings/privacy')} 
            className="text-primary interactive" 
            style={{ fontSize: '0.8rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Privacy Policy
          </button>
        </div>
      </footer>
    </div>
  );
}
