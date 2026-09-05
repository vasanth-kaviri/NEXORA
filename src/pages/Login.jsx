import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import CountryCodePicker from '../components/CountryCodePicker';
import IconInput from '../components/IconInput';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useCountryCodes } from '../hooks/useCountryCodes';
import db from '../services/db';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ contact: '', password: '' });
  const [contactType, setContactType] = useState('email');

  const {
    countryCode,
    setCountryCode,
    showCountryMenu,
    setShowCountryMenu,
    searchCountry,
    setSearchCountry,
    filteredCountries,
    countryCodes,
  } = useCountryCodes();

  const handleLogin = (e) => {
    e.preventDefault();
    // Persistent Database Authentication
    db.login(formData.contact, formData.password);
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      headline="Welcome to NEXORA."
      subtext="Your AI-powered companion for career readiness, interview preparation, and real-world project experience."
      gradientDirection="135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%"
      blobRight="radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.45) 0%, transparent 50%)"
      blobLeft="radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.4) 0%, transparent 50%)"
    >
      <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: 'var(--space-xs)' }}>
        Welcome Back
      </h1>
      <p className="text-muted" style={{ marginBottom: 'var(--space-md)', fontSize: '0.9rem' }}>
        Log in to continue your career journey with NEXORA.
      </p>

      {/* Google Authentication with Database Persistence */}
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <GoogleAuthButton mode="signin" onSuccess={() => navigate('/dashboard')} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-md)' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>or continue with</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
      </div>

      <form onSubmit={handleLogin} className="glass-panel w-full max-w-full overflow-hidden" style={{ padding: 'var(--space-md)' }}>

        {/* Contact Input Toggle */}
        <div className="input-group">
          <div className="flex justify-between items-center mb-xs">
            <label className="input-label mb-0">Contact Details</label>
            <div className="flex gap-sm">
              <span
                onClick={() => { setContactType('email'); setFormData({ ...formData, contact: '' }); }}
                style={{ fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, color: contactType === 'email' ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                Email
              </span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span
                onClick={() => { setContactType('phone'); setFormData({ ...formData, contact: '' }); setShowCountryMenu(false); }}
                style={{ fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, color: contactType === 'phone' ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                Phone
              </span>
            </div>
          </div>

          {contactType === 'email' ? (
            <IconInput
              icon={<Mail size={20} />}
              type="email"
              placeholder="student@example.com"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
          ) : (
            <div className="flex w-full gap-2" style={{ width: '100%' }}>
              <CountryCodePicker
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                showCountryMenu={showCountryMenu}
                setShowCountryMenu={setShowCountryMenu}
                searchCountry={searchCountry}
                setSearchCountry={setSearchCountry}
                filteredCountries={filteredCountries}
                countryCodes={countryCodes}
              />
              <input
                type="tel"
                maxLength={countryCodes.find(c => c.code === countryCode)?.maxLength || 15}
                className="input-field flex-1 min-w-0"
                style={{ flex: 1, minWidth: 0 }}
                placeholder="234 567 8900"
                value={formData.contact}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, contact: val });
                }}
                required
              />
            </div>
          )}
        </div>

        {/* Password */}
        <div className="input-group mb-lg mt-md">
          <label className="input-label flex justify-between">
            Password
            <span onClick={() => navigate('/forgot-password')} className="text-primary" style={{ cursor: 'pointer' }}>
              Forgot?
            </span>
          </label>
          <IconInput
            icon={<Lock size={20} />}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Login <ArrowRight size={20} />
        </button>
      </form>

      <div className="text-center mt-md">
        <p className="text-muted">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-primary interactive"
            style={{ fontWeight: '600', cursor: 'pointer' }}
          >
            Sign up
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
