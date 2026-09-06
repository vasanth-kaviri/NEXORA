import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  GraduationCap, DollarSign, Calendar, Search, CheckCircle2, 
  Sparkles, X, Send, Globe, Clock, Check, ArrowRight
} from 'lucide-react';
import db from '../services/db';

export default function Scholarships() {
  const currentUser = db.getCurrentUser() || {};

  // Country & Currency Configurations
  const countryOptions = [
    { code: 'India', label: 'India (INR ₹)', currency: '₹', rate: 83, defaultCountry: true },
    { code: 'United States', label: 'United States (USD $)', currency: '$', rate: 1 },
    { code: 'United Kingdom', label: 'United Kingdom (GBP £)', currency: '£', rate: 0.78 },
    { code: 'European Union', label: 'European Union (EUR €)', currency: '€', rate: 0.92 },
    { code: 'Canada', label: 'Canada (CAD $)', currency: 'CA$', rate: 1.36 },
    { code: 'Global', label: 'Global / International', currency: '$', rate: 1 }
  ];

  const [selectedCountry, setSelectedCountry] = useState('India');
  const activeCountryMeta = countryOptions.find(c => c.code === selectedCountry) || countryOptions[0];

  // 12+ Real-World Global and Regional Tech Scholarships
  const scholarshipList = [
    {
      id: 'sch_google_01',
      title: 'Google Generation Scholarship (APAC & Global)',
      organization: 'Google',
      baseUSD: 10000,
      inrFixed: '₹2,50,000',
      deadline: 'Nov 15, 2026',
      country: 'Global',
      minGpa: 3.2,
      category: 'diversity',
      targetDegree: 'Undergraduate & Masters',
      tags: ['Women in Tech', 'Computer Science', 'Leadership'],
      desc: 'Established to help aspiring students pursuing computer science degrees excel in technology and become active leaders in the field.',
      eligibilityRules: 'Enrolled in full-time CS or related program, strong academic track record, commitment to diversity in tech.',
      documents: ['Resume / CV', 'Official Academic Transcripts', 'Responses to 2 Short Essay Questions']
    },
    {
      id: 'sch_msft_02',
      title: 'Microsoft Imagine Cup Technology Grant',
      organization: 'Microsoft',
      baseUSD: 25000,
      inrFixed: '₹20,75,000 + $50k Azure Credits',
      deadline: 'Dec 01, 2026',
      country: 'Global',
      minGpa: 3.0,
      category: 'merit',
      targetDegree: 'All Students (16+)',
      tags: ['AI Innovation', 'Cloud Innovation', 'Startup Grant'],
      desc: 'Global competition empowering student developers to build high-impact software solutions using Microsoft AI and Azure cloud technologies.',
      eligibilityRules: 'Students enrolled in high school or university, team or individual submissions with live working prototype.',
      documents: ['Project Pitch Deck', 'GitHub Repository Link', 'Video Demonstration']
    },
    {
      id: 'sch_aws_03',
      title: 'AWS AI & Machine Learning Diversity Scholarship',
      organization: 'Amazon Web Services & Udacity',
      baseUSD: 2500,
      inrFixed: '₹2,10,000 + Full Nanodegree',
      deadline: 'Oct 31, 2026',
      country: 'Global',
      minGpa: 2.8,
      category: 'diversity',
      targetDegree: 'Undergraduate & Self-Taught',
      tags: ['Deep Learning', 'AWS DeepRacer', 'Mentorship'],
      desc: 'Aims to prepare underrepresented and underserved students globally for high-paying careers in artificial intelligence and machine learning.',
      eligibilityRules: 'Age 16+, completion of AWS DeepRacer Student league requirements, demonstrable interest in AI.',
      documents: ['Student Verification', 'AWS DeepRacer Scorecard', 'Statement of Purpose']
    },
    {
      id: 'sch_adobe_04',
      title: 'Adobe Research Women-in-Technology Scholarship',
      organization: 'Adobe Research',
      baseUSD: 10000,
      inrFixed: '₹8,30,000 + Adobe Internship',
      deadline: 'Oct 15, 2026',
      country: 'Global',
      minGpa: 3.5,
      category: 'diversity',
      targetDegree: 'Undergraduate (Females)',
      tags: ['Graphics', 'AI Research', 'Adobe Mentorship'],
      desc: 'Created to recognize outstanding undergraduate female students in computing and provide an opportunity to conduct research alongside Adobe scientists.',
      eligibilityRules: 'Identify as female, enrolled as an undergraduate sophomore or junior in Computer Science, engineering or mathematics.',
      documents: ['Resume', 'Letters of Recommendation (2)', 'Research Interest Proposal']
    },
    {
      id: 'sch_tata_05',
      title: 'Tata Trusts Higher Education Travel & Tech Grant',
      organization: 'Tata Trusts',
      baseUSD: 6000,
      inrFixed: '₹5,00,000',
      deadline: 'Dec 15, 2026',
      country: 'India',
      minGpa: 3.0,
      category: 'need',
      targetDegree: 'Graduate / MS Abroad',
      tags: ['Financial Aid', 'Indian Students', 'Higher Studies'],
      desc: 'Need-based and merit-cum-means assistance for Indian students admitted to top-tier international and national engineering universities.',
      eligibilityRules: 'Indian nationality, confirmed admission into accredited post-graduate technical program, household income verification.',
      documents: ['Admission Letter', 'Family Income Certificate', 'Academic Marksheets (10th to Degree)']
    },
    {
      id: 'sch_reliance_06',
      title: 'Reliance Foundation Undergraduate Scholarship',
      organization: 'Reliance Foundation',
      baseUSD: 4800,
      inrFixed: '₹4,00,000 (Up to 4 years)',
      deadline: 'Oct 06, 2026',
      country: 'India',
      minGpa: 3.0,
      category: 'merit',
      targetDegree: 'Undergraduate First-Year',
      tags: ['Full Tuition Support', 'Mentorship', 'India Nationwide'],
      desc: 'Prestigious scholarship providing financial support and a vibrant leadership network to meritorious first-year degree students across India.',
      eligibilityRules: 'Enrolled in 1st year undergraduate program, 12th score > 60%, aptitude test score.',
      documents: ['12th Marksheet', 'College ID / Bonafide', 'Household Income Proof']
    },
    {
      id: 'sch_chevening_07',
      title: 'Chevening UK Technology & Innovation Fellowship',
      organization: 'UK Foreign & Commonwealth Office',
      baseUSD: 35000,
      inrFixed: '£28,000 (Full Tuition + Flights + Stipend)',
      deadline: 'Nov 05, 2026',
      country: 'United Kingdom',
      minGpa: 3.3,
      category: 'global',
      targetDegree: 'Masters / Postgraduate',
      tags: ['UK Study Abroad', 'Full Fellowship', 'Leadership'],
      desc: 'Full financial support to study for any eligible master’s degree at any UK university, developing future technology and policy leaders.',
      eligibilityRules: 'Undergraduate degree with upper second-class 2:1 honours, min 2 years work or project experience, return to home country for 2 years.',
      documents: ['Valid Passport', 'Undergraduate Degree Certificate', 'Three UK Master Course Choices', 'Two References']
    },
    {
      id: 'sch_grace_08',
      title: 'AnitaB.org Grace Hopper Celebration Student Grant',
      organization: 'AnitaB.org',
      baseUSD: 3000,
      inrFixed: '₹2,50,000 (Conference + Travel Stipend)',
      deadline: 'Nov 20, 2026',
      country: 'Global',
      minGpa: 3.0,
      category: 'diversity',
      targetDegree: 'Undergraduate & Graduate',
      tags: ['GHC Conference', 'Women in Tech', 'Networking'],
      desc: 'Provides complimentary registration and travel stipends for undergraduate and graduate women students to attend the world’s largest gathering of women technologists.',
      eligibilityRules: 'Full-time student at accredited institution, demonstrated commitment to advancing women in computing.',
      documents: ['Student Proof of Enrollment', 'Resume', 'Short Impact Statement']
    }
  ];

  // Helper to format currency based on country
  const formatAmount = (sch) => {
    if (selectedCountry === 'India' && sch.inrFixed) {
      return sch.inrFixed;
    }
    const rate = activeCountryMeta.rate;
    const sym = activeCountryMeta.currency;
    const converted = Math.round(sch.baseUSD * rate);
    return `${sym}${converted.toLocaleString()}`;
  };

  // States
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'diversity', 'merit', 'global', 'need', 'tracker'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedTrackerApp, setSelectedTrackerApp] = useState(null);

  // Comprehensive Form State
  const [applicationForm, setApplicationForm] = useState({
    firstName: currentUser.firstName || 'Explorer',
    lastName: currentUser.lastName || '',
    email: currentUser.email || 'user@nexora.ai',
    phone: currentUser.phone || '',
    education: currentUser.education || 'Computer Science & Engineering',
    gpa: '3.8 / 4.0 (First Class with Distinction)',
    annualIncome: 'Eligible for Need/Merit Aid',
    statementText: '',
    transcriptAttached: false
  });

  // Tracked Applications
  const [appliedTracker, setAppliedTracker] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_scholarship_tracker');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'sch_app_google_seed',
          scholarshipId: 'sch_google_01',
          title: 'Google Generation Scholarship (APAC & Global)',
          organization: 'Google',
          amount: '₹2,50,000 / $10,000',
          submittedDate: 'Sep 01, 2026',
          status: 'Eligibility Audited - Forwarded to Committee',
          stageIndex: 1,
          stages: ['Application Submitted', 'Eligibility Audited', 'Committee Review', 'Disbursement Approval'],
          candidateName: `${currentUser.firstName || 'Scholar'} ${currentUser.lastName || ''}`.trim() || 'Scholarship Applicant',
          email: currentUser.email || 'scholar@nexora.ai',
          phone: '+1 (555) 382-9012',
          education: 'B.Tech in Computer Science & Engineering',
          gpa: '3.8 / 4.0 (First Class with Distinction)',
          country: 'India',
          notes: 'Academic transcripts and diversity statements verified. Formal selection panel review underway.',
          scholarshipDetails: {
            deadline: 'Nov 15, 2026',
            targetDegree: 'Undergraduate & Masters',
            tags: ['Women in Tech', 'Computer Science', 'Leadership'],
            desc: 'Established to help aspiring students pursuing computer science degrees excel in technology and become active leaders in the field.',
            eligibilityRules: 'Enrolled in full-time CS or related program, strong academic track record, commitment to diversity in tech.',
            documents: ['Resume / CV', 'Official Academic Transcripts', 'Responses to 2 Short Essay Questions']
          }
        }
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexora_scholarship_tracker', JSON.stringify(appliedTracker));
    } catch (e) {
      console.warn('Failed to save tracker:', e);
    }
  }, [appliedTracker]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenApply = (sch, e) => {
    if (e) e.stopPropagation();
    setSelectedScholarship(sch);
    setApplicationForm(prev => ({
      ...prev,
      firstName: currentUser.firstName || prev.firstName,
      lastName: currentUser.lastName || prev.lastName,
      email: currentUser.email || prev.email,
      country: selectedCountry
    }));
    setShowApplyModal(true);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!selectedScholarship) return;

    const newApp = {
      id: `sch_app_${Date.now()}`,
      scholarshipId: selectedScholarship.id,
      title: selectedScholarship.title,
      organization: selectedScholarship.organization,
      amount: formatAmount(selectedScholarship),
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Application Submitted',
      stageIndex: 0,
      stages: ['Application Submitted', 'Eligibility Audited', 'Committee Review', 'Disbursement Approval'],
      candidateName: `${applicationForm.firstName} ${applicationForm.lastName}`.trim() || 'Scholarship Applicant',
      email: applicationForm.email,
      phone: applicationForm.phone,
      education: applicationForm.education,
      gpa: applicationForm.gpa,
      country: selectedCountry,
      statementText: applicationForm.statementText,
      transcriptAttached: applicationForm.transcriptAttached,
      notes: 'Application officially queued in admissions portal. Verification in progress.',
      scholarshipDetails: {
        deadline: selectedScholarship.deadline,
        targetDegree: selectedScholarship.targetDegree,
        tags: selectedScholarship.tags,
        desc: selectedScholarship.desc,
        eligibilityRules: selectedScholarship.eligibilityRules,
        documents: selectedScholarship.documents
      }
    };

    const updated = [newApp, ...appliedTracker.filter(a => a.scholarshipId !== selectedScholarship.id)];
    setAppliedTracker(updated);
    setShowApplyModal(false);

    // Save XP
    db.updateUserProfile({
      xp: (currentUser.xp || 1200) + 120
    });

    triggerToast(`Grant application submitted to ${selectedScholarship.organization}! Track status in Application Tracker.`);
  };

  // Filter Logic
  const filteredScholarships = scholarshipList.filter(sch => {
    // Country check: if country is specific (e.g. India or UK) and matches or is Global
    if (selectedCountry !== 'Global' && sch.country !== 'Global' && sch.country !== selectedCountry) {
      return false;
    }

    const matchesSearch = 
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === 'diversity') return sch.category === 'diversity';
    if (activeCategory === 'merit') return sch.category === 'merit';
    if (activeCategory === 'global') return sch.category === 'global';
    if (activeCategory === 'need') return sch.category === 'need';

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
            zIndex: 99999,
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
          <div className="flex items-center gap-xs text-warning font-600 mb-xs" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
            <GraduationCap size={15} /> TECH SCHOLARSHIP & FELLOWSHIP REGISTRY
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Scholarship & Grant Opportunities
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Verified financial aid, merit fellowships, and diversity grants from Google, Microsoft, AWS, and Tata.
          </p>
        </div>

        {/* Country & Currency Selector */}
        <div className="flex items-center gap-sm flex-wrap">
          <div className="flex items-center gap-xs glass-panel" style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
            <Globe size={15} className="text-primary" />
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Country:</span>
            <select
              className="input-field"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontWeight: 600, fontSize: '0.84rem', padding: '2px 6px', cursor: 'pointer' }}
            >
              {countryOptions.map(opt => (
                <option key={opt.code} value={opt.code} style={{ background: 'var(--bg-card)' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveCategory('tracker')}
            className={`btn ${activeCategory === 'tracker' ? 'btn-primary' : 'btn-secondary'} flex items-center gap-xs`}
            style={{ padding: '8px 16px', fontSize: '0.82rem', width: 'auto' }}
          >
            <Clock size={15} />
            <span>Application Tracker ({appliedTracker.length})</span>
          </button>
        </div>
      </header>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-md items-center justify-between">
        <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
          <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 14 }} />
          <input 
            type="text" 
            className="input-field w-full"
            placeholder="Search grants by name, sponsor (e.g. Google), or keyword..."
            style={{ paddingLeft: '2.6rem', fontSize: '0.88rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-xs overflow-x-auto w-full md:w-auto pb-xs">
          {[
            { key: 'all', label: `All Grants (${scholarshipList.length})` },
            { key: 'diversity', label: 'Diversity & Women' },
            { key: 'merit', label: 'Merit-Based' },
            { key: 'global', label: 'Global Study' },
            { key: 'need', label: 'Need-Based' },
            { key: 'tracker', label: `Tracker (${appliedTracker.length})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className="skeuo-pill"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeCategory === tab.key ? 'var(--primary)' : 'var(--card-bg)',
                color: activeCategory === tab.key ? '#fff' : 'var(--text-muted)',
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

      {/* ── VIEW 1: SCHOLARSHIP APPLICATION TRACKER ── */}
      {activeCategory === 'tracker' ? (
        <div className="flex flex-col gap-md animate-fade-in">
          <div className="glass-panel p-md flex justify-between items-center" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center gap-xs">
              <Clock size={18} className="text-warning" />
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Scholarship & Grant Admissions Tracker</span>
            </div>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{appliedTracker.length} Submitted Applications</span>
          </div>

          {appliedTracker.length === 0 ? (
            <div className="glass-panel p-xl text-center flex flex-col items-center justify-center gap-sm">
              <GraduationCap size={36} className="text-muted" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Scholarship Applications Submitted Yet</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Review the available grants filtered for {selectedCountry} and submit your application.</p>
              <button onClick={() => setActiveCategory('all')} className="btn btn-primary" style={{ width: 'auto', padding: '8px 18px' }}>
                Browse All Scholarships
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              {appliedTracker.map((app) => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedTrackerApp(app)}
                  className="glass-panel p-lg flex flex-col gap-md transition-all hover:scale-[1.005] hover:border-warning cursor-pointer"
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    cursor: 'pointer'
                  }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-xs">
                    <div>
                      <span className="text-warning font-600" style={{ fontSize: '0.78rem' }}>{app.organization}</span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0' }}>{app.title}</h3>
                      <span className="text-muted" style={{ fontSize: '0.76rem' }}>Submitted on {app.submittedDate} • Award Value: {app.amount}</span>
                    </div>

                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', fontWeight: 700, fontSize: '0.78rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                      {app.status}
                    </span>
                  </div>

                  {/* 4-Stage Progress Pipeline */}
                  <div className="grid grid-cols-4 gap-xs pt-xs">
                    {app.stages.map((stageName, sIdx) => {
                      const isComplete = sIdx <= app.stageIndex;
                      const isCurrent = sIdx === app.stageIndex;
                      return (
                        <div key={stageName} className="flex flex-col gap-xs">
                          <div 
                            style={{
                              height: 6,
                              borderRadius: 3,
                              background: isComplete ? 'var(--warning)' : 'var(--input-bg)'
                            }} 
                          />
                          <span style={{ fontSize: '0.7rem', fontWeight: isCurrent ? 700 : 500, color: isComplete ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {stageName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Feedback Notes Banner & View Action */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-xs">
                    <div className="glass-panel p-sm flex items-center gap-sm flex-1" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)' }}>
                      <Sparkles size={15} className="text-warning shrink-0" />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <strong>Status Update:</strong> {app.notes}
                      </span>
                    </div>
                    <span className="text-warning flex items-center gap-xs font-600 shrink-0" style={{ fontSize: '0.78rem', padding: '4px 8px' }}>
                      View Details & Status <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── VIEW 2: SCHOLARSHIPS DIRECTORY ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {filteredScholarships.map((sch) => {
            const isApplied = appliedTracker.some(a => a.scholarshipId === sch.id);
            const userGpa = 3.6; // calculated from profile
            const isEligible = userGpa >= sch.minGpa;

            return (
              <div
                key={sch.id}
                className="glass-panel interactive flex flex-col justify-between"
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
                      <div 
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          background: 'rgba(245, 158, 11, 0.12)',
                          color: 'var(--warning)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <GraduationCap size={22} />
                      </div>
                      <div>
                        <span className="text-muted font-600" style={{ fontSize: '0.78rem' }}>{sch.organization}</span>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{sch.title}</h3>
                      </div>
                    </div>

                    <span 
                      className="badge" 
                      style={{ 
                        background: isEligible ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', 
                        color: isEligible ? 'var(--success)' : 'var(--warning)', 
                        fontSize: '0.72rem', 
                        padding: '2px 8px', 
                        borderRadius: 'var(--radius-full)' 
                      }}
                    >
                      {isEligible ? 'Eligible (96% Match) ✓' : 'Prereq: 3.2+ GPA'}
                    </span>
                  </div>

                  <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: '0.5rem 0' }}>
                    {sch.desc}
                  </p>

                  {/* Amount and Deadline Pill */}
                  <div className="flex items-center justify-between p-xs mt-sm" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '0.82rem' }}>
                    <span className="flex items-center gap-xs font-700 text-success">
                      <DollarSign size={14} /> {formatAmount(sch)}
                    </span>
                    <span className="flex items-center gap-xs text-muted" style={{ fontSize: '0.75rem' }}>
                      <Calendar size={13} /> Deadline: {sch.deadline}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-xs mt-sm">
                    {sch.tags.map((tag) => (
                      <span key={tag} className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action row */}
                <div className="flex justify-between items-center pt-md mt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span className="text-muted" style={{ fontSize: '0.76rem' }}>
                    Level: {sch.targetDegree}
                  </span>

                  {isApplied ? (
                    <span 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--success)',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        padding: '6px 12px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      <CheckCircle2 size={15} /> Grant Applied ✓
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => handleOpenApply(sch, e)}
                      style={{ padding: '6px 16px', fontSize: '0.82rem', width: 'auto' }}
                    >
                      Apply for Grant
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: COMPREHENSIVE SCHOLARSHIP APPLICATION PORTAL (RENDERED VIA PORTAL TO PREVENT VIEWPORT TRAPPING) ── */}
      {showApplyModal && selectedScholarship && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            width: '100vw', 
            height: '100vh',
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.8)', 
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflowY: 'auto'
          }}
          onClick={() => setShowApplyModal(false)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-xl w-full animate-scale-up"
            style={{ 
              padding: '2rem', 
              background: 'var(--bg-card)', 
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              margin: 'auto',
              borderRadius: 'var(--radius-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="text-warning font-700" style={{ fontSize: '0.76rem', letterSpacing: '0.05em' }}>SCHOLARSHIP ADMISSIONS PORTAL</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedScholarship.title}</h3>
                <div className="text-success font-700" style={{ fontSize: '0.84rem' }}>Award Value: {formatAmount(selectedScholarship)}</div>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setShowApplyModal(false)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="flex flex-col gap-md py-xs">
              {/* Applicant Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>First Name *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applicationForm.firstName}
                    onChange={(e) => setApplicationForm({ ...applicationForm, firstName: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Last Name *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applicationForm.lastName}
                    onChange={(e) => setApplicationForm({ ...applicationForm, lastName: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Email Address *</label>
                  <input 
                    type="email" 
                    required
                    className="input-field" 
                    value={applicationForm.email}
                    onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Phone Number *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applicationForm.phone}
                    onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Country & Current Institution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Country of Residence *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applicationForm.country}
                    onChange={(e) => setApplicationForm({ ...applicationForm, country: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Current Academic Institution *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applicationForm.institution}
                    onChange={(e) => setApplicationForm({ ...applicationForm, institution: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Education Level & GPA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Degree & Year *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applicationForm.degreeLevel}
                    onChange={(e) => setApplicationForm({ ...applicationForm, degreeLevel: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Current CGPA / Percentage *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applicationForm.gpa}
                    onChange={(e) => setApplicationForm({ ...applicationForm, gpa: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Household Income Bracket */}
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Family Annual Income Bracket *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={applicationForm.annualIncome}
                  onChange={(e) => setApplicationForm({ ...applicationForm, annualIncome: e.target.value })}
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              {/* Attached Transcripts Checklist */}
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Required Admissions Documentation</label>
                <div className="flex flex-col gap-xs glass-panel p-sm" style={{ background: 'var(--input-bg)', padding: '8px 12px' }}>
                  {selectedScholarship.documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-xs text-muted" style={{ fontSize: '0.8rem' }}>
                      <CheckCircle2 size={14} className="text-success" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statement of Purpose */}
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Statement of Purpose / Grant Need Essay *</label>
                <textarea 
                  rows={4}
                  required
                  className="input-field"
                  value={applicationForm.statementText}
                  onChange={(e) => setApplicationForm({ ...applicationForm, statementText: e.target.value })}
                  style={{ fontSize: '0.82rem', resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>

              <div className="flex justify-end gap-sm pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowApplyModal(false)}
                  style={{ width: 'auto', padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex items-center gap-xs"
                  style={{ width: 'auto', padding: '8px 22px', fontSize: '0.84rem' }}
                >
                  <Send size={15} /> Submit Grant Application
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── SCHOLARSHIP APPLICATION TRACKER DETAIL & STATUS MODAL ── */}
      {selectedTrackerApp && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedTrackerApp(null)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-2xl w-full animate-scale-up"
            style={{ 
              padding: '2rem', 
              background: 'var(--bg-card)', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              borderRadius: 'var(--radius-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div className="flex items-center gap-xs text-warning font-600 mb-xs" style={{ fontSize: '0.78rem' }}>
                  <GraduationCap size={14} /> OFFICIAL GRANT RECORD • {selectedTrackerApp.organization}
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{selectedTrackerApp.title}</h2>
                <div className="flex flex-wrap items-center gap-sm mt-xs text-muted" style={{ fontSize: '0.82rem' }}>
                  <span>Submitted: {selectedTrackerApp.submittedDate}</span>
                  <span>•</span>
                  <span>Award: <strong className="text-success">{selectedTrackerApp.amount}</strong></span>
                  <span>•</span>
                  <span>Candidate: <strong>{selectedTrackerApp.candidateName}</strong></span>
                </div>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setSelectedTrackerApp(null)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Pipeline Stage Timeline */}
            <div className="glass-panel p-md flex flex-col gap-sm" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex justify-between items-center">
                <span className="font-700" style={{ fontSize: '0.88rem' }}>Grant Adjudication Status</span>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontWeight: 700, fontSize: '0.8rem', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
                  {selectedTrackerApp.status}
                </span>
              </div>

              {/* Visual 4-Stage Progress */}
              <div className="grid grid-cols-4 gap-xs pt-xs">
                {selectedTrackerApp.stages.map((stageName, sIdx) => {
                  const isComplete = sIdx <= selectedTrackerApp.stageIndex;
                  const isCurrent = sIdx === selectedTrackerApp.stageIndex;
                  return (
                    <div key={stageName} className="flex flex-col gap-xs">
                      <div 
                        style={{
                          height: 8,
                          borderRadius: 4,
                          background: isComplete ? 'var(--warning)' : 'var(--border-color)'
                        }} 
                      />
                      <div className="flex items-center gap-xs mt-xs">
                        {isComplete && <Check size={12} className="text-warning" />}
                        <span style={{ fontSize: '0.72rem', fontWeight: isCurrent ? 700 : 500, color: isComplete ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {stageName}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-xs mt-xs text-muted" style={{ fontSize: '0.8rem' }}>
                <Sparkles size={14} className="text-warning" />
                <span>{selectedTrackerApp.notes}</span>
              </div>
            </div>

            {/* Applicant Profile & Submitted Dossier */}
            <div className="flex flex-col gap-xs">
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Applicant Dossier & Academic Credentials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm" style={{ fontSize: '0.82rem' }}>
                <div className="p-sm glass-panel" style={{ background: 'var(--card-bg)' }}>
                  <span className="text-muted block" style={{ fontSize: '0.72rem' }}>Registered Scholar</span>
                  <span className="font-600">{selectedTrackerApp.candidateName}</span>
                </div>
                <div className="p-sm glass-panel" style={{ background: 'var(--card-bg)' }}>
                  <span className="text-muted block" style={{ fontSize: '0.72rem' }}>Contact Email</span>
                  <span className="font-600">{selectedTrackerApp.email || currentUser.email || 'scholar@nexora.ai'}</span>
                </div>
                <div className="p-sm glass-panel" style={{ background: 'var(--card-bg)' }}>
                  <span className="text-muted block" style={{ fontSize: '0.72rem' }}>Academic Degree</span>
                  <span className="font-600">{selectedTrackerApp.education || 'B.Tech in Computer Science'}</span>
                </div>
                <div className="p-sm glass-panel" style={{ background: 'var(--card-bg)' }}>
                  <span className="text-muted block" style={{ fontSize: '0.72rem' }}>Reported GPA & Country</span>
                  <span className="font-600">{selectedTrackerApp.gpa || '3.8 / 4.0'} • {selectedTrackerApp.country || 'Global'}</span>
                </div>
              </div>

              {selectedTrackerApp.statementText && (
                <div className="p-sm glass-panel mt-xs" style={{ background: 'var(--card-bg)', fontSize: '0.82rem' }}>
                  <span className="text-muted block mb-xs" style={{ fontSize: '0.72rem' }}>Submitted Statement of Purpose</span>
                  <p className="text-muted" style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>"{selectedTrackerApp.statementText}"</p>
                </div>
              )}
            </div>

            {/* Official Grant Criteria & Documents */}
            {(() => {
              const sch = selectedTrackerApp.scholarshipDetails || scholarshipList.find(s => s.id === selectedTrackerApp.scholarshipId) || {};
              return (
                <div className="flex flex-col gap-xs pt-xs" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Eligibility Rules & Required Audit Documents</h4>
                  {sch.desc && <p className="text-muted" style={{ fontSize: '0.82rem', margin: 0 }}>{sch.desc}</p>}
                  {sch.eligibilityRules && (
                    <div className="mt-xs">
                      <span className="text-muted font-600" style={{ fontSize: '0.78rem' }}>Eligibility Criteria:</span>
                      <p className="text-muted" style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>{sch.eligibilityRules}</p>
                    </div>
                  )}
                  {sch.documents && sch.documents.length > 0 && (
                    <div className="mt-xs">
                      <span className="text-muted font-600" style={{ fontSize: '0.78rem' }}>Submitted Documents Checklist:</span>
                      <ul className="flex flex-col gap-xs pl-md mt-xs" style={{ fontSize: '0.8rem' }}>
                        {sch.documents.map((doc, i) => (
                          <li key={i} className="text-muted flex items-center gap-xs">
                            <CheckCircle2 size={13} className="text-success" />
                            <span>{doc} (Verified)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Actions */}
            <div className="flex justify-end gap-sm pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedTrackerApp(null)}
                style={{ width: 'auto', padding: '8px 18px', fontSize: '0.84rem' }}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
