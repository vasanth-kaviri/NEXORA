import { Request, Response } from 'express';
import { Roadmap, IRoadmap, MilestoneStatus, ResourceType } from '../models/roadmap.model';
import { sendSuccess, sendError } from '../utils/appResponse';
import { logger } from '../utils/logger';

// --- Seed Template Interfaces -------------------------------------------------

export interface ISeedMilestone {
  milestoneId: string;
  title: string;
  description: string;
  estimatedHours: number;
  skills: string[];
  resources: Array<{
    title: string;
    url: string;
    type: ResourceType;
  }>;
}

export interface ISeedPhase {
  phaseId: string;
  phaseTitle: string;
  order: number;
  milestones: ISeedMilestone[];
}

export interface ISeedRoadmap {
  role: string;
  domain: string;
  matchKeys: string[];
  description: string;
  phases: ISeedPhase[];
}

// --- Curated Production Seed Roadmaps -----------------------------------------

export const SEED_ROADMAPS: Record<string, ISeedRoadmap> = {
  mobile: {
    role: 'Mobile App Developer',
    domain: 'Mobile App Development',
    matchKeys: ['mobile', 'android', 'ios', 'flutter', 'react native', 'swift', 'kotlin'],
    description:
      'Architect native-grade mobile applications with smooth 60fps animations, hardware integrations, offline synchronization, and automated store deployments.',
    phases: [
      {
        phaseId: 'mob_p1',
        phaseTitle: 'Phase 1: Core Mobile Architecture & React Native Foundations',
        order: 1,
        milestones: [
          {
            milestoneId: 'mob_m1',
            title: 'React Native & Expo Architecture',
            description:
              'Master JSX components, StyleSheet primitives, Expo Router file-based stack navigation, and safe area handling across devices.',
            estimatedHours: 25,
            skills: ['React Native', 'Expo', 'File-based Routing', 'TypeScript'],
            resources: [
              { title: 'Expo Router Guide', url: 'https://docs.expo.dev/router/introduction/', type: 'DOCS' },
              { title: 'React Native New Architecture Overview', url: 'https://reactnative.dev/docs/the-new-architecture/landing-page', type: 'VIDEO' },
            ],
          },
          {
            milestoneId: 'mob_m2',
            title: 'Navigation & Native Device State',
            description:
              'Implement deep linking, bottom tabs, drawer navigation, modal sheets, and global client state synchronization.',
            estimatedHours: 20,
            skills: ['React Navigation', 'Deep Linking', 'Zustand', 'Context API'],
            resources: [
              { title: 'React Navigation Fundamentals', url: 'https://reactnavigation.org/docs/getting-started', type: 'DOCS' },
              { title: 'Mobile Deep Linking Architecture', url: 'https://docs.expo.dev/guides/deep-linking/', type: 'PROJECT' },
            ],
          },
        ],
      },
      {
        phaseId: 'mob_p2',
        phaseTitle: 'Phase 2: Hardware Integrations, Biometrics & Security',
        order: 2,
        milestones: [
          {
            milestoneId: 'mob_m3',
            title: 'Camera, GPS & Hardware Sensors',
            description:
              'Integrate device camera viewfinders, background GPS geolocation tracking, accelerometer telemetry, and runtime permission flows.',
            estimatedHours: 30,
            skills: ['Expo Camera', 'Expo Location', 'Sensors API', 'Permissions API'],
            resources: [
              { title: 'Expo Camera Documentation', url: 'https://docs.expo.dev/versions/latest/sdk/camera/', type: 'DOCS' },
              { title: 'Background Geolocation Mastery', url: 'https://docs.expo.dev/versions/latest/sdk/location/', type: 'PROJECT' },
            ],
          },
          {
            milestoneId: 'mob_m4',
            title: 'Biometrics & Keychain Storage',
            description:
              'Secure user sessions with FaceID / TouchID biometric challenges, iOS Keychain, and Android Keystore hardware-backed encryption.',
            estimatedHours: 20,
            skills: ['LocalAuthentication', 'Expo SecureStore', 'Hardware Keystore', 'Biometrics'],
            resources: [
              { title: 'Expo LocalAuthentication API', url: 'https://docs.expo.dev/versions/latest/sdk/local-authentication/', type: 'DOCS' },
              { title: 'Mobile Security Best Practices', url: 'https://owasp.org/www-project-mobile-security-testing-guide/', type: 'DOCS' },
            ],
          },
        ],
      },
      {
        phaseId: 'mob_p3',
        phaseTitle: 'Phase 3: Offline-First Architecture & Data Persistence',
        order: 3,
        milestones: [
          {
            milestoneId: 'mob_m5',
            title: 'SQLite, WatermelonDB & Local Persistence',
            description:
              'Design local embedded database schemas with SQLite, schema migrations, batch indexing, and high-performance querying.',
            estimatedHours: 35,
            skills: ['Expo SQLite', 'WatermelonDB', 'Local Schemas', 'Indexing'],
            resources: [
              { title: 'Expo SQLite Quickstart', url: 'https://docs.expo.dev/versions/latest/sdk/sqlite/', type: 'DOCS' },
              { title: 'WatermelonDB Architecture Guide', url: 'https://watermelondb.dev/docs', type: 'DOCS' },
            ],
          },
          {
            milestoneId: 'mob_m6',
            title: 'Background Sync & Conflict Resolution',
            description:
              'Implement background tasks, optimistic UI mutations, idempotent server queues, and timestamp-based conflict resolution.',
            estimatedHours: 30,
            skills: ['TaskManager', 'Optimistic UI', 'Sync Protocols', 'Idempotency'],
            resources: [
              { title: 'Expo TaskManager Guide', url: 'https://docs.expo.dev/versions/latest/sdk/task-manager/', type: 'DOCS' },
              { title: 'Offline-First Sync Engine Project', url: 'https://github.com/expo/examples', type: 'PROJECT' },
            ],
          },
        ],
      },
      {
        phaseId: 'mob_p4',
        phaseTitle: 'Phase 4: Motion, High-Performance UI & Skia',
        order: 4,
        milestones: [
          {
            milestoneId: 'mob_m7',
            title: 'Reanimated 3 & Gesture Handling',
            description:
              'Execute animations on the native UI thread with worklets, spring physics, shared element transitions, and continuous gestures.',
            estimatedHours: 30,
            skills: ['Reanimated 3', 'Gesture Handler', 'UI Worklets', 'Shared Elements'],
            resources: [
              { title: 'React Native Reanimated 3 Docs', url: 'https://docs.swmansion.com/react-native-reanimated/', type: 'DOCS' },
              { title: 'Complex Fluid Gestures Masterclass', url: 'https://youtube.com', type: 'VIDEO' },
            ],
          },
          {
            milestoneId: 'mob_m8',
            title: 'Skia 2D Graphics & Hardware Acceleration',
            description:
              'Render 60fps custom 2D graphics, shaders, custom path animations, and GPU-accelerated canvas components.',
            estimatedHours: 25,
            skills: ['React Native Skia', '2D Shaders', 'Canvas Rendering', 'GPU Optimization'],
            resources: [
              { title: 'Shopify React Native Skia Guide', url: 'https://shopify.github.io/react-native-skia/', type: 'DOCS' },
              { title: 'Interactive Graphing & Shader Lab', url: 'https://github.com/Shopify/react-native-skia/tree/main/example', type: 'PROJECT' },
            ],
          },
        ],
      },
      {
        phaseId: 'mob_p5',
        phaseTitle: 'Phase 5: Production Deployment & Store Pipelines',
        order: 5,
        milestones: [
          {
            milestoneId: 'mob_m9',
            title: 'EAS Build, TestFlight & App Store Release',
            description:
              'Configure cloud EAS builds, code signing credentials, TestFlight internal groups, and App Store Connect metadata.',
            estimatedHours: 30,
            skills: ['EAS Build', 'Code Signing', 'TestFlight', 'App Store Connect'],
            resources: [
              { title: 'EAS Build Quickstart', url: 'https://docs.expo.dev/build/introduction/', type: 'DOCS' },
              { title: 'iOS Code Signing & Provisioning Guide', url: 'https://docs.expo.dev/app-signing/app-credentials/', type: 'DOCS' },
            ],
          },
          {
            milestoneId: 'mob_m10',
            title: 'Google Play Console & OTA Updates',
            description:
              'Produce Android AAB app bundles, configure internal testing tracks in Google Play Console, and deploy instant EAS Update OTA patches.',
            estimatedHours: 25,
            skills: ['Google Play Console', 'EAS Update', 'AAB Bundles', 'Release Tracks'],
            resources: [
              { title: 'EAS Update Documentation', url: 'https://docs.expo.dev/eas-update/introduction/', type: 'DOCS' },
              { title: 'Google Play Store Release Checklist', url: 'https://support.google.com/googleplay/android-developer', type: 'DOCS' },
            ],
          },
        ],
      },
    ],
  },

  frontend: {
    role: 'Frontend Developer',
    domain: 'Frontend Web Development',
    matchKeys: ['frontend', 'web', 'react', 'next.js', 'ui', 'css', 'javascript'],
    description:
      'Master high-performance modern web engineering, React 19 architecture, Next.js App Router, global state orchestration, and Core Web Vitals optimization.',
    phases: [
      {
        phaseId: 'fe_p1',
        phaseTitle: 'Phase 1: Advanced TypeScript & Modern React 19 Foundations',
        order: 1,
        milestones: [
          {
            milestoneId: 'fe_m1',
            title: 'Strict TypeScript & Component Primitives',
            description:
              'Master advanced generics, utility types, discriminated unions, and semantic HTML/CSS design tokens.',
            estimatedHours: 25,
            skills: ['TypeScript 5', 'Generics', 'CSS Modern Tokens', 'Semantic HTML5'],
            resources: [
              { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html', type: 'DOCS' },
              { title: 'Modern React Component Primitives', url: 'https://react.dev/learn', type: 'DOCS' },
            ],
          },
          {
            milestoneId: 'fe_m2',
            title: 'React 19 Server Components & Concurrent Mode',
            description:
              'Deep dive into React Server Components (RSC), Suspense boundaries, streaming SSR, and Server Actions.',
            estimatedHours: 25,
            skills: ['React 19', 'RSC', 'Suspense', 'Server Actions'],
            resources: [
              { title: 'React 19 Upgrade Guide', url: 'https://react.dev/blog/2024/04/25/react-19', type: 'DOCS' },
              { title: 'Concurrent Rendering Patterns', url: 'https://react.dev/reference/react/useTransition', type: 'VIDEO' },
            ],
          },
        ],
      },
      {
        phaseId: 'fe_p2',
        phaseTitle: 'Phase 2: Next.js App Router & State Architecture',
        order: 2,
        milestones: [
          {
            milestoneId: 'fe_m3',
            title: 'Next.js App Router & Layout Systems',
            description:
              'Build scalable route handlers, nested layouts, parallel routes, intercepting routes, and caching layers.',
            estimatedHours: 30,
            skills: ['Next.js 15', 'App Router', 'Nested Layouts', 'Route Interception'],
            resources: [
              { title: 'Next.js App Router Docs', url: 'https://nextjs.org/docs/app', type: 'DOCS' },
              { title: 'Production App Router Blueprint', url: 'https://github.com/vercel/next.js/tree/canary/examples', type: 'PROJECT' },
            ],
          },
          {
            milestoneId: 'fe_m4',
            title: 'Global State Management & Server State Sync',
            description:
              'Orchestrate client state with Zustand and server synchronization with TanStack React Query cache invalidations.',
            estimatedHours: 25,
            skills: ['Zustand', 'TanStack Query v5', 'Optimistic Updates', 'Cache Management'],
            resources: [
              { title: 'TanStack Query Essentials', url: 'https://tanstack.com/query/latest/docs/framework/react/overview', type: 'DOCS' },
              { title: 'Zustand Best Practices', url: 'https://docs.pmnd.rs/zustand/getting-started/introduction', type: 'DOCS' },
            ],
          },
        ],
      },
      {
        phaseId: 'fe_p3',
        phaseTitle: 'Phase 3: Core Web Vitals, Testing & Accessibility',
        order: 3,
        milestones: [
          {
            milestoneId: 'fe_m5',
            title: 'Core Web Vitals & Bundle Optimization',
            description:
              'Analyze and optimize LCP, INP, and CLS metrics, dynamic imports, image formats (AVIF/WebP), and tree shaking.',
            estimatedHours: 25,
            skills: ['Web Vitals', 'Lighthouse', 'Code Splitting', 'Bundle Analysis'],
            resources: [
              { title: 'web.dev Core Web Vitals', url: 'https://web.dev/explore/vitals', type: 'DOCS' },
              { title: 'Performance Optimization Lab', url: 'https://web.dev/learn/performance', type: 'PROJECT' },
            ],
          },
          {
            milestoneId: 'fe_m6',
            title: 'Automated Testing with Vitest & Playwright',
            description:
              'Build robust test suites with Vitest unit tests, React Testing Library component tests, and Playwright end-to-end flows.',
            estimatedHours: 30,
            skills: ['Vitest', 'Testing Library', 'Playwright', 'E2E Testing'],
            resources: [
              { title: 'Playwright Testing Guide', url: 'https://playwright.dev/docs/intro', type: 'DOCS' },
              { title: 'Vitest Unit Testing', url: 'https://vitest.dev/guide/', type: 'DOCS' },
            ],
          },
        ],
      },
      {
        phaseId: 'fe_p4',
        phaseTitle: 'Phase 4: Production Edge Deployment & CI/CD',
        order: 4,
        milestones: [
          {
            milestoneId: 'fe_m7',
            title: 'Edge Runtime, Middleware & CDN Caching',
            description:
              'Deploy edge functions, geolocation middleware redirects, Cloudflare / Vercel CDN headers, and automated GitHub Actions CI/CD.',
            estimatedHours: 25,
            skills: ['Vercel Edge', 'Cloudflare', 'CDN Caching', 'GitHub Actions'],
            resources: [
              { title: 'Vercel Edge Middleware', url: 'https://vercel.com/docs/functions/edge-middleware', type: 'DOCS' },
              { title: 'CI/CD Pipeline Setup', url: 'https://docs.github.com/en/actions', type: 'PROJECT' },
            ],
          },
        ],
      },
    ],
  },

  fullstack: {
    role: 'Full Stack Developer',
    domain: 'Full Stack Engineering',
    matchKeys: ['full stack', 'fullstack', 'mern', 'node', 'express', 'database', 'backend'],
    description:
      'Engineer robust full-stack software systems with typed APIs, relational and document databases, distributed caching, secure auth, and cloud containerization.',
    phases: [
      {
        phaseId: 'fs_p1',
        phaseTitle: 'Phase 1: Full-Stack Foundations & API Architecture',
        order: 1,
        milestones: [
          {
            milestoneId: 'fs_m1',
            title: 'TypeScript Full-Stack Systems & REST APIs',
            description:
              'Design typed contracts shared between client and server, robust Express/Fastify architectures, and OpenAPI documentation.',
            estimatedHours: 25,
            skills: ['TypeScript', 'Express.js', 'REST APIs', 'OpenAPI / Swagger'],
            resources: [
              { title: 'Express.js Production Best Practices', url: 'https://expressjs.com/en/advanced/best-practice-performance.html', type: 'DOCS' },
              { title: 'RESTful API Design Standards', url: 'https://restfulapi.net/', type: 'DOCS' },
            ],
          },
          {
            milestoneId: 'fs_m2',
            title: 'Relational & Document Database Modeling',
            description:
              'Model complex schemas with PostgreSQL (Prisma/Drizzle) and MongoDB (Mongoose), indexing, transactions, and migration scripts.',
            estimatedHours: 30,
            skills: ['PostgreSQL', 'MongoDB', 'Prisma ORM', 'Mongoose', 'Database Indexing'],
            resources: [
              { title: 'Prisma Documentation', url: 'https://www.prisma.io/docs', type: 'DOCS' },
              { title: 'PostgreSQL Indexing Deep Dive', url: 'https://www.postgresql.org/docs/current/indexes.html', type: 'DOCS' },
            ],
          },
        ],
      },
      {
        phaseId: 'fs_p2',
        phaseTitle: 'Phase 2: Authentication, Security & Distributed Caching',
        order: 2,
        milestones: [
          {
            milestoneId: 'fs_m3',
            title: 'Enterprise Authentication & RBAC',
            description:
              'Implement secure JWT refresh token rotation, OAuth2 social logins, role-based access control (RBAC), and CSRF/CORS protections.',
            estimatedHours: 30,
            skills: ['JWT', 'Refresh Tokens', 'OAuth 2.0', 'RBAC Security'],
            resources: [
              { title: 'OWASP Top 10 Security Guide', url: 'https://owasp.org/www-project-top-ten/', type: 'DOCS' },
              { title: 'Token Rotation Architecture', url: 'https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation', type: 'PROJECT' },
            ],
          },
          {
            milestoneId: 'fs_m4',
            title: 'Redis In-Memory Caching & Rate Limiting',
            description:
              'Accelerate response times with Redis caching, sliding window rate limiters, session storage, and cache eviction policies.',
            estimatedHours: 25,
            skills: ['Redis', 'Rate Limiting', 'Cache Eviction', 'Session Storage'],
            resources: [
              { title: 'Redis Developer Hub', url: 'https://redis.io/docs/latest/develop/', type: 'DOCS' },
              { title: 'Distributed Rate Limiting Pattern', url: 'https://redis.io/glossary/rate-limiting/', type: 'DOCS' },
            ],
          },
        ],
      },
      {
        phaseId: 'fs_p3',
        phaseTitle: 'Phase 3: Event-Driven Architectures & Microservices',
        order: 3,
        milestones: [
          {
            milestoneId: 'fs_m5',
            title: 'Message Queues & Background Workers',
            description:
              'Implement asynchronous message processing with BullMQ / RabbitMQ, dead letter queues, and scheduled cron jobs.',
            estimatedHours: 30,
            skills: ['BullMQ', 'RabbitMQ', 'Event-Driven Architecture', 'Job Workers'],
            resources: [
              { title: 'BullMQ Guide', url: 'https://docs.bullmq.io/', type: 'DOCS' },
              { title: 'Event-Driven Systems Design', url: 'https://microservices.io/patterns/data/event-driven-architecture.html', type: 'DOCS' },
            ],
          },
          {
            milestoneId: 'fs_m6',
            title: 'Docker Containerization & Microservice Decomposition',
            description:
              'Containerize Node.js and database services with multi-stage Dockerfiles, Docker Compose local orchestration, and health checks.',
            estimatedHours: 25,
            skills: ['Docker', 'Docker Compose', 'Multi-stage Builds', 'Microservices'],
            resources: [
              { title: 'Docker Official Documentation', url: 'https://docs.docker.com/', type: 'DOCS' },
              { title: 'Production Dockerfile for Node.js', url: 'https://nodejs.org/en/docs/guides/nodejs-docker-webapp/', type: 'PROJECT' },
            ],
          },
        ],
      },
      {
        phaseId: 'fs_p4',
        phaseTitle: 'Phase 4: Cloud Infrastructure & Observability',
        order: 4,
        milestones: [
          {
            milestoneId: 'fs_m7',
            title: 'Kubernetes, Cloud Deployments & Telemetry',
            description:
              'Deploy containerized services to AWS/GCP, configure Prometheus & Grafana telemetry dashboards, Winston structured logging, and CI/CD pipelines.',
            estimatedHours: 35,
            skills: ['Kubernetes', 'AWS ECS', 'Prometheus', 'Grafana', 'CI/CD'],
            resources: [
              { title: 'Kubernetes Basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', type: 'DOCS' },
              { title: 'Prometheus & Grafana Observability', url: 'https://prometheus.io/docs/introduction/overview/', type: 'DOCS' },
            ],
          },
        ],
      },
    ],
  },

  aiml: {
    role: 'AI/ML Engineer',
    domain: 'Data Science & Artificial Intelligence',
    matchKeys: ['ai', 'ml', 'machine learning', 'data science', 'deep learning', 'neural', 'python'],
    description:
      'Master mathematical modeling, deep neural networks, large language models, RAG pipelines, and production MLOps deployment.',
    phases: [
      {
        phaseId: 'ai_p1',
        phaseTitle: 'Phase 1: Mathematical Foundations & Scientific Python',
        order: 1,
        milestones: [
          {
            milestoneId: 'ai_m1',
            title: 'Linear Algebra, Calculus & NumPy Vectorization',
            description:
              'Master matrix operations, eigenvectors, gradient descent mathematics, and vectorized high-speed computation with NumPy and Pandas.',
            estimatedHours: 30,
            skills: ['Python 3.12', 'NumPy', 'Pandas', 'Linear Algebra', 'Calculus'],
            resources: [
              { title: '3Blue1Brown Essence of Linear Algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra', type: 'VIDEO' },
              { title: 'NumPy Vectorization Mastery', url: 'https://numpy.org/doc/stable/user/quickstart.html', type: 'DOCS' },
            ],
          },
          {
            milestoneId: 'ai_m2',
            title: 'Exploratory Data Analysis & Feature Engineering',
            description:
              'Clean noisy datasets, detect outliers, perform dimensionality reduction (PCA/t-SNE), and extract predictive features.',
            estimatedHours: 25,
            skills: ['Data Cleaning', 'Feature Engineering', 'PCA', 'Seaborn / Matplotlib'],
            resources: [
              { title: 'Kaggle Feature Engineering Course', url: 'https://www.kaggle.com/learn/feature-engineering', type: 'PROJECT' },
              { title: 'Pandas Data Wrangling', url: 'https://pandas.pydata.org/docs/user_guide/index.html', type: 'DOCS' },
            ],
          },
        ],
      },
      {
        phaseId: 'ai_p2',
        phaseTitle: 'Phase 2: Classical Machine Learning & PyTorch Deep Learning',
        order: 2,
        milestones: [
          {
            milestoneId: 'ai_m3',
            title: 'Supervised & Unsupervised Machine Learning',
            description:
              'Implement and evaluate Random Forests, XGBoost gradient boosting, SVMs, and k-Means clustering with Scikit-Learn.',
            estimatedHours: 30,
            skills: ['Scikit-Learn', 'XGBoost', 'Random Forests', 'Model Evaluation'],
            resources: [
              { title: 'Scikit-Learn User Guide', url: 'https://scikit-learn.org/stable/user_guide.html', type: 'DOCS' },
              { title: 'Hands-on Machine Learning Blueprint', url: 'https://github.com/ageron/handson-ml3', type: 'PROJECT' },
            ],
          },
          {
            milestoneId: 'ai_m4',
            title: 'PyTorch Deep Neural Networks & Backpropagation',
            description:
              'Build multilayer perceptrons (MLP), convolutional neural networks (CNN), backprop autograd engines, and GPU training loops.',
            estimatedHours: 35,
            skills: ['PyTorch', 'Autograd', 'CUDA Training', 'CNNs'],
            resources: [
              { title: 'PyTorch Deep Learning Tutorials', url: 'https://pytorch.org/tutorials/', type: 'DOCS' },
              { title: 'Karpathy Neural Networks: Zero to Hero', url: 'https://karpathy.ai/zero-to-hero.html', type: 'VIDEO' },
            ],
          },
        ],
      },
      {
        phaseId: 'ai_p3',
        phaseTitle: 'Phase 3: Transformers, LLM Architectures & RAG',
        order: 3,
        milestones: [
          {
            milestoneId: 'ai_m5',
            title: 'Transformer Self-Attention & Hugging Face',
            description:
              'Master scaled dot-product attention, multi-head attention mechanisms, BERT/GPT architectures, and Hugging Face fine-tuning.',
            estimatedHours: 35,
            skills: ['Transformers', 'Attention Mechanism', 'Hugging Face', 'LoRA Fine-tuning'],
            resources: [
              { title: 'Attention Is All You Need Paper', url: 'https://arxiv.org/abs/1706.03762', type: 'DOCS' },
              { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', type: 'DOCS' },
            ],
          },
          {
            milestoneId: 'ai_m6',
            title: 'Retrieval-Augmented Generation (RAG) & Vector DBs',
            description:
              'Build end-to-end RAG systems with dense embeddings, Pinecone / Qdrant vector databases, semantic search, and reranking.',
            estimatedHours: 30,
            skills: ['RAG Systems', 'Vector Databases', 'Semantic Search', 'LangChain'],
            resources: [
              { title: 'Pinecone Learning Center', url: 'https://www.pinecone.io/learn/', type: 'DOCS' },
              { title: 'Production RAG Pipeline Implementation', url: 'https://github.com/langchain-ai/rag-from-scratch', type: 'PROJECT' },
            ],
          },
        ],
      },
      {
        phaseId: 'ai_p4',
        phaseTitle: 'Phase 4: MLOps, Model Serving & Scalable Inference',
        order: 4,
        milestones: [
          {
            milestoneId: 'ai_m7',
            title: 'FastAPI Model Serving, Triton & ONNX Runtime',
            description:
              'Package trained models for sub-20ms inference with ONNX Runtime, Triton inference server, FastAPI async endpoints, and Docker.',
            estimatedHours: 30,
            skills: ['FastAPI', 'ONNX Runtime', 'Triton Server', 'Model Serving'],
            resources: [
              { title: 'FastAPI Machine Learning Serving', url: 'https://fastapi.tiangolo.com/', type: 'DOCS' },
              { title: 'ONNX Runtime Optimization Guide', url: 'https://onnxruntime.ai/docs/', type: 'DOCS' },
            ],
          },
        ],
      },
    ],
  },
};

// --- Seed Resolver Helper -----------------------------------------------------

export function resolveSeedForRole(role: string, domain: string): ISeedRoadmap {
  const query = `${role} ${domain}`.toLowerCase();

  for (const key of Object.keys(SEED_ROADMAPS)) {
    const seed = SEED_ROADMAPS[key];
    const match = seed.matchKeys.some((k) => {
      if (k.length <= 3) {
        return new RegExp(`\\b${k}\\b`, 'i').test(query);
      }
      return query.includes(k);
    });
    if (match) {
      return seed;
    }
  }

  // Adaptive seed generator for arbitrary user roles
  const resolvedRole = role.trim() || domain.trim() || 'Software Engineer';
  const resolvedDomain = domain.trim() || 'Engineering';

  return {
    role: resolvedRole,
    domain: resolvedDomain,
    matchKeys: [resolvedRole.toLowerCase()],
    description: `A custom-tailored DAG curriculum for mastering the core and advanced competencies expected of a modern ${resolvedRole}.`,
    phases: [
      {
        phaseId: 'adapt_p1',
        phaseTitle: `Phase 1: Foundations & Core Principles for ${resolvedRole}`,
        order: 1,
        milestones: [
          {
            milestoneId: 'adapt_m1',
            title: `Foundations of ${resolvedRole}`,
            description: 'Core concepts, syntax, architectural fundamentals, and development toolchains.',
            estimatedHours: 25,
            skills: ['Foundations', 'Git Collaboration', 'Clean Architecture'],
            resources: [
              { title: `${resolvedRole} Overview`, url: 'https://roadmap.sh', type: 'DOCS' },
            ],
          },
          {
            milestoneId: 'adapt_m2',
            title: `Essential Tooling & Environment Setup`,
            description: 'Modern development environments, package managers, testing frameworks, and linters.',
            estimatedHours: 20,
            skills: ['Tooling', 'CLI Mastery', 'Automated Testing'],
            resources: [
              { title: 'Developer Best Practices', url: 'https://roadmap.sh', type: 'DOCS' },
            ],
          },
        ],
      },
      {
        phaseId: 'adapt_p2',
        phaseTitle: `Phase 2: Framework Mastery & Production Patterns`,
        order: 2,
        milestones: [
          {
            milestoneId: 'adapt_m3',
            title: `Advanced Design Patterns & Architecture`,
            description: 'High-leverage design patterns, separation of concerns, and clean dependency inversion.',
            estimatedHours: 30,
            skills: ['Design Patterns', 'System Design', 'Modularity'],
            resources: [
              { title: 'Refactoring & Design Patterns', url: 'https://refactoring.guru/', type: 'DOCS' },
            ],
          },
          {
            milestoneId: 'adapt_m4',
            title: `Real-World Capstone Deliverable`,
            description: 'Build and test a scalable portfolio project demonstrating end-to-end competencies.',
            estimatedHours: 35,
            skills: ['Portfolio Project', 'Production Quality', 'Documentation'],
            resources: [
              { title: 'Open Source Best Practices', url: 'https://opensource.guide/', type: 'PROJECT' },
            ],
          },
        ],
      },
      {
        phaseId: 'adapt_p3',
        phaseTitle: `Phase 3: Production Deployment, CI/CD & Cloud`,
        order: 3,
        milestones: [
          {
            milestoneId: 'adapt_m5',
            title: `Automated CI/CD & Deployment Pipelines`,
            description: 'Automated test suites, containerization, cloud deployment, and performance telemetry.',
            estimatedHours: 25,
            skills: ['CI/CD Pipelines', 'Cloud Hosting', 'Monitoring'],
            resources: [
              { title: 'DevOps & Deployment Guide', url: 'https://roadmap.sh/devops', type: 'DOCS' },
            ],
          },
        ],
      },
    ],
  };
}

// --- Controller Handlers ------------------------------------------------------

/**
 * Helper to build legacy coreSteps array for backward compatibility with existing views
 */
function buildLegacyCoreSteps(phases: any[]) {
  const steps: any[] = [];
  phases.forEach((phase) => {
    phase.milestones.forEach((m: any) => {
      let legacyStatus: 'completed' | 'in-progress' | 'locked' = 'locked';
      if (m.status === 'COMPLETED') legacyStatus = 'completed';
      else if (m.status === 'IN_PROGRESS' || m.status === 'AVAILABLE') legacyStatus = 'in-progress';

      steps.push({
        id: m.milestoneId,
        title: m.title,
        description: m.description,
        estimatedTime: `${m.estimatedHours || 20} Hours`,
        skills: m.skills || [],
        status: legacyStatus,
        rawStatus: m.status,
      });
    });
  });
  return steps;
}

/**
 * GET /api/v1/roadmap
 * Returns the active user's roadmap from MongoDB.
 * If none exists, seeds from deterministic catalog, initializes Milestone 1 as AVAILABLE,
 * and saves to MongoDB.
 */
export const getRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const queryRole = (req.query.role as string) || '';
    const queryDomain = (req.query.domain as string) || '';

    const effectiveRole = user?.targetRole || user?.dreamJob || queryRole || 'Mobile App Developer';
    const effectiveDomain = user?.domain || queryDomain || 'Mobile App Development';

    // If authenticated user exists, query MongoDB
    if (user?._id) {
      let roadmap = await Roadmap.findOne({
        userId: user._id,
        role: effectiveRole,
      });

      // If roadmap does not exist for this exact role, check if user has any existing roadmap
      if (!roadmap) {
        roadmap = await Roadmap.findOne({ userId: user._id });
      }

      // If roadmap still does not exist, seed a new one
      if (!roadmap) {
        const seed = resolveSeedForRole(effectiveRole, effectiveDomain);

        // Count total milestones and set first milestone to AVAILABLE
        let totalMilestones = 0;
        const initializedPhases = seed.phases.map((phase, pIdx) => {
          const milestones = phase.milestones.map((m, mIdx) => {
            totalMilestones += 1;
            const status: MilestoneStatus = pIdx === 0 && mIdx === 0 ? 'AVAILABLE' : 'LOCKED';
            return {
              ...m,
              status,
              completedAt: undefined,
            };
          });
          return {
            ...phase,
            milestones,
          };
        });

        roadmap = new Roadmap({
          userId: user._id,
          role: seed.role,
          domain: seed.domain,
          progressPercentage: 0,
          totalMilestones,
          completedMilestones: 0,
          phases: initializedPhases,
        });

        await roadmap.save();
        logger.info(`[RoadmapController] Seeded new DAG roadmap for user ${user._id} (${seed.role})`);
      }

      // Build compatibility wrapper
      const legacyCoreSteps = buildLegacyCoreSteps(roadmap.phases);
      const responseData = {
        _id: roadmap._id,
        id: roadmap.role.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        title: roadmap.role,
        role: roadmap.role,
        domain: roadmap.domain,
        category: roadmap.domain,
        description: `Career progression track tailored for ${roadmap.role}.`,
        progressPercentage: roadmap.progressPercentage,
        totalMilestones: roadmap.totalMilestones,
        completedMilestones: roadmap.completedMilestones,
        phases: roadmap.phases,
        coreSteps: legacyCoreSteps,
      };

      res.status(200).json(sendSuccess({ roadmap: responseData }, 'Roadmap retrieved successfully.'));
      return;
    }

    // Guest / Unauthenticated Fallback: Return seed template without persisting
    const seed = resolveSeedForRole(effectiveRole, effectiveDomain);
    let totalMilestones = 0;
    const initializedPhases = seed.phases.map((phase, pIdx) => {
      const milestones = phase.milestones.map((m, mIdx) => {
        totalMilestones += 1;
        const status: MilestoneStatus = pIdx === 0 && mIdx === 0 ? 'AVAILABLE' : 'LOCKED';
        return {
          ...m,
          status,
          completedAt: undefined,
        };
      });
      return {
        ...phase,
        milestones,
      };
    });

    const responseData = {
      id: seed.role.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      title: seed.role,
      role: seed.role,
      domain: seed.domain,
      category: seed.domain,
      description: seed.description,
      progressPercentage: 0,
      totalMilestones,
      completedMilestones: 0,
      phases: initializedPhases,
      coreSteps: buildLegacyCoreSteps(initializedPhases),
    };

    res.status(200).json(sendSuccess({ roadmap: responseData }, 'Roadmap seed retrieved successfully.'));
  } catch (err) {
    logger.error('Error in getRoadmap:', err);
    res.status(500).json(sendError('Failed to retrieve roadmap.', 500));
  }
};

