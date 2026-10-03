import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, Sparkles, BookOpen, Play, CheckCircle2, 
  ArrowRight, Video, Code2, Shield, Cpu, Layers,
  Award, Globe, Smartphone, Brain, Database, Cloud,
  Gamepad2, Palette, CheckSquare, BarChart3
} from 'lucide-react';
import { ROADMAP_DOMAINS } from '../../utils/roadmapData';
import videoService from '../../services/videoService';
import db from '../../services/db';
import { useToast } from '../../contexts/ToastContext';

// Comprehensive metadata for all 12 Real-Time Domains
const ALL_DOMAINS_METADATA = [
  {
    id: 'fullstack',
    title: 'Full-Stack Web Development',
    category: 'Web & Mobile',
    icon: Globe,
    accentColor: 'indigo',
    badge: 'Flagship Track',
    description: 'Architect modern full-stack applications with React 19, Next.js 15, Node.js, TypeScript, PostgreSQL, and cloud deployments.',
    skills: ['Next.js 15', 'React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
    featuredVideoId: 'W6NZfCO5SIk',
    featuredVideoTitle: 'Full Stack Web Development for Beginners',
    duration: '180 Hours',
    milestonesCount: 10,
  },
  {
    id: 'mobile',
    title: 'Mobile App Development',
    category: 'Web & Mobile',
    icon: Smartphone,
    accentColor: 'sky',
    badge: 'Mobile Native',
    description: 'Build native iOS and Android apps with 60fps animations using React Native, Expo Router, Swift, SQLite, and EAS store releases.',
    skills: ['React Native', 'Expo Router', 'Swift', 'SQLite', 'Reanimated 3', 'EAS Build'],
    featuredVideoId: '0-S5a0eXPoc',
    featuredVideoTitle: 'React Native & Expo Router Masterclass',
    duration: '160 Hours',
    milestonesCount: 10,
  },
  {
    id: 'ai',
    title: 'AI & Deep Learning Engineering',
    category: 'AI & Data',
    icon: Brain,
    accentColor: 'purple',
    badge: 'Cutting-Edge',
    description: 'Train neural networks from scratch, fine-tune transformer LLMs, and build production RAG pipelines with PyTorch and Hugging Face.',
    skills: ['PyTorch', 'Transformers', 'Hugging Face', 'RAG Pipelines', 'LoRA', 'CUDA'],
    featuredVideoId: 'aircAruvnKk',
    featuredVideoTitle: 'Neural Networks: Zero to Hero (Andrej Karpathy)',
    duration: '200 Hours',
    milestonesCount: 10,
  },
  {
    id: 'data',
    title: 'Data Science & Machine Learning',
    category: 'AI & Data',
    icon: Database,
    accentColor: 'cyan',
    badge: 'Predictive Analytics',
    description: 'Master mathematical modeling, statistical EDA, feature engineering, and production ML pipelines with Scikit-Learn and XGBoost.',
    skills: ['Python 3.12', 'NumPy', 'Pandas', 'Scikit-Learn', 'XGBoost', 'MLflow'],
    featuredVideoId: 'LHBE6Q9XlzI',
    featuredVideoTitle: 'Python for Data Science & Machine Learning Bootcamp',
    duration: '170 Hours',
    milestonesCount: 10,
  },
  {
    id: 'devops',
    title: 'Cloud & DevOps Engineering',
    category: 'Cloud & Security',
    icon: Cloud,
    accentColor: 'blue',
    badge: 'Enterprise Infrastructure',
    description: 'Architect self-healing cloud clusters with Docker, Kubernetes, Terraform Infrastructure as Code, AWS, and automated CI/CD pipelines.',
    skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'GitHub Actions', 'Prometheus'],
    featuredVideoId: '7xTGNNLPyMI',
    featuredVideoTitle: 'Docker & Kubernetes Full Course: Cloud Container Orchestration',
    duration: '150 Hours',
    milestonesCount: 10,
  },
  {
    id: 'security',
    title: 'Cybersecurity & Ethical Hacking',
    category: 'Cloud & Security',
    icon: Shield,
    accentColor: 'rose',
    badge: 'Threat Defense',
    description: 'Protect enterprise infrastructure through ethical penetration testing, OWASP vulnerability exploitation, cryptography, and SOC monitoring.',
    skills: ['Penetration Testing', 'Nmap', 'Burp Suite', 'OWASP Top 10', 'Cryptography', 'Linux'],
    featuredVideoId: '3Kq1MIfTWCE',
    featuredVideoTitle: 'Ethical Hacking Full Course: Penetration Testing',
    duration: '180 Hours',
    milestonesCount: 10,
  },
  {
    id: 'blockchain',
    title: 'Blockchain & Web3 Engineering',
    category: 'Systems & Web3',
    icon: Layers,
    accentColor: 'amber',
    badge: 'Decentralized Tech',
    description: 'Build decentralized applications (DApps) and smart contracts on Ethereum using Solidity, Hardhat, Ethers.js, and DeFi protocols.',
    skills: ['Solidity', 'Hardhat', 'Ethereum', 'Ethers.js', 'DeFi Protocols', 'Foundry'],
    featuredVideoId: 'gyMwXuJbiXC',
    featuredVideoTitle: 'Solidity, Ethereum & Web3 Full Course (Patrick Collins)',
    duration: '190 Hours',
    milestonesCount: 10,
  },
  {
    id: 'game',
    title: 'Game Development & Graphics',
    category: 'Systems & Web3',
    icon: Gamepad2,
    accentColor: 'emerald',
    badge: 'Real-Time 3D',
    description: 'Create interactive 2D and 3D games using Unity, Unreal Engine 5, C++, HLSL shader programming, and multiplayer network code.',
    skills: ['Unreal Engine 5', 'Unity', 'C++', 'C#', 'HLSL Shaders', '3D Physics'],
    featuredVideoId: 'AmGSEH7QcDg',
    featuredVideoTitle: 'Unreal Engine 5 Beginner Tutorial: 3D Action Game',
    duration: '175 Hours',
    milestonesCount: 10,
  },
  {
    id: 'embedded',
    title: 'Embedded Systems & IoT',
    category: 'Systems & Web3',
    icon: Cpu,
    accentColor: 'orange',
    badge: 'Hardware Silicon',
    description: 'Program bare-metal firmware, real-time operating systems (FreeRTOS), ESP32 microcontrollers, and wireless sensor telemetry.',
    skills: ['Embedded C', 'FreeRTOS', 'ARM Cortex-M', 'ESP32', 'I2C / SPI', 'MQTT'],
    featuredVideoId: '1Udq9vWc_6M',
    featuredVideoTitle: 'Embedded Systems & Real-Time OS (FreeRTOS) Programming',
    duration: '160 Hours',
    milestonesCount: 10,
  },
  {
    id: 'design',
    title: 'UI/UX & Product Design',
    category: 'Product & QA',
    icon: Palette,
    accentColor: 'pink',
    badge: 'Design Systems',
    description: 'Design production-grade design systems with Figma auto-layout, design tokens, micro-interactions, and WCAG AA accessibility heuristics.',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Auto-Layout', 'WCAG AA', 'Prototyping'],
    featuredVideoId: 'c9Wg6Cb_YlU',
    featuredVideoTitle: 'Figma UI/UX Design Essentials Course: Master Design Systems',
    duration: '130 Hours',
    milestonesCount: 10,
  },
  {
    id: 'qa',
    title: 'QA Automation & SDET',
    category: 'Product & QA',
    icon: CheckSquare,
    accentColor: 'teal',
    badge: 'Zero-Defect Quality',
    description: 'Architect modern automated test suites with Playwright, TypeScript, Page Object Model (POM), performance load testing, and CI pipelines.',
    skills: ['Playwright', 'TypeScript', 'SDET', 'Page Object Model', 'API Testing', 'CI/CD'],
    featuredVideoId: 'x_P-SfZpxbE',
    featuredVideoTitle: 'Playwright Test Automation: Complete SDET Framework Blueprint',
    duration: '140 Hours',
    milestonesCount: 10,
  },
  {
    id: 'analytics',
    title: 'Data Analytics & Business Intelligence',
    category: 'AI & Data',
    icon: BarChart3,
    accentColor: 'lime',
    badge: 'BI & Warehousing',
    description: 'Transform enterprise data into actionable executive dashboards using advanced SQL window functions, Power BI, dbt, and Snowflake.',
    skills: ['Advanced SQL', 'Window Functions', 'Power BI', 'dbt', 'Snowflake', 'Data Modeling'],
    featuredVideoId: '7S_tz1z_5bA',
    featuredVideoTitle: 'SQL for Data Analysis: Full Database Querying Masterclass',
    duration: '135 Hours',
    milestonesCount: 10,
  },
];

