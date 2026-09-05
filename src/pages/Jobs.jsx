import { useState, useEffect } from 'react';
import { 
  Briefcase, Building, DollarSign, MapPin, Search, Filter, Bookmark, 
  BookmarkCheck, CheckCircle2, ArrowRight, ExternalLink, X, Sparkles, 
  Clock, ShieldCheck, FileText, Send, User, Mail, Phone, GraduationCap,
  Calendar, Check, AlertCircle, Eye, ChevronRight
} from 'lucide-react';
import db from '../services/db';

export default function Jobs() {
  const currentUser = db.getCurrentUser() || {};

  // 15+ Real-World Jobs and Internships from Leading MNCs & Tech Giants
  const allJobs = [
    {
      id: 'job_google_01',
      title: 'Software Engineering Intern - Cloud & Systems',
      company: 'Google',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=80',
      location: 'Bangalore, India & Mountain View, CA (Hybrid)',
      salary: '$45 - $55 / hr · ₹85,000 / mo',
      type: 'Internship',
      batch: '2026 Batch',
      match: 97,
      remote: false,
      deadline: 'Rolling Admission',
      tags: ['C++', 'Python', 'Distributed Systems', 'Kubernetes'],
      desc: 'Join Google Cloud engineering to build planetary-scale telemetry pipelines and container infrastructure. You will collaborate directly with senior staff engineers to write production code deployed across global datacenters.',
      responsibilities: [
        'Design and deploy scalable asynchronous APIs in Go and C++.',
        'Optimize multi-tenant database access patterns to eliminate network bottlenecks.',
        'Participate in design reviews and blameless post-mortems for distributed services.'
      ],
      requirements: [
        'Enrolled in BS/MS Computer Science or equivalent engineering degree.',
        'Experience with object-oriented programming, data structures, and algorithms.',
        'Familiarity with container concepts (Docker, Linux namespaces).'
      ]
    },
    {
      id: 'job_msft_02',
      title: 'Full-Stack Graduate Software Engineer',
      company: 'Microsoft',
      logo: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=80',
      location: 'Hyderabad, India & Redmond, WA',
      salary: '$120k – $145k · ₹18 – 24 LPA',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 95,
      remote: false,
      deadline: 'Oct 30, 2026',
      tags: ['React', 'TypeScript', 'C#', '.NET Core', 'Azure'],
      desc: 'Build customer-facing enterprise applications for Microsoft 365 and Azure Developer Platform. You will deliver high-framerate web interfaces and resilient backend microservices.',
      responsibilities: [
        'Build accessible React/TypeScript web experiences using Fluent UI design tokens.',
        'Develop secure REST and GraphQL services backed by Azure Cosmos DB.',
        'Maintain 99.99% service availability with automated health probes.'
      ],
      requirements: [
        'Strong knowledge of modern JavaScript/TypeScript and web development.',
        'Proficiency with relational and NoSQL databases.',
        'Solid understanding of Git, CI/CD pipelines, and unit testing.'
      ]
    },
    {
      id: 'job_amzn_03',
      title: 'Software Development Engineer I (AWS Core)',
      company: 'Amazon Web Services',
      logo: 'https://images.unsplash.com/photo-1523474253246-72fb9c27030d?auto=format&fit=crop&q=80&w=80',
      location: 'Seattle, WA & Bangalore, India',
      salary: '$135k – $160k · ₹22 – 30 LPA',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 94,
      remote: false,
      deadline: 'Nov 15, 2026',
      tags: ['Java', 'Distributed Systems', 'AWS Lambda', 'DynamoDB'],
      desc: 'Invent on behalf of millions of AWS customers. Build mission-critical cloud primitives powering modern internet applications with extreme durability and microsecond latencies.',
      responsibilities: [
        'Write highly testable, fault-tolerant Java code running on AWS infrastructure.',
        'Mitigate complex network partitions and state divergence in distributed storage engines.',
        'Take operational ownership of software services from deployment to live monitoring.'
      ],
      requirements: [
        'Bachelor’s in Computer Science or related STEM field graduating by Summer 2026.',
        'Deep understanding of concurrency, multithreading, and algorithmic complexity.',
        'Hands-on experience with cloud infrastructure or Linux systems.'
      ]
    },
    {
      id: 'job_meta_04',
      title: 'Frontend Engineer (UI Infrastructure)',
      company: 'Meta',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=80',
      location: 'Menlo Park, CA & Remote Eligible',
      salary: '$140k – $170k · ₹28 – 36 LPA',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 96,
      remote: true,
      deadline: 'Nov 01, 2026',
      tags: ['React', 'Relay', 'GraphQL', 'Web Performance'],
      desc: 'Help evolve the core React infrastructure and design systems powering Instagram, WhatsApp, and Facebook for 3 billion daily active people.',
      responsibilities: [
        'Design composable, zero-runtime CSS primitives and accessible UI widgets.',
        'Profile and reduce main-thread JavaScript execution latency and bundle sizes.',
        'Work cross-functionally with product design and accessibility specialists.'
      ],
      requirements: [
        'Exceptional command of modern JavaScript (ESNext), DOM APIs, and CSS architecture.',
        'Familiarity with AST transforms (Babel, SWC) and modern build tools.',
        'Passion for web accessibility (WCAG 2.1 AA) and responsive micro-interactions.'
      ]
    },
    {
      id: 'job_stripe_05',
      title: 'Backend Engineering Intern (Payments Core)',
      company: 'Stripe',
      logo: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&q=80&w=80',
      location: 'San Francisco, CA & Dublin, Ireland (Remote)',
      salary: '$58 / hr · ₹1,10,000 / mo',
      type: 'Internship',
      batch: '2026 Batch',
      match: 98,
      remote: true,
      deadline: 'Rolling Admission',
      tags: ['Ruby', 'Go', 'PostgreSQL', 'Idempotency', 'Kafka'],
      desc: 'Build the financial infrastructure that moves hundreds of billions of dollars each year. You will write code where correctness, idempotency, and auditability are paramount.',
      responsibilities: [
        'Design transactional financial ledgers resistant to duplicate requests.',
        'Implement resilient retry strategies and circuit breakers for global banking partners.',
        'Write developer documentation and public API SDK interfaces.'
      ],
      requirements: [
        'Proficiency in Ruby, Go, Python, or Java with strong OOP fundamentals.',
        'Understanding of database isolation levels and transactional integrity.',
        'Clear, empathetic written and verbal communication.'
      ]
    },
    {
      id: 'job_openai_06',
      title: 'AI Systems & Infrastructure Engineer',
      company: 'OpenAI',
      logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=80',
      location: 'San Francisco, CA (Onsite)',
      salary: '$180k – $220k + Equity',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 92,
      remote: false,
      deadline: 'Dec 15, 2026',
      tags: ['PyTorch', 'CUDA', 'Python', 'Distributed GPU Clusters'],
      desc: 'Scale high-throughput model inference infrastructure serving hundreds of millions of ChatGPT queries daily across tens of thousands of GPUs.',
      responsibilities: [
        'Optimize model quantization (FP8, INT4) and KV-cache utilization algorithms.',
        'Develop low-latency model serving runtimes using Triton and vLLM.',
        'Collaborate with research scientists to deploy experimental frontier checkpoints.'
      ],
      requirements: [
        'Strong background in systems programming (C++, Rust, or CUDA).',
        'Familiarity with transformer architectures and attention optimizations (FlashAttention).',
        'Proven track record building and benchmarking performance-critical software.'
      ]
    },
    {
      id: 'job_tcs_07',
      title: 'Systems Engineer - Digital & Prime',
      company: 'Tata Consultancy Services',
      logo: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=80',
      location: 'Hyderabad, Bangalore, Pune (India)',
      salary: '₹7.5 – 11.5 LPA',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 90,
      remote: false,
      deadline: 'Oct 15, 2026',
      tags: ['Java', 'Spring Boot', 'Angular', 'Cloud Essentials'],
      desc: 'TCS Digital hiring track for elite graduates. Work on digital transformation programs for Fortune 100 banking, healthcare, and retail clients.',
      responsibilities: [
        'Develop enterprise microservices using Spring Boot and Hibernate.',
        'Build responsive front-end dashboards in Angular and TypeScript.',
        'Participate in agile sprint ceremonies and code audits.'
      ],
      requirements: [
        'B.Tech / B.E / M.Tech in CS / IT / Circuit branches graduating in 2026.',
        'Minimum 70% or 7.0 CGPA throughout academic career.',
        'Strong problem solving skills evaluated in TCS NQT coding rounds.'
      ]
    },
    {
      id: 'job_accenture_08',
      title: 'Associate Software Engineer (Advanced Tech)',
      company: 'Accenture',
      logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=80',
      location: 'Bangalore, Gurgaon, Chennai (India)',
      salary: '₹6.5 – 9.0 LPA',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 89,
      remote: false,
      deadline: 'Oct 20, 2026',
      tags: ['Python', 'Cloud Ingress', 'SQL', 'Automation'],
      desc: 'Join Accenture’s Advanced Technology Centers to build cloud solutions, AI-driven automation workflows, and enterprise web portals.',
      responsibilities: [
        'Implement automated testing and continuous integration scripts.',
        'Analyze client datasets and build automated reporting pipelines.',
        'Collaborate with international delivery teams across agile sprints.'
      ],
      requirements: [
        'B.E/B.Tech from recognized university graduating in 2026.',
        'Good understanding of SQL databases, basic networking, and modern programming.',
        'Strong analytical thinking and adaptability.'
      ]
    },
  ];

  // States
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'internships', 'fulltime', 'remote', 'saved', 'tracker'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Editable Application Form State
  const [applyForm, setApplyForm] = useState({
    firstName: currentUser.firstName || 'Alex',
    lastName: currentUser.lastName || 'Johnson',
    email: currentUser.email || 'alex.developer@example.com',
    phone: currentUser.phone || '+1 (234) 567-8900',
    education: currentUser.education || 'B.S. Computer Science & Engineering (2026)',
    portfolioLink: 'https://github.com/alexjohnson',
    resumeName: 'Alex_Johnson_Resume_ATS_Ready.pdf (92/100 ATS Match)',
    coverNote: ''
  });

  // Saved Jobs
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_saved_jobs');
      return saved ? JSON.parse(saved) : ['job_google_01', 'job_stripe_05'];
    } catch {
      return ['job_google_01', 'job_stripe_05'];
    }
  });

  // Application Tracker Data
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_job_applications');
      if (saved) return JSON.parse(saved);
    } catch {}

    // Default authentic demo applications
    return [
      {
        id: 'app_1',
        jobId: 'job_google_01',
        company: 'Google',
        title: 'Software Engineering Intern - Cloud & Systems',
        appliedDate: 'Aug 26, 2026',
        status: 'Interview Scheduled',
        stageIndex: 2,
        atsScore: 96,
        nextStep: 'Technical Round 1: System Design & Algorithms on Sep 14',
        candidateName: 'Alex Johnson',
        email: 'alex.developer@example.com'
      },
      {
        id: 'app_2',
        jobId: 'job_stripe_05',
        company: 'Stripe',
        title: 'Backend Engineering Intern (Payments Core)',
        appliedDate: 'Sep 01, 2026',
        status: 'ATS Resume Screened',
        stageIndex: 1,
        atsScore: 94,
        nextStep: 'Recruiter review in progress. Expect update in 3-5 days.',
        candidateName: 'Alex Johnson',
        email: 'alex.developer@example.com'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexora_job_applications', JSON.stringify(applications));
    } catch (e) {
      console.warn('Failed to save applications:', e);
    }
  }, [applications]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleToggleBookmark = (jobId, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter(id => id !== jobId);
      triggerToast('Job removed from saved bookmarks.');
    } else {
      updated = [...savedJobIds, jobId];
      triggerToast('Job bookmarked to your profile!');
    }
    setSavedJobIds(updated);
    localStorage.setItem('nexora_saved_jobs', JSON.stringify(updated));
  };

  const handleOpenApplyModal = (job, e) => {
    if (e) e.stopPropagation();
    setApplyingJob(job);
    setApplyForm(prev => ({
      ...prev,
      firstName: currentUser.firstName || prev.firstName,
      lastName: currentUser.lastName || prev.lastName,
      email: currentUser.email || prev.email,
      coverNote: `I am excited to apply for the ${job.title} position at ${job.company}. My background in high-scale systems and hands-on projects directly aligns with your requirements.`
    }));
    setShowApplyModal(true);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    const newApp = {
      id: `app_${Date.now()}`,
      jobId: applyingJob.id,
      company: applyingJob.company,
      title: applyingJob.title,
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Application Submitted',
      stageIndex: 0,
      atsScore: 92,
      nextStep: 'Application dispatched to hiring team. Automated ATS screening underway.',
      candidateName: `${applyForm.firstName} ${applyForm.lastName}`,
      email: applyForm.email
    };

    const updated = [newApp, ...applications.filter(a => a.jobId !== applyingJob.id)];
    setApplications(updated);
    setShowApplyModal(false);

    // Save XP
    db.updateUserProfile({
      xp: (currentUser.xp || 1200) + 100
    });

    triggerToast(`Application officially submitted to ${applyingJob.company}! Tracked in Application Tracker.`);
  };

  // Filter logic
  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'internships') return job.type === 'Internship';
    if (activeTab === 'fulltime') return job.type === 'Full-Time';
    if (activeTab === 'remote') return job.remote === true;
    if (activeTab === 'saved') return savedJobIds.includes(job.id);

    return true;
  });

  const stages = ['Submitted', 'ATS Screened', 'Interview', 'Final Decision'];

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
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
            <Briefcase size={15} /> GLOBAL TECH TALENT NETWORK
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Real-World Jobs & Internships
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Verified engineering roles from Google, Microsoft, Amazon, Stripe, and leading tech employers.
          </p>
        </div>

        <div className="flex items-center gap-sm">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`btn ${activeTab === 'tracker' ? 'btn-primary' : 'btn-secondary'} flex items-center gap-xs`}
            style={{ padding: '8px 16px', fontSize: '0.82rem', width: 'auto' }}
          >
            <Clock size={15} />
            <span>Application Tracker ({applications.length})</span>
          </button>
        </div>
      </header>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-md items-center justify-between">
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
          <Search size={18} className="text-muted" style={{ position: 'absolute', top: 12, left: 14 }} />
          <input 
            type="text" 
            className="input-field w-full" 
            placeholder="Search by role, company (e.g. Google), or skill..."
            style={{ paddingLeft: '2.6rem', fontSize: '0.88rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-xs overflow-x-auto w-full md:w-auto pb-xs">
          {[
            { key: 'all', label: `All Roles (${allJobs.length})` },
            { key: 'internships', label: 'Internships' },
            { key: 'fulltime', label: 'Full-Time' },
            { key: 'remote', label: 'Remote Only' },
            { key: 'saved', label: `Saved (${savedJobIds.length})` },
            { key: 'tracker', label: `Tracker (${applications.length})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="skeuo-pill"
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeTab === tab.key ? 'var(--primary)' : 'var(--card-bg)',
                color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
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

      {/* ── VIEW 1: APPLICATION TRACKER ── */}
      {activeTab === 'tracker' ? (
        <div className="flex flex-col gap-md animate-fade-in">
          <div className="glass-panel p-md flex justify-between items-center" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center gap-xs">
              <Clock size={18} className="text-primary" />
              <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Live Candidate Application Tracking Pipeline</span>
            </div>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{applications.length} Active Dispatches</span>
          </div>

          {applications.length === 0 ? (
            <div className="glass-panel p-xl text-center flex flex-col items-center justify-center gap-sm">
              <Briefcase size={36} className="text-muted" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Applications Submitted Yet</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Explore verified roles above and apply with 1-click Quick Apply.</p>
              <button onClick={() => setActiveTab('all')} className="btn btn-primary" style={{ width: 'auto', padding: '8px 18px' }}>
                Browse All Roles
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              {applications.map((app) => (
                <div 
                  key={app.id} 
                  className="glass-panel p-lg flex flex-col gap-md"
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)'
                  }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-xs">
                    <div>
                      <span className="text-muted font-600" style={{ fontSize: '0.78rem' }}>{app.company}</span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0' }}>{app.title}</h3>
                      <span className="text-muted" style={{ fontSize: '0.76rem' }}>Applied on {app.appliedDate} • Candidate: {app.candidateName}</span>
                    </div>

                    <div className="flex items-center gap-xs">
                      <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.78rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                        ATS: {app.atsScore}/100 Match
                      </span>
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', fontWeight: 700, fontSize: '0.78rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* 4-Stage Visual Progress Pipeline */}
                  <div className="grid grid-cols-4 gap-xs pt-xs">
                    {stages.map((stageName, sIdx) => {
                      const isComplete = sIdx <= app.stageIndex;
                      const isCurrent = sIdx === app.stageIndex;
                      return (
                        <div key={stageName} className="flex flex-col gap-xs">
                          <div 
                            style={{
                              height: 6,
                              borderRadius: 3,
                              background: isComplete ? 'var(--primary)' : 'var(--input-bg)'
                            }} 
                          />
                          <span style={{ fontSize: '0.7rem', fontWeight: isCurrent ? 700 : 500, color: isComplete ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {stageName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Next Step Banner */}
                  <div className="glass-panel p-sm flex items-center gap-sm" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)' }}>
                    <Sparkles size={15} className="text-primary shrink-0" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong>Next Step:</strong> {app.nextStep}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── VIEW 2: JOB CARDS DIRECTORY ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {filteredJobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const isApplied = applications.some(a => a.jobId === job.id);

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="glass-panel interactive flex flex-col justify-between cursor-pointer transition-all"
                style={{
                  padding: '1.5rem',
                  border: '1px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div>
                  {/* Header row with Match and Bookmark */}
                  <div className="flex justify-between items-start mb-sm">
                    <div className="flex gap-sm items-center">
                      <div 
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '10px',
                          background: 'rgba(99, 102, 241, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: 'var(--primary)',
                          border: '1px solid rgba(99, 102, 241, 0.2)'
                        }}
                      >
                        <Building size={20} />
                      </div>
                      <div>
                        <span className="text-muted font-600" style={{ fontSize: '0.78rem' }}>{job.company}</span>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{job.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-xs">
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                        {job.match}% Match
                      </span>
                      <button
                        className="btn-icon-tactile"
                        onClick={(e) => handleToggleBookmark(job.id, e)}
                        style={{ padding: '6px', borderRadius: '50%' }}
                      >
                        {isSaved ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} className="text-muted" />}
                      </button>
                    </div>
                  </div>

                  {/* Location and Salary */}
                  <div className="flex flex-wrap items-center gap-md text-muted mb-sm" style={{ fontSize: '0.8rem' }}>
                    <span className="flex items-center gap-xs">
                      <MapPin size={13} /> {job.location}
                    </span>
                    <span className="flex items-center gap-xs text-success font-600">
                      <DollarSign size={13} /> {job.salary}
                    </span>
                  </div>

                  <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, margin: '0.5rem 0' }}>
                    {job.desc.length > 140 ? `${job.desc.substring(0, 140)}...` : job.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-xs mt-sm">
                    <span className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-main)', fontSize: '0.7rem' }}>
                      {job.type}
                    </span>
                    {job.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="badge" style={{ background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary)', fontSize: '0.7rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="flex justify-between items-center pt-md mt-sm" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Deadline: {job.deadline}
                  </span>

                  {isApplied ? (
                    <span 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--success)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        padding: '6px 12px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      <CheckCircle2 size={14} /> Applied ✓
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => handleOpenApplyModal(job, e)}
                      style={{ padding: '6px 16px', fontSize: '0.82rem', width: 'auto' }}
                    >
                      Quick Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SLIDE-OUT DETAIL MODAL ── */}
      {selectedJob && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedJob(null)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-2xl w-full animate-scale-up"
            style={{ 
              padding: '2rem', 
              background: 'var(--bg-card)', 
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                  {selectedJob.company} • {selectedJob.type}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '6px' }}>{selectedJob.title}</h2>
                <div className="flex items-center gap-md text-muted mt-xs" style={{ fontSize: '0.82rem' }}>
                  <span><MapPin size={13} style={{ display: 'inline' }} /> {selectedJob.location}</span>
                  <span><DollarSign size={13} style={{ display: 'inline' }} /> {selectedJob.salary}</span>
                </div>
              </div>
              <button 
                className="btn-icon-tactile" 
                onClick={() => setSelectedJob(null)}
                style={{ borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-md py-xs">
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Role Overview</h4>
                <p className="text-muted" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{selectedJob.desc}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Key Responsibilities</h4>
                <ul className="flex flex-col gap-xs" style={{ paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i} className="text-muted">{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>Prerequisites & Qualifications</h4>
                <ul className="flex flex-col gap-xs" style={{ paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="text-muted">{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center pt-md" style={{ borderTop: '1px solid var(--border-color)' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => handleToggleBookmark(selectedJob.id, { stopPropagation: () => {} })}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}
              >
                {savedJobIds.includes(selectedJob.id) ? 'Bookmarked ✓' : 'Save Opportunity'}
              </button>

              <button 
                className="btn btn-primary"
                onClick={() => {
                  const job = selectedJob;
                  setSelectedJob(null);
                  handleOpenApplyModal(job);
                }}
                style={{ width: 'auto', padding: '10px 24px', fontSize: '0.88rem' }}
              >
                Proceed to Quick Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE QUICK APPLY MODAL (WITH EDITABLE FIELDS) ── */}
      {showApplyModal && applyingJob && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowApplyModal(false)}
        >
          <div 
            className="glass-panel flex flex-col gap-md max-w-lg w-full animate-scale-up"
            style={{ padding: '2rem', background: 'var(--bg-card)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="text-primary font-600" style={{ fontSize: '0.78rem' }}>CANDIDATE DISPATCH PORTAL</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Apply to {applyingJob.company}</h3>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>Role: {applyingJob.title}</div>
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
              {/* First & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>First Name *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applyForm.firstName}
                    onChange={(e) => setApplyForm({ ...applyForm, firstName: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Last Name *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applyForm.lastName}
                    onChange={(e) => setApplyForm({ ...applyForm, lastName: e.target.value })}
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
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label className="input-label" style={{ fontSize: '0.8rem' }}>Phone Number *</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    value={applyForm.phone}
                    onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Education & Institution</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={applyForm.education}
                  onChange={(e) => setApplyForm({ ...applyForm, education: e.target.value })}
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              {/* Resume Document Selection */}
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Attached Resume Document</label>
                <div className="glass-panel p-sm flex justify-between items-center" style={{ background: 'var(--input-bg)', padding: '8px 12px' }}>
                  <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.82rem' }}>
                    <FileText size={16} className="text-primary" />
                    <span>{applyForm.resumeName}</span>
                  </div>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontSize: '0.7rem' }}>
                    ATS Verified
                  </span>
                </div>
              </div>

              {/* GitHub / Portfolio */}
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>GitHub / Portfolio Profile Link</label>
                <input 
                  type="url" 
                  className="input-field" 
                  value={applyForm.portfolioLink}
                  onChange={(e) => setApplyForm({ ...applyForm, portfolioLink: e.target.value })}
                  placeholder="https://github.com/yourhandle"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              {/* Cover Pitch */}
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Candidate Pitch / Cover Note</label>
                <textarea 
                  rows={3}
                  className="input-field"
                  value={applyForm.coverNote}
                  onChange={(e) => setApplyForm({ ...applyForm, coverNote: e.target.value })}
                  style={{ fontSize: '0.82rem', resize: 'vertical' }}
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
                  style={{ width: 'auto', padding: '8px 24px', fontSize: '0.84rem' }}
                >
                  <Send size={14} /> Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
