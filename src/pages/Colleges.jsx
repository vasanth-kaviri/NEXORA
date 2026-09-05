import { useState, useEffect } from 'react';
import { 
  GraduationCap, MapPin, Star, Search, Filter, Globe, Building2, 
  BookOpen, ExternalLink, X, Award, DollarSign, Calendar, ChevronRight, CheckCircle2,
  Compass, ShieldCheck, School, Library
} from 'lucide-react';
import db from '../services/db';

export default function Colleges() {
  const currentUser = db.getCurrentUser() || {};

  // Education Tiers: 10th, 12th, Undergrad, Postgrad
  const educationTiers = [
    {
      key: '10th',
      step: '01',
      icon: School,
      label: '10th Class / Secondary',
      sub: 'Top Junior Colleges, PU, & Senior Secondary Academies'
    },
    {
      key: '12th',
      step: '02',
      icon: Building2,
      label: '12th Class / Senior Secondary',
      sub: 'Premier B.Tech, BS, & Undergrad Engineering Institutes'
    },
    {
      key: 'undergrad',
      step: '03',
      icon: GraduationCap,
      label: 'Undergraduate Degree',
      sub: 'Top Global Master’s, MS, & M.Tech Universities'
    },
    {
      key: 'postgrad',
      step: '04',
      icon: Library,
      label: 'Postgraduate & Doctoral',
      sub: 'PhD Programs & Global Centers of Research Excellence'
    }
  ];

  // Determine initial tier based on user's education string
  const userEduString = (currentUser.education || '').toLowerCase();
  let defaultTier = '12th';
  if (userEduString.includes('10th') || userEduString.includes('matric') || userEduString.includes('secondary')) {
    defaultTier = '10th';
  } else if (userEduString.includes('bachelor') || userEduString.includes('undergrad') || userEduString.includes('b.tech') || userEduString.includes('b.s')) {
    defaultTier = 'undergrad';
  } else if (userEduString.includes('master') || userEduString.includes('phd') || userEduString.includes('postgrad')) {
    defaultTier = 'postgrad';
  }

  const [activeTier, setActiveTier] = useState(defaultTier);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState(null);

  // 10 Global Regions
  const globalRegions = [
    { key: 'all', label: 'All Regions (Global)' },
    { key: 'india', label: 'India & South Asia' },
    { key: 'north_america', label: 'North America (USA & Canada)' },
    { key: 'uk', label: 'United Kingdom' },
    { key: 'europe', label: 'European Union (Germany, Switzerland)' },
    { key: 'east_asia', label: 'East Asia & Singapore' },
    { key: 'australia', label: 'Australia & New Zealand' },
    { key: 'middle_east', label: 'Middle East & North Africa' },
    { key: 'latin_america', label: 'Latin America' },
    { key: 'africa', label: 'Africa' }
  ];

  // Tier 1: 10th Grade / Secondary (Junior Colleges / PU Academies)
  const tier10thColleges = [
    {
      id: 'inter_1',
      name: 'Sri Chaitanya & Narayana Premier Science Academy',
      region: 'india',
      location: 'Hyderabad, Bangalore & Vijayawada, India',
      accreditation: 'Telangana & AP State Board / CBSE Certified',
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
      region: 'india',
      location: 'Mumbai, Maharashtra, India',
      accreditation: 'Maharashtra State Board NAAC A+',
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
      region: 'india',
      location: 'New Delhi, India',
      accreditation: 'CBSE Accredited Center of Excellence',
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
      region: 'india',
      location: 'Bangalore, Karnataka, India',
      accreditation: 'Karnataka PU Board Accredited',
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
      name: 'Phillips Exeter Academy',
      region: 'north_america',
      location: 'Exeter, New Hampshire, USA',
      accreditation: 'NEASC Accredited Prep Institution',
      program: 'Advanced STEM & High School Diploma (Harkness Method)',
      match: 96,
      rating: 5.0,
      admissions: 'SSAT Exam, Rigorous Transcripts, & Admissions Interview',
      highlights: 'One of the top secondary academies globally; feeds over 30% of graduating seniors into Ivy League, MIT, and Stanford.',
      coaching: ['AP Computer Science A', 'Multivariable Calculus', 'Olympiad Math'],
      fees: '$60,000 / year (Generous need-blind financial aid)',
      deadline: 'Jan 15, 2027'
    },
    {
      id: 'inter_6',
      name: 'United World College (Mahindra UWC of India)',
      region: 'india',
      location: 'Pune, India (Residential International Campus)',
      accreditation: 'International Baccalaureate (IB) World School',
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

  // Tier 2: 12th Grade / Senior Secondary (Undergraduate Engineering & Tech Colleges)
  const tier12thColleges = [
    {
      id: 'ug_1',
      name: 'IIT Bombay & IIT Delhi',
      region: 'india',
      location: 'Mumbai & New Delhi, India',
      accreditation: 'Institute of Eminence • NAAC A++',
      program: 'B.Tech in Computer Science & Engineering / AI & Data',
      match: 99,
      rating: 4.9,
      admissions: 'JEE Advanced Rank: Top 100 - 500 All-India',
      highlights: 'India’s foremost tech institutions. Median CSE domestic package: ₹32 LPA; International: $150k+ USD.',
      coaching: ['T-Hub / SINE Incubator', 'Direct recruitment by Google, Microsoft, Uber, Apple'],
      fees: '₹2,50,000 / year (Full waiver for low income)',
      deadline: 'June 2027 (JoSAA)'
    },
    {
      id: 'ug_2',
      name: 'BITS Pilani (Pilani, Goa, Hyderabad)',
      region: 'india',
      location: 'Rajasthan, Goa & Hyderabad, India',
      accreditation: 'Institute of Eminence • NAAC A (3.71)',
      program: 'B.E. (Hons) in Computer Science / Electronics',
      match: 97,
      rating: 4.8,
      admissions: 'BITSAT Score: 325+ / 390',
      highlights: 'Zero attendance policy promotes startup ventures. World-class alumni network (Founders of Swiggy, Postman, BigBasket).',
      coaching: ['Practice School (PS-II) 6-month paid corporate internship', 'BITS Spark Angel Fund'],
      fees: '₹5,50,000 / year',
      deadline: 'June 2027'
    },
    {
      id: 'ug_3',
      name: 'Massachusetts Institute of Technology (MIT)',
      region: 'north_america',
      location: 'Cambridge, MA, USA',
      accreditation: 'ABET Accredited • QS World #1',
      program: 'Bachelor of Science (SB) in Computer Science & Molecular Engineering',
      match: 98,
      rating: 5.0,
      admissions: 'Class 12 Boards 95%+ / SAT 1540+ & Extracurricular Leadership',
      highlights: 'World’s #1 engineering institute. 100% need-blind financial aid meets full demonstrated financial need.',
      coaching: ['Undergraduate Research Opportunities Program (UROP)', 'Martin Trust Center for Entrepreneurship'],
      fees: '$60,150 / year (Full aid available for families < $140k)',
      deadline: 'Jan 01, 2027'
    },
    {
      id: 'ug_4',
      name: 'University of Cambridge & Oxford',
      region: 'uk',
      location: 'Cambridge & Oxford, United Kingdom',
      accreditation: 'UK Royal Charter • Times Higher Ed Top 3',
      program: 'BA / MEng in Computer Science (Tripos)',
      match: 97,
      rating: 4.9,
      admissions: 'A*A*A in A-Levels / Class 12 Boards 95%+ & TMUA entrance exam',
      highlights: 'One-on-one weekly tutorial supervision system with world authority fellows.',
      coaching: ['Silicon Fen Tech Cluster', 'Cambridge Enterprise Fund'],
      fees: '£37,293 / year (International)',
      deadline: 'Oct 15, 2026'
    },
    {
      id: 'ug_5',
      name: 'National University of Singapore (NUS)',
      region: 'east_asia',
      location: 'Kent Ridge, Singapore',
      accreditation: 'QS Asia #1 • Ministry of Education Certified',
      program: 'Bachelor of Computing in Computer Science (AI Track)',
      match: 96,
      rating: 4.9,
      admissions: 'Class 12 Boards 95%+ or JEE Advanced Top Rankers',
      highlights: 'Ranked #1 in Asia for Computing. Singapore Government Tuition Grant covers up to 50% tuition.',
      coaching: ['NUS Overseas Colleges (Silicon Valley / Tel Aviv)', 'Tech MNC Feeder'],
      fees: 'SGD 17,500 / year (With MOE Tuition Grant)',
      deadline: 'Feb 28, 2027'
    },
    {
      id: 'ug_6',
      name: 'University of Waterloo',
      region: 'north_america',
      location: 'Waterloo, Ontario, Canada',
      accreditation: 'CEAB Certified • Canadian Top Co-op',
      program: 'Bachelor of Computer Science (BCS) with Co-op System',
      match: 95,
      rating: 4.8,
      admissions: 'Class 12 Marks 93%+ & Euclid Mathematics Contest',
      highlights: 'World-famous Co-op program guarantees 24 months of paid engineering work experience at Google, Apple, and Bloomberg.',
      coaching: ['Earn $85,000+ CAD during co-op semesters', 'Direct Post-Graduation Work Permit'],
      fees: '$58,000 CAD / year',
      deadline: 'Feb 01, 2027'
    },
    {
      id: 'ug_7',
      name: 'ETH Zurich (Swiss Federal Institute of Technology)',
      region: 'europe',
      location: 'Zurich, Switzerland',
      accreditation: 'European Excellence Center • QS World #7',
      program: 'Bachelor of Science in Computer Science (Informatik)',
      match: 95,
      rating: 4.9,
      admissions: 'Direct Entrance Exam or Swiss Matura / Class 12 Boards 92%+',
      highlights: 'Albert Einstein’s alma mater. Exceptionally low tuition fees with Europe’s highest research output.',
      coaching: ['Direct partnership with Google Zurich Engineering HQ', 'Max Planck Institute'],
      fees: 'CHF 1,460 / year (Ultra Affordable)',
      deadline: 'April 30, 2027'
    },
    {
      id: 'ug_8',
      name: 'University of Melbourne',
      region: 'australia',
      location: 'Melbourne, Victoria, Australia',
      accreditation: 'Group of Eight (Go8) • TEQSA Certified',
      program: 'Bachelor of Science (Computing and Software Systems)',
      match: 93,
      rating: 4.7,
      admissions: 'Class 12 Boards 88%+ / ATAR 90.00',
      highlights: 'Ranked #1 in Australia for computer science. Fast-track pathway into Master of Engineering.',
      coaching: ['Melbourne Accelerator Program (MAP)', 'Australian Tech Hub'],
      fees: '$48,500 AUD / year',
      deadline: 'Nov 30, 2026'
    }
  ];

  // Tier 3: Undergraduate Degree (Top Global Universities for Higher Studies - MS / PhD / MTech)
  const tierUndergradColleges = [
    {
      id: 'grad_1',
      name: 'Stanford University',
      region: 'north_america',
      location: 'Stanford, California, USA',
      accreditation: 'WASC Accredited • QS World #2',
      program: 'M.S. in Computer Science (Artificial Intelligence / Systems)',
      match: 98,
      rating: 5.0,
      admissions: 'UG CGPA > 3.8 / 10.0, GRE Quantitative 168+, 3 Strong LoRs, Top Projects',
      highlights: 'Located in the heart of Silicon Valley. Birthplace of Google, Cisco, and NVIDIA.',
      coaching: ['Stanford AI Lab (SAIL)', 'StartX Startup Accelerator'],
      fees: '$58,740 / year',
      deadline: 'Dec 06, 2026'
    },
    {
      id: 'grad_2',
      name: 'Carnegie Mellon University (CMU)',
      region: 'north_america',
      location: 'Pittsburgh, PA, USA',
      accreditation: 'MSCHE Certified • #1 School of Computer Science',
      program: 'Master of Science in Computer Science (MSCS) & Software Engineering',
      match: 99,
      rating: 5.0,
      admissions: 'UG GPA > 3.85, Rigorous Math/Algorithms background',
      highlights: 'Ranked #1 globally in Software Engineering and Artificial Intelligence.',
      coaching: ['Robotics Institute', 'Software Engineering Institute (SEI)'],
      fees: '$54,000 / year',
      deadline: 'Dec 12, 2026'
    },
    {
      id: 'grad_3',
      name: 'Indian Institute of Science (IISc Bangalore)',
      region: 'india',
      location: 'Bangalore, Karnataka, India',
      accreditation: 'Institute of Eminence • NIRF #1 Overall in India',
      program: 'M.Tech in Artificial Intelligence / Computer Science & Automation',
      match: 96,
      rating: 4.9,
      admissions: 'GATE CS Score > 850 + Technical Interview',
      highlights: 'India’s premier postgraduate research institution. Full monthly MHRD stipend of ₹12,400 provided to all students.',
      coaching: ['Kotak-IISc AI-ML Center', 'Direct PhD fast-track at top global labs'],
      fees: '₹45,000 / year (Fully funded with stipend)',
      deadline: 'April 15, 2027'
    },
    {
      id: 'grad_4',
      name: 'Technical University of Munich (TUM)',
      region: 'europe',
      location: 'Munich, Bavaria, Germany',
      accreditation: 'German Universities of Excellence • European Top 5',
      program: 'M.Sc. in Informatics & Data Engineering',
      match: 94,
      rating: 4.8,
      admissions: 'B.Tech in CS with 8.0+ CGPA / ECTS credit matching & Aptitude Assessment',
      highlights: 'Tuition-free high quality German education. Close ties with BMW, Siemens, and Google Munich.',
      coaching: ['UnternehmerTUM (Europe’s #1 university tech incubator)', '18-Month Post-Study Work Visa'],
      fees: '€150 / semester administrative fee (Zero tuition)',
      deadline: 'May 31, 2027'
    },
    {
      id: 'grad_5',
      name: 'King Abdullah University of Science and Technology (KAUST)',
      region: 'middle_east',
      location: 'Thuwal, Saudi Arabia',
      accreditation: 'World Recognized Research Institute',
      program: 'MS in Computer Science & Machine Learning',
      match: 93,
      rating: 4.8,
      admissions: 'High CGPA, GRE, & Research Aptitude',
      highlights: 'All admitted students receive the KAUST Fellowship: 100% full tuition waiver, free housing, and $20,000 - $30,000 annual cash stipend.',
      coaching: ['Shaheen Supercomputing Laboratory', 'High-Impact Research Fellowships'],
      fees: '100% Fully Funded Fellowship',
      deadline: 'Jan 10, 2027'
    }
  ];

  // Tier 4: Postgraduate & Doctoral (PhD / Research Centers)
  const tierPostgradColleges = [
    {
      id: 'phd_1',
      name: 'University of California, Berkeley',
      region: 'north_america',
      location: 'Berkeley, California, USA',
      accreditation: 'WASC Accredited • World Research Powerhouse',
      program: 'Ph.D. in Computer Science (EECS) - Distributed Systems & AI',
      match: 98,
      rating: 5.0,
      admissions: 'Exceptional publications, GRE, 3 Top Academic Letters',
      highlights: 'Home to RISELab and creators of Apache Spark, Ray, and Berkeley RISC-V. 100% fully funded PhD positions with stipend.',
      coaching: ['Direct collaboration with Silicon Valley research labs', 'Full tuition + $42,000 stipend'],
      fees: 'Fully Funded Graduate Fellowship',
      deadline: 'Dec 01, 2026'
    },
    {
      id: 'phd_2',
      name: 'University of Tokyo & KAIST',
      region: 'east_asia',
      location: 'Tokyo, Japan & Daejeon, South Korea',
      accreditation: 'National Centers of Academic Excellence',
      program: 'Doctoral Program in Computational Intelligence & Robotics',
      match: 94,
      rating: 4.8,
      admissions: 'Master’s Thesis, Research Proposal, MEXT / Global Korea Scholarship',
      highlights: 'Asia’s premier hardware-software co-design and humanoid robotics laboratories.',
      coaching: ['MEXT Government Fellowship', 'RIKEN Center for Advanced Intelligence Project'],
      fees: 'Fully Funded with Government Stipend',
      deadline: 'Nov 15, 2026'
    }
  ];

  // Select active pool based on tier
  let activePool = tier12thColleges;
  if (activeTier === '10th') activePool = tier10thColleges;
  else if (activeTier === 'undergrad') activePool = tierUndergradColleges;
  else if (activeTier === 'postgrad') activePool = tierPostgradColleges;

  // Filter by Region and Search
  const filteredColleges = activePool.filter(college => {
    if (activeRegion !== 'all' && college.region !== activeRegion) {
      return false;
    }
    const query = searchQuery.toLowerCase();
    return (
      college.name.toLowerCase().includes(query) ||
      college.location.toLowerCase().includes(query) ||
      college.program.toLowerCase().includes(query)
    );
  });

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ paddingBottom: '5rem' }}>

      {/* ── Center Header ── */}
      <header className="flex flex-col items-center text-center justify-center gap-xs" style={{ margin: '0 auto', maxWidth: '720px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>
          <GraduationCap size={14} /> CERTIFIED GLOBAL ADMISSIONS & COUNSELING
        </div>
        <h1 className="text-gradient" style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px', lineHeight: 1.2 }}>
          Top Certified Colleges & Higher Ed
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '600px' }}>
          Explore accredited educational institutions worldwide tailored to your current educational level, from 10th secondary academies to top global doctoral centers.
        </p>
      </header>

      {/* ── Modernized 4-Stage Educational Level Stepper ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {educationTiers.map((tier) => {
          const Icon = tier.icon;
          const isActive = activeTier === tier.key;
          return (
            <div
              key={tier.key}
              onClick={() => setActiveTier(tier.key)}
              className="glass-panel interactive flex flex-col justify-between cursor-pointer transition-all"
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.06))' : 'var(--card-bg)',
                boxShadow: isActive ? '0 0 20px rgba(99, 102, 241, 0.2)' : 'none'
              }}
            >
              <div>
                <div className="flex justify-between items-center mb-xs">
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                    LEVEL {tier.step}
                  </span>
                  <div style={{ padding: '6px', borderRadius: '8px', background: isActive ? 'var(--primary)' : 'var(--input-bg)', color: isActive ? '#fff' : 'var(--text-muted)' }}>
                    <Icon size={16} />
                  </div>
                </div>

                <h4 style={{ fontSize: '0.96rem', fontWeight: 800, margin: '4px 0', color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {tier.label}
                </h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {tier.sub}
                </p>
              </div>

              <div className="pt-xs mt-sm flex items-center justify-between" style={{ borderTop: '1px solid var(--border-color)', fontSize: '0.74rem' }}>
                <span className={isActive ? 'text-primary font-700' : 'text-muted'}>
                  {isActive ? '● Selected Track' : 'Switch Level'}
                </span>
                <ChevronRight size={13} className={isActive ? 'text-primary' : 'text-muted'} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Search Bar & 10 Global Regions Filter ── */}
      <div className="flex flex-col gap-sm">
        <div className="flex flex-col md:flex-row gap-md items-center justify-between">
          <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
            <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 14 }} />
            <input 
              type="text" 
              className="input-field w-full"
              placeholder="Search by institution name, city, program, or degree..."
              style={{ paddingLeft: '2.6rem', fontSize: '0.88rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <span className="badge glass-panel" style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.82rem' }}>
            {filteredColleges.length} Certified Institutions Available
          </span>
        </div>

        {/* Region Pills */}
        <div className="flex gap-xs overflow-x-auto w-full pb-xs">
          {globalRegions.map(reg => (
            <button
              key={reg.key}
              onClick={() => setActiveRegion(reg.key)}
              className="skeuo-pill shrink-0"
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: activeRegion === reg.key ? 'var(--primary)' : 'var(--card-bg)',
                color: activeRegion === reg.key ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer'
              }}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Institutions Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {filteredColleges.map((col) => (
          <div 
            key={col.id} 
            className="glass-panel interactive flex flex-col justify-between"
            style={{
              padding: '1.75rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)'
            }}
          >
            <div>
              <div className="flex justify-between items-start mb-sm">
                <div>
                  <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.74rem' }}>
                    <ShieldCheck size={14} /> {col.accreditation}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{col.name}</h3>
                  <span className="flex items-center gap-xs text-muted mt-xs" style={{ fontSize: '0.8rem' }}>
                    <MapPin size={13} /> {col.location}
                  </span>
                </div>

                <div className="flex items-center gap-xs bg-input px-2 py-1 rounded">
                  <Star size={14} className="text-warning fill-warning" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{col.rating}</span>
                </div>
              </div>

              {/* Program Overview */}
              <div className="glass-panel p-sm mb-sm" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-muted block font-600" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>Featured Program</span>
                <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>{col.program}</span>
              </div>

              {/* Admission Criteria & Highlights */}
              <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.55, marginBottom: '10px' }}>
                {col.highlights}
              </p>

              <div className="flex flex-col gap-xs text-muted mb-sm" style={{ fontSize: '0.8rem' }}>
                <div><strong>Admissions:</strong> {col.admissions}</div>
                <div><strong>Tuition / Funding:</strong> {col.fees}</div>
              </div>

              {/* Coaching / Focus Tags */}
              <div className="flex flex-wrap gap-xs mt-sm">
                {col.coaching.map((c, idx) => (
                  <span key={idx} className="badge" style={{ background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', fontSize: '0.72rem' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="flex justify-between items-center pt-md mt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
              <span className="text-muted" style={{ fontSize: '0.76rem' }}>
                Deadline: {col.deadline}
              </span>

              <button
                onClick={() => setSelectedCollege(col)}
                className="btn btn-primary flex items-center gap-xs"
                style={{ padding: '6px 16px', fontSize: '0.8rem', width: 'auto' }}
              >
                <span>View Details</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── DETAILS MODAL ── */}
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
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="badge text-primary font-700 mb-xs" style={{ background: 'rgba(99, 102, 241, 0.12)', fontSize: '0.72rem' }}>
                  CERTIFIED ADMISSIONS DOSSIER
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedCollege.name}</h3>
                <span className="text-muted" style={{ fontSize: '0.82rem' }}>{selectedCollege.location}</span>
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
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Accreditation & Quality Standing</label>
                <div className="glass-panel p-sm text-main font-600" style={{ background: 'var(--input-bg)', fontSize: '0.85rem' }}>
                  {selectedCollege.accreditation}
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Program & Curriculum</label>
                <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                  {selectedCollege.program}
                </p>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Admissions Cutoff & Criteria</label>
                <p className="text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                  {selectedCollege.admissions}
                </p>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Estimated Annual Tuition & Financial Aid</label>
                <p className="text-success font-700" style={{ fontSize: '0.88rem', margin: 0 }}>
                  {selectedCollege.fees}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-sm pt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setSelectedCollege(null)}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.84rem' }}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedCollege.name + ' official website')}`, '_blank');
                }}
                style={{ width: 'auto', padding: '8px 20px', fontSize: '0.84rem' }}
              >
                Visit Official Admissions Portal <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