export default function DomainHub() {
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [catalogOverview, setCatalogOverview] = useState(null);

  useEffect(() => {
    async function loadCatalog() {
      const data = await videoService.getCatalogOverview();
      setCatalogOverview(data);
    }
    loadCatalog();
  }, []);

  const filterCategories = ['All', 'Web & Mobile', 'AI & Data', 'Cloud & Security', 'Systems & Web3', 'Product & QA'];

  const filteredDomains = useMemo(() => {
    if (selectedFilter === 'All') return ALL_DOMAINS_METADATA;
    return ALL_DOMAINS_METADATA.filter(d => d.category === selectedFilter);
  }, [selectedFilter]);

  const handleEnrollTrack = (domain) => {
    localStorage.setItem('nexora_active_course', domain.id);
    db.updateUserProfile({
      dreamJob: domain.title,
      selectedTrack: domain.id,
      targetRole: domain.title
    });
    window.dispatchEvent(new Event('user_session_changed'));
    toast.success(`Track switched to ${domain.title}!`);
    navigate('/roadmap');
  };

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-8" style={{ minHeight: '100vh', padding: '24px 20px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      
      {/* ── Hero Banner ── */}
      <header className="glass-panel p-8 sm:p-10 rounded-3xl border border-border flex flex-col gap-4 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="badge text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Compass size={13} /> Engineering Specialization Catalog
            </span>
            <span className="badge text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              12 Real-Time Domains Active
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-main tracking-tight m-0 leading-tight">
            Master Any Tier-1 Engineering Domain
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed m-0 mt-2">
            Structured DAG curriculums paired with verified video masterclasses, interactive code execution drawers, and real-time competency evaluations.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-border/60">
          <span className="text-xs font-bold uppercase tracking-wider text-muted mr-1">
            Filter:
          </span>
          {filterCategories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-card text-muted hover:text-main border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* ── Domains Grid (12 Domains) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDomains.map((domain) => {
          const Icon = domain.icon;
          const videoCount = catalogOverview?.domainCounts?.[domain.id] || 2;

          return (
            <div
              key={domain.id}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-border/80 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between gap-5 group shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>

                  <span className="badge text-[10px] font-mono font-bold uppercase bg-input text-muted border border-border">
                    {domain.badge}
                  </span>
                </div>

                {/* Domain Title & Description */}
                <h3 className="text-lg font-black text-main m-0 group-hover:text-indigo-400 transition-colors leading-snug">
                  {domain.title}
                </h3>

                <p className="text-xs text-muted leading-relaxed m-0 mt-2 line-clamp-3">
                  {domain.description}
                </p>

                {/* Tech Skills Chips */}
                <div className="flex items-center gap-1.5 flex-wrap mt-4">
                  {domain.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-input text-muted border border-border/50"
                    >
                      {skill}
                    </span>
                  ))}
                  {domain.skills.length > 4 && (
                    <span className="text-[10px] text-muted font-medium">
                      +{domain.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions & Video Hub Trigger */}
              <div className="pt-4 border-t border-border/60 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted font-medium flex items-center gap-1">
                    <Clock size={12} className="text-indigo-400" /> {domain.duration}
                  </span>
                  <span className="text-indigo-400 font-mono font-bold flex items-center gap-1">
                    <Video size={12} /> {videoCount} Masterclasses
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleEnrollTrack(domain)}
                    className="btn-primary text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer font-bold shadow-sm"
                  >
                    <span>Curriculum</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/classroom/${domain.featuredVideoId}`)}
                    className="text-xs py-2 px-3 rounded-xl font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Play size={12} />
                    <span>Watch Video</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