/**
 * PATCH /api/v1/roadmap/milestones/:milestoneId
 * Updates the status of a milestone ('IN_PROGRESS' or 'COMPLETED').
 * If 'COMPLETED', automatically unlocks the next sequential milestone in the DAG from 'LOCKED' to 'AVAILABLE'.
 * Recalculates 'progressPercentage' atomically and returns the updated state.
 */
export const updateMilestoneProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?._id) {
      res.status(401).json(sendError('Authentication required to update milestones.', 401));
      return;
    }

    const { milestoneId } = req.params;
    const { status } = req.body;

    if (!milestoneId) {
      res.status(400).json(sendError('Milestone ID is required.', 400));
      return;
    }

    const validStatuses: MilestoneStatus[] = ['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json(sendError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
      return;
    }

    // Find user's active roadmap
    let roadmap = await Roadmap.findOne({ userId: user._id });
    if (!roadmap) {
      res.status(404).json(sendError('Roadmap not found for current user.', 404));
      return;
    }

    // Locate milestone in DAG
    let targetPhaseIdx = -1;
    let targetMilestoneIdx = -1;

    for (let p = 0; p < roadmap.phases.length; p++) {
      const mIdx = roadmap.phases[p].milestones.findIndex((m) => m.milestoneId === milestoneId);
      if (mIdx !== -1) {
        targetPhaseIdx = p;
        targetMilestoneIdx = mIdx;
        break;
      }
    }

    if (targetPhaseIdx === -1 || targetMilestoneIdx === -1) {
      res.status(404).json(sendError(`Milestone '${milestoneId}' not found in roadmap.`, 404));
      return;
    }

    const targetMilestone = roadmap.phases[targetPhaseIdx].milestones[targetMilestoneIdx];
    const previousStatus = targetMilestone.status;
    const newStatus: MilestoneStatus = status || (previousStatus === 'AVAILABLE' ? 'IN_PROGRESS' : 'COMPLETED');

    // Update the target milestone
    targetMilestone.status = newStatus;
    if (newStatus === 'COMPLETED') {
      targetMilestone.completedAt = new Date();

      // Sequential DAG Unlock: Promote the immediate next milestone from LOCKED to AVAILABLE
      let nextPhaseIdx = targetPhaseIdx;
      let nextMilestoneIdx = targetMilestoneIdx + 1;

      if (nextMilestoneIdx >= roadmap.phases[targetPhaseIdx].milestones.length) {
        nextPhaseIdx = targetPhaseIdx + 1;
        nextMilestoneIdx = 0;
      }

      if (
        nextPhaseIdx < roadmap.phases.length &&
        nextMilestoneIdx < roadmap.phases[nextPhaseIdx].milestones.length
      ) {
        const nextMilestone = roadmap.phases[nextPhaseIdx].milestones[nextMilestoneIdx];
        if (nextMilestone.status === 'LOCKED') {
          nextMilestone.status = 'AVAILABLE';
          logger.info(
            `[RoadmapController] Unlocked milestone '${nextMilestone.milestoneId}' (${nextMilestone.title}) to AVAILABLE`,
          );
        }
      }
    } else {
      targetMilestone.completedAt = undefined;
    }

    // Atomic recalculation of completedMilestones and progressPercentage
    let totalCount = 0;
    let completedCount = 0;

    for (const phase of roadmap.phases) {
      for (const m of phase.milestones) {
        totalCount += 1;
        if (m.status === 'COMPLETED') {
          completedCount += 1;
        }
      }
    }

    roadmap.totalMilestones = totalCount;
    roadmap.completedMilestones = completedCount;
    roadmap.progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Mark Mongoose modified fields for nested arrays
    roadmap.markModified('phases');
    await roadmap.save();

    logger.info(
      `[RoadmapController] Updated milestone '${milestoneId}' to '${newStatus}'. Progress: ${roadmap.progressPercentage}% (${completedCount}/${totalCount})`,
    );

    const legacyCoreSteps = buildLegacyCoreSteps(roadmap.phases);
    const responseData = {
      _id: roadmap._id,
      id: roadmap.role.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      title: roadmap.role,
      role: roadmap.role,
      domain: roadmap.domain,
      category: roadmap.domain,
      description: `Career progression track tailored for ${roadmap.role}.`,
      progressPercentage: roadmap.progressPercentage,
      totalMilestones: roadmap.totalMilestones,
      completedMilestones: roadmap.completedMilestones,
      phases: roadmap.phases,
      coreSteps: legacyCoreSteps,
    };

    res.status(200).json(sendSuccess({ roadmap: responseData }, 'Milestone progress updated successfully.'));
  } catch (err) {
    logger.error('Error in updateMilestoneProgress:', err);
    res.status(500).json(sendError('Failed to update milestone progress.', 500));
  }
};
