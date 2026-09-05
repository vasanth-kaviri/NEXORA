import { useState, useEffect } from 'react';
import { 
  GraduationCap, MapPin, Star, Search, Filter, Globe, Building2, 
  BookOpen, ExternalLink, X, Award, DollarSign, Calendar, ChevronRight, CheckCircle2 
} from 'lucide-react';
import db from '../services/db';

export default function Colleges() {
  const currentUser = db.getCurrentUser() || {};

  // Determine initial tier based on user's education string
  const userEduString = (currentUser.education || '').toLowerCase();
  let defaultTier = 'undergrad';
  if (userEduString.includes('10th') || userEduString.includes('matric') || userEduString.includes('secondary')) {
    defaultTier = '10th';
  } else if (userEduString.includes('12th') || userEduString.includes('inter') || userEduString.includes('high school')) {
    defaultTier = '12th';
  }

  const [activeTier, setActiveTier] = useState(defaultTier);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState(null);

  // 1. Colleges for 10th Class Students (Best Intermediate / Junior Colleges / PU Colleges)
  const tier10thColleges = [
    {
      id: 'inter_1',
      name: 'Sri Chaitanya / Narayana Premier Junior Science Academy',
      region: 'India',
      location: 'Hyderabad, Bangalore & Vijayawada, India',
      program: 'Intermediate MPC (Maths, Physics, Chemistry) + JEE Advanced Super-60',
      match: 97,
      rating: 4.8,
      admissions: 'Direct Entrance Exam & 10th GPA > 9.5',
      highlights: 'Produces top 100 All-India ranks in IIT JEE & BITSAT annually. Intensive coaching.',
      coaching: ['IIT JEE Advanced', 'BITSAT', 'KVPY / Olympiads'],
      fees: '₹1,50,000 – 2,20,000 / year (Hostel available)',
      deadline: 'April 30, 2027'
    },
    {
      id: 'inter_2',
      name: "St. Xavier's Junior College",
      region: 'India',
      location: 'Mumbai, Maharashtra, India',
      program: 'Higher Secondary Certificate (HSC) Science & Electronics',
      match: 95,
      rating: 4.9,
      admissions: 'Merit List Cutoff: 94%+ in 10th Board (ICSE / CBSE / State)',
      highlights: 'Historic premier institution with state-of-the-art physics, chemistry, and computing laboratories.',
      coaching: ['MHT-CET', 'JEE Main', 'NEET / Medical Prep'],
      fees: '₹15,000 / year (Government Aided)',
      deadline: 'June 15, 2027'
    },
    {
      id: 'inter_3',
      name: 'Delhi Public School (R.K. Puram)',
      region: 'India',
      location: 'New Delhi, India',
      program: 'CBSE Senior Secondary Science (PCM + Computer Science & AI)',
      match: 94,
      rating: 4.9,
      admissions: '10th Board Exam 92%+ & Aptitude Written Test',
      highlights: 'Nationally recognized for robotics clubs, international Olympiad medalists, and global college placements.',
      coaching: ['JEE Main / Advanced', 'SAT Prep', 'National Science Olympiads'],
      fees: '₹1,80,000 / year',
      deadline: 'May 10, 2027'
    },
    {
      id: 'inter_4',
      name: 'Bishop Cotton Pre-University College',
      region: 'India',
      location: 'Bangalore, Karnataka, India',
      program: 'Karnataka PU Board: PCMC (Physics, Chem, Math, Computer Science)',
      match: 92,
      rating: 4.7,
      admissions: '10th Marks Cutoff: 88%+',
      highlights: 'Prestigious legacy with high admission rates to NIT Surathkal, BITS, and Bangalore tech colleges.',
      coaching: ['KCET Engineering', 'JEE Main', 'COMEDK'],
      fees: '₹95,000 / year',
      deadline: 'May 25, 2027'
    },
    {
      id: 'inter_5',
      name: 'Pace Junior Science College',
      region: 'India',
      location: 'Mumbai & Pune, India',
      program: 'Integrated HSC Science & Computer Engineering Track',
      match: 91,
      rating: 4.6,
      admissions: 'Pace Admission Cum Scholarship Test (ACE)',
      highlights: 'Synchronized college curriculum with competitive engineering entrance syllabus.',
      coaching: ['JEE Advanced', 'BITSAT', 'IISER Aptitude'],
      fees: '₹2,10,000 / year',
      deadline: 'May 30, 2027'
    },
    {
      id: 'inter_6',
      name: 'United World College (Mahindra UWC of India)',
      region: 'Global',
      location: 'Pune, India (Residential International Campus)',
      program: 'International Baccalaureate (IB) Diploma in Higher STEM & Computing',
      match: 93,
      rating: 4.9,
      admissions: 'Holistic National Selection Committee (10th + Interviews)',
      highlights: 'Global student body representing 80+ nations. Direct feeder into Ivy League, MIT, and Oxford.',
      coaching: ['IB Higher Level Math & Physics', 'SAT / ACT', 'Global University Admissions'],
      fees: 'Need-based full scholarships available',
      deadline: 'Jan 15, 2027'
    }
  ];

  // 2. Colleges for 12th Class Students (Top Undergraduate Engineering Colleges & Universities)
  const tier12thColleges = [
    {
      id: 'ug_1',
      name: 'IIT Bombay & IIT Delhi',
      region: 'India',
      location: 'Mumbai & New Delhi, India',
      program: 'B.Tech in Computer Science & Engineering / AI & Data',
      match: 99,
      rating: 5.0,
      admissions: 'JEE Advanced Rank < 150',
      highlights: 'India’s top engineering institutes. 100% placement record with ₹25–45 LPA domestic median and $150k+ global packages.',
      coaching: ['World-Class Research Labs', 'Incubator & Startups', 'Fortune 500 Recruiting'],
      fees: '₹2,20,000 / year (Fee waivers for need-based)',
      deadline: 'JoSAA Counseling June 2027'
    },
    {
      id: 'ug_2',
      name: 'BITS Pilani (Pilani, Goa, Hyderabad Campuses)',
      region: 'India',
      location: 'Pilani, Rajasthan & Hyderabad, India',
      program: 'B.E. in Computer Science & MSc Data Science Dual Degree',
      match: 97,
      rating: 4.9,
      admissions: 'BITSAT Score: 320+ / 390',
      highlights: 'Zero attendance policy encouraging self-learning, exceptional Practice School (PS-II) mandatory 6-month corporate internships.',
      coaching: ['Direct MNC Placements', 'Global Alumni Network', 'Startup Sandbox'],
      fees: '₹5,40,000 / year (Merit-cum-Means scholarships available)',
      deadline: 'May 15, 2027'
    },
    {
      id: 'ug_3',
      name: 'IIIT Hyderabad (International Institute of Information Technology)',
      region: 'India',
      location: 'Hyderabad, Telangana, India',
      program: 'B.Tech + MS by Research in Computer Science & Computational Linguistics',
      match: 98,
      rating: 4.9,
      admissions: 'JEE Main (99.8%+ percentile) or UGEE Research Entrance',
      highlights: 'Unmatched coding culture. Consistently ranks top in ACM ICPC World Finals and machine learning research.',
      coaching: ['Kohli Centre on Intelligent Systems', 'Deep Learning Labs', 'Top Product Companies'],
      fees: '₹3,80,000 / year',
      deadline: 'March 31, 2027'
    },
    {
      id: 'ug_4',
      name: 'Massachusetts Institute of Technology (MIT)',
      region: 'North America',
      location: 'Cambridge, MA, USA',
      program: 'Bachelor of Science in Electrical Engineering & Computer Science (EECS)',
      match: 98,
      rating: 5.0,
      admissions: 'Holistic Admissions: SAT 1540+, Olympiads, Exceptional Projects',
      highlights: 'World’s premier technology university. Birthplace of the internet, modern algorithms, and AI breakthroughs.',
      coaching: ['UROP Undergraduate Research', 'Silicon Valley Direct Recruiting'],
      fees: 'Full need-blind financial aid meets 100% demonstrated need',
      deadline: 'Jan 05, 2027'
    },
    {
      id: 'ug_5',
      name: 'University of California, Berkeley',
      region: 'North America',
      location: 'Berkeley, CA, USA',
      program: 'BS in Electrical Engineering & Computer Sciences (EECS) / Data Science',
      match: 96,
      rating: 4.9,
      admissions: 'UC Application (Top 1% GPA + Essays)',
      highlights: 'Located adjacent to Silicon Valley. Home to the legendary RISELab and Apache Spark creators.',
      coaching: ['Direct Access to Silicon Valley Tech Giants', 'Bears Startup Garage'],
      fees: '$48,000 / year (Out-of-state)',
      deadline: 'Nov 30, 2026'
    },
    {
      id: 'ug_6',
      name: 'National University of Singapore (NUS)',
      region: 'Asia',
      location: 'Kent Ridge, Singapore',
      program: 'Bachelor of Computing in Computer Science (Artificial Intelligence Track)',
      match: 95,
      rating: 4.9,
      admissions: 'Class 12 Boards 95%+ or JEE Advanced Top Rankers',
      highlights: 'Ranked #1 in Asia for Computing. Singapore Government Tuition Grant covers up to 50% tuition.',
      coaching: ['NUS Overseas Colleges (Silicon Valley / Tel Aviv)', 'Tech MNC Feeder'],
      fees: 'SGD 17,500 / year (With MOE Tuition Grant)',
      deadline: 'Feb 28, 2027'
    },
    {
      id: 'ug_7',
      name: 'University of Waterloo',
      region: 'North America',
      location: 'Waterloo, Ontario, Canada',
      program: 'Bachelor of Computer Science (BCS) with Co-op System',
      match: 95,
      rating: 4.8,
      admissions: 'Class 12 Marks 93%+ & Euclid Mathematics Contest',
      highlights: 'World-famous Co-op program guarantees 24 months of paid engineering work experience at Google, Apple, and Bloomberg.',
      coaching: ['Earn $85,000+ CAD during co-op semesters', 'Direct Post-Graduation Work Permit'],
      fees: '$58,000 CAD / year',
      deadline: 'Feb 01, 2027'
    }
  ];

  // 3. Colleges for Undergraduates / Graduates (Top Global Universities for Higher Studies - MS / PhD / MTech)
  const tierUndergradColleges = [
    {
      id: 'grad_1',
      name: 'Stanford University',
      region: 'North America',
      location: 'Stanford, CA, USA',
      program: 'Master of Science (MS) in Computer Science (AI & Systems Specializations)',
      match: 99,
      rating: 5.0,
      admissions: 'GRE (Optional / 325+), TOEFL 100+, 3 Strong Academic Recommendations',
      highlights: 'The epicenter of Silicon Valley venture capital and generative AI innovation. World-renowned faculty.',
      coaching: ['Silicon Valley Career Fairs', 'Stanford AI Lab (SAIL)', 'Research Assistantships (RA/TA)'],
      fees: '$62,000 / year (Full RA/TA funding available)',
      deadline: 'Dec 01, 2026'
    },
    {
      id: 'grad_2',
      name: 'Carnegie Mellon University (CMU)',
      region: 'North America',
      location: 'Pittsburgh, PA, USA',
      program: 'Master of Science in Computational Data Science (MCDS) & MS CS',
      match: 98,
      rating: 5.0,
      admissions: 'Top 5% Undergrad GPA, Strong Coding Portfolio, GRE Quant 168+',
      highlights: 'Ranked #1 globally for Computer Science, Machine Learning, and Software Engineering.',
      coaching: ['Language Technologies Institute', 'Robotics Institute', 'Top MNC High-Frequency Trading'],
      fees: '$56,000 / year',
      deadline: 'Dec 12, 2026'
    },
    {
      id: 'grad_3',
      name: 'ETH Zurich (Swiss Federal Institute of Technology)',
      region: 'Europe',
      location: 'Zurich, Switzerland',
      program: 'Master in Computer Science (Data Management & Machine Intelligence)',
      match: 97,
      rating: 4.9,
      admissions: 'Bachelor in CS with high math rigor, GRE Quant 165+',
      highlights: 'Albert Einstein’s alma mater. World #1 outside the US for computer science. Zero tuition fees for international students.',
      coaching: ['Max Planck Institute Collaboration', 'Google Zurich AI Campus Link', 'World-Class HPC Clusters'],
      fees: 'CHF 1,460 / year (~₹1,35,000 INR total tuition)',
      deadline: 'Dec 15, 2026'
    },
    {
      id: 'grad_4',
      name: 'Technical University of Munich (TUM)',
      region: 'Europe',
      location: 'Munich, Bavaria, Germany',
      program: 'Master of Science in Informatics / Robotics & Cognition (English Taught)',
      match: 94,
      rating: 4.8,
      admissions: 'GATE score or TUM Aptitude Assessment, ECTS credit mapping',
      highlights: 'Germany’s top engineering university. Direct access to Munich high-tech corridor (BMW, Siemens, Google Germany).',
      coaching: ['18-Month Post-Study Work Visa in Germany', 'Industry Collaboration Labs'],
      fees: '€4,000 / semester (Low living cost compared to US)',
      deadline: 'Jan 15, 2027'
    },
    {
      id: 'grad_5',
      name: 'University of Oxford',
      region: 'Europe',
      location: 'Oxford, United Kingdom',
      program: 'MSc in Advanced Computer Science',
      match: 96,
      rating: 4.9,
      admissions: 'First-Class Bachelor Degree, IELTS 7.5+ or TOEFL 110+',
      highlights: 'Prestigious 1-year intensive master’s program combining mathematical theory with quantum computing and AI verification.',
      coaching: ['Oxford Foundry Incubator', 'Chevening & Rhodes Scholarships Eligible'],
      fees: '£39,000 / year (Full scholarships available)',
      deadline: 'Jan 20, 2027'
    },
    {
      id: 'grad_6',
      name: 'Indian Institute of Science (IISc Bangalore)',
      region: 'India',
      location: 'Bangalore, Karnataka, India',
      program: 'M.Tech in Artificial Intelligence & Computational and Data Sciences (CDS)',
      match: 98,
      rating: 5.0,
      admissions: 'GATE CS / DA Score > 800 + Technical Interview',
      highlights: 'India’s premier scientific research institute. Highest research output per faculty in Asia.',
      coaching: ['Full MHRD Monthly Fellowship (₹12,400/mo)', 'Global University PhD Placements'],
      fees: '₹35,000 / year (Fully government funded)',
      deadline: 'March 25, 2027'
    }
  ];

  // Select active pool based on tier
  const activePool = 
    activeTier === '10th' ? tier10thColleges :
    activeTier === '12th' ? tier12thColleges : tierUndergradColleges;

  // Filter logic
  const filteredColleges = activePool.filter(col => {
    const matchesSearch = 
      col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.program.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeRegion === 'india') return col.region === 'India';
    if (activeRegion === 'us') return col.region === 'North America';
    if (activeRegion === 'europe') return col.region === 'Europe';
    if (activeRegion === 'global') return col.region !== 'India';

    return true;
  });

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
            <Globe size={15} /> GLOBAL ACADEMIC NAVIGATION DIRECTORY
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Best Colleges & Universities Worldwide
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Intelligently segmented by your educational status: 10th graduates, 12th graduates, and Undergraduates.
          </p>
        </div>
      </header>

      {/* 3-Tier Educational Level Switcher */}
      <div className="glass-panel p-sm flex flex-col sm:flex-row gap-xs" style={{ background: 'var(--bg-card)' }}>
        {[
          { key: '10th', label: '1. Completed 10th / Secondary', sub: 'Best Intermediate & Junior Colleges' },
          { key: '12th', label: '2. Completed 12th / High School', sub: 'Top Undergrad B.Tech & Engineering' },
          { key: 'undergrad', label: '3. Completed Undergrad / Degree', sub: 'Top Global Universities for Higher Studies (MS/PhD)' }
        ].map(tier => (
          <button
            key={tier.key}
            onClick={() => setActiveTier(tier.key)}
            className="flex-1 flex flex-col items-start p-sm"
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTier === tier.key ? 'var(--primary)' : 'transparent',
              color: activeTier === tier.key ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{tier.label}</span>
            <span style={{ fontSize: '0.74rem', opacity: 0.85, marginTop: '2px' }}>{tier.sub}</span>
          </button>
        ))}
      </div>

      {/* Search & Region Filters */}
      <div className="flex flex-col md:flex-row gap-md items-center justify-between">
        <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
          <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 14 }} />
          <input 
            type="text" 
            className="input-field w-full"
            placeholder="Search institution by name, city, or curriculum..."
            style={{ paddingLeft: '2.6rem', fontSize: '0.88rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-xs overflow-x-auto w-full md:w-auto pb-xs">
          {[
            { key: 'all', label: `All Regions (${activePool.length})` },
            { key: 'india', label: 'India & South Asia' },
            { key: 'us', label: 'North America (USA/Canada)' },
            { key: 'europe', label: 'Europe & UK' },
            { key: 'global', label: 'International Only' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveRegion(tab.key)}
              className="skeuo-pill"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeRegion === tab.key ? 'var(--primary)' : 'var(--card-bg)',
                color: activeRegion === tab.key ? '#fff' : 'var(--text-muted)',
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

      {/* College Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {filteredColleges.map((col) => (
          <div
            key={col.id}
            onClick={() => setSelectedCollege(col)}
            className="glass-panel interactive flex flex-col justify-between cursor-pointer"
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
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{col.name}</h3>
                    <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                      <MapPin size={12} /> {col.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-xs text-warning font-700" style={{ fontSize: '0.88rem' }}>
                  <Star size={14} fill="currentColor" /> {col.rating} ({col.match}% Match)
                </div>
              </div>

              {/* Program Pill */}
              <div style={{ padding: '8px 12px', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', margin: '0.6rem 0' }}>
                <strong style={{ color: 'var(--primary)' }}>Specialization:</strong> {col.program}
              </div>

              <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                {col.highlights}
              </p>

              {/* Key Highlights */}
              <div className="flex flex-col gap-xs mt-sm text-muted" style={{ fontSize: '0.8rem' }}>
                <div><strong>Admission Benchmark:</strong> {col.admissions}</div>
                <div><strong>Tuition & Aid:</strong> {col.fees}</div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex justify-between items-center pt-md mt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span className="text-muted flex items-center gap-xs" style={{ fontSize: '0.78rem' }}>
                <Calendar size={13} /> Next Intake: {col.deadline}
              </span>

              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCollege(col);
                }}
                style={{ padding: '6px 14px', fontSize: '0.82rem', width: 'auto' }}
              >
                Admission Guide
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* College Admission Guide Modal */}
      {selectedCollege && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedCollege(null)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-xl w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="text-primary font-600" style={{ fontSize: '0.78rem' }}>INSTITUTIONAL ADMISSION DOSSIER</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedCollege.name}</h3>
                <div className="text-muted" style={{ fontSize: '0.82rem' }}>{selectedCollege.location}</div>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setSelectedCollege(null)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-md py-xs">
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Recommended Program</h4>
                <div className="glass-panel p-sm" style={{ background: 'var(--input-bg)', fontSize: '0.85rem' }}>
                  {selectedCollege.program}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Admission Eligibility & Cutoffs</h4>
                <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {selectedCollege.admissions}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>Focus Areas & Exam Preparation</h4>
                <div className="flex flex-wrap gap-xs">
                  {selectedCollege.coaching.map((c, i) => (
                    <span key={i} className="badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', padding: '4px 10px', fontSize: '0.78rem' }}>
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Financial Investment & Scholarships</h4>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{selectedCollege.fees}</p>
              </div>
            </div>

            <div className="flex justify-end pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setSelectedCollege(null)}
                style={{ width: 'auto', padding: '8px 24px', fontSize: '0.85rem' }}
              >
                Close Admission Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
