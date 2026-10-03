import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading and redirect to onboarding
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center" style={{ height: '100%', width: '100%' }}>
      <div className="animate-fade-in flex flex-col items-center justify-center">
        <div style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          padding: '1.5rem',
          borderRadius: '50%',
          boxShadow: '0 0 30px var(--primary-glow)',
          marginBottom: 'var(--space-lg)'
        }}>
          <BrainCircuit size={64} color="white" />
        </div>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: 'var(--space-xs)' }}>
          NEXORA
        </h1>
        <p className="text-muted" style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
          Intelligence For Your Career Journey
        </p>
      </div>
    </div>
  );
}
