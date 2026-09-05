/**
 * NEXORA Dynamic Roadmap Catalog
 * Covers all 12 dream job career domains + subset specialization tracks + fallback.
 */

export const ROADMAP_DOMAINS = {
  data: {
    id: 'data',
    category: 'Data Science & AI',
    title: 'Data Science & Machine Learning Engineer',
    matchKeys: ['data', 'machine learning', 'ai', 'artificial intelligence', 'ml', 'deep learning'],
    description: 'Master mathematical modeling, statistical analysis, deep neural networks, and production ML pipelines.',
    coreSteps: [
      {
        id: 'ds_1',
        title: 'Python for Data Engineering & Scientific Computing',
        description: 'Master vectorized computations with NumPy, manipulation with Pandas, and data wrangling.',
        estimatedTime: '3 Weeks',
        skills: ['Python 3.12', 'NumPy', 'Pandas', 'Data Cleaning'],
        status: 'completed'
      },
      {
        id: 'ds_2',
        title: 'Exploratory Data Analysis & Statistical Modeling',
        description: 'Hypothesis testing, distributions, feature engineering, and high-impact visual reporting.',
        estimatedTime: '4 Weeks',
        skills: ['Scipy', 'Matplotlib', 'Seaborn', 'Hypothesis Testing'],
        status: 'in-progress'
      },
      {
        id: 'ds_3',
        title: 'Classical Machine Learning Algorithms',
        description: 'Supervised & unsupervised learning: XGBoost, Random Forests, SVMs, and PCA dimensionality reduction.',
        estimatedTime: '5 Weeks',
        skills: ['Scikit-Learn', 'XGBoost', 'Hyperparameter Tuning', 'Cross-Validation'],
        status: 'locked'
      },
      {
        id: 'ds_4',
        title: 'Deep Learning with PyTorch & Transformers',
        description: 'Convolutional neural networks, attention mechanisms, embeddings, and transfer learning.',
        estimatedTime: '6 Weeks',
        skills: ['PyTorch', 'Transformers', 'Hugging Face', 'CUDA Basics'],
        status: 'locked'
      },
      {
        id: 'ds_5',
        title: 'Production MLOps & Model Serving',
        description: 'Containerize models with Docker, serve via FastAPI/Triton, and track experiments with MLflow.',
        estimatedTime: '4 Weeks',
        skills: ['MLflow', 'FastAPI', 'Docker', 'Model Registry'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'ds_subset_llm',
      title: 'Generative AI & Agentic Systems Specialization',
      badge: 'Advanced Subset',
      description: 'Cutting-edge specialization track focusing on Large Language Models, RAG pipelines, and autonomous AI agents.',
      steps: [
        {
          id: 'ds_sub_1',
          title: 'Advanced RAG & Vector Databases',
          description: 'Build semantic search pipelines with Pinecone/Qdrant, hybrid retrieval, and reranking models.',
          estimatedTime: '3 Weeks',
          skills: ['Pinecone', 'LangChain', 'LlamaIndex', 'Hybrid Search'],
          status: 'in-progress'
        },
        {
          id: 'ds_sub_2',
          title: 'Fine-Tuning Open Source LLMs (LoRA/QLoRA)',
          description: 'Parameter-efficient fine-tuning of Llama 3 and Mistral models on proprietary enterprise datasets.',
          estimatedTime: '4 Weeks',
          skills: ['PEFT', 'LoRA', 'Axolotl', 'Dataset Curation'],
          status: 'locked'
        },
        {
          id: 'ds_sub_3',
          title: 'Autonomous Multi-Agent Architectures',
          description: 'Design self-correcting agent swarms using LangGraph, CrewAI, and structured tool calling.',
          estimatedTime: '3 Weeks',
          skills: ['LangGraph', 'CrewAI', 'Tool Calling', 'Agent Memory'],
          status: 'locked'
        }
      ]
    }
  },

  fullstack: {
    id: 'fullstack',
    category: 'Full Stack Engineering',
    title: 'Modern Full Stack Software Engineer',
    matchKeys: ['full stack', 'fullstack', 'software engineer', 'web developer', 'mern'],
    description: 'Architect resilient client-server systems, modern React applications, scalable APIs, and distributed cloud services.',
    coreSteps: [
      {
        id: 'fs_1',
        title: 'Modern TypeScript & Frontend Component Architecture',
        description: 'State management, custom hooks, atomic design principles, and component isolation.',
        estimatedTime: '3 Weeks',
        skills: ['TypeScript', 'React 19', 'Tailwind CSS', 'Vite'],
        status: 'completed'
      },
      {
        id: 'fs_2',
        title: 'Backend API Design & Authentication',
        description: 'RESTful API protocols, JWT session invalidation, OAuth2, and RBAC authorization schemes.',
        estimatedTime: '4 Weeks',
        skills: ['Node.js', 'Express', 'JWT', 'REST API'],
        status: 'in-progress'
      },
      {
        id: 'fs_3',
        title: 'Database Architecture & ORMs',
        description: 'Relational data modeling with PostgreSQL, indexing, migrations with Prisma, and NoSQL with MongoDB.',
        estimatedTime: '4 Weeks',
        skills: ['PostgreSQL', 'Prisma ORM', 'Redis Caching', 'Query Tuning'],
        status: 'locked'
      },
      {
        id: 'fs_4',
        title: 'Real-Time Communication & WebSockets',
        description: 'Build bi-directional streaming applications, chat engines, and collaborative multi-user canvases.',
        estimatedTime: '3 Weeks',
        skills: ['Socket.io', 'WebSockets', 'SSE', 'Pub/Sub'],
        status: 'locked'
      },
      {
        id: 'fs_5',
        title: 'Cloud CI/CD & Production Deployment',
        description: 'Automated GitHub Actions pipelines, Docker container orchestration, and serverless edge functions.',
        estimatedTime: '4 Weeks',
        skills: ['Docker', 'GitHub Actions', 'AWS/Vercel', 'Monitoring'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'fs_subset_cloud',
      title: 'Cloud-Native & Distributed Microservices Specialization',
      badge: 'Advanced Subset',
      description: 'Specialization focusing on gRPC communication, event-driven architectures (Kafka), and Kubernetes orchestration.',
      steps: [
        {
          id: 'fs_sub_1',
          title: 'Event-Driven Architecture with Apache Kafka',
          description: 'Design decoupled asynchronous event streams, message idempotency, and consumer groups.',
          estimatedTime: '3 Weeks',
          skills: ['Kafka', 'Event Sourcing', 'CQRS', 'Dead Letter Queues'],
          status: 'in-progress'
        },
        {
          id: 'fs_sub_2',
          title: 'gRPC & Protocol Buffers Inter-Service RPC',
          description: 'High-performance microservice communication with streaming gRPC and schema validation.',
          estimatedTime: '3 Weeks',
          skills: ['Protobuf', 'gRPC', 'Service Discovery', 'Envoy Proxy'],
          status: 'locked'
        },
        {
          id: 'fs_sub_3',
          title: 'Zero-Downtime Blue-Green & Canary Deployments',
          description: 'Implement automated canary rollouts and traffic shaping with Argo Rollouts and Istio service mesh.',
          estimatedTime: '4 Weeks',
          skills: ['ArgoCD', 'Istio', 'Kubernetes', 'Helm Charts'],
          status: 'locked'
        }
      ]
    }
  },

  frontend: {
    id: 'frontend',
    category: 'Frontend Engineering',
    title: 'Frontend & Web Experience Engineer',
    matchKeys: ['front', 'frontend', 'ui developer', 'web design'],
    description: 'Craft blisteringly fast, accessible, and delightful interactive user interfaces with modern web standards.',
    coreSteps: [
      {
        id: 'fe_1',
        title: 'Advanced Modern CSS, Flexbox & Grid Systems',
        description: 'CSS variables, container queries, modern layouts, and fluid typography.',
        estimatedTime: '2 Weeks',
        skills: ['Modern CSS', 'Subgrid', 'Animations', 'Tailwind'],
        status: 'completed'
      },
      {
        id: 'fe_2',
        title: 'Deep-Dive React Internals & Concurrency',
        description: 'Server Components, Suspense boundaries, Transitions, and performance profiler mastery.',
        estimatedTime: '4 Weeks',
        skills: ['React 19', 'Hooks Optimization', 'Render Profiling'],
        status: 'in-progress'
      },
      {
        id: 'fe_3',
        title: 'Global State Management & Server Cache',
        description: 'Client state with Zustand and intelligent server synchronization using TanStack Query.',
        estimatedTime: '3 Weeks',
        skills: ['Zustand', 'TanStack Query', 'Optimistic Updates'],
        status: 'locked'
      },
      {
        id: 'fe_4',
        title: 'Web Performance Optimization & Core Web Vitals',
        description: 'Critical rendering path, image CDNs, tree shaking, and sub-second Largest Contentful Paint (LCP).',
        estimatedTime: '3 Weeks',
        skills: ['Lighthouse', 'Code Splitting', 'Bundle Analysis'],
        status: 'locked'
      },
      {
        id: 'fe_5',
        title: 'Frontend Testing & Design System Packaging',
        description: 'Component unit testing with Vitest/Testing Library, E2E testing with Playwright, and Storybook documentation.',
        estimatedTime: '4 Weeks',
        skills: ['Vitest', 'Playwright', 'Storybook', 'WCAG 2.2 AA'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'fe_subset_3d',
      title: '3D Web, WebGL & Creative Coding Specialization',
      badge: 'Advanced Subset',
      description: 'Specialization for immersive web experiences using Three.js, React Three Fiber, and custom GLSL shaders.',
      steps: [
        {
          id: 'fe_sub_1',
          title: 'Three.js & React Three Fiber (R3F)',
          description: 'Load GLTF/GLB models, configure camera frustums, realistic PBR lights, and physics simulations.',
          estimatedTime: '4 Weeks',
          skills: ['Three.js', 'React Three Fiber', 'Drei', 'Camera Controls'],
          status: 'in-progress'
        },
        {
          id: 'fe_sub_2',
          title: 'GLSL Shaders & Custom Post-Processing',
          description: 'Write custom vertex and fragment shaders for neon glows, liquid displacement, and particle effects.',
          estimatedTime: '4 Weeks',
          skills: ['GLSL', 'Postprocessing', 'Shader Toy', 'UV Mapping'],
          status: 'locked'
        }
      ]
    }
  },

  backend: {
    id: 'backend',
    category: 'Backend & Cloud',
    title: 'Backend, Cloud & DevOps Architect',
    matchKeys: ['back', 'backend', 'cloud', 'devops', 'sysadmin', 'sre', 'aws'],
    description: 'Build enterprise-scale distributed systems, multi-cloud infrastructure, high-throughput pipelines, and robust security.',
    coreSteps: [
      {
        id: 'be_1',
        title: 'High-Performance Backend in Go / Node.js',
        description: 'Concurrency models, goroutines, async I/O loops, and memory management.',
        estimatedTime: '4 Weeks',
        skills: ['Go / Node', 'Concurrency', 'HTTP/2', 'WebSockets'],
        status: 'completed'
      },
      {
        id: 'be_2',
        title: 'Database Internals & High-Availability Clusters',
        description: 'B-Trees, Write-Ahead Logs (WAL), Read Replicas, Sharding, and distributed locks with Redis.',
        estimatedTime: '4 Weeks',
        skills: ['PostgreSQL', 'Redis', 'Connection Pooling', 'Sharding'],
        status: 'in-progress'
      },
      {
        id: 'be_3',
        title: 'Cloud Infrastructure with AWS / Terraform',
        description: 'VPC subnets, ECS/EKS clusters, IAM least-privilege policies, and Infrastructure as Code.',
        estimatedTime: '5 Weeks',
        skills: ['AWS', 'Terraform', 'IAM', 'VPC Networking'],
        status: 'locked'
      },
      {
        id: 'be_4',
        title: 'Container Orchestration with Kubernetes',
        description: 'Pods, Services, Ingress Controllers, StatefulSets, ConfigMaps, and Helm package management.',
        estimatedTime: '5 Weeks',
        skills: ['Kubernetes', 'Helm', 'Ingress NGINX', 'Storage Classes'],
        status: 'locked'
      },
      {
        id: 'be_5',
        title: 'Observability, SRE & Chaos Engineering',
        description: 'Distributed tracing with OpenTelemetry, Prometheus metrics, Grafana dashboards, and SLI/SLO alerts.',
        estimatedTime: '3 Weeks',
        skills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Chaos Mesh'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'be_subset_sre',
      title: 'Site Reliability Engineering (SRE) & Chaos Automation',
      badge: 'Advanced Subset',
      description: 'Focus on automated incident remediation, zero-downtime database failovers, and latency budget management.',
      steps: [
        {
          id: 'be_sub_1',
          title: 'Automated Failover & Multi-Region Replication',
          description: 'Configure active-passive and active-active geographic database failovers across AWS regions.',
          estimatedTime: '3 Weeks',
          skills: ['Route 53 Failover', 'Aurora Global DB', 'Cross-Region S3'],
          status: 'in-progress'
        },
        {
          id: 'be_sub_2',
          title: 'Chaos Engineering & Automated Load Testing',
          description: 'Simulate packet drops, memory leaks, and pod evictions using Chaos Mesh and k6 load testing.',
          estimatedTime: '3 Weeks',
          skills: ['k6', 'Chaos Mesh', 'Latency Injection', 'Runbooks'],
          status: 'locked'
        }
      ]
    }
  },

  design: {
    id: 'design',
    category: 'Product Design',
    title: 'UI/UX & Product Experience Designer',
    matchKeys: ['design', 'ui', 'ux', 'product design', 'graphic', 'figma'],
    description: 'Design intuitive, accessible, and emotionally engaging digital products through iterative user-centered research.',
    coreSteps: [
      {
        id: 'de_1',
        title: 'Design Foundations & Visual Hierarchy',
        description: 'Typography scales, 8pt spacing grids, color psychology, and cognitive visual affordances.',
        estimatedTime: '3 Weeks',
        skills: ['Figma', 'Visual Hierarchy', 'Color Theory', 'Layouts'],
        status: 'completed'
      },
      {
        id: 'de_2',
        title: 'User Research & Journey Mapping',
        description: 'User interviews, persona synthesis, empathy maps, and end-to-end task flow optimization.',
        estimatedTime: '3 Weeks',
        skills: ['User Interviews', 'Personas', 'Journey Mapping'],
        status: 'in-progress'
      },
      {
        id: 'de_3',
        title: 'Scalable Design Systems & Token Architecture',
        description: 'Component variants, auto-layout 5.0, variables, design tokens, and developer handoff documentation.',
        estimatedTime: '4 Weeks',
        skills: ['Figma Variables', 'Design Tokens', 'Storybook Sync'],
        status: 'locked'
      },
      {
        id: 'de_4',
        title: 'Micro-Interactions & Prototyping',
        description: 'Smart animate transitions, interactive component states, and motion physics in Protopie / Figma.',
        estimatedTime: '3 Weeks',
        skills: ['Prototyping', 'Micro-interactions', 'Protopie'],
        status: 'locked'
      },
      {
        id: 'de_5',
        title: 'Accessibility Audits (WCAG 2.2) & Usability Testing',
        description: 'Screen reader flow testing, contrast ratios, and live qualitative moderated user tests.',
        estimatedTime: '3 Weeks',
        skills: ['WCAG Guidelines', 'Usability Testing', 'Maze Analytics'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'de_subset_spatial',
      title: 'Spatial UI & XR (AR/VR) Design Specialization',
      badge: 'Advanced Subset',
      description: 'Pioneer next-generation 3D spatial computing interfaces for Apple Vision Pro and Meta Quest.',
      steps: [
        {
          id: 'de_sub_1',
          title: 'Spatial Audio & Depth Layering Principles',
          description: 'Design depth planes, gaze-and-pinch interactions, and directional spatial sound cues.',
          estimatedTime: '3 Weeks',
          skills: ['Spline 3D', 'Spatial UI Guidelines', 'Gaze Tracking'],
          status: 'in-progress'
        },
        {
          id: 'de_sub_2',
          title: 'VisionOS & Immersive Environment Mockups',
          description: 'Create spatial glassmorphism window systems, ornaments, and volumetric content in Bezi / Spline.',
          estimatedTime: '4 Weeks',
          skills: ['Bezi', 'VisionOS Design', 'Volumetric Assets'],
          status: 'locked'
        }
      ]
    }
  },

  game: {
    id: 'game',
    category: 'Game Development',
    title: 'Game Engine & Gameplay Programmer',
    matchKeys: ['game', 'unity', 'unreal', 'gaming', 'godot'],
    description: 'Develop immersive 2D/3D video games, gameplay mechanics, physics controllers, and game engine architecture.',
    coreSteps: [
      {
        id: 'gm_1',
        title: 'C# & Unity Engine Architecture',
        description: 'Game loop lifecycle, component architecture, prefab hierarchies, and physics triggers.',
        estimatedTime: '3 Weeks',
        skills: ['C#', 'Unity 6', 'Input System', 'Prefabs'],
        status: 'completed'
      },
      {
        id: 'gm_2',
        title: 'Player Mechanics & State Machines',
        description: 'Character controllers, finite state machines (FSM), inventory systems, and camera transitions.',
        estimatedTime: '4 Weeks',
        skills: ['FSM', 'Cinemachine', 'Raycasting', 'Inventories'],
        status: 'in-progress'
      },
      {
        id: 'gm_3',
        title: 'AI Behavior Trees & Pathfinding',
        description: 'NavMesh pathfinding, enemy steering behaviors, line of sight, and sensory perception.',
        estimatedTime: '4 Weeks',
        skills: ['NavMesh', 'Behavior Trees', 'Enemy AI'],
        status: 'locked'
      },
      {
        id: 'gm_4',
        title: 'Shader Graphs & Visual Effects (VFX)',
        description: 'Custom particle systems, stylized water shaders, post-processing profiles, and audio spatialization.',
        estimatedTime: '4 Weeks',
        skills: ['Shader Graph', 'VFX Graph', 'FMOD Audio'],
        status: 'locked'
      },
      {
        id: 'gm_5',
        title: 'Game Performance Profiling & Multiplatform Export',
        description: 'Draw call batching, memory garbage collection optimization, and build deployment to PC/Consoles.',
        estimatedTime: '3 Weeks',
        skills: ['Unity Profiler', 'Occlusion Culling', 'Steamworks API'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'gm_subset_net',
      title: 'Multiplayer Networking & Server Authoritative Systems',
      badge: 'Advanced Subset',
      description: 'Specialization in client prediction, lag compensation, and authoritative dedicated game servers.',
      steps: [
        {
          id: 'gm_sub_1',
          title: 'Netcode for GameObjects & Client Prediction',
          description: 'Synchronize player transforms, interpolate movement, and reconcile server state discrepancies.',
          estimatedTime: '4 Weeks',
          skills: ['Unity Netcode', 'RPCs', 'NetworkVariables'],
          status: 'in-progress'
        },
        {
          id: 'gm_sub_2',
          title: 'Dedicated Headless Game Server Hosting',
          description: 'Deploy headless game server builds on AWS GameLift or Agones Kubernetes clusters.',
          estimatedTime: '4 Weeks',
          skills: ['Headless Linux Builds', 'Matchmaking', 'Agones / GameLift'],
          status: 'locked'
        }
      ]
    }
  },

  blockchain: {
    id: 'blockchain',
    category: 'Web3 & Decentralized Tech',
    title: 'Blockchain & Smart Contract Engineer',
    matchKeys: ['blockchain', 'web3', 'crypto', 'solidity', 'ethereum'],
    description: 'Engineer secure EVM smart contracts, decentralized finance (DeFi) protocols, and trustless dApps.',
    coreSteps: [
      {
        id: 'bc_1',
        title: 'Ethereum Cryptography & EVM Fundamentals',
        description: 'Public/private key cryptography, gas mechanics, memory vs storage slots, and RPC node architecture.',
        estimatedTime: '3 Weeks',
        skills: ['Cryptography', 'EVM', 'Gas Optimization', 'JSON-RPC'],
        status: 'completed'
      },
      {
        id: 'bc_2',
        title: 'Solidity Smart Contract Development with Foundry',
        description: 'ERC-20/721/1155 token standards, inheritance, events, custom errors, and comprehensive unit tests.',
        estimatedTime: '4 Weeks',
        skills: ['Solidity 0.8+', 'Foundry', 'Forge Tests', 'OpenZeppelin'],
        status: 'in-progress'
      },
      {
        id: 'bc_3',
        title: 'Frontend dApp Integration with Wagmi & Viem',
        description: 'Wallet connection modals, contract read/write hooks, transaction simulation, and event listening.',
        estimatedTime: '3 Weeks',
        skills: ['Viem', 'Wagmi', 'RainbowKit', 'Ethers.js'],
        status: 'locked'
      },
      {
        id: 'bc_4',
        title: 'Smart Contract Security Auditing',
        description: 'Detecting reentrancy, oracle front-running, integer overflow, flash loan exploits, and static analysis.',
        estimatedTime: '4 Weeks',
        skills: ['Slither', 'Echidna Fuzzing', 'Attack Vectors', 'Reentrancy'],
        status: 'locked'
      },
      {
        id: 'bc_5',
        title: 'Layer 2 Rollups & Multi-Chain Architecture',
        description: 'Deploying contracts on Arbitrum, Optimism, and Base; cross-chain bridging with LayerZero.',
        estimatedTime: '3 Weeks',
        skills: ['Arbitrum', 'Optimism', 'LayerZero', 'Bridge Contracts'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'bc_subset_zk',
      title: 'Zero-Knowledge Proofs (ZKPs) & Account Abstraction',
      badge: 'Advanced Subset',
      description: 'Specialization in zk-SNARKs, privacy-preserving contracts, and ERC-4337 smart contract wallets.',
      steps: [
        {
          id: 'bc_sub_1',
          title: 'Circom & zk-SNARK Circuit Construction',
          description: 'Write arithmetic constraint circuits in Circom, generate proving/verifying keys with SnarkJS.',
          estimatedTime: '4 Weeks',
          skills: ['Circom', 'SnarkJS', 'Groth16', 'ZK Verifiers'],
          status: 'in-progress'
        },
        {
          id: 'bc_sub_2',
          title: 'ERC-4337 Account Abstraction & Paymasters',
          description: 'Implement gasless transactions, biometric signers, and session keys with UserOperations.',
          estimatedTime: '3 Weeks',
          skills: ['ERC-4337', 'Paymasters', 'Bundlers', 'Session Keys'],
          status: 'locked'
        }
      ]
    }
  },

  security: {
    id: 'security',
    category: 'Cybersecurity',
    title: 'Cybersecurity & Ethical Hacking Specialist',
    matchKeys: ['security', 'cyber', 'pentest', 'ethical hacking', 'infosec'],
    description: 'Defend systems from sophisticated cyber threats through vulnerability assessments, red team exercises, and zero trust security.',
    coreSteps: [
      {
        id: 'sec_1',
        title: 'Computer Networking & Protocol Security',
        description: 'Deep packet inspection with Wireshark, TCP/IP handshakes, DNS spoofing, and TLS handshake security.',
        estimatedTime: '3 Weeks',
        skills: ['Wireshark', 'TCP/IP', 'TLS 1.3', 'Network Firewalls'],
        status: 'completed'
      },
      {
        id: 'sec_2',
        title: 'Linux Hardening & Privilege Escalation',
        description: 'Kernel exploits, SUID abuse, cron job hijackings, and secure bash automation.',
        estimatedTime: '4 Weeks',
        skills: ['Linux Hardening', 'Privilege Escalation', 'SELinux'],
        status: 'in-progress'
      },
      {
        id: 'sec_3',
        title: 'Web Application Penetration Testing',
        description: 'OWASP Top 10 mastery: SQLi, SSRF, XSS, broken access controls, and Burp Suite automation.',
        estimatedTime: '5 Weeks',
        skills: ['Burp Suite Pro', 'OWASP Top 10', 'SQLMap', 'Auth Bypass'],
        status: 'locked'
      },
      {
        id: 'sec_4',
        title: 'Active Directory Attacks & Defense',
        description: 'Kerberoasting, Pass-the-Hash, BloodHound graph analysis, and defensive Group Policy hardening.',
        estimatedTime: '4 Weeks',
        skills: ['Active Directory', 'BloodHound', 'Mimikatz', 'Kerberos'],
        status: 'locked'
      },
      {
        id: 'sec_5',
        title: 'SOC Operations & Incident Response',
        description: 'Log telemetry correlation with Splunk/Wazuh, threat hunting with YARA rules, and post-mortem containment.',
        estimatedTime: '4 Weeks',
        skills: ['Splunk', 'Wazuh SIEM', 'YARA Rules', 'Forensics'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'sec_subset_cloud',
      title: 'DevSecOps & Cloud Security Posture (CSPM)',
      badge: 'Advanced Subset',
      description: 'Specialization in automated SAST/DAST pipelines, container security (Trivy), and AWS CloudTrail audit policies.',
      steps: [
        {
          id: 'sec_sub_1',
          title: 'Automated CI/CD Vulnerability Scanning',
          description: 'Embed Semgrep, Snyk, and Trufflehog into GitHub Actions to prevent secret leaks and code vulnerabilities.',
          estimatedTime: '3 Weeks',
          skills: ['Semgrep', 'Trufflehog', 'Snyk', 'GitHub Actions'],
          status: 'in-progress'
        },
        {
          id: 'sec_sub_2',
          title: 'AWS Cloud Security & GuardDuty Posture',
          description: 'Remediate unauthorized S3 bucket access, configure AWS Security Hub, and detect IAM anomalies.',
          estimatedTime: '3 Weeks',
          skills: ['AWS GuardDuty', 'Security Hub', 'IAM Audit', 'CloudTrail'],
          status: 'locked'
        }
      ]
    }
  },

  analytics: {
    id: 'analytics',
    category: 'Analytics & BI',
    title: 'Business Intelligence & Product Analyst',
    matchKeys: ['business', 'analytics', 'bi', 'product manager', 'tableau', 'data analyst'],
    description: 'Transform complex business datasets into strategic revenue growth drivers and predictive executive dashboards.',
    coreSteps: [
      {
        id: 'an_1',
        title: 'Advanced SQL Querying & Data Modeling',
        description: 'Window functions, Common Table Expressions (CTEs), recursive queries, and dimensional star schema design.',
        estimatedTime: '3 Weeks',
        skills: ['Advanced SQL', 'Window Functions', 'Star Schemas', 'PostgreSQL'],
        status: 'completed'
      },
      {
        id: 'an_2',
        title: 'Interactive Dashboarding with Tableau & Power BI',
        description: 'LOD calculations, parameterized drill-downs, dynamic storytelling, and executive KPI summaries.',
        estimatedTime: '4 Weeks',
        skills: ['Tableau', 'Power BI', 'DAX', 'Storyboarding'],
        status: 'in-progress'
      },
      {
        id: 'an_3',
        title: 'Product Analytics & Funnel Optimization',
        description: 'Cohort retention analysis, user churn prediction, Mixpanel event instrumentation, and A/B test design.',
        estimatedTime: '4 Weeks',
        skills: ['Mixpanel', 'Cohort Retention', 'A/B Testing', 'Hypothesis Design'],
        status: 'locked'
      },
      {
        id: 'an_4',
        title: 'Python for Statistical Forecasting',
        description: 'Time series forecasting with ARIMA/Prophet, customer lifetime value (LTV), and marketing attribution modeling.',
        estimatedTime: '4 Weeks',
        skills: ['Python', 'Prophet', 'Statsmodels', 'LTV Modeling'],
        status: 'locked'
      },
      {
        id: 'an_5',
        title: 'Modern Cloud Data Warehousing (Snowflake/BigQuery)',
        description: 'Data transformation pipelines with dbt (data build tool), partitioning, and clustering strategies.',
        estimatedTime: '3 Weeks',
        skills: ['Snowflake', 'BigQuery', 'dbt Cloud', 'ELT Pipelines'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'an_subset_growth',
      title: 'Predictive Growth Modeling & Real-Time KPIs',
      badge: 'Advanced Subset',
      description: 'Specialization in streaming product metrics and algorithmic churn mitigation systems.',
      steps: [
        {
          id: 'an_sub_1',
          title: 'Algorithmic Churn Prediction Pipelines',
          description: 'Train logistic regression & random forest classifiers to score at-risk accounts before contract renewals.',
          estimatedTime: '3 Weeks',
          skills: ['Scikit-Learn', 'Feature Store', 'Churn Scoring'],
          status: 'in-progress'
        },
        {
          id: 'an_sub_2',
          title: 'Real-Time Streaming Metrics with DuckDB & Kafka',
          description: 'Query in-flight telemetry streams with sub-second latency for live executive command centers.',
          estimatedTime: '3 Weeks',
          skills: ['DuckDB', 'Kafka Streaming', 'Fast Querying'],
          status: 'locked'
        }
      ]
    }
  },

  qa: {
    id: 'qa',
    category: 'QA & Test Engineering',
    title: 'Quality Assurance & Automation Engineer',
    matchKeys: ['qa', 'quality', 'test', 'automation engineer', 'sdet'],
    description: 'Ensure software reliability, performance, and bug-free user experiences through end-to-end automated testing.',
    coreSteps: [
      {
        id: 'qa_1',
        title: 'Testing Fundamentals & Test Case Matrix Design',
        description: 'Boundary value analysis, equivalence partitioning, state transition testing, and Jira bug workflows.',
        estimatedTime: '2 Weeks',
        skills: ['Test Cases', 'Jira', 'Regression Testing', 'Bug Reporting'],
        status: 'completed'
      },
      {
        id: 'qa_2',
        title: 'API Testing with Postman & REST Assured',
        description: 'Automate REST endpoint assertions, JSON schema validation, auth token refreshes, and contract testing.',
        estimatedTime: '3 Weeks',
        skills: ['Postman', 'Newman CLI', 'REST Assured', 'Schema Validation'],
        status: 'in-progress'
      },
      {
        id: 'qa_3',
        title: 'Modern Browser Automation with Playwright / Cypress',
        description: 'Page Object Models (POM), auto-waiting mechanisms, visual regression testing, and mock network intercepts.',
        estimatedTime: '4 Weeks',
        skills: ['Playwright', 'TypeScript', 'POM Architecture', 'Mock Intercepts'],
        status: 'locked'
      },
      {
        id: 'qa_4',
        title: 'Mobile Automation with Appium',
        description: 'Automate iOS and Android test suites across physical devices and cloud device farms.',
        estimatedTime: '4 Weeks',
        skills: ['Appium', 'Android ADB', 'iOS XCUITest', 'BrowserStack'],
        status: 'locked'
      },
      {
        id: 'qa_5',
        title: 'Performance & Load Testing with k6',
        description: 'Script virtual user ramps, stress tests, soak tests, and analyze P99 response latency bottlenecks.',
        estimatedTime: '3 Weeks',
        skills: ['k6', 'Load Testing', 'Latency Benchmarking'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'qa_subset_chaos',
      title: 'Chaos Testing & Contract Verification Specialization',
      badge: 'Advanced Subset',
      description: 'Specialization in Pact consumer-driven contract testing and deliberate fault injection.',
      steps: [
        {
          id: 'qa_sub_1',
          title: 'Consumer-Driven Contract Testing with Pact',
          description: 'Prevent breaking microservice schema updates by validating contracts before code merges.',
          estimatedTime: '3 Weeks',
          skills: ['Pact.io', 'Contract Tests', 'Schema Governance'],
          status: 'in-progress'
        },
        {
          id: 'qa_sub_2',
          title: 'Browser Network Throttling & Chaos Simulation',
          description: 'Simulate packet drops, 500 server errors, and offline caching gracefully with service workers.',
          estimatedTime: '3 Weeks',
          skills: ['Chaos Testing', 'Service Workers', 'Offline Resilience'],
          status: 'locked'
        }
      ]
    }
  },

  mobile: {
    id: 'mobile',
    category: 'Mobile App Engineering',
    title: 'Mobile Application Engineer (iOS & Android)',
    matchKeys: ['mobile', 'android', 'ios', 'flutter', 'react native', 'swift', 'kotlin'],
    description: 'Build native-grade mobile applications with silky-smooth 60fps animations, offline storage, and hardware integrations.',
    coreSteps: [
      {
        id: 'mob_1',
        title: 'React Native & Expo Architecture',
        description: 'JSX components, StyleSheet styling, Expo router stack navigation, and safe area handling.',
        estimatedTime: '3 Weeks',
        skills: ['React Native', 'Expo', 'File-based Routing', 'TypeScript'],
        status: 'completed'
      },
      {
        id: 'mob_2',
        title: 'Device Hardware & Biometric Integrations',
        description: 'Camera access, GPS geolocation tracking, accelerometer, FaceID/Fingerprint authentication, and Keychain storage.',
        estimatedTime: '4 Weeks',
        skills: ['Expo Sensors', 'Biometrics', 'SecureStore', 'Camera API'],
        status: 'in-progress'
      },
      {
        id: 'mob_3',
        title: 'Offline-First Architecture & SQLite Sync',
        description: 'Local caching with SQLite / WatermelonDB, optimistic mutation queues, and background sync workers.',
        estimatedTime: '4 Weeks',
        skills: ['SQLite', 'WatermelonDB', 'Offline Sync', 'TanStack Query'],
        status: 'locked'
      },
      {
        id: 'mob_4',
        title: 'Fluid Animations with React Native Reanimated',
        description: 'Shared element transitions, gesture handlers, spring physics, and worklet execution on UI thread.',
        estimatedTime: '4 Weeks',
        skills: ['Reanimated 3', 'Gesture Handler', 'UI Worklets'],
        status: 'locked'
      },
      {
        id: 'mob_5',
        title: 'App Store & Google Play Deployment Automation',
        description: 'Fastlane release automation, EAS Build pipelines, code signing certificates, and OTA updates.',
        estimatedTime: '3 Weeks',
        skills: ['Fastlane', 'EAS Build', 'App Store Connect', 'Google Play Console'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'mob_subset_native',
      title: 'Native Swift / Kotlin Bridge Specialization',
      badge: 'Advanced Subset',
      description: 'Specialization in writing native C++ and platform-specific modules for high-frequency Bluetooth and audio processing.',
      steps: [
        {
          id: 'mob_sub_1',
          title: 'JSI & TurboModules Architecture',
          description: 'Direct C++ memory binding without JSON bridge serialization for sub-millisecond execution.',
          estimatedTime: '4 Weeks',
          skills: ['C++', 'JSI', 'TurboModules', 'Nitro Modules'],
          status: 'in-progress'
        },
        {
          id: 'mob_sub_2',
          title: 'CoreBluetooth & BLE Hardware Communication',
          description: 'Connect to wearable fitness trackers and IoT devices via Bluetooth Low Energy GATT characteristics.',
          estimatedTime: '3 Weeks',
          skills: ['BLE', 'GATT Services', 'IoT Communication'],
          status: 'locked'
        }
      ]
    }
  },

  marketing: {
    id: 'marketing',
    category: 'Growth & Tech Sales',
    title: 'Digital Marketing & Growth Engineer',
    matchKeys: ['marketing', 'digital marketing', 'growth', 'sales', 'seo', 'ads'],
    description: 'Blend technical automation, SEO algorithms, performance marketing, and data-driven customer acquisition.',
    coreSteps: [
      {
        id: 'mk_1',
        title: 'Technical SEO & Programmatic Pages',
        description: 'Schema.org JSON-LD microdata, OpenGraph tags, sitemap index generation, and search engine crawl budgets.',
        estimatedTime: '3 Weeks',
        skills: ['Technical SEO', 'Schema.org', 'Core Web Vitals', 'Search Console'],
        status: 'completed'
      },
      {
        id: 'mk_2',
        title: 'Performance Marketing & Pixel Attribution',
        description: 'Google Ads Search/Display, Meta Conversions API (CAPI), UTM taxonomy, and multi-touch attribution modeling.',
        estimatedTime: '3 Weeks',
        skills: ['Google Ads', 'Meta CAPI', 'Attribution', 'GA4 Analytics'],
        status: 'in-progress'
      },
      {
        id: 'mk_3',
        title: 'Marketing Automation & Email Drip Workflows',
        description: 'Behavioral email sequences in HubSpot/Klaviyo, event triggers, lead scoring, and CRM pipeline synchronization.',
        estimatedTime: '4 Weeks',
        skills: ['HubSpot', 'Customer.io', 'Lead Scoring', 'Lifecycle Marketing'],
        status: 'locked'
      },
      {
        id: 'mk_4',
        title: 'High-Converting Landing Page Design & CRO',
        description: 'Conversion rate optimization (CRO), heatmaps analysis with Hotjar, and multivariable landing page A/B tests.',
        estimatedTime: '3 Weeks',
        skills: ['CRO', 'Hotjar', 'Unbounce/Webflow', 'VWO Testing'],
        status: 'locked'
      },
      {
        id: 'mk_5',
        title: 'Viral Loop & Referral Engineering',
        description: 'Design incentive reward structures, gamified user onboarding milestones, and affiliate partner APIs.',
        estimatedTime: '3 Weeks',
        skills: ['Viral Loops', 'Product Led Growth (PLG)', 'Affiliate APIs'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'mk_subset_ai',
      title: 'AI Growth Automation & Content Engines',
      badge: 'Advanced Subset',
      description: 'Specialization in programmatic content generation, personalized landing pages, and automated bidding algorithms.',
      steps: [
        {
          id: 'mk_sub_1',
          title: 'Programmatic SEO Generation Pipeline',
          description: 'Generate 1,000+ targeted niche comparison pages using Next.js static generation and verified dataset feeds.',
          estimatedTime: '3 Weeks',
          skills: ['Programmatic SEO', 'Headless CMS', 'Next.js SSG'],
          status: 'in-progress'
        },
        {
          id: 'mk_sub_2',
          title: 'Automated Ad Creative Variation Engine',
          description: 'Dynamic image & copy synthesis using Python scripts and marketing API endpoints.',
          estimatedTime: '3 Weeks',
          skills: ['Ad Automation', 'Creative APIs', 'Python Scripts'],
          status: 'locked'
        }
      ]
    }
  }
};

/**
 * Helper to match user's dreamJob string to a roadmap domain
 */
export function getRoadmapForJob(dreamJob = '') {
  const query = (dreamJob || '').toLowerCase().trim();
  
  for (const key of Object.keys(ROADMAP_DOMAINS)) {
    const domain = ROADMAP_DOMAINS[key];
    if (domain.matchKeys.some(k => query.includes(k))) {
      return domain;
    }
  }

  // Fallback: Default Adaptive Career Roadmap
  return {
    id: 'default_adaptive',
    category: 'Technology Career Track',
    title: `${dreamJob || 'Software Professional'} Career Roadmap`,
    description: `A custom-tailored curriculum designed specifically for mastering competencies expected of a modern ${dreamJob || 'Software Engineer'}.`,
    coreSteps: [
      {
        id: 'def_1',
        title: 'Foundations & Computer Science Core',
        description: 'Data structures, algorithm complexity analysis, clean code principles, and git collaboration.',
        estimatedTime: '3 Weeks',
        skills: ['Algorithms', 'Data Structures', 'Git & GitHub', 'System Basics'],
        status: 'completed'
      },
      {
        id: 'def_2',
        title: `Core Technical Skills for ${dreamJob || 'Your Field'}`,
        description: 'Industry-standard frameworks, libraries, design patterns, and hands-on laboratory exercises.',
        estimatedTime: '4 Weeks',
        skills: ['Core Frameworks', 'Design Patterns', 'API Integration'],
        status: 'in-progress'
      },
      {
        id: 'def_3',
        title: 'End-to-End Real World Architecture',
        description: 'Build a production-grade portfolio project demonstrating scalability, clean testing, and error resilience.',
        estimatedTime: '4 Weeks',
        skills: ['System Architecture', 'Testing', 'Database Design'],
        status: 'locked'
      },
      {
        id: 'def_4',
        title: 'Cloud Deployment, CI/CD & Security',
        description: 'Automated test pipelines, cloud hosting, environment secrets management, and performance monitoring.',
        estimatedTime: '3 Weeks',
        skills: ['CI/CD', 'Cloud Hosting', 'Security Best Practices'],
        status: 'locked'
      },
      {
        id: 'def_5',
        title: 'Interview Preparation & Portfolio Optimization',
        description: 'Technical behavioral storytelling, mock interview practice, ATS resume polish, and public showcase.',
        estimatedTime: '2 Weeks',
        skills: ['Mock Interviews', 'ATS Resume', 'Live Presentation'],
        status: 'locked'
      }
    ],
    subset: {
      id: 'def_subset_advanced',
      title: 'Advanced Electives & Deep Specialization Subset',
      badge: 'Advanced Subset',
      description: 'Specialized modular deep-dive units to elevate your profile above average candidates in recruitment screenings.',
      steps: [
        {
          id: 'def_sub_1',
          title: 'System Design & Distributed Scalability',
          description: 'Caching layers, horizontal sharding, load balancers, and CAP theorem trade-offs.',
          estimatedTime: '3 Weeks',
          skills: ['System Design', 'Caching', 'Load Balancing'],
          status: 'in-progress'
        },
        {
          id: 'def_sub_2',
          title: 'Applied AI Integration & Automation',
          description: 'Incorporate intelligent LLM features, semantic queries, and automated processing into your projects.',
          estimatedTime: '3 Weeks',
          skills: ['AI APIs', 'Prompt Engineering', 'Vector Embeddings'],
          status: 'locked'
        }
      ]
    }
  };
}
