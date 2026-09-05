import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center" style={{ height: '100vh', width: '100vw', backgroundColor: 'var(--bg-main)' }}>
      <div className="glass-panel animate-fade-in flex flex-col items-center" style={{ padding: 'var(--space-xl)', maxWidth: 400, width: '100%' }}>
        <Shield size={64} className="text-secondary mb-md" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: 'var(--space-md)' }}>Admin Portal</h1>
        
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <div className="input-group mb-lg">
            <label className="input-label">Admin Passkey</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} className="text-muted" style={{ position: 'absolute', top: 14, left: 14 }} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--secondary), var(--primary))' }}>
            Enter Portal <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
