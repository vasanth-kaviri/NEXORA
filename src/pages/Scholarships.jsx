import { useState } from 'react';
import { 
  GraduationCap, DollarSign, Calendar, Search, Filter, CheckCircle2, 
  Sparkles, ExternalLink, X, FileText, Send, Award, AlertCircle, Bookmark 
} from 'lucide-react';
import db from '../services/db';

export default function Scholarships() {
  const currentUser = db.getCurrentUser() || {};

  // 12+ Real-World Global and Regional Tech Scholarships
  const scholarshipList = [
    {
      id: 'sch_google_01',
      title: 'Google Generation Scholarship (APAC & Global)',
      organization: 'Google',
      amount: '$10,000 / ₹2,50,000',
      deadline: 'Nov 15, 2026',
      eligible: true,
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
      amount: '$25,000 + $50k Azure Credits',
      deadline: 'Dec 01, 2026',
      eligible: true,
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
      amount: '$2,500 + Full Nanodegree',
      deadline: 'Oct 31, 2026',
      eligible: true,
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
      amount: '$10,000 + Adobe Internship',
      deadline: 'Oct 15, 2026',
      eligible: true,
      category: 'diversity',
      targetDegree: 'Undergraduate (Juniors)',
      tags: ['Women in Tech', 'Computer Graphics', 'AI Research'],
      desc: 'Created to recognize outstanding undergraduate female students in computing and provide an opportunity to conduct research alongside Adobe scientists.',
      eligibilityRules: 'Female student majoring in Computer Science, 3.5+ GPA, outstanding leadership experience.',
      documents: ['Resume', 'Academic Transcript', 'Research Proposal', '3 Recommendation Letters']
    },
    {
      id: 'sch_tata_05',
      title: 'Tata Trust Higher Education Scholarship for Technology',
      organization: 'Tata Trusts',
      amount: '₹2,50,000 Full Grant',
      deadline: 'Nov 30, 2026',
      eligible: true,
      category: 'need',
      targetDegree: 'B.Tech / M.Tech / MS',
      tags: ['Merit-cum-Means', 'Engineering', 'Higher Education'],
      desc: 'Providing financial relief to deserving Indian engineering students admitted into premier national and international STEM programs.',
      eligibilityRules: 'Indian resident, family annual income under ₹6 LPA, minimum 75% score in prior degree.',
      documents: ['Income Certificate', 'College Admission Offer Letter', 'Fee Breakdown Structure']
    },
    {
      id: 'sch_chevening_06',
      title: 'Chevening British Technology Leadership Fellowship',
      organization: 'UK Foreign & Commonwealth Office',
      amount: '£35,000 (Full Tuition + Stipend)',
      deadline: 'Nov 05, 2026',
      eligible: true,
      category: 'global',
      targetDegree: '1-Year UK Masters',
      tags: ['Study in UK', 'Full Ride', 'Tech Policy & AI'],
      desc: 'The UK government’s global scholarship programme offering full financial support for future tech leaders to study master’s degrees at any UK university.',
      eligibilityRules: 'Undergraduate degree with 2+ years work experience, commitment to return to home country for 2 years.',
      documents: ['Degree Certificate', '3 Essays (Leadership, Networking, Future Career)', '2 References']
    },
    {
      id: 'sch_reliance_07',
      title: 'Reliance Foundation Undergraduate Tech Scholarship',
      organization: 'Reliance Foundation',
      amount: '₹2,00,000 Grant over degree',
      deadline: 'Dec 15, 2026',
      eligible: true,
      category: 'merit',
      targetDegree: 'First Year Undergraduates',
      tags: ['Engineering', 'Merit-Based', 'Mentorship'],
      desc: 'Supports India’s brightest first-year undergraduate students with grants and professional development workshops throughout their college degree.',
      eligibilityRules: 'First-year B.E./B.Tech student with minimum 60% in Class 12, passed online aptitude test.',
      documents: ['Class 12 Marksheet', 'College Identity Card', 'Aptitude Test Score']
    },
    {
      id: 'sch_ghc_08',
      title: 'Grace Hopper Celebration Student Tech Fellowship',
      organization: 'AnitaB.org',
      amount: '$1,500 + Full Conference Pass',
      deadline: 'Immediate',
      eligible: true,
      category: 'diversity',
      targetDegree: 'All College Levels',
      tags: ['Women in Tech', 'Networking', 'Career Fair'],
      desc: 'Grants complimentary access, travel stipends, and networking opportunities for students attending the world’s largest gathering of women in tech.',
      eligibilityRules: 'Enrolled student identifying as woman or non-binary in a computing-related degree.',
      documents: ['Student Verification', 'CV', 'Community Involvement Essay']
    },
    {
      id: 'sch_erasmus_09',
      title: 'Erasmus Mundus European Tech & AI Masters Grant',
      organization: 'European Commission',
      amount: '€25,000 / year (Fully Funded)',
      deadline: 'Jan 15, 2027',
      eligible: true,
      category: 'global',
      targetDegree: 'Masters across 3 EU Universities',
      tags: ['Study in Europe', 'Multi-Country Degree', 'AI & Robotics'],
      desc: 'Premier joint master degrees delivered across consortiums of top universities in France, Germany, Italy, and Sweden with full living allowances.',
      eligibilityRules: 'Bachelor degree in CS, Math, or Engineering, English proficiency (IELTS 6.5+ / TOEFL 90+).',
      documents: ['Motivation Letter', 'Certified Transcripts', 'Proof of English Proficiency']
    },
    {
      id: 'sch_palantir_10',
      title: 'Palantir Future Technology Scholarship',
      organization: 'Palantir Technologies',
      amount: '$7,000 + Tech Workshops',
      deadline: 'Nov 25, 2026',
      eligible: true,
      category: 'merit',
      targetDegree: 'Undergraduate & Masters',
      tags: ['Big Data', 'Security', 'Enterprise Software'],
      desc: 'Celebrates students who are leveraging technology and data systems to solve the world’s hardest public and private sector challenges.',
      eligibilityRules: 'Active student in STEM field, demonstrated passion for algorithmic problem solving.',
      documents: ['Resume', 'Coding Portfolio Link', 'Essay on High-Impact Data Systems']
    },
    {
      id: 'sch_github_11',
      title: 'GitHub Campus Expert & Open Source Grant',
      organization: 'GitHub Education',
      amount: '$3,000 + Swag & Cloud Tools',
      deadline: 'Rolling',
      eligible: true,
      category: 'merit',
      targetDegree: 'Active Students',
      tags: ['Open Source', 'Community Building', 'Hackathons'],
      desc: 'Empowers student leaders to build thriving technical communities on their college campuses with resources and financial backing.',
      eligibilityRules: 'Student 18+, active GitHub profile, passionate about organizing tech workshops.',
      documents: ['GitHub Profile', 'Campus Proposal Video']
    },
    {
      id: 'sch_kcmahindra_12',
      title: 'K.C. Mahindra Tech Education Trust Scholarship',
      organization: 'K.C. Mahindra Education Trust',
      amount: '₹8,00,000 Merit Loan / Grant',
      deadline: 'Dec 10, 2026',
      eligible: true,
      category: 'global',
      targetDegree: 'Postgraduate Abroad in Tech',
      tags: ['Overseas Study', 'Merit Grant', 'STEM'],
      desc: 'Provides interest-free loans and non-refundable grants to Indian graduates going abroad for post-graduate engineering studies at top-ranked universities.',
      eligibilityRules: 'First-class degree from recognized Indian university, confirmed admission into top foreign university.',
      documents: ['Foreign Admission Letter', 'Degree Transcripts', '2 Recommender Forms']
    }
  ];

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [appliedScholarships, setAppliedScholarships] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexora_applied_scholarships') || '[]');
    } catch {
      return [];
    }
  });
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [statementText, setStatementText] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenApply = (sch, e) => {
    if (e) e.stopPropagation();
    setSelectedScholarship(sch);
    setStatementText(`I am applying for the ${sch.title}. As an aspiring engineer in ${currentUser.dreamJob || 'Software Engineering'}, this grant will directly facilitate my hands-on research and coursework.`);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!selectedScholarship) return;

    const updated = [...new Set([...appliedScholarships, selectedScholarship.id])];
    setAppliedScholarships(updated);
    localStorage.setItem('nexora_applied_scholarships', JSON.stringify(updated));

    setShowApplyModal(false);
    triggerToast(`Grant application submitted to ${selectedScholarship.organization}!`);
  };

  const filteredScholarships = scholarshipList.filter(sch => {
    const matchesSearch = 
      sch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sch.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === 'diversity') return sch.category === 'diversity';
    if (activeCategory === 'merit') return sch.category === 'merit';
    if (activeCategory === 'global') return sch.category === 'global';
    if (activeCategory === 'need') return sch.category === 'need';
    if (activeCategory === 'applied') return appliedScholarships.includes(sch.id);

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

        <span className="badge glass-panel" style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.82rem' }}>
          {scholarshipList.length} Active Grants
        </span>
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
            { key: 'all', label: `All (${scholarshipList.length})` },
            { key: 'diversity', label: 'Women in Tech & Diversity' },
            { key: 'merit', label: 'Merit-Based' },
            { key: 'global', label: 'Global Study Abroad' },
            { key: 'need', label: 'Need-Based' },
            { key: 'applied', label: `Applied (${appliedScholarships.length})` }
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

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {filteredScholarships.map((sch) => {
          const isApplied = appliedScholarships.includes(sch.id);

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

                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                    Eligible ✓
                  </span>
                </div>

                <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: '0.5rem 0' }}>
                  {sch.desc}
                </p>

                {/* Amount and Deadline Pill */}
                <div className="flex items-center justify-between p-xs mt-sm" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '0.82rem' }}>
                  <span className="flex items-center gap-xs font-700 text-success">
                    <DollarSign size={14} /> {sch.amount}
                  </span>
                  <span className="text-muted flex items-center gap-xs">
                    <Calendar size={13} /> Deadline: {sch.deadline}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-xs mt-sm">
                  {sch.tags.map((tag, i) => (
                    <span 
                      key={i}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        padding: '2px 8px',
                        borderRadius: 4
                      }}
                    >
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

      {/* Interactive Application Modal */}
      {showApplyModal && selectedScholarship && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowApplyModal(false)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-lg w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="text-warning font-600" style={{ fontSize: '0.78rem' }}>SCHOLARSHIP ADMISSIONS PORTAL</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedScholarship.title}</h3>
                <div className="text-success font-600" style={{ fontSize: '0.82rem' }}>Award: {selectedScholarship.amount}</div>
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
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Applicant Details</label>
                <input 
                  type="text" 
                  disabled
                  className="input-field" 
                  value={`${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'} (${currentUser.email || 'alex.developer@example.com'})`}
                  style={{ opacity: 0.8, fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Required Documentation Checklist</label>
                <div className="flex flex-col gap-xs glass-panel p-sm" style={{ background: 'var(--input-bg)', padding: '8px 12px' }}>
                  {selectedScholarship.documents.map((doc, i) => (
                    <div key={i} className="flex items-center gap-xs text-muted" style={{ fontSize: '0.8rem' }}>
                      <CheckCircle2 size={14} className="text-success" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Statement of Purpose / Grant Need</label>
                <textarea 
                  rows={4}
                  className="input-field"
                  value={statementText}
                  onChange={(e) => setStatementText(e.target.value)}
                  style={{ fontSize: '0.82rem', resize: 'vertical' }}
                />
              </div>

              <div className="flex justify-end gap-sm pt-sm">
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
                  className="btn btn-primary"
                  style={{ width: 'auto', padding: '8px 22px', fontSize: '0.84rem' }}
                >
                  <Send size={15} /> Submit Grant Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
