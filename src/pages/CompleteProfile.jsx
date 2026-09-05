import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Book, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
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

  return (
    <AuthLayout
      headline="Personalize Your Experience."
      subtext="Tell us your goals so we can tailor the perfect learning path and job opportunities just for you."
    >
      {/* Override left column max-width for this page (more fields) */}
      <div style={{ width: '100%', maxWidth: '500px', paddingBottom: 'var(--space-2xl)' }}>
        <header className="mb-lg text-center mt-xl lg:mt-0">
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: 'var(--space-xs)' }}>
            Complete Profile
          </h1>
          <p className="text-muted">Tell us a bit about yourself to personalize your NEXORA experience.</p>
        </header>

        <form onSubmit={handleSubmit} className="glass-panel w-full max-w-full overflow-hidden" style={{ padding: 'var(--space-lg)' }}>

          {/* First Name */}
          <div className="input-group mb-md">
            <label className="input-label">First Name <span className="text-secondary">*</span></label>
            <IconInput
              icon={<User size={20} />}
              type="text"
              placeholder="e.g. Alex"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>

          {/* Last Name */}
          <div className="input-group mb-md">
            <label className="input-label">Last Name <span className="text-secondary">*</span></label>
            <IconInput
              icon={<User size={20} />}
              type="text"
              placeholder="e.g. Johnson"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group mb-md">
            <label className="input-label">Email Address <span className="text-secondary">*</span></label>
            <IconInput
              icon={<Mail size={20} />}
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Phone */}
          <div className="input-group mb-md">
            <label className="input-label">Phone Number <span className="text-secondary">*</span></label>
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

          {/* Education */}
          <div className="input-group mb-md">
            <label className="input-label">Highest Education</label>
            <IconInput
              icon={<GraduationCap size={20} />}
              type="text"
              placeholder="e.g. B.Sc Computer Science"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            />
          </div>

          {/* Domain */}
          <div className="input-group mb-md">
            <label className="input-label">Domain of Interest <span className="text-secondary">*</span></label>
            <div style={{ position: 'relative' }}>
              <Book size={20} className="text-muted" style={{ position: 'absolute', top: 14, left: 14 }} />
              <select
                className="input-field"
                style={{ paddingLeft: '2.75rem', width: '100%', appearance: 'none' }}
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

          {/* Dream Job */}
          <div className="input-group mb-xl">
            <label className="input-label">Dream Job / Role <span className="text-secondary">*</span></label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={20} className="text-muted" style={{ position: 'absolute', top: 14, left: 14 }} />
              <select
                className="input-field"
                style={{ paddingLeft: '2.75rem', width: '100%', appearance: 'none' }}
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

          <button type="submit" className="btn btn-primary w-full">
            Complete Profile <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
