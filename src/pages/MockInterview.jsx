import { Video, Mic, StopCircle } from 'lucide-react';
import { useState } from 'react';

export default function MockInterview() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ height: '100%' }}>
      <header className="mb-sm">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Mock Interview</h1>
        <p className="text-muted">Behavioral: Data Scientist</p>
      </header>

      <div className="glass-panel flex-1 flex flex-col overflow-hidden relative">
        {/* Simulated Video Feed */}
        <div style={{ flex: 1, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Video size={48} color="rgba(255,255,255,0.2)" />
          {isRecording && (
            <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--secondary)', animation: 'pulse 1.5s infinite' }} />
              <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }`}</style>
              <span style={{ color: 'white', fontSize: '0.8rem' }}>Recording</span>
            </div>
          )}
        </div>

        {/* Question Panel */}
        <div style={{ padding: 'var(--space-md)', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
          <p className="text-primary font-600 mb-xs" style={{ fontSize: '0.85rem' }}>Question 1 of 5</p>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: 'var(--space-md)' }}>
            "Tell me about a time you had to clean a very messy dataset. What was your approach?"
          </h3>
          
          <div className="flex justify-center mt-md mb-sm">
            {!isRecording ? (
              <button 
                onClick={() => setIsRecording(true)}
                style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(236, 72, 153, 0.2)', border: '2px solid var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Mic size={28} className="text-secondary" />
              </button>
            ) : (
              <button 
                onClick={() => setIsRecording(false)}
                style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <StopCircle size={28} color="white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
