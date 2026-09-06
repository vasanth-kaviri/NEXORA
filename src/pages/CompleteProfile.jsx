import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Book, Briefcase, GraduationCap, ArrowRight, Sparkles, CheckCircle2, Target, Cpu } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import CountryCodePicker from '../components/CountryCodePicker';
import IconInput from '../components/IconInput';
import { useCountryCodes } from '../hooks/useCountryCodes';
import db from '../services/db';
import { useToast } from '../contexts/ToastContext';

const domains = [
  'Artificial Intelligence', 'Web Development', 'Cloud Computing', 'Cybersecurity',
  'Data Science', 'UI/UX Design', 'Mobile App Development', 'Game Development',
  'Blockchain', 'Digital Marketing', 'Business Analytics',
];

const jobs = [
  'Machine Learning Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Engineer', 'DevOps Engineer', 'Cloud Architect',
  'Security Analyst', 'Data Scientist', 'Business Analyst',
  'Product Designer', 'Game Developer', 'Blockchain Engineer',
  'QA Engineer', 'Mobile App Developer',
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', education: '', domain: '', dreamJob: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    db.updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone ? `${countryCode} ${formData.phone}` : '',
      education: formData.education,
      domain: formData.domain,
      dreamJob: formData.dreamJob,
      profileCompleted: true
    });
    toast.success('Profile calibrated! Welcome to your NEXORA engineering workstation.');
    navigate('/dashboard');
  };

  // Dynamic right-side AI profile calibration showcase
  const profileShowcase = (
    <div className="flex flex-col animate-fade-in w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="minimal-badge" style={{ color: 'var(--minimal-indigo)', borderColor: 'rgba(99, 102, 241, 0.25)' }}>
          <Sparkles size={12} className="text-minimal-indigo" />
          <span>AI CAREER ENGINE</span>
        </span>
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>· Real-Time Calibration</span>
      </div>

      <h2 
        className="text-gradient"
        style={{ fontSize: '2.15rem', fontWeight: 800, lineHeight: 1.22, letterSpacing: '-0.5px', marginBottom: '12px' }}
      >
        Precision Tailored Trajectory.
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '24px' }}>
        NEXORA analyzes your domain focus and target career role to dynamically synthesize daily technical sprints and interview assessments.
      </p>

      {/* Trajectory Blueprint Terminal Card */}
      <div 
        className="glass-panel skeuo-convex" 
        style={{ 
          borderRadius: '18px', 
          padding: '22px', 
          background: 'var(--skeuo-surface-card)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.22)'
        }}
      >
        <div className="flex justify-between items-center pb-3 mb-3.5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            <span className="text-muted font-mono" style={{ fontSize: '0.74rem', marginLeft: '6px' }}>
              nexora://engine/profile-synthesis
            </span>
          </div>
          <span className="minimal-badge font-mono" style={{ fontSize: '0.68rem', color: 'var(--minimal-emerald)' }}>
            ● SYNC ACTIVE
          </span>
        </div>

        {/* Selected Trajectory Preview */}
        <div className="p-3 rounded-xl mb-3" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
          <div className="flex justify-between items-center mb-1">
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Target Role Alignment
            </span>
            <span className="minimal-badge" style={{ fontSize: '0.68rem', color: 'var(--minimal-indigo)' }}>
              98% Match
            </span>
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: '2px 0 0 0', color: 'var(--text-main)' }}>
            {formData.dreamJob || 'Full Stack Engineer'}
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            Specialization: <strong className="text-primary">{formData.domain || 'Web Development'}</strong>
          </p>
        </div>

        {/* Dynamic Provisioning Milestones */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between p-2 px-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-minimal-emerald" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                FAANG Diagnostic Assessment Engine
              </span>
            </div>
            <span className="font-mono text-minimal-emerald" style={{ fontSize: '0.72rem' }}>READY</span>
          </div>

          <div className="flex items-center justify-between p-2 px-3 rounded-lg" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div className="flex items-center gap-2">
              <Target size={15} className="text-minimal-indigo" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Calibrated Milestone Roadmaps
              </span>
            </div>
            <span className="font-mono text-minimal-indigo" style={{ fontSize: '0.72rem' }}>STAGED</span>
          </div>

          <div className="flex items-center justify-between p-2 px-3 rounded-lg" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center gap-2">
              <Cpu size={15} className="text-muted" />
              <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                AI Mentor Workstation Persona
              </span>
            </div>
            <span className="font-mono text-muted" style={{ fontSize: '0.72rem' }}>AWAITING</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-muted" style={{ borderTop: '1px solid var(--border-color)' }}>
          <span>NEXORA Calibration Core</span>
          <span className="font-mono">Adaptive AI v2.5</span>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      headline="Personalize Your Trajectory."
      subtext="Calibrate your domain focus and target career goals to unlock tailored curriculum roadmaps, AI mock interviews, and sandbox projects."
      badgeText="ENGINEERING ONBOARDING"
      badgeSub="· Step 1 of 1"
      maxWidth="560px"
      customShowcase={profileShowcase}
    >
      <div className="w-full">
        <div className="mb-5 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2.5" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--minimal-indigo)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <Sparkles size={12} />
            <span>Profile Calibration</span>
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Complete Profile
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
            Configure your technical background so NEXORA can tailor your career station.
          </p>
        </div>

        {/* 2-Column Responsive Grid Form */}
        <form onSubmit={handleSubmit} className="w-full">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* First Name */}
            <div className="input-group mb-0">
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>First Name <span className="text-secondary">*</span></label>
              <IconInput
                icon={<User size={18} />}
                type="text"
                placeholder="e.g. Alex"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>

            {/* Last Name */}
            <div className="input-group mb-0">
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Last Name <span className="text-secondary">*</span></label>
              <IconInput
                icon={<User size={18} />}
                type="text"
                placeholder="e.g. Johnson"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Email Address */}
            <div className="input-group mb-0">
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Email Address <span className="text-secondary">*</span></label>
              <IconInput
                icon={<Mail size={18} />}
                type="email"
                placeholder="alex.johnson@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="input-group mb-0">
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Phone Number <span className="text-secondary">*</span></label>
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
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, phone: val });
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Highest Education */}
            <div className="input-group mb-0">
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Highest Education</label>
              <IconInput
                icon={<GraduationCap size={18} />}
                type="text"
                placeholder="e.g. B.Tech Computer Science"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              />
            </div>

            {/* Domain of Interest */}
            <div className="input-group mb-0">
              <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Domain Focus <span className="text-secondary">*</span></label>
              <div style={{ position: 'relative' }}>
                <Book size={18} className="text-muted" style={{ position: 'absolute', top: 13, left: 14 }} />
                <select
                  className="input-field"
                  style={{ paddingLeft: '2.6rem', width: '100%', appearance: 'none', borderRadius: 'var(--radius-md)' }}
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a domain</option>
                  {domains.map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>
                <div style={{ position: 'absolute', top: 16, right: 14, pointerEvents: 'none' }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Dream Job Role (Full width) */}
          <div className="input-group mb-5">
            <label className="input-label" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Target Dream Job / Role <span className="text-secondary">*</span></label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={18} className="text-muted" style={{ position: 'absolute', top: 13, left: 14 }} />
              <select
                className="input-field"
                style={{ paddingLeft: '2.6rem', width: '100%', appearance: 'none', borderRadius: 'var(--radius-md)' }}
                value={formData.dreamJob}
                onChange={(e) => setFormData({ ...formData, dreamJob: e.target.value })}
                required
              >
                <option value="" disabled>Select your target role</option>
                {jobs.map((j, i) => <option key={i} value={j}>{j}</option>)}
              </select>
              <div style={{ position: 'absolute', top: 16, right: 14, pointerEvents: 'none' }}>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            style={{ padding: '13px', fontSize: '0.94rem', borderRadius: 'var(--radius-md)' }}
          >
            <span>Calibrate Trajectory &amp; Launch</span>
            <ArrowRight size={18} />
          </button>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-muted" style={{ borderTop: '1px solid var(--border-color)' }}>
            <span>⚡ Instant Sandbox Provisioning</span>
            <span>🔒 Confidential Profile Data</span>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
