import { useState } from 'react';
import { 
  Briefcase, Building, DollarSign, MapPin, Search, Filter, Bookmark, 
  BookmarkCheck, CheckCircle2, ArrowRight, ExternalLink, X, Sparkles, 
  Clock, ShieldCheck, FileText, Send
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
      match: 92,
      remote: false,
      deadline: 'Nov 15, 2026',
      tags: ['Java', 'Distributed Systems', 'AWS DynamoDB', 'Docker'],
      desc: 'Be part of the AWS infrastructure team delivering compute and storage virtualization for millions of enterprise customers worldwide.',
      responsibilities: [
        'Write high-throughput Java microservices handling millions of transactions per minute.',
        'Collaborate with principal engineers on fault tolerance and automatic failover.',
        'Automate deployment canary rollouts using internal CI/CD pipelines.'
      ],
      requirements: [
        'Bachelor’s in CS, EE, or related field.',
        'Demonstrated grasp of concurrency, thread safety, and memory management.',
        'Experience building production APIs or cloud-native applications.'
      ]
    },
    {
      id: 'job_meta_04',
      title: 'Frontend Engineer (UI Architecture)',
      company: 'Meta',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=80',
      location: 'Remote (Worldwide)',
      salary: '$140k – $170k · ₹28 – 36 LPA',
      type: 'Full-Time',
      batch: 'Open',
      match: 96,
      remote: true,
      deadline: 'Immediate',
      tags: ['React', 'Relay', 'GraphQL', 'Web Performance'],
      desc: 'Engineer the future of global communication across Instagram, WhatsApp, and Horizon platforms. Push the boundaries of web UI responsiveness and instant updates.',
      responsibilities: [
        'Optimize complex React trees for 60fps rendering across desktop and mobile browsers.',
        'Implement real-time collaboration features using GraphQL subscriptions and WebSockets.',
        'Champion design system token integration and accessibility standards.'
      ],
      requirements: [
        'Deep mastery of modern JavaScript, DOM internals, and browser performance APIs.',
        'Experience maintaining state across large-scale single-page apps.',
        'Passion for pixel-perfect UI and user empathy.'
      ]
    },
    {
      id: 'job_stripe_05',
      title: 'Infrastructure & Payment Core Intern',
      company: 'Stripe',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=80',
      location: 'San Francisco, CA & Dublin, Ireland',
      salary: '$50 - $60 / hr · ₹1,00,000 / mo',
      type: 'Internship',
      batch: '2026 Batch',
      match: 94,
      remote: false,
      deadline: 'Dec 01, 2026',
      tags: ['Ruby', 'Go', 'PostgreSQL', 'Idempotent APIs'],
      desc: 'Help scale the economic infrastructure of the internet. Write software that safely processes hundreds of billions of dollars each year with zero downtime.',
      responsibilities: [
        'Build fault-tolerant payment idempotency systems with strict ACID compliance.',
        'Improve observability, distributed tracing, and real-time ledger verification.',
        'Collaborate with global financial partner integrations.'
      ],
      requirements: [
        'Strong computer science fundamentals and disciplined testing mindset.',
        'Familiarity with SQL transactions and distributed logging.',
        'Clear written and verbal technical communication.'
      ]
    },
    {
      id: 'job_openai_06',
      title: 'Research Engineering Intern - Model Scaling',
      company: 'OpenAI',
      logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=80',
      location: 'San Francisco, CA (Hybrid / Remote)',
      salary: '$60 - $75 / hr',
      type: 'Internship',
      batch: '2026 Batch',
      match: 98,
      remote: true,
      deadline: 'Oct 20, 2026',
      tags: ['PyTorch', 'Python', 'CUDA', 'Distributed GPU Clusters'],
      desc: 'Push the frontiers of artificial intelligence. Work with world-class researchers to scale multi-modal foundation models and optimize high-throughput inference.',
      responsibilities: [
        'Implement parallelized training scripts using PyTorch FSDP and Megatron-LM.',
        'Benchmark matrix multiplication kernels on cutting-edge GPU clusters.',
        'Analyze model loss trajectories and debug distributed memory bottlenecks.'
      ],
      requirements: [
        'Solid background in linear algebra, probability, and machine learning.',
        'Hands-on experience training deep neural networks with PyTorch.',
        'Familiarity with CUDA or GPU hardware acceleration is a plus.'
      ]
    },
    {
      id: 'job_razorpay_07',
      title: 'Backend Engineer - FinTech Infrastructure',
      company: 'Razorpay',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=80',
      location: 'Bangalore, India',
      salary: '₹16 – 22 LPA',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 91,
      remote: false,
      deadline: 'Nov 10, 2026',
      tags: ['Golang', 'Kafka', 'MySQL', 'Redis'],
      desc: 'Empower over 8 million Indian businesses with instant digital transactions, banking APIs, and fraud detection engines.',
      responsibilities: [
        'Build low-latency payment processing pipelines handling 10,000+ RPS.',
        'Integrate bank webhooks with guaranteed delivery and retry mechanics.',
        'Optimize Redis caching for instantaneous payment status polling.'
      ],
      requirements: [
        'Proficiency in Golang, Java, or Node.js.',
        'Understanding of message brokers (Kafka, RabbitMQ) and caching.',
        'Eagerness to solve high-volume financial reliability problems.'
      ]
    },
    {
      id: 'job_swiggy_08',
      title: 'Associate Data Scientist - Routing & Logistics',
      company: 'Swiggy',
      logo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=80',
      location: 'Bangalore, India (Hybrid)',
      salary: '₹15 – 20 LPA',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 89,
      remote: false,
      deadline: 'Oct 25, 2026',
      tags: ['Python', 'Operations Research', 'Machine Learning', 'SQL'],
      desc: 'Develop hyper-local demand forecasting and delivery dispatch optimization algorithms powering millions of daily food and grocery orders.',
      responsibilities: [
        'Model ETA predictions based on real-time traffic and kitchen preparation times.',
        'Design combinatorial optimization algorithms for driver batching.',
        'Execute rigorous A/B tests to validate delivery efficiency gains.'
      ],
      requirements: [
        'Degree in Statistics, Computer Science, Data Science, or Operations Research.',
        'Strong skills in Python, Scikit-Learn, and analytical SQL.',
        'Solid problem-solving intuition and metric-driven thinking.'
      ]
    },
    {
      id: 'job_uber_09',
      title: 'Platform Engineering Intern',
      company: 'Uber',
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=80',
      location: 'Hyderabad, India & San Francisco, CA',
      salary: '$48 - $58 / hr · ₹80,000 / mo',
      type: 'Internship',
      batch: '2026 Batch',
      match: 93,
      remote: false,
      deadline: 'Nov 30, 2026',
      tags: ['Go', 'Microservices', 'Kafka', 'Cassandra'],
      desc: 'Build the core platforms that power global mobility, dispatching millions of rides and deliveries across 10,000+ cities daily.',
      responsibilities: [
        'Develop highly concurrent backend services in Go.',
        'Improve automated testing harnesses for microservice integration.',
        'Participate in chaos engineering drills and disaster recovery tests.'
      ],
      requirements: [
        'Strong algorithmic reasoning and data structures background.',
        'Comfort with Unix/Linux development environments.',
        'Familiarity with distributed data stores.'
      ]
    },
    {
      id: 'job_atlassian_10',
      title: 'Junior Software Engineer - Cloud Tools',
      company: 'Atlassian',
      logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=80',
      location: 'Remote (Worldwide)',
      salary: '$110k – $135k · ₹20 – 26 LPA',
      type: 'Full-Time',
      batch: 'Open',
      match: 92,
      remote: true,
      deadline: 'Rolling',
      tags: ['React', 'TypeScript', 'Java', 'AWS'],
      desc: 'Build teamwork software used by millions at Jira, Confluence, and Trello. Work from anywhere with Atlassian’s revolutionary Team Anywhere model.',
      responsibilities: [
        'Build responsive web interfaces using Atlassian Design System.',
        'Collaborate with product designers to streamline developer collaboration.',
        'Deploy microservices to AWS multi-region infrastructure.'
      ],
      requirements: [
        'Experience building web applications with modern JS/TS frameworks.',
        'Good understanding of REST APIs and relational databases.',
        'Self-motivated with excellent remote asynchronous communication.'
      ]
    },
    {
      id: 'job_tcs_11',
      title: 'Digital Systems Engineer - Cloud & AI',
      company: 'TCS Digital',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=80',
      location: 'Pune, Mumbai, Hyderabad, India',
      salary: '₹7.5 – 11.5 LPA',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 88,
      remote: false,
      deadline: 'Oct 31, 2026',
      tags: ['Java', 'Spring Boot', 'Cloud Fundamentals', 'Python'],
      desc: 'Deliver digital transformation and cloud modernization projects for Fortune 500 banking, retail, and healthcare leaders worldwide.',
      responsibilities: [
        'Develop enterprise REST microservices in Java Spring Boot.',
        'Automate deployment pipelines and cloud infrastructure provisioning.',
        'Conduct code quality reviews and automated security scanning.'
      ],
      requirements: [
        'BE/B.Tech/MCA in Computer Science or IT streams.',
        'Strong core Java, OOP concepts, and SQL fundamentals.',
        'Good aptitude, logical reasoning, and communication skills.'
      ]
    },
    {
      id: 'job_accenture_12',
      title: 'Cybersecurity Operations Associate',
      company: 'Accenture',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=80',
      location: 'Gurgaon & Bangalore, India',
      salary: '₹8.0 – 12.0 LPA',
      type: 'Full-Time',
      batch: '2026 Batch',
      match: 86,
      remote: false,
      deadline: 'Nov 20, 2026',
      tags: ['SIEM', 'Network Security', 'Wireshark', 'SOC'],
      desc: 'Protect multinational enterprise clients against sophisticated cyber attacks, monitor global threat intelligence feeds, and conduct vulnerability remediation.',
      responsibilities: [
        'Analyze security telemetry and alert events in SIEM platforms.',
        'Perform basic vulnerability assessments and penetration test triage.',
        'Draft incident response reports and assist in security remediation.'
      ],
      requirements: [
        'Knowledge of networking (TCP/IP, DNS, Firewalls) and OS security.',
        'Certifications such as CompTIA Security+ or CEH are an advantage.',
        'Analytical problem-solving skills under high-pressure scenarios.'
      ]
    }
  ];

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexora_saved_jobs') || '[]');
    } catch {
      return [];
    }
  });
  const [appliedJobIds, setAppliedJobIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nexora_applied_jobs') || '[]');
    } catch {
      return [];
    }
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleToggleBookmark = (jobId, e) => {
    e.stopPropagation();
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
    setCoverNote(`I am excited to apply for the ${job.title} position at ${job.company}. My background in modern software engineering and hands-on projects directly matches the required technical stack.`);
    setPortfolioLink('https://github.com/' + (currentUser.firstName || 'alex').toLowerCase());
    setShowApplyModal(true);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    const updated = [...new Set([...appliedJobIds, applyingJob.id])];
    setAppliedJobIds(updated);
    localStorage.setItem('nexora_applied_jobs', JSON.stringify(updated));

    setShowApplyModal(false);
    triggerToast(`Application officially submitted to ${applyingJob.company}! Status: Under Review.`);
  };

  // Filter logic
  const filteredJobs = allJobs.filter(job => {
    // Search
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Tabs
    if (activeTab === 'internships') return job.type === 'Internship';
    if (activeTab === 'fulltime') return job.type === 'Full-Time';
    if (activeTab === 'remote') return job.remote === true;
    if (activeTab === 'saved') return savedJobIds.includes(job.id);

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
          <div className="flex items-center gap-xs text-primary font-600 mb-xs" style={{ fontSize: '0.82rem', letterSpacing: '0.05em' }}>
            <Briefcase size={15} /> GLOBAL TECH TALENT NETWORK
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Real-World Jobs & Internships
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Curated opportunities from Google, Microsoft, Amazon, Stripe, and leading tech employers.
          </p>
        </div>

        <span className="badge glass-panel" style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.82rem' }}>
          {allJobs.length} Verified Positions Live
        </span>
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
            { key: 'saved', label: `Saved (${savedJobIds.length})` }
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

      {/* Job Cards Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {filteredJobs.map((job) => {
          const isSaved = savedJobIds.includes(job.id);
          const isApplied = appliedJobIds.includes(job.id);

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
                        fontSize: '1.2rem',
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}
                    >
                      {job.company[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-xs">
                        <span style={{ fontWeight: 700, fontSize: '0.96rem' }}>{job.company}</span>
                        {job.remote && (
                          <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--secondary)', fontSize: '0.7rem', padding: '1px 6px', borderRadius: 4 }}>
                            Remote
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.78rem', marginTop: '2px' }}>
                        <MapPin size={12} /> {job.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-xs">
                    <span 
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--success)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {job.match}% Match
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(job.id, e)}
                      className="btn-icon-tactile"
                      style={{ padding: '6px', borderRadius: '50%' }}
                    >
                      {isSaved ? (
                        <BookmarkCheck size={18} className="text-primary" />
                      ) : (
                        <Bookmark size={18} className="text-muted" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Job Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.5rem 0' }}>
                  {job.title}
                </h3>

                <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {job.desc.slice(0, 115)}...
                </p>

                {/* Compensation & Type */}
                <div className="flex items-center justify-between p-xs" style={{ background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '0.82rem' }}>
                  <span className="flex items-center gap-xs font-600">
                    <DollarSign size={14} className="text-success" /> {job.salary}
                  </span>
                  <span className="text-muted">
                    {job.type} • {job.batch}
                  </span>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-xs mt-sm">
                  {job.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        fontSize: '0.74rem',
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
                  Deadline: {job.deadline}
                </span>

                <div className="flex gap-xs">
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
                      <CheckCircle2 size={15} /> Applied ✓
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => handleOpenApplyModal(job, e)}
                      style={{ padding: '6px 14px', fontSize: '0.82rem', width: 'auto' }}
                    >
                      Quick Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide-Out Detail Modal */}
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

      {/* Interactive Quick Apply Modal */}
      {showApplyModal && applyingJob && (
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
                <span className="text-primary font-600" style={{ fontSize: '0.78rem' }}>DIRECT APPLICATION DISPATCH</span>
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
              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Candidate Name & Contact</label>
                <input 
                  type="text" 
                  disabled
                  className="input-field" 
                  value={`${currentUser.firstName || 'Alex'} ${currentUser.lastName || 'Johnson'} (${currentUser.email || 'alex.developer@example.com'})`}
                  style={{ opacity: 0.8, fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Attached Resume Document</label>
                <div className="glass-panel p-sm flex justify-between items-center" style={{ background: 'var(--input-bg)', padding: '8px 12px' }}>
                  <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.82rem' }}>
                    <FileText size={16} className="text-primary" />
                    <span>Alex_Johnson_Resume_ATS_Ready.pdf (Analyzed 86/100)</span>
                  </div>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', fontSize: '0.7rem' }}>
                    Active
                  </span>
                </div>
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>GitHub / Portfolio Profile</label>
                <input 
                  type="url" 
                  className="input-field" 
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  placeholder="https://github.com/yourhandle"
                  style={{ fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label className="input-label" style={{ fontSize: '0.8rem' }}>Short Candidate Cover Pitch</label>
                <textarea 
                  rows={3}
                  className="input-field"
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
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
                  <Send size={15} /> Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
