import { VideoProvider, VideoDifficulty, IVideoChapter } from '../models/videoLecture.model';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';

export interface IVideoSeedItem {
  videoId: string;
  title: string;
  description: string;
  provider: VideoProvider;
  domainId: string;
  milestoneId?: string;
  channelTitle: string;
  durationMinutes: number;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl: string;
  chapters: IVideoChapter[];
  keyTakeaways: string[];
  skills: string[];
  difficulty: VideoDifficulty;
  order: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CURATED MASTERCLASS VIDEO CATALOG (All 12 Real-Time Domains)
// ─────────────────────────────────────────────────────────────────────────────

export const CURATED_VIDEO_CATALOG: IVideoSeedItem[] = [
  // ── 1. Full-Stack Web Development ──────────────────────────────────────────
  {
    videoId: 'W6NZfCO5SIk',
    title: 'Full Stack Web Development for Beginners (React, Node, Express, MongoDB)',
    description: 'Learn modern full-stack web development from scratch. Build end-to-end applications with React, Node.js, Express, and MongoDB with production security.',
    provider: 'YOUTUBE',
    domainId: 'fullstack',
    milestoneId: 'fs_m1',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 480,
    thumbnailUrl: 'https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/W6NZfCO5SIk',
    chapters: [
      { title: 'Full Stack Architecture & Monorepos', timestampSeconds: 0 },
      { title: 'Modern React Component Hierarchies', timestampSeconds: 1800 },
      { title: 'Express REST Endpoints & Middleware', timestampSeconds: 5400 },
      { title: 'MongoDB Schemas & Aggregations', timestampSeconds: 9600 },
      { title: 'JWT Authentication & Production Security', timestampSeconds: 14400 },
      { title: 'Cloud Deployment to Vercel & Render', timestampSeconds: 21600 },
    ],
    keyTakeaways: [
      'Declarative state management and component lifecycle in React 19',
      'RESTful API routing with Express.js and middleware error handlers',
      'NoSQL document modeling, indexing, and Mongoose query pipelines',
      'Secure token storage and CORS configuration',
    ],
    skills: ['React 19', 'Node.js', 'Express', 'MongoDB', 'REST APIs'],
    difficulty: 'BEGINNER',
    order: 1,
  },
  {
    videoId: '843nec-IvW0',
    title: 'Next.js 15 & React 19 Masterclass: Server Components & Full Stack',
    description: 'Deep dive into Next.js App Router, React Server Components (RSC), server actions, streaming Suspense, and edge caching for sub-second page loads.',
    provider: 'YOUTUBE',
    domainId: 'fullstack',
    milestoneId: 'fs_m2',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 320,
    thumbnailUrl: 'https://img.youtube.com/vi/843nec-IvW0/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=843nec-IvW0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/843nec-IvW0',
    chapters: [
      { title: 'App Router File Conventions', timestampSeconds: 0 },
      { title: 'Server Components vs Client Components', timestampSeconds: 2400 },
      { title: 'Server Actions & Form Mutations', timestampSeconds: 6200 },
      { title: 'Optimistic UI Updates with useOptimistic', timestampSeconds: 9800 },
      { title: 'Prisma ORM & PostgreSQL Connections', timestampSeconds: 13200 },
    ],
    keyTakeaways: [
      'Zero-bundle-size React Server Components',
      'Atomic server actions replacing traditional REST boilerplate',
      'Edge streaming with React Suspense fallback boundaries',
    ],
    skills: ['Next.js 15', 'React Server Components', 'PostgreSQL', 'Prisma'],
    difficulty: 'ADVANCED',
    order: 2,
  },

  // ── 2. Mobile App Development ──────────────────────────────────────────────
  {
    videoId: '0-S5a0eXPoc',
    title: 'React Native & Expo Router Masterclass: Build Native iOS & Android Apps',
    description: 'Learn modern React Native with Expo Router, file-based navigation, Reanimated 3 physics animations, SQLite offline storage, and hardware camera sensors.',
    provider: 'YOUTUBE',
    domainId: 'mobile',
    milestoneId: 'mob_m1',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 360,
    thumbnailUrl: 'https://img.youtube.com/vi/0-S5a0eXPoc/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
    embedUrl: 'https://www.youtube-nocookie.com/embed/0-S5a0eXPoc',
    chapters: [
      { title: 'Expo Router Stack & Tab Navigation', timestampSeconds: 0 },
      { title: 'Native UI Layout with StyleSheet & Yoga', timestampSeconds: 2800 },
      { title: 'Offline-First Persistence with Expo SQLite', timestampSeconds: 7200 },
      { title: 'Reanimated 3 Physics & Gesture Handling', timestampSeconds: 12000 },
      { title: 'EAS Build Cloud Pipelines & TestFlight', timestampSeconds: 18000 },
    ],
    keyTakeaways: [
      'Building 60fps native apps using the React Native New Architecture (Fabric & JSI)',
      'Hardware integrations with CameraView, Location, and LocalAuthentication',
      'Automated App Store and Google Play distribution using EAS CLI',
    ],
    skills: ['React Native', 'Expo Router', 'TypeScript', 'Mobile Animations', 'SQLite'],
    difficulty: 'INTERMEDIATE',
    order: 1,
  },
  {
    videoId: 'mJ3bGvy0WAY',
    title: 'iOS Swift & SwiftUI Full Course for Beginners',
    description: 'Native iOS engineering with Swift 6 and SwiftUI. Learn state properties, NavigationStack, CoreData/SwiftData, async/await concurrency, and WidgetKit.',
    provider: 'YOUTUBE',
    domainId: 'mobile',
    milestoneId: 'mob_m8',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 420,
    thumbnailUrl: 'https://img.youtube.com/vi/mJ3bGvy0WAY/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=mJ3bGvy0WAY',
    embedUrl: 'https://www.youtube-nocookie.com/embed/mJ3bGvy0WAY',
    chapters: [
      { title: 'Swift 6 Syntax & Protocol-Oriented Design', timestampSeconds: 0 },
      { title: 'Declarative UI with SwiftUI View Hierarchies', timestampSeconds: 3600 },
      { title: 'SwiftData & Hardware Keychain Storage', timestampSeconds: 9000 },
      { title: 'Actors & Structured Concurrency', timestampSeconds: 15000 },
      { title: 'Xcode Profiling with Instruments', timestampSeconds: 21000 },
    ],
    keyTakeaways: [
      'Mastering Swift memory management (ARC) and memory leaks',
      'SwiftUI reactive data bindings with @State, @Binding, and @Observable',
      'Hardware-isolated biometric auth with LocalAuthentication framework',
    ],
    skills: ['Swift 6', 'SwiftUI', 'iOS Architecture', 'SwiftData', 'Xcode'],
    difficulty: 'ADVANCED',
    order: 2,
  },

  // ── 3. AI & Deep Learning ──────────────────────────────────────────────────
  {
    videoId: 'aircAruvnKk',
    title: 'Neural Networks: Zero to Hero by Andrej Karpathy',
    description: 'Build backpropagation, autograd engines, and deep neural networks completely from scratch with PyTorch. Covers micrograd, makemore, and GPT architectures.',
    provider: 'YOUTUBE',
    domainId: 'ai',
    milestoneId: 'ai_m4',
    channelTitle: 'Andrej Karpathy',
    durationMinutes: 150,
    thumbnailUrl: 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/aircAruvnKk',
    chapters: [
      { title: 'Derivative Intuition & Backprop Tree', timestampSeconds: 0 },
      { title: 'Building Micrograd Autograd Engine', timestampSeconds: 1800 },
      { title: 'Forward Pass & Loss Function Design', timestampSeconds: 4200 },
      { title: 'Gradient Descent Optimization Loop', timestampSeconds: 6600 },
    ],
    keyTakeaways: [
      'Exact mathematical derivation of reverse-mode automatic differentiation',
      'Vectorized tensor operations and computational graph execution',
      'Weight initialization, vanishing gradients, and regularization techniques',
    ],
    skills: ['PyTorch', 'Autograd', 'Calculus', 'Neural Networks', 'Python'],
    difficulty: 'INTERMEDIATE',
    order: 1,
  },
  {
    videoId: 'kCc8FmEb1nY',
    title: 'Let\'s build GPT: from scratch, in code, spelled out',
    description: 'Build a Generative Pre-trained Transformer (GPT) following the Attention Is All You Need paper. Implement scaled dot-product attention, multi-head attention, and layer norms.',
    provider: 'YOUTUBE',
    domainId: 'ai',
    milestoneId: 'ai_m5',
    channelTitle: 'Andrej Karpathy',
    durationMinutes: 120,
    thumbnailUrl: 'https://img.youtube.com/vi/kCc8FmEb1nY/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kCc8FmEb1nY',
    chapters: [
      { title: 'Transformer Tokenization & Embeddings', timestampSeconds: 0 },
      { title: 'Scaled Dot-Product Self-Attention', timestampSeconds: 2100 },
      { title: 'Multi-Head Attention & Causal Masking', timestampSeconds: 4200 },
      { title: 'Residual Connections & Layer Normalization', timestampSeconds: 5800 },
      { title: 'GPU Training Loop & Text Generation', timestampSeconds: 6800 },
    ],
    keyTakeaways: [
      'Self-attention mathematical formulation: Softmax((Q*K^T)/sqrt(d_k)) * V',
      'Causal masking preventing attention to future tokens during autoregression',
      'Inference scaling and temperature/top-k sampling strategies',
    ],
    skills: ['Transformers', 'LLMs', 'Attention Mechanism', 'PyTorch', 'CUDA'],
    difficulty: 'ADVANCED',
    order: 2,
  },

  // ── 4. Data Science & Machine Learning ──────────────────────────────────────
  {
    videoId: 'LHBE6Q9XlzI',
    title: 'Python for Data Science & Machine Learning Bootcamp',
    description: 'Master NumPy, Pandas data wrangling, Seaborn visualization, Scikit-Learn algorithms, Random Forests, XGBoost, and model evaluation metrics.',
    provider: 'YOUTUBE',
    domainId: 'data',
    milestoneId: 'ds_1',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 540,
    thumbnailUrl: 'https://img.youtube.com/vi/LHBE6Q9XlzI/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/LHBE6Q9XlzI',
    chapters: [
      { title: 'NumPy Vectorized Arrays & Broadcasting', timestampSeconds: 0 },
      { title: 'Pandas DataFrames & Time Series', timestampSeconds: 3600 },
      { title: 'Exploratory Data Analysis (EDA)', timestampSeconds: 9000 },
      { title: 'Supervised Learning: Linear & Logistic Regression', timestampSeconds: 15000 },
      { title: 'Decision Trees, Random Forests & XGBoost', timestampSeconds: 24000 },
      { title: 'Cross-Validation & Hyperparameter Tuning', timestampSeconds: 30000 },
    ],
    keyTakeaways: [
      'Vectorized computation replacing Python loops for 100x speedups',
      'Handling missing data, outliers, and categorical encoding with pipelines',
      'Preventing data leakage and optimizing ROC-AUC / F1-scores',
    ],
    skills: ['NumPy', 'Pandas', 'Scikit-Learn', 'Feature Engineering', 'XGBoost'],
    difficulty: 'INTERMEDIATE',
    order: 1,
  },

  // ── 5. Cloud & DevOps Engineering ──────────────────────────────────────────
  {
    videoId: '7xTGNNLPyMI',
    title: 'Docker & Kubernetes Full Course: Master Cloud Container Orchestration',
    description: 'Production containerization with multi-stage Docker builds, Docker Compose, Kubernetes pods, deployments, services, ingress controllers, and Helm charts.',
    provider: 'YOUTUBE',
    domainId: 'devops',
    channelTitle: 'TechWorld with Nana',
    durationMinutes: 300,
    thumbnailUrl: 'https://img.youtube.com/vi/7xTGNNLPyMI/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=7xTGNNLPyMI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7xTGNNLPyMI',
    chapters: [
      { title: 'Docker Architecture & Container Isolation', timestampSeconds: 0 },
      { title: 'Multi-Stage Dockerfiles for Production', timestampSeconds: 3200 },
      { title: 'Docker Compose Multi-Container Stacks', timestampSeconds: 6800 },
      { title: 'Kubernetes Architecture: Control Plane & Nodes', timestampSeconds: 10200 },
      { title: 'Pods, Deployments, Services & Ingress Routing', timestampSeconds: 13800 },
    ],
    keyTakeaways: [
      'Linux namespaces, cgroups, and container layer caching',
      'High-availability rolling updates and self-healing pods in Kubernetes',
      'Production cluster security and secrets management',
    ],
    skills: ['Docker', 'Kubernetes', 'K8s Ingress', 'Helm', 'Container Security'],
    difficulty: 'INTERMEDIATE',
    order: 1,
  },
  {
    videoId: 'R67XuYc9NQ4',
    title: 'GitHub Actions Tutorial: CI/CD Pipeline Automation',
    description: 'Automate build, test, and cloud deployment pipelines with GitHub Actions. Covers workflows, job matrices, self-hosted runners, and secret masking.',
    provider: 'YOUTUBE',
    domainId: 'devops',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 180,
    thumbnailUrl: 'https://img.youtube.com/vi/R67XuYc9NQ4/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=R67XuYc9NQ4',
    embedUrl: 'https://www.youtube-nocookie.com/embed/R67XuYc9NQ4',
    chapters: [
      { title: 'GitHub Actions Syntax & Triggers', timestampSeconds: 0 },
      { title: 'Building & Testing Full-Stack Monorepos', timestampSeconds: 2400 },
      { title: 'Automated Container Registry Push', timestampSeconds: 5400 },
      { title: 'Zero-Downtime Deployment to AWS', timestampSeconds: 8400 },
    ],
    keyTakeaways: [
      'Declarative YAML syntax for multi-stage continuous delivery',
      'Secret masking and OIDC credentials with cloud providers',
      'Parallel job matrix test execution reducing CI duration by 70%',
    ],
    skills: ['GitHub Actions', 'CI/CD Pipelines', 'Automated Testing', 'AWS Deployment'],
    difficulty: 'ADVANCED',
    order: 2,
  },

  // ── 6. Cybersecurity & Ethical Hacking ──────────────────────────────────────
  {
    videoId: '3Kq1MIfTWCE',
    title: 'Ethical Hacking Full Course: Learn Penetration Testing from Scratch',
    description: 'Comprehensive network security and ethical hacking masterclass. Covers reconnaissance, Nmap scanning, Burp Suite proxying, SQL injection, XSS, and buffer overflows.',
    provider: 'YOUTUBE',
    domainId: 'security',
    channelTitle: 'The Cyber Mentor',
    durationMinutes: 900,
    thumbnailUrl: 'https://img.youtube.com/vi/3Kq1MIfTWCE/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3Kq1MIfTWCE',
    chapters: [
      { title: 'Networking Fundamentals & TCP/IP Handshake', timestampSeconds: 0 },
      { title: 'Reconnaissance & OSINT Information Gathering', timestampSeconds: 7200 },
      { title: 'Port Scanning & Service Fingerprinting with Nmap', timestampSeconds: 14400 },
      { title: 'Web App Vulnerabilities: OWASP Top 10', timestampSeconds: 21600 },
      { title: 'Burp Suite Interception & API Exploit Payloads', timestampSeconds: 32400 },
      { title: 'Privilege Escalation on Linux & Windows', timestampSeconds: 43200 },
    ],
    keyTakeaways: [
      'Deep packet inspection and stateful firewall traversal',
      'OWASP Top 10 vulnerabilities (SQLi, SSRF, IDOR, Broken Authentication)',
      'Defensive hardening: Content Security Policy, rate limiting, and hashing',
    ],
    skills: ['Penetration Testing', 'Nmap', 'Burp Suite', 'OWASP Top 10', 'Linux Security'],
    difficulty: 'INTERMEDIATE',
    order: 1,
  },

  // ── 7. Blockchain & Web3 Engineering ───────────────────────────────────────
  {
    videoId: 'gyMwXuJbiXC',
    title: 'Solidity, Ethereum & Web3 Full Course: JavaScript & Hardhat',
    description: 'Complete Web3 development roadmap covering Solidity 0.8+, ERC-20 tokens, ERC-721 NFTs, decentralized finance (DeFi), smart contract auditing, and frontend ethers.js.',
    provider: 'YOUTUBE',
    domainId: 'blockchain',
    channelTitle: 'Patrick Collins (freeCodeCamp)',
    durationMinutes: 960,
    thumbnailUrl: 'https://img.youtube.com/vi/gyMwXuJbiXC/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=gyMwXuJbiXC',
    embedUrl: 'https://www.youtube-nocookie.com/embed/gyMwXuJbiXC',
    chapters: [
      { title: 'Blockchain Foundations & Cryptographic Hashes', timestampSeconds: 0 },
      { title: 'Solidity Syntax, Storage & Gas Optimization', timestampSeconds: 7200 },
      { title: 'Deploying with Hardhat & Foundry', timestampSeconds: 18000 },
      { title: 'ERC-20 Tokens & ERC-721 NFT Standards', timestampSeconds: 28800 },
      { title: 'Connecting Frontend DApps with Ethers.js', timestampSeconds: 39600 },
      { title: 'Smart Contract Security & Reentrancy Exploits', timestampSeconds: 48000 },
    ],
    keyTakeaways: [
      'EVM storage layout (slot alignment, memory vs storage gas costs)',
      'Writing secure reentrancy guards and audit checks',
      'Interacting with smart contracts from React using Wagmi and Viem',
    ],
    skills: ['Solidity', 'Hardhat', 'Ethereum', 'Ethers.js', 'Smart Contracts'],
    difficulty: 'ADVANCED',
    order: 1,
  },

  // ── 8. Game Development & Graphics ─────────────────────────────────────────
  {
    videoId: 'AmGSEH7QcDg',
    title: 'Unreal Engine 5 Beginner Tutorial: Build a Complete 3D Action Game',
    description: 'Learn Unreal Engine 5 from scratch with Lumen dynamic lighting, Nanite geometry virtualization, Blueprints, C++ game logic, Niagara VFX, and physics simulations.',
    provider: 'YOUTUBE',
    domainId: 'game',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 300,
    thumbnailUrl: 'https://img.youtube.com/vi/AmGSEH7QcDg/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=AmGSEH7QcDg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/AmGSEH7QcDg',
    chapters: [
      { title: 'UE5 Interface & Viewport Navigation', timestampSeconds: 0 },
      { title: 'Nanite Virtualized Geometry & Quixel Assets', timestampSeconds: 2400 },
      { title: 'Lumen Real-Time Global Illumination', timestampSeconds: 5400 },
      { title: 'Character Controller Blueprints & State Machines', timestampSeconds: 8400 },
      { title: 'C++ Gameplay Programming & Actor Lifecycle', timestampSeconds: 13200 },
    ],
    keyTakeaways: [
      '3D vector math, transformation matrices, and physics collisions',
      'Shader material graphs and PBR (Physically Based Rendering)',
      'Game state replication across multiplayer client-server architecture',
    ],
    skills: ['Unreal Engine 5', 'C++', 'Blueprints', 'Game Physics', '3D Graphics'],
    difficulty: 'INTERMEDIATE',
    order: 1,
  },

  // ── 9. Embedded Systems & IoT ───────────────────────────────────────────────
  {
    videoId: '1Udq9vWc_6M',
    title: 'Embedded Systems & Real-Time OS (FreeRTOS) Programming',
    description: 'Architect low-level embedded software on ARM Cortex-M and ESP32 with FreeRTOS. Covers task scheduling, semaphores, queues, I2C/SPI bus protocols, and BLE telemetry.',
    provider: 'YOUTUBE',
    domainId: 'embedded',
    channelTitle: 'Fastbit Embedded Brain Academy',
    durationMinutes: 240,
    thumbnailUrl: 'https://img.youtube.com/vi/1Udq9vWc_6M/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=1Udq9vWc_6M',
    embedUrl: 'https://www.youtube-nocookie.com/embed/1Udq9vWc_6M',
    chapters: [
      { title: 'Microcontroller Architecture & Memory Maps', timestampSeconds: 0 },
      { title: 'Bare-Metal Register Programming & GPIOs', timestampSeconds: 2400 },
      { title: 'Interrupt Service Routines (ISRs) & Timers', timestampSeconds: 5400 },
      { title: 'FreeRTOS Task Scheduling & Context Switching', timestampSeconds: 8400 },
      { title: 'I2C & SPI Sensor Communications', timestampSeconds: 11400 },
    ],
    keyTakeaways: [
      'Direct hardware manipulation using memory-mapped I/O registers',
      'Deterministic pre-emptive priority scheduling in real-time operating systems',
      'Low-power sleep states and battery management protocols',
    ],
    skills: ['Embedded C', 'FreeRTOS', 'ARM Cortex-M', 'ESP32', 'I2C/SPI'],
    difficulty: 'ADVANCED',
    order: 1,
  },

  // ── 10. UI/UX & Product Design ─────────────────────────────────────────────
  {
    videoId: 'c9Wg6Cb_YlU',
    title: 'Figma UI/UX Design Essentials Course: Master Design Systems',
    description: 'Professional UI/UX product design in Figma. Learn auto-layout 5.0, variables, design tokens, responsive components, interactive prototyping, and developer handoff.',
    provider: 'YOUTUBE',
    domainId: 'design',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 420,
    thumbnailUrl: 'https://img.youtube.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
    embedUrl: 'https://www.youtube-nocookie.com/embed/c9Wg6Cb_YlU',
    chapters: [
      { title: 'UI Fundamentals: Visual Hierarchy & Spacing', timestampSeconds: 0 },
      { title: 'Figma Auto-Layout & Fluid Responsiveness', timestampSeconds: 3600 },
      { title: 'Design Tokens: Colors, Typography & Elevations', timestampSeconds: 9000 },
      { title: 'Component Variants & Interactive Micro-Animations', timestampSeconds: 14400 },
      { title: 'WCAG 2.1 AA Accessibility & Color Contrast', timestampSeconds: 19800 },
    ],
    keyTakeaways: [
      'Scalable design system architecture using nested Figma components and variables',
      'Cognitive load reduction and usability heuristics (Nielsen Norman)',
      'Clean developer handoff with CSS variable specifications',
    ],
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Auto-Layout', 'Prototyping'],
    difficulty: 'BEGINNER',
    order: 1,
  },

  // ── 11. QA Engineering & SDET Automation ───────────────────────────────────
  {
    videoId: 'x_P-SfZpxbE',
    title: 'Playwright Test Automation: Complete SDET Framework Blueprint',
    description: 'Learn modern browser automation with Playwright and TypeScript. Covers page object model (POM), API mocking, parallel test runs, visual regression, and CI integration.',
    provider: 'YOUTUBE',
    domainId: 'qa',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 280,
    thumbnailUrl: 'https://img.youtube.com/vi/x_P-SfZpxbE/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=x_P-SfZpxbE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/x_P-SfZpxbE',
    chapters: [
      { title: 'Playwright Setup & Headless Browser Engines', timestampSeconds: 0 },
      { title: 'Robust Locators (Role, Text, TestId)', timestampSeconds: 2400 },
      { title: 'Page Object Model (POM) Design Pattern', timestampSeconds: 5400 },
      { title: 'Network Request Interception & Mocking', timestampSeconds: 9000 },
      { title: 'Visual Regression & Snapshot Comparisons', timestampSeconds: 12600 },
    ],
    keyTakeaways: [
      'Auto-waiting mechanisms eliminating flaky test failures',
      'Multi-tab and multi-context testing for complex user workflows',
      'Generating rich HTML execution reports with video and trace files',
    ],
    skills: ['Playwright', 'TypeScript', 'SDET', 'Page Object Model', 'E2E Testing'],
    difficulty: 'INTERMEDIATE',
    order: 1,
  },

  // ── 12. Data Analytics & Business Intelligence ─────────────────────────────
  {
    videoId: '7S_tz1z_5bA',
    title: 'SQL for Data Analysis: Full Database Querying Masterclass',
    description: 'Master advanced SQL for business intelligence and analytics. Covers CTEs, window functions (ROW_NUMBER, RANK, DENSE_RANK), joins, aggregations, and query optimization.',
    provider: 'YOUTUBE',
    domainId: 'analytics',
    channelTitle: 'freeCodeCamp.org',
    durationMinutes: 260,
    thumbnailUrl: 'https://img.youtube.com/vi/7S_tz1z_5bA/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=7S_tz1z_5bA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/7S_tz1z_5bA',
    chapters: [
      { title: 'Relational Database Concepts & SELECT Primitives', timestampSeconds: 0 },
      { title: 'Multi-Table Inner & Outer Joins', timestampSeconds: 2400 },
      { title: 'Aggregations, GROUP BY & HAVING Clauses', timestampSeconds: 6000 },
      { title: 'Common Table Expressions (CTEs) & Subqueries', timestampSeconds: 9600 },
      { title: 'Analytical Window Functions (LEAD, LAG, NTILE)', timestampSeconds: 12600 },
    ],
    keyTakeaways: [
      'Executing complex multi-table cohort and retention analytics',
      'Window calculations across partitioned row sets with zero table locks',
      'Query execution plans (EXPLAIN ANALYZE) and B-Tree indexing',
    ],
    skills: ['SQL', 'Window Functions', 'Data Modeling', 'Business Intelligence', 'Analytics'],
    difficulty: 'BEGINNER',
    order: 1,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE HELPER METHODS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns all video lectures associated with a specific engineering domain.
 * Supports Redis caching with 1-hour TTL.
 */
export async function getVideosForDomain(domainId: string): Promise<IVideoSeedItem[]> {
  const normalizedId = domainId.toLowerCase().trim();
  const cacheKey = `nexora:videos:domain:${normalizedId}`;

  try {
    const redis = getRedisClient();
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    logger.warn('[VideoProviderService] Redis cache lookup failed, falling back to catalog:', err);
  }

  const results = CURATED_VIDEO_CATALOG.filter((v) => v.domainId === normalizedId);

  // If no direct matches, return general fullstack/ai videos as fallback
  const finalResults = results.length > 0 ? results : CURATED_VIDEO_CATALOG.slice(0, 4);

  try {
    const redis = getRedisClient();
    await redis.set(cacheKey, JSON.stringify(finalResults), 'EX', 3600);
  } catch (err) {
    // Non-critical cache error
  }

  return finalResults;
}

/**
 * Retrieves a single video by its videoId.
 */
export function getVideoById(videoId: string): IVideoSeedItem | null {
  return CURATED_VIDEO_CATALOG.find((v) => v.videoId === videoId) || null;
}

/**
 * Returns all available domains with their respective video lecture counts.
 */
export function getDomainVideoCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  CURATED_VIDEO_CATALOG.forEach((v) => {
    counts[v.domainId] = (counts[v.domainId] || 0) + 1;
  });
  return counts;
}
