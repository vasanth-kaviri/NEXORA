/**
 * NEXORA Curated Learning Resources Database
 * Maps roadmap step IDs to domain-specific courses, articles, and real-world projects.
 */

export const TOPIC_RESOURCES = {
  // ─────────────────────────────────────────────────────────────
  // 1. DATA SCIENCE & AI
  // ─────────────────────────────────────────────────────────────
  ds_1: [
    { id: 'ds_1_1', title: 'Python for Data Analysis & Scientific Computing', type: 'Course', source: 'Coursera', description: 'Comprehensive guide to NumPy arrays, Pandas DataFrames, and vectorized operations.', content: 'video' },
    { id: 'ds_1_2', title: 'Pandas Vectorization & Performance Patterns', type: 'Article', source: 'Towards Data Science', description: 'Techniques for replacing slow loops with vectorized operations and parallel apply.', content: 'article' },
    { id: 'ds_1_3', title: 'Automated Financial Data Cleaning Pipeline', type: 'Project', source: 'Kaggle', description: 'Build an end-to-end data cleaning script handling malformed dates and missing records.', content: 'external' }
  ],
  ds_2: [
    { id: 'ds_2_1', title: 'Statistical Thinking & Hypothesis Testing', type: 'Course', source: 'Stanford Online', description: 'P-values, confidence intervals, A/B test power analysis, and statistical distributions.', content: 'video' },
    { id: 'ds_2_2', title: 'Advanced Exploratory Data Analysis with Seaborn & Plotly', type: 'Article', source: 'Towards Data Science', description: 'Creating interactive pair plots, correlation heatmaps, and faceted charts.', content: 'article' },
    { id: 'ds_2_3', title: 'Customer Churn EDA & Feature Engineering Case Study', type: 'Project', source: 'GitHub', description: 'Analyze telecommunications dataset to uncover factors influencing customer turnover.', content: 'external' }
  ],
  ds_3: [
    { id: 'ds_3_1', title: 'Machine Learning Specialization by Andrew Ng', type: 'Course', source: 'DeepLearning.AI', description: 'Supervised learning, gradient descent, logistic regression, and neural network foundations.', content: 'video' },
    { id: 'ds_3_2', title: 'Demystifying Gradient Boosted Trees & XGBoost', type: 'Article', source: 'Medium', description: 'Deep dive into boosting mathematics, regularization terms, and tree pruning.', content: 'article' },
    { id: 'ds_3_3', title: 'Credit Risk Classification with Cross-Validation', type: 'Project', source: 'Kaggle', description: 'Train and calibrate XGBoost models to evaluate loan default probabilities.', content: 'external' }
  ],
  ds_4: [
    { id: 'ds_4_1', title: 'Deep Learning with PyTorch: Zero to Hero', type: 'Course', source: 'Fast.ai', description: 'Convolutional networks, modern residual blocks, embeddings, and transformer architectures.', content: 'video' },
    { id: 'ds_4_2', title: 'The Illustrated Transformer & Self-Attention Explained', type: 'Article', source: 'Jay Alammar Blog', description: 'Visual intuition into query-key-value projections and multi-head attention.', content: 'article' },
    { id: 'ds_4_3', title: 'Fine-Tuning BERT for Sentiment Analysis', type: 'Project', source: 'Hugging Face', description: 'Use Hugging Face Transformers to adapt a pre-trained model for product reviews.', content: 'external' }
  ],
  ds_5: [
    { id: 'ds_5_1', title: 'MLOps: Production Machine Learning Systems', type: 'Course', source: 'Coursera', description: 'Model registry, artifact tracking with MLflow, Docker packaging, and automated retraining.', content: 'video' },
    { id: 'ds_5_2', title: 'Deploying High-Throughput PyTorch Models with FastAPI & Triton', type: 'Article', source: 'Towards Data Science', description: 'Asynchronous model inference with dynamic batching and GPU acceleration.', content: 'article' },
    { id: 'ds_5_3', title: 'Production Real-Time Fraud Detection API', type: 'Project', source: 'GitHub', description: 'Containerized microservice with Docker, Prometheus metrics, and automated tests.', content: 'external' }
  ],
  ds_sub_1: [
    { id: 'ds_sub_1_1', title: 'Production Retrieval Augmented Generation (RAG)', type: 'Course', source: 'DeepLearning.AI', description: 'Chunking strategies, dense embeddings, vector indexing, and hybrid reranking.', content: 'video' },
    { id: 'ds_sub_1_2', title: 'Vector Database Benchmarks: Pinecone vs Qdrant vs Milvus', type: 'Article', source: 'Towards Data Science', description: 'Comparative latency, accuracy, and scaling analysis across vector search engines.', content: 'article' },
    { id: 'ds_sub_1_3', title: 'Enterprise Document Question Answering System', type: 'Project', source: 'GitHub', description: 'Full RAG pipeline querying multi-page PDFs with source citation and hallucination checks.', content: 'external' }
  ],
  ds_sub_2: [
    { id: 'ds_sub_2_1', title: 'Efficient Fine-Tuning with LoRA & QLoRA', type: 'Course', source: 'Hugging Face', description: 'Parameter-efficient fine-tuning of 7B-70B models using consumer GPUs and PEFT.', content: 'video' },
    { id: 'ds_sub_2_2', title: 'Quantization Deep Dive: GGML, AWQ, and BitsAndBytes', type: 'Article', source: 'Medium', description: 'Understanding 4-bit and 8-bit weight quantization without quality loss.', content: 'article' },
    { id: 'ds_sub_2_3', title: 'Domain-Adapted Legal Assistant LLM', type: 'Project', source: 'GitHub', description: 'Fine-tune Llama 3 on legal contracts dataset using unsloth and flash-attention.', content: 'external' }
  ],
  ds_sub_3: [
    { id: 'ds_sub_3_1', title: 'Building Multi-Agent AI Systems with LangGraph & CrewAI', type: 'Course', source: 'DeepLearning.AI', description: 'State machines, human-in-the-loop workflows, and autonomous tool calling agents.', content: 'video' },
    { id: 'ds_sub_3_2', title: 'Architecting Resilient Multi-Agent Workflows', type: 'Article', source: 'Towards Data Science', description: 'Error recovery, circular task prevention, and inter-agent communication schemas.', content: 'article' },
    { id: 'ds_sub_3_3', title: 'Autonomous Market Research Agent Squad', type: 'Project', source: 'GitHub', description: 'Collaborative agents that scrape news, perform competitor analysis, and write PDF briefs.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 2. FULL STACK SOFTWARE ENGINEERING
  // ─────────────────────────────────────────────────────────────
  fs_1: [
    { id: 'fs_1_1', title: 'Total TypeScript: Advanced Design Patterns', type: 'Course', source: 'TotalTypeScript', description: 'Generics, conditional types, template literal types, and robust UI component typing.', content: 'video' },
    { id: 'fs_1_2', title: 'Modern Component Architecture in React 19', type: 'Article', source: 'Kent C. Dodds', description: 'Compound components, custom hooks, and co-locating component state.', content: 'article' },
    { id: 'fs_1_3', title: 'Enterprise Design System Component Library', type: 'Project', source: 'GitHub', description: 'Publishable NPM package with Tailwind CSS, CVA variants, and TypeScript types.', content: 'external' }
  ],
  fs_2: [
    { id: 'fs_2_1', title: 'Production REST & GraphQL API Engineering', type: 'Course', source: 'Frontend Masters', description: 'Node.js, Express, rate limiting, JWT authentication, and secure session management.', content: 'video' },
    { id: 'fs_2_2', title: 'Zero-Trust OAuth 2.0 & Refresh Token Rotation', type: 'Article', source: 'Auth0 Blog', description: 'Securing single-page applications against XSS and CSRF token interception.', content: 'article' },
    { id: 'fs_2_3', title: 'Multi-Tenant SaaS Authentication Service', type: 'Project', source: 'GitHub', description: 'Role-based access control (RBAC) backend with automated password resets and MFA.', content: 'external' }
  ],
  fs_3: [
    { id: 'fs_3_1', title: 'PostgreSQL Mastery: Indexing, Transactions & ORMs', type: 'Course', source: 'Execute Program', description: 'ACID guarantees, B-tree indexes, execution plans, and Prisma ORM migrations.', content: 'video' },
    { id: 'fs_3_2', title: 'Avoiding the N+1 Query Problem in Modern ORMs', type: 'Article', source: 'Prisma Guide', description: 'Optimizing database roundtrips using eager joins and DataLoader patterns.', content: 'article' },
    { id: 'fs_3_3', title: 'High-Volume E-Commerce Order Ledger Database', type: 'Project', source: 'GitHub', description: 'Schema design supporting concurrency, optimistic locking, and audit logs.', content: 'external' }
  ],
  fs_4: [
    { id: 'fs_4_1', title: 'Real-Time Web Applications with WebSockets & Redis', type: 'Course', source: 'Udemy', description: 'Bi-directional messaging, rooms, horizontal scaling with Redis Pub/Sub adapters.', content: 'video' },
    { id: 'fs_4_2', title: 'Building Scalable Presence & Collaborative State', type: 'Article', source: 'Figma Engineering', description: 'How multiplayer apps handle cursor synchronization and heartbeat presence.', content: 'article' },
    { id: 'fs_4_3', title: 'Multiplayer Collaborative Whiteboard Canvas', type: 'Project', source: 'GitHub', description: 'Real-time drawing canvas using Socket.io and conflict-free replicated data types.', content: 'external' }
  ],
  fs_5: [
    { id: 'fs_5_1', title: 'DevOps for Developers: Docker, CI/CD & AWS', type: 'Course', source: 'Frontend Masters', description: 'Multi-stage Docker builds, GitHub Actions pipelines, and zero-downtime deployment.', content: 'video' },
    { id: 'fs_5_2', title: 'Optimizing Docker Images for Production React & Node Apps', type: 'Article', source: 'Docker Docs', description: 'Layer caching, minimal Alpine bases, and non-root security principles.', content: 'article' },
    { id: 'fs_5_3', title: 'Automated Preview Environment Pipeline', type: 'Project', source: 'GitHub', description: 'GitHub Action spawning temporary feature branch staging environments on AWS.', content: 'external' }
  ],
  fs_sub_1: [
    { id: 'fs_sub_1_1', title: 'Event-Driven Microservices with Apache Kafka', type: 'Course', source: 'Confluent Academy', description: 'Producers, consumers, partition rebalancing, and consumer offset management.', content: 'video' },
    { id: 'fs_sub_1_2', title: 'Designing Idempotent Event Consumers', type: 'Article', source: 'Martin Fowler Blog', description: 'Guaranteed at-least-once delivery patterns and deduplication strategies.', content: 'article' },
    { id: 'fs_sub_1_3', title: 'Real-Time Order Processing Event Pipeline', type: 'Project', source: 'GitHub', description: 'Microservices decoupled through Kafka topics with dead-letter queue handling.', content: 'external' }
  ],
  fs_sub_2: [
    { id: 'fs_sub_2_1', title: 'High-Speed Microservices with gRPC & Protobuf', type: 'Course', source: 'Udemy', description: 'Binary serialization, bidirectional streaming, and polyglot service integration.', content: 'video' },
    { id: 'fs_sub_2_2', title: 'Benchmarking REST vs gRPC for Low-Latency APIs', type: 'Article', source: 'Netflix TechBlog', description: 'Throughput and serialization benchmarks under high network concurrency.', content: 'article' },
    { id: 'fs_sub_2_3', title: 'Distributed Telemetry Aggregator in Go & Node', type: 'Project', source: 'GitHub', description: 'High-throughput metrics ingestion pipeline communicating via gRPC.', content: 'external' }
  ],
  fs_sub_3: [
    { id: 'fs_sub_3_1', title: 'Zero-Downtime Blue-Green Deployment Strategies', type: 'Course', source: 'AWS Skill Builder', description: 'Route53 traffic shifting, ALB target groups, and canary health monitoring.', content: 'video' },
    { id: 'fs_sub_3_2', title: 'Database Migrations Without Downtime: Expand & Contract Pattern', type: 'Article', source: 'Stripe Engineering', description: 'Safe column renames and schema alterations on production databases.', content: 'article' },
    { id: 'fs_sub_3_3', title: 'Automated Canary Rollout Controller', type: 'Project', source: 'GitHub', description: 'Automated deployment script tracking error rates and triggering rollbacks.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 3. FRONTEND ENGINEERING
  // ─────────────────────────────────────────────────────────────
  fe_1: [
    { id: 'fe_1_1', title: 'Modern CSS Masterclass: Grid, Subgrid & Container Queries', type: 'Course', source: 'Every Layout', description: 'Intrinsically responsive layouts without brittle media queries and complex floats.', content: 'video' },
    { id: 'fe_1_2', title: 'Fluid Typography & Spacing Systems with CSS clamp()', type: 'Article', source: 'CSS-Tricks', description: 'Building mathematical fluid scales that automatically adjust across viewports.', content: 'article' },
    { id: 'fe_1_3', title: 'Interactive Dashboard Grid with Resizable Panes', type: 'Project', source: 'CodePen', description: 'Pure CSS Grid layout with CSS custom properties and draggable dividers.', content: 'external' }
  ],
  fe_2: [
    { id: 'fe_2_1', title: 'React 19 Deep Dive: Fiber, Actions & Server Components', type: 'Course', source: 'Frontend Masters', description: 'Concurrent scheduling, lane priorities, useTransition, and server rendering mechanics.', content: 'video' },
    { id: 'fe_2_2', title: 'Profiling React Performance with Chrome DevTools', type: 'Article', source: 'Overreacted', description: 'Diagnosing wasted renders, long tasks, and unneeded hook dependencies.', content: 'article' },
    { id: 'fe_2_3', title: 'Virtual Scrolling Table Handling 100,000 Rows', type: 'Project', source: 'GitHub', description: 'Smooth 60fps windowed rendering list with dynamic row heights.', content: 'external' }
  ],
  fe_3: [
    { id: 'fe_3_1', title: 'State Management with Zustand & TanStack Query', type: 'Course', source: 'TkDodo Blog & Course', description: 'Separating client UI state from server cache, optimistic updates, and invalidations.', content: 'video' },
    { id: 'fe_3_2', title: 'Inside TanStack Query: Stale-While-Revalidate Explained', type: 'Article', source: 'TkDodo Tech', description: 'Cache keys, garbage collection, query cancellation, and prefetching techniques.', content: 'article' },
    { id: 'fe_3_3', title: 'Offline-Capable Kanban Board with Optimistic Sync', type: 'Project', source: 'GitHub', description: 'Trello-style drag and drop board with immediate optimistic mutations and rollbacks.', content: 'external' }
  ],
  fe_4: [
    { id: 'fe_4_1', title: 'Mastering Core Web Vitals (LCP, INP, CLS)', type: 'Course', source: 'Web.dev by Google', description: 'Diagnosing interaction latency, optimizing resource priorities, and font swapping.', content: 'video' },
    { id: 'fe_4_2', title: 'Code Splitting & Dynamic Imports in Vite', type: 'Article', source: 'Vite Docs', description: 'Route-level code splitting, manual vendor chunks, and asset compression.', content: 'article' },
    { id: 'fe_4_3', title: 'Web Vitals Performance Audit & Fix Suite', type: 'Project', source: 'GitHub', description: 'Audit report and optimization PR bringing Lighthouse score from 55 to 98.', content: 'external' }
  ],
  fe_5: [
    { id: 'fe_5_1', title: 'Frontend Testing with Vitest, Playwright & Storybook', type: 'Course', source: 'TestingJavaScript.com', description: 'Unit testing hooks, visual regression testing in Storybook, and end-to-end tests.', content: 'video' },
    { id: 'fe_5_2', title: 'The Practical Test Pyramid for Modern Web Apps', type: 'Article', source: 'Kent C. Dodds', description: 'Balancing unit, integration, and E2E tests for maximum confidence.', content: 'article' },
    { id: 'fe_5_3', title: 'Production Storybook & Automated Visual Diff Suite', type: 'Project', source: 'GitHub', description: 'Component catalog with chromatic visual regression checks on every pull request.', content: 'external' }
  ],
  fe_sub_1: [
    { id: 'fe_sub_1_1', title: 'Three.js Journey with Bruno Simon', type: 'Course', source: 'Threejs Journey', description: 'Cameras, geometries, lights, shadows, custom textures, and physics simulations.', content: 'video' },
    { id: 'fe_sub_1_2', title: 'Declarative 3D with React Three Fiber & Drei', type: 'Article', source: 'Poimandres Guide', description: 'Managing Three.js scene graphs inside declarative React components.', content: 'article' },
    { id: 'fe_sub_1_3', title: 'Interactive 3D Product Customizer Showroom', type: 'Project', source: 'GitHub', description: 'WebGL interactive showcase with glTF model loading and material color swaps.', content: 'external' }
  ],
  fe_sub_2: [
    { id: 'fe_sub_2_1', title: 'The Book of Shaders: Fragment & Vertex GLSL', type: 'Course', source: 'The Book of Shaders', description: 'Algorithmic drawing, procedural noise, fractional Brownian motion, and raymarching.', content: 'video' },
    { id: 'fe_sub_2_2', title: 'Post-Processing Shaders: Bloom, Vignette, and Chromatic Aberration', type: 'Article', source: 'Codrops', description: 'Full-screen render passes creating cinematic visual atmosphere on the web.', content: 'article' },
    { id: 'fe_sub_2_3', title: 'Interactive Audio Visualizer Shader', type: 'Project', source: 'ShaderToy', description: 'Audio-reactive GLSL shader responding dynamically to microphone input frequencies.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 4. BACKEND & CLOUD INFRASTRUCTURE
  // ─────────────────────────────────────────────────────────────
  be_1: [
    { id: 'be_1_1', title: 'High-Concurrency Backend Engineering in Go', type: 'Course', source: 'Frontend Masters', description: 'Goroutines, channels, sync primitives, memory allocations, and low-latency HTTP routers.', content: 'video' },
    { id: 'be_1_2', title: 'Understanding the Go Garbage Collector & Escape Analysis', type: 'Article', source: 'Ardan Labs', description: 'Minimizing heap allocations and tuning GC pacing for sustained high throughput.', content: 'article' },
    { id: 'be_1_3', title: 'Distributed URL Shortener with Go & Redis', type: 'Project', source: 'GitHub', description: 'High-throughput microservice handling 20,000 req/sec with Base62 encoding.', content: 'external' }
  ],
  be_2: [
    { id: 'be_2_1', title: 'Database Internals: Storage Engines & Indexing', type: 'Course', source: 'CMU Database Group', description: 'B+ trees, LSM trees, write-ahead logging (WAL), and distributed consensus.', content: 'video' },
    { id: 'be_2_2', title: 'PostgreSQL Deep Dive: EXPLAIN ANALYZE & Query Plans', type: 'Article', source: 'Use The Index, Luke!', description: 'Identifying index scans vs sequential scans, hash joins, and cost estimates.', content: 'article' },
    { id: 'be_2_3', title: 'Database Sharding & Replication Simulation', type: 'Project', source: 'GitHub', description: 'Consistent hashing router distributing writes across 4 PostgreSQL shards.', content: 'external' }
  ],
  be_3: [
    { id: 'be_3_1', title: 'Infrastructure as Code with Terraform & AWS', type: 'Course', source: 'HashiCorp Learn', description: 'Modules, remote state in S3, VPC subnets, IAM policies, and RDS clusters.', content: 'video' },
    { id: 'be_3_2', title: 'Terraform Best Practices: Structuring Multi-Env Repos', type: 'Article', source: 'Gruntwork Blog', description: 'Terragrunt patterns, state locking, and keeping development and production DRY.', content: 'article' },
    { id: 'be_3_3', title: 'Production Multi-AZ AWS Infrastructure in Terraform', type: 'Project', source: 'GitHub', description: 'Complete automated infrastructure for a containerized web application.', content: 'external' }
  ],
  be_4: [
    { id: 'be_4_1', title: 'Kubernetes from Ground Up (CKA Preparation)', type: 'Course', source: 'Udemy / Mumshad', description: 'Pods, Deployments, Services, Ingress controllers, PersistentVolumes, and Helm.', content: 'video' },
    { id: 'be_4_2', title: 'Architecting Kubernetes Horizontal Pod Autoscaling', type: 'Article', source: 'K8s Official Docs', description: 'Scaling workloads based on CPU, memory, and custom Prometheus queue length.', content: 'article' },
    { id: 'be_4_3', title: 'Self-Healing Microservices Deployment on Minikube', type: 'Project', source: 'GitHub', description: 'Helm chart with liveness probes, readiness probes, and rolling update strategy.', content: 'external' }
  ],
  be_5: [
    { id: 'be_5_1', title: 'Cloud Observability: Prometheus, Grafana & OpenTelemetry', type: 'Course', source: 'Coursera', description: 'Distributed tracing, contextual spans, RED metrics, and P99 alert thresholds.', content: 'video' },
    { id: 'be_5_2', title: 'Site Reliability Engineering (SRE): Defining SLIs and SLOs', type: 'Article', source: 'Google SRE Book', description: 'Error budgets, burn rates, and building actionable on-call alert rules.', content: 'article' },
    { id: 'be_5_3', title: 'Production Observability Dashboard & Synthetic Monitor', type: 'Project', source: 'GitHub', description: 'Full Grafana dashboard monitoring cluster API health, latency, and error spikes.', content: 'external' }
  ],
  be_sub_1: [
    { id: 'be_sub_1_1', title: 'Multi-Region Architecture & Disaster Recovery', type: 'Course', source: 'AWS Solutions Architecture', description: 'Active-Active vs Active-Passive databases, Aurora Global Database, and latency routing.', content: 'video' },
    { id: 'be_sub_1_2', title: 'Handling Split-Brain in Distributed Clusters', type: 'Article', source: 'Jepsen Analysis', description: 'Quorum consensus, Raft protocol, and network partition recovery strategies.', content: 'article' },
    { id: 'be_sub_1_3', title: 'Automated Multi-Region Failover Controller', type: 'Project', source: 'GitHub', description: 'Health check probe triggering automated DNS flip and read-replica promotion.', content: 'external' }
  ],
  be_sub_2: [
    { id: 'be_sub_2_1', title: 'Chaos Engineering with Chaos Mesh & Litmus', type: 'Course', source: 'Linux Foundation', description: 'Simulating pod kill, packet drop, disk pressure, and clock skew in staging.', content: 'video' },
    { id: 'be_sub_2_2', title: 'Principles of Chaos Engineering & Hypotheses', type: 'Article', source: 'Netflix Principles of Chaos', description: 'Formulating steady-state hypotheses and testing system resilience safely.', content: 'article' },
    { id: 'be_sub_2_3', title: 'Automated Stress & Chaos Injection CI Pipeline', type: 'Project', source: 'GitHub', description: 'k6 load test combined with random pod termination during benchmark run.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 5. UI/UX PRODUCT DESIGN
  // ─────────────────────────────────────────────────────────────
  de_1: [
    { id: 'de_1_1', title: 'Visual Design Foundations & Visual Hierarchy', type: 'Course', source: 'DesignCode', description: 'Grid systems, typographical scales, intentional white space, and color harmony.', content: 'video' },
    { id: 'de_1_2', title: 'Optical Adjustments in Digital Design', type: 'Article', source: 'Refactoring UI', description: 'Visual balance vs mathematical centering, icon alignment, and text contrast.', content: 'article' },
    { id: 'de_1_3', title: 'B2B SaaS Dashboard Visual Redesign', type: 'Project', source: 'Figma Community', description: 'Redesign of a complex data analytics tool focusing on scannability and contrast.', content: 'external' }
  ],
  de_2: [
    { id: 'de_2_1', title: 'User Research & Journey Mapping Methodologies', type: 'Course', source: 'Interaction Design Foundation', description: 'Generative research interviews, affinity diagrams, persona formulation, and empathy maps.', content: 'video' },
    { id: 'de_2_2', title: 'How to Conduct Effective Usability Test Sessions', type: 'Article', source: 'Nielsen Norman Group', description: 'Task-based user testing script design, thinking out loud protocols, and bias reduction.', content: 'article' },
    { id: 'de_2_3', title: 'Comprehensive FinTech Onboarding Journey Map', type: 'Project', source: 'Figma', description: 'End-to-end journey map documenting friction points and drop-off opportunities.', content: 'external' }
  ],
  de_3: [
    { id: 'de_3_1', title: 'Scalable Design Systems & Token Architecture in Figma', type: 'Course', source: 'Figma Learn', description: 'Design tokens, component variants, auto-layout 5.0, and syncing with code.', content: 'video' },
    { id: 'de_3_2', title: 'Naming Tokens: Semantic vs Primitive Schemes', type: 'Article', source: 'Supernova Guide', description: 'Structuring color, typography, and spacing tokens for seamless developer handoff.', content: 'article' },
    { id: 'de_3_3', title: 'Complete Multi-Brand Design System in Figma', type: 'Project', source: 'Figma Community', description: '50+ reusable components supporting dark mode, light mode, and high-contrast themes.', content: 'external' }
  ],
  de_4: [
    { id: 'de_4_1', title: 'Advanced Micro-Interactions with Figma & Framer', type: 'Course', source: 'Framer Academy', description: 'Smart Animate, spring physics, interactive states, and component transitions.', content: 'video' },
    { id: 'de_4_2', title: 'The Psychology of Micro-Interactions in SaaS', type: 'Article', source: 'UX Collective', description: 'Providing satisfying feedback, progress indication, and Delightful UX cues.', content: 'article' },
    { id: 'de_4_3', title: 'Interactive Mobile Banking App Prototype', type: 'Project', source: 'Figma', description: 'Realistic clickable prototype with swipe actions, PIN entry, and modal sheets.', content: 'external' }
  ],
  de_5: [
    { id: 'de_5_1', title: 'Designing for Accessibility: WCAG 2.2 Standards', type: 'Course', source: 'Deque University', description: 'Color contrast ratios, keyboard focus rings, screen reader labels, and touch targets.', content: 'video' },
    { id: 'de_5_2', title: 'Common Accessibility Traps in Modern Web Apps', type: 'Article', source: 'Smashing Magazine', description: 'Modal focus traps, dynamic content announcements, and custom dropdown pitfalls.', content: 'article' },
    { id: 'de_5_3', title: 'Full Accessibility Audit & Remediation Spec', type: 'Project', source: 'Behance', description: 'Complete audit of a live checkout flow identifying WCAG AA compliance fixes.', content: 'external' }
  ],
  de_sub_1: [
    { id: 'de_sub_1_1', title: 'Spatial Design & UI for Immersive Computing', type: 'Course', source: 'Apple Developer', description: 'Depth layering, gaze input, spatial audio feedback, and dynamic lighting.', content: 'video' },
    { id: 'de_sub_1_2', title: 'Designing Glassmorphism & Materials in Spatial OS', type: 'Article', source: 'UX Collective', description: 'Legibility rules over semi-transparent surfaces in variable real-world lighting.', content: 'article' },
    { id: 'de_sub_1_3', title: 'Spatial Workspace UI Kit & VisionOS Concept', type: 'Project', source: 'Figma Community', description: '3D windowed workspace layout with natural gesture navigation controls.', content: 'external' }
  ],
  de_sub_2: [
    { id: 'de_sub_2_1', title: 'VisionOS Spatial Prototyping with Spline & Figma', type: 'Course', source: 'DesignCode', description: 'Importing 3D assets into interactive canvases with spatial raycast interactions.', content: 'video' },
    { id: 'de_sub_2_2', title: 'Ergonomics of Gaze and Pinch Interactions', type: 'Article', source: 'UX Movement', description: 'Minimizing eye strain and arm fatigue in head-mounted spatial computing.', content: 'article' },
    { id: 'de_sub_2_3', title: 'Spatial Media Player Interactive Prototype', type: 'Project', source: 'Spline', description: 'Interactive 3D media player widget that anchors into immersive environments.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 6. GAME DEVELOPMENT
  // ─────────────────────────────────────────────────────────────
  gm_1: [
    { id: 'gm_1_1', title: 'Unity C# Survival Guide: Architecture & Lifecycle', type: 'Course', source: 'GameDev.tv', description: 'MonoBehaviour execution order, scriptable objects, event systems, and memory profiling.', content: 'video' },
    { id: 'gm_1_2', title: 'Decoupling Game Logic with ScriptableObject Architecture', type: 'Article', source: 'Unity Blog', description: 'Using ScriptableObject game events to eliminate hardcoded singleton references.', content: 'article' },
    { id: 'gm_1_3', title: 'Modular Inventory & Equipment System in Unity', type: 'Project', source: 'GitHub', description: 'Extensible item database with drag-and-drop slots and save-state persistence.', content: 'external' }
  ],
  gm_2: [
    { id: 'gm_2_1', title: 'Smooth 3D Character Controller & Kinematics', type: 'Course', source: 'Brackeys Archive', description: 'Rigidbodies, collision detection, coyote time, jump buffering, and raycasts.', content: 'video' },
    { id: 'gm_2_2', title: 'Finite State Machines for Player Movement', type: 'Article', source: 'Habrador Game Dev', description: 'Clean hierarchical state machines for Idle, Run, Jump, Dash, and Wall-slide.', content: 'article' },
    { id: 'gm_2_3', title: 'Responsive 3D Platformer Movement Controller', type: 'Project', source: 'GitHub', description: 'Production-ready character controller with smooth camera follow and slope handling.', content: 'external' }
  ],
  gm_3: [
    { id: 'gm_3_1', title: 'Game AI: Behavior Trees & NavMesh Pathfinding', type: 'Course', source: 'Udemy', description: 'Selector nodes, sequence nodes, decorators, NavMesh agents, and dynamic obstacle avoidance.', content: 'video' },
    { id: 'gm_3_2', title: 'Building a Node-Based Behavior Tree Visual Editor in Unity', type: 'Article', source: 'The AI Game Dev', description: 'Custom editor windows using Unity UI Toolkit to visualize active AI nodes.', content: 'article' },
    { id: 'gm_3_3', title: 'Stealth Game Enemy AI with Hearing & Vision Cones', type: 'Project', source: 'GitHub', description: 'Enemy guards patrolling, investigating sound triggers, and pursuing the player.', content: 'external' }
  ],
  gm_4: [
    { id: 'gm_4_1', title: 'Shader Graph Mastery: Visual Effects in Unity URP', type: 'Course', source: 'GameDev.tv', description: 'PBR materials, vertex displacement, dissolve effects, and water surface shaders.', content: 'video' },
    { id: 'gm_4_2', title: 'Writing Custom Stylized Cel Shaders in HLSL', type: 'Article', source: 'MinionsArt Tutorials', description: 'Step lighting bands, rim light highlights, and inverted hull outline passes.', content: 'article' },
    { id: 'gm_4_3', title: 'Sci-Fi Shield Impact & Forcefield VFX Suite', type: 'Project', source: 'Unity Asset Store', description: 'Custom particle systems and shader graph impact effects triggered on hit.', content: 'external' }
  ],
  gm_5: [
    { id: 'gm_5_1', title: 'Unity Optimization: Profiler, Garbage Collector & Draw Calls', type: 'Course', source: 'Unity Learn', description: 'Draw call batching, texture atlases, occlusion culling, and reducing GC allocations.', content: 'video' },
    { id: 'gm_5_2', title: 'Mobile Game Optimization: Target Stable 60 FPS', type: 'Article', source: 'Arm Community', description: 'Bandwidth optimization, texture compression (ASTC), and LOD mesh strategies.', content: 'article' },
    { id: 'gm_5_3', title: 'Cross-Platform Mobile & PC Benchmark Scene', type: 'Project', source: 'GitHub', description: 'Stress test scene benchmarking draw calls, physics rigidbodies, and frame rate.', content: 'external' }
  ],
  gm_sub_1: [
    { id: 'gm_sub_1_1', title: 'Multiplayer Games with Netcode for GameObjects', type: 'Course', source: 'Code Monkey', description: 'Client-server architecture, NetworkVariables, Server RPCs, and lag compensation.', content: 'video' },
    { id: 'gm_sub_1_2', title: 'Client-Side Prediction & Server Reconciliation Explained', type: 'Article', source: 'Gabriel Gambetta Tech', description: 'How competitive online games mask network latency for instant player responsiveness.', content: 'article' },
    { id: 'gm_sub_1_3', title: 'Fast-Paced 4-Player Multiplayer Arena Game', type: 'Project', source: 'GitHub', description: 'Real-time online shooter with lobby matchmaking and snapshot interpolation.', content: 'external' }
  ],
  gm_sub_2: [
    { id: 'gm_sub_2_1', title: 'Dedicated Headless Game Server Hosting with Agones', type: 'Course', source: 'Google Cloud Training', description: 'Running headless Unity servers inside Kubernetes containers with automated scaling.', content: 'video' },
    { id: 'gm_sub_2_2', title: 'Cost-Effective Game Server Fleet Management', type: 'Article', source: 'Riot Games TechBlog', description: 'Dynamic provisioning, geographic matchmaking, and graceful server draining.', content: 'article' },
    { id: 'gm_sub_2_3', title: 'Headless Linux Server Docker Build Pipeline', type: 'Project', source: 'GitHub', description: 'Automated GitHub Action building and pushing Linux dedicated server containers.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 7. BLOCKCHAIN & WEB3
  // ─────────────────────────────────────────────────────────────
  bc_1: [
    { id: 'bc_1_1', title: 'Ethereum & EVM Architecture from First Principles', type: 'Course', source: 'Cyfrin Updraft', description: 'Account models, gas mechanics, transaction lifecycle, opcode execution, and state trie.', content: 'video' },
    { id: 'bc_1_2', title: 'Deep Dive into EVM Storage Layout & Gas Optimization', type: 'Article', source: 'RareSkills', description: 'Storage slot packing, warm/cold storage access costs, and SSTORE opcode quirks.', content: 'article' },
    { id: 'bc_1_3', title: 'Pure Assembly (Yul) EVM Gas Benchmark Suite', type: 'Project', source: 'GitHub', description: 'Benchmarking standard Solidity implementations against optimized inline assembly.', content: 'external' }
  ],
  bc_2: [
    { id: 'bc_2_1', title: 'Smart Contract Development with Foundry & Solidity', type: 'Course', source: 'Patrick Collins / Cyfrin', description: 'Fuzz testing, invariant testing, deployment scripts, and OpenZeppelin standards.', content: 'video' },
    { id: 'bc_2_2', title: 'Writing Effective Invariant Tests in Foundry', type: 'Article', source: 'Trail of Bits Blog', description: 'Defining state invariants to uncover obscure multi-transaction edge case vulnerabilities.', content: 'article' },
    { id: 'bc_2_3', title: 'DeFi Automated Liquidity Pool & Token Swap Contract', type: 'Project', source: 'GitHub', description: 'Constant product automated market maker (x * y = k) with flash loan resistance.', content: 'external' }
  ],
  bc_3: [
    { id: 'bc_3_1', title: 'Fullstack dApp Development with Wagmi, Viem & RainbowKit', type: 'Course', source: 'Buildspace', description: 'Wallet connection, contract writes, event logs listening, and handling transaction toasts.', content: 'video' },
    { id: 'bc_3_2', title: 'Viem vs Ethers.js: The Next Generation Web3 Client', type: 'Article', source: 'Viem Docs', description: 'Type-safe contract ABIs, lightweight bundle size, and tree-shakeable functions.', content: 'article' },
    { id: 'bc_3_3', title: 'Decentralized Crowdfunding Platform dApp', type: 'Project', source: 'GitHub', description: 'React frontend interacting with smart contracts for campaign funding and refund logic.', content: 'external' }
  ],
  bc_4: [
    { id: 'bc_4_1', title: 'Smart Contract Security & Hacking (Damn Vulnerable DeFi)', type: 'Course', source: 'Secureum', description: 'Reentrancy, flash loan attacks, price oracle manipulation, and front-running protection.', content: 'video' },
    { id: 'bc_4_2', title: 'Static Analysis with Slither & Automated Auditing Tools', type: 'Article', source: 'Trail of Bits', description: 'Setting up automated static analysis in pull requests to catch known anti-patterns.', content: 'article' },
    { id: 'bc_4_3', title: 'Comprehensive DeFi Audit Report & Proof of Concept', type: 'Project', source: 'GitHub', description: 'Detailed security audit findings reproducing a reentrancy exploit with Foundry tests.', content: 'external' }
  ],
  bc_5: [
    { id: 'bc_5_1', title: 'Layer 2 Rollups: Optimistic vs Zero-Knowledge', type: 'Course', source: 'Ethereum Foundation', description: 'Arbitrum, Optimism, zkSync, data availability layers, and bridge security models.', content: 'video' },
    { id: 'bc_5_2', title: 'The Mechanics of EIP-4844 Proto-Danksharding', type: 'Article', source: 'Vitalik Buterin Blog', description: 'Blob transactions, ephemeral storage, and dramatic Layer 2 gas fee reductions.', content: 'article' },
    { id: 'bc_5_3', title: 'Cross-Chain Asset Bridge Prototype with Chainlink CCIP', type: 'Project', source: 'GitHub', description: 'Sending cross-chain messages and minting wrapped tokens across testnets.', content: 'external' }
  ],
  bc_sub_1: [
    { id: 'bc_sub_1_1', title: 'Zero-Knowledge Proofs with Circom & SnarkJS', type: 'Course', source: 'ZKU.one', description: 'Arithmetic circuits, rank-1 constraint systems (R1CS), and Groth16 zk-SNARKs.', content: 'video' },
    { id: 'bc_sub_1_2', title: 'An Intuitive Introduction to Polynomial Commitments', type: 'Article', source: 'Vitalik Buterin Blog', description: 'KZG commitments, blinding factors, and succinct proof generation.', content: 'article' },
    { id: 'bc_sub_1_3', title: 'Anonymous Voting dApp with Zero-Knowledge Proofs', type: 'Project', source: 'GitHub', description: 'Voters prove group membership without revealing identity or vote choices on-chain.', content: 'external' }
  ],
  bc_sub_2: [
    { id: 'bc_sub_2_1', title: 'ERC-4337 Account Abstraction & Smart Accounts', type: 'Course', source: 'ZeroDev Academy', description: 'UserOperations, Bundlers, Paymasters, and gas sponsorship for Web2 onboarding.', content: 'video' },
    { id: 'bc_sub_2_2', title: 'Gasless Transactions and Social Login with Web3Auth', type: 'Article', source: 'Biconomy Blog', description: 'Onboarding users with Google login while maintaining non-custodial smart wallets.', content: 'article' },
    { id: 'bc_sub_2_3', title: 'Gasless Mobile dApp with Session Keys', type: 'Project', source: 'GitHub', description: 'Smart account dApp allowing users to play on-chain games without signing every move.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 8. CYBERSECURITY
  // ─────────────────────────────────────────────────────────────
  sec_1: [
    { id: 'sec_1_1', title: 'Network Security & Packet Analysis with Wireshark', type: 'Course', source: 'Cybrary', description: 'TCP handshakes, DNS spoofing, ARP cache poisoning, and TLS handshake decryption.', content: 'video' },
    { id: 'sec_1_2', title: 'Dissecting Modern DDoS Attacks & Mitigation Strategies', type: 'Article', source: 'Cloudflare Learning', description: 'SYN floods, NTP amplification, and Layer 7 HTTP request attacks.', content: 'article' },
    { id: 'sec_1_3', title: 'Network Intrusion Detection System with Snort', type: 'Project', source: 'GitHub', description: 'Configure custom Snort rules to detect suspicious port scans and brute-force attempts.', content: 'external' }
  ],
  sec_2: [
    { id: 'sec_2_1', title: 'Linux Privilege Escalation & System Hardening', type: 'Course', source: 'TryHackMe', description: 'SUID binaries, capabilities, cron job exploitation, sudo misconfigurations, and kernel exploits.', content: 'video' },
    { id: 'sec_2_2', title: 'CIS Benchmarks: Production Linux Server Hardening', type: 'Article', source: 'Red Hat Security', description: 'Disabling root SSH, configuring fail2ban, iptables firewalling, and SELinux enforcement.', content: 'article' },
    { id: 'sec_2_3', title: 'Automated Linux Security Audit Script (Lynis)', type: 'Project', source: 'GitHub', description: 'Bash automation auditing file permissions, open ports, and vulnerable packages.', content: 'external' }
  ],
  sec_3: [
    { id: 'sec_3_1', title: 'Web Application Penetration Testing (OWASP Top 10)', type: 'Course', source: 'PortSwigger Web Security Academy', description: 'SQL Injection, Cross-Site Scripting (XSS), CSRF, SSRF, and broken access controls.', content: 'video' },
    { id: 'sec_3_2', title: 'Bypassing WAFs and Filter Evasion Techniques', type: 'Article', source: 'PortSwigger Research', description: 'Encoding payloads, chunked transfer encoding, and unicode normalization quirks.', content: 'article' },
    { id: 'sec_3_3', title: 'Vulnerability Assessment Report on Demo Target', type: 'Project', source: 'GitHub', description: 'Comprehensive pentest report with CVSS scoring and remediation recommendations.', content: 'external' }
  ],
  sec_4: [
    { id: 'sec_4_1', title: 'Active Directory Attacks and Defense', type: 'Course', source: 'TCM Security', description: 'Kerberoasting, AS-REP roasting, DCSync, BloodHound path discovery, and Golden Tickets.', content: 'video' },
    { id: 'sec_4_2', title: 'Hardening Active Directory: Tiered Administrative Model', type: 'Article', source: 'Microsoft Security', description: 'Protecting domain controllers with Tier 0 isolation and LAPS password management.', content: 'article' },
    { id: 'sec_4_3', title: 'Active Directory Attack Lab in VirtualBox', type: 'Project', source: 'GitHub', description: 'Lab environment demonstrating BloodHound shortest-path attack graph analysis.', content: 'external' }
  ],
  sec_5: [
    { id: 'sec_5_1', title: 'SOC Analyst Fundamentals: SIEM & Threat Hunting', type: 'Course', source: 'LetsDefend', description: 'Splunk queries, log correlation, IOC detection, MITRE ATT&CK mapping, and malware triage.', content: 'video' },
    { id: 'sec_5_2', title: 'Memory Forensics with Volatility: Detecting Hidden Processes', type: 'Article', source: 'SANS Institute', description: 'Analyzing RAM dumps to extract injected DLLs and malicious command lines.', content: 'article' },
    { id: 'sec_5_3', title: 'Ransomware Incident Response Playbook & Case File', type: 'Project', source: 'GitHub', description: 'Step-by-step containment, eradication, and evidence preservation documentation.', content: 'external' }
  ],
  sec_sub_1: [
    { id: 'sec_sub_1_1', title: 'DevSecOps: Automated Security in CI/CD Pipelines', type: 'Course', source: 'Udemy', description: 'SAST with Semgrep, DAST with OWASP ZAP, container scanning with Trivy, and secret detection.', content: 'video' },
    { id: 'sec_sub_1_2', title: 'Preventing Hardcoded Secrets in Git Repositories', type: 'Article', source: 'GitGuardian', description: 'Pre-commit hooks, automated token revocation, and enterprise secrets management.', content: 'article' },
    { id: 'sec_sub_1_3', title: 'Secure CI/CD Pipeline with Automated Vulnerability Gates', type: 'Project', source: 'GitHub', description: 'GitHub Actions workflow blocking deployments if critical vulnerabilities are found.', content: 'external' }
  ],
  sec_sub_2: [
    { id: 'sec_sub_2_1', title: 'AWS Cloud Security & GuardDuty Threat Detection', type: 'Course', source: 'A Cloud Guru', description: 'IAM policies, S3 bucket lockdowns, CloudTrail audits, GuardDuty, and Security Hub.', content: 'video' },
    { id: 'sec_sub_2_2', title: 'Remediating AWS IAM Privilege Escalation Vectors', type: 'Article', source: 'Rhino Security Labs', description: 'Identifying over-permissive wildcard roles and dangerous PassRole permissions.', content: 'article' },
    { id: 'sec_sub_2_3', title: 'Automated Cloud Compliance Checker with Prowler', type: 'Project', source: 'GitHub', description: 'Run automated CIS AWS benchmark checks and generate compliance audit reports.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 9. BUSINESS & ANALYTICS
  // ─────────────────────────────────────────────────────────────
  an_1: [
    { id: 'an_1_1', title: 'Advanced SQL for Analytics: Window Functions & CTEs', type: 'Course', source: 'Mode Analytics', description: 'ROW_NUMBER(), DENSE_RANK(), LAG(), LEAD(), cumulative sums, and complex joins.', content: 'video' },
    { id: 'an_1_2', title: 'Dimensional Modeling: Kimball Star Schemas Explained', type: 'Article', source: 'Towards Data Science', description: 'Fact tables, slowly changing dimensions (SCD Type 2), and surrogate keys.', content: 'article' },
    { id: 'an_1_3', title: 'Enterprise E-Commerce Sales Analytics Data Mart', type: 'Project', source: 'GitHub', description: 'PostgreSQL database modeling customer transactions with modular SQL views.', content: 'external' }
  ],
  an_2: [
    { id: 'an_2_1', title: 'Executive Dashboard Design in Tableau & Power BI', type: 'Course', source: 'Maven Analytics', description: 'DAX formulas, LOD expressions, parameter actions, and storytelling with data.', content: 'video' },
    { id: 'an_2_2', title: 'The Cognitive Science of Data Visualization', type: 'Article', source: 'Stephen Few / Perceptual Edge', description: 'Preattentive visual attributes, eliminating chart junk, and choosing the right visualization.', content: 'article' },
    { id: 'an_2_3', title: 'SaaS Executive KPI Dashboard with Interactive Drill-Downs', type: 'Project', source: 'Tableau Public', description: 'Interactive dashboard tracking MRR, ARR, churn rate, and CAC payback period.', content: 'external' }
  ],
  an_3: [
    { id: 'an_3_1', title: 'Product Analytics: Funnels, Cohorts & Retention', type: 'Course', source: 'Reforge', description: 'Aha moments, retention curves, drop-off diagnostics, and north star metric frameworks.', content: 'video' },
    { id: 'an_3_2', title: 'How to Read and Interpret Cohort Retention Heatmaps', type: 'Article', source: 'Amplitude Blog', description: 'Distinguishing day-N retention vs unbounded retention for feature engagement.', content: 'article' },
    { id: 'an_3_3', title: 'User Onboarding Funnel Diagnostic Report', type: 'Project', source: 'GitHub', description: 'Python script analyzing user session events to identify the highest drop-off steps.', content: 'external' }
  ],
  an_4: [
    { id: 'an_4_1', title: 'Time Series Forecasting with Python & Prophet', type: 'Course', source: 'Coursera', description: 'Trend decomposition, seasonality adjustments, ARIMA models, and Facebook Prophet.', content: 'video' },
    { id: 'an_4_2', title: 'Evaluating Forecast Accuracy: MAPE vs RMSE vs MAE', type: 'Article', source: 'Towards Data Science', description: 'Choosing the right loss metric for business inventory and revenue forecasting.', content: 'article' },
    { id: 'an_4_3', title: 'Retail Demand Forecasting Model with Holiday Offsets', type: 'Project', source: 'Kaggle', description: 'Trained model predicting daily unit sales across 50 retail locations.', content: 'external' }
  ],
  an_5: [
    { id: 'an_5_1', title: 'Modern Cloud Data Warehousing with dbt & Snowflake', type: 'Course', source: 'dbt Learn', description: 'ELT architecture, incremental models, documentation generation, and testing.', content: 'video' },
    { id: 'an_5_2', title: 'Snowflake Architecture: Micro-Partitions & Virtual Warehouses', type: 'Article', source: 'Snowflake Docs', description: 'Separation of compute and storage, zero-copy cloning, and time-travel querying.', content: 'article' },
    { id: 'an_5_3', title: 'Production dbt Analytics Engineering Repository', type: 'Project', source: 'GitHub', description: 'Complete dbt project with staging, intermediate, and marts layers plus schema tests.', content: 'external' }
  ],
  an_sub_1: [
    { id: 'an_sub_1_1', title: 'Customer Churn Prediction & Survival Analysis', type: 'Course', source: 'DataCamp', description: 'Cox proportional hazards, Kaplan-Meier curves, and logistic classification.', content: 'video' },
    { id: 'an_sub_1_2', title: 'From Churn Prediction to Retention Intervention', type: 'Article', source: 'Harvard Business Review', description: 'Targeting customers who are both high-risk and receptive to incentives.', content: 'article' },
    { id: 'an_sub_1_3', title: 'End-to-End Churn Scoring Pipeline with Automated Alerts', type: 'Project', source: 'GitHub', description: 'Python pipeline sending daily high-churn risk customer alerts to Slack.', content: 'external' }
  ],
  an_sub_2: [
    { id: 'an_sub_2_1', title: 'Real-Time Streaming Analytics with DuckDB & Kafka', type: 'Course', source: 'Confluent', description: 'In-process analytical querying over streaming event payloads with DuckDB.', content: 'video' },
    { id: 'an_sub_2_2', title: 'DuckDB: The SQLite of Analytics Explained', type: 'Article', source: 'DuckDB Blog', description: 'Vectorized columnar execution engine running embedded in memory.', content: 'article' },
    { id: 'an_sub_2_3', title: 'Live Clickstream Dashboard with DuckDB WASM', type: 'Project', source: 'GitHub', description: 'Client-side analytical dashboard querying millions of rows right inside the browser.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 10. QA & TEST AUTOMATION
  // ─────────────────────────────────────────────────────────────
  qa_1: [
    { id: 'qa_1_1', title: 'Software Testing Fundamentals & Test Case Matrix Design', type: 'Course', source: 'ISTQB Foundation', description: 'Boundary value analysis, equivalence partitioning, state transition, and test strategies.', content: 'video' },
    { id: 'qa_1_2', title: 'Writing Crisp, Actionable Bug Reports Engineers Love', type: 'Article', source: 'Ministry of Testing', description: 'Reproducible steps, environment isolation, expected vs actual behavior, and logs.', content: 'article' },
    { id: 'qa_1_3', title: 'Comprehensive Test Plan & Traceability Matrix', type: 'Project', source: 'Notion Template', description: 'Full test management plan covering smoke, regression, and acceptance criteria.', content: 'external' }
  ],
  qa_2: [
    { id: 'qa_2_1', title: 'API Testing Mastery with Postman & REST Assured', type: 'Course', source: 'Udemy', description: 'Collection runners, environment variables, Newman CLI in CI/CD, and Java REST Assured.', content: 'video' },
    { id: 'qa_2_2', title: 'JSON Schema Validation in Automated API Tests', type: 'Article', source: 'Postman Blog', description: 'Validating response payload structures automatically across all API endpoints.', content: 'article' },
    { id: 'qa_2_3', title: 'Automated Postman Test Suite with GitHub Actions', type: 'Project', source: 'GitHub', description: 'Newman test runner reporting HTML test results on every code merge.', content: 'external' }
  ],
  qa_3: [
    { id: 'qa_3_1', title: 'End-to-End Testing with Playwright & TypeScript', type: 'Course', source: 'Playwright Mastery', description: 'Page Object Model, network interception, multi-tab testing, and trace viewer.', content: 'video' },
    { id: 'qa_3_2', title: 'Why Playwright Outperforms Legacy Selenium', type: 'Article', source: 'Checkly Blog', description: 'Auto-waiting, isolated browser contexts, and native WebSocket inspection.', content: 'article' },
    { id: 'qa_3_3', title: 'Production E2E Smoke & Regression Test Suite', type: 'Project', source: 'GitHub', description: 'Parallelized Playwright test framework testing authentication, cart, and checkout.', content: 'external' }
  ],
  qa_4: [
    { id: 'qa_4_1', title: 'Mobile Test Automation with Appium 2.0', type: 'Course', source: 'TestAutomationU', description: 'UIAutomator2, XCUITest drivers, mobile gestures, and device cloud integration.', content: 'video' },
    { id: 'qa_4_2', title: 'Running Appium Tests on Real Device Farms (BrowserStack/SauceLabs)', type: 'Article', source: 'Appium Pro', description: 'Parallel execution across Android and iOS versions with screen recording.', content: 'article' },
    { id: 'qa_4_3', title: 'Cross-Platform React Native Appium Automation Suite', type: 'Project', source: 'GitHub', description: 'Automated test suite executing same test scenarios on both iOS and Android.', content: 'external' }
  ],
  qa_5: [
    { id: 'qa_5_1', title: 'Performance & Load Testing with k6', type: 'Course', source: 'k6 Documentation', description: 'Virtual users, ramp-up stages, thresholds, soak tests, and spike test scenarios.', content: 'video' },
    { id: 'qa_5_2', title: 'Interpreting Latency Percentiles: Why Average Response Time Lies', type: 'Article', source: 'Gil Tene / InfoQ', description: 'Understanding P95 and P99 tail latencies in distributed cloud architectures.', content: 'article' },
    { id: 'qa_5_3', title: 'Black Friday Spike Load Test Simulation', type: 'Project', source: 'GitHub', description: 'k6 script simulating 10,000 concurrent checkout sessions with metric alerts.', content: 'external' }
  ],
  qa_sub_1: [
    { id: 'qa_sub_1_1', title: 'Consumer-Driven Contract Testing with Pact', type: 'Course', source: 'Pactflow Academy', description: 'Preventing breaking API changes between independent microservice teams.', content: 'video' },
    { id: 'qa_sub_1_2', title: 'Contract Testing vs Integration Testing in Distributed Systems', type: 'Article', source: 'Martin Fowler', description: 'Catching integration bugs in local builds without spinning up all microservices.', content: 'article' },
    { id: 'qa_sub_1_3', title: 'Frontend-Backend Contract Verification Suite with Pact', type: 'Project', source: 'GitHub', description: 'Bi-directional contract validation in CI preventing unannounced payload alterations.', content: 'external' }
  ],
  qa_sub_2: [
    { id: 'qa_sub_2_1', title: 'Network Chaos & Web Performance Throttling Simulation', type: 'Course', source: 'Web Performance Calendar', description: 'Testing offline capabilities, 3G high-latency, packet drops, and flaky connections.', content: 'video' },
    { id: 'qa_sub_2_2', title: 'Testing Resilience Against Degraded Third-Party APIs', type: 'Article', source: 'Uber Engineering', description: 'Simulating slow response timeouts and verifying client-side circuit breakers.', content: 'article' },
    { id: 'qa_sub_2_3', title: 'Flaky Network Simulation Test Suite in Playwright', type: 'Project', source: 'GitHub', description: 'Automated tests validating error toasts and retry banners under 500ms packet delay.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 11. MOBILE APP ENGINEERING
  // ─────────────────────────────────────────────────────────────
  mob_1: [
    { id: 'mob_1_1', title: 'React Native & Expo Router Masterclass', type: 'Course', source: 'Galactic Academy', description: 'File-based routing, Hermes JS engine, native build configuration, and EAS CLI.', content: 'video' },
    { id: 'mob_1_2', title: 'Understanding the React Native New Architecture', type: 'Article', source: 'React Native Blog', description: 'JSI, Fabric renderer, TurboModules, and direct synchronous C++ memory access.', content: 'article' },
    { id: 'mob_1_3', title: 'Production Social Feed App with Expo Router', type: 'Project', source: 'GitHub', description: 'Smooth native navigation with infinite scroll, image caching, and pull-to-refresh.', content: 'external' }
  ],
  mob_2: [
    { id: 'mob_2_1', title: 'Native Device Hardware: Biometrics, Camera & Geolocation', type: 'Course', source: 'Frontend Masters', description: 'FaceID/Fingerprint auth, high-res camera capture, background location tracking.', content: 'video' },
    { id: 'mob_2_2', title: 'Handling Mobile Permissions Gracefully on iOS and Android', type: 'Article', source: 'Thoughtbot', description: 'Pre-permission priming modals that dramatically increase user grant conversion.', content: 'article' },
    { id: 'mob_2_3', title: 'Biometric Secure Vault Mobile App', type: 'Project', source: 'GitHub', description: 'Stores encrypted notes in iOS Keychain & Android Keystore unlocked by FaceID.', content: 'external' }
  ],
  mob_3: [
    { id: 'mob_3_1', title: 'Offline-First Mobile Architecture with SQLite & WatermelonDB', type: 'Course', source: 'Egghead.io', description: 'Local SQLite queries, reactive observables, conflict resolution, and background sync.', content: 'video' },
    { id: 'mob_3_2', title: 'Sync Strategies for Mobile Apps: CRDTs vs Last-Write-Wins', type: 'Article', source: 'Linear TechBlog', description: 'How Linear and Notion achieve instant offline interaction and effortless synchronization.', content: 'article' },
    { id: 'mob_3_3', title: 'Offline Field Inspection App with SQLite Sync Engine', type: 'Project', source: 'GitHub', description: 'Works completely without cellular reception and syncs changes upon reconnecting.', content: 'external' }
  ],
  mob_4: [
    { id: 'mob_4_1', title: 'Fluid Mobile Animations with React Native Reanimated 3', type: 'Course', source: 'William Candillon / YouTube', description: 'Shared element transitions, gesture handler pan responders, physics springs, and 120fps.', content: 'video' },
    { id: 'mob_4_2', title: 'Running Animations Directly on the UI Thread with Worklets', type: 'Article', source: 'Software Mansion', description: 'Bypassing the JavaScript bridge completely for lag-free touch responsiveness.', content: 'article' },
    { id: 'mob_4_3', title: 'Tinder-Style Swipable Card Stack with Physics Bounce', type: 'Project', source: 'GitHub', description: 'Gesture-driven cards with dynamic rotation, scale triggers, and haptic feedback.', content: 'external' }
  ],
  mob_5: [
    { id: 'mob_5_1', title: 'Mobile CI/CD: Fastlane & EAS Build Automation', type: 'Course', source: 'Ray Wenderlich / Kodeco', description: 'Automated app signing, certificates, testflight distribution, and Google Play tracks.', content: 'video' },
    { id: 'mob_5_2', title: 'Managing iOS Provisioning Profiles Without Headaches', type: 'Article', source: 'Fastlane Match Docs', description: 'Syncing certificates across dev teams using an encrypted Git repository.', content: 'article' },
    { id: 'mob_5_3', title: 'Automated Release Pipeline from Git Tag to App Store', type: 'Project', source: 'GitHub', description: 'GitHub Action generating production iOS IPA and Android AAB packages automatically.', content: 'external' }
  ],
  mob_sub_1: [
    { id: 'mob_sub_1_1', title: 'Writing Custom C++ TurboModules with JSI', type: 'Course', source: 'Software Mansion Academy', description: 'Creating zero-copy native modules that expose high-performance C++ code to React Native.', content: 'video' },
    { id: 'mob_sub_1_2', title: 'Direct Memory Sharing Between JS and Native via ArrayBuffers', type: 'Article', source: 'Marc Rousavy Blog', description: 'Processing live 60fps camera frames in real time with VisionCamera frame processors.', content: 'article' },
    { id: 'mob_sub_1_3', title: 'High-Performance Image Filtering Native TurboModule', type: 'Project', source: 'GitHub', description: 'C++ module applying Gaussian blur to image buffers 15x faster than JS.', content: 'external' }
  ],
  mob_sub_2: [
    { id: 'mob_sub_2_1', title: 'Bluetooth Low Energy (BLE) Development in React Native', type: 'Course', source: 'Punch Through', description: 'GATT servers, characteristics, advertising packets, MTU negotiation, and pairing.', content: 'video' },
    { id: 'mob_sub_2_2', title: 'Handling BLE Connection Drops and Reconnection Logic', type: 'Article', source: 'Polidea Blog', description: 'Robust state machine recovering from peripheral distance drops and OS kills.', content: 'article' },
    { id: 'mob_sub_2_3', title: 'IoT Smart Thermostat Mobile Controller App', type: 'Project', source: 'GitHub', description: 'Scans for nearby BLE devices, reads sensor telemetry, and sends encrypted commands.', content: 'external' }
  ],

  // ─────────────────────────────────────────────────────────────
  // 12. DIGITAL GROWTH & MARTECH
  // ─────────────────────────────────────────────────────────────
  mk_1: [
    { id: 'mk_1_1', title: 'Technical SEO for Developers: Indexing & Rendering', type: 'Course', source: 'Ahrefs Academy', description: 'Robots.txt, canonicalization, JSON-LD Schema.org structured data, and server rendering.', content: 'video' },
    { id: 'mk_1_2', title: 'How Googlebot Handles Client-Side JavaScript Rendering', type: 'Article', source: 'Google Search Central', description: 'Two-wave indexing, rendering queues, and ensuring meta tags render correctly.', content: 'article' },
    { id: 'mk_1_3', title: 'Automated Dynamic XML Sitemap & OpenGraph Image Generator', type: 'Project', source: 'GitHub', description: 'Next.js script creating 5,000 programmatic SEO landing pages with dynamic social previews.', content: 'external' }
  ],
  mk_2: [
    { id: 'mk_2_1', title: 'Server-Side Tracking & Meta Conversions API (CAPI)', type: 'Course', source: 'Simmer / Simo Ahava', description: 'Google Tag Manager Server Container, GA4 measurement protocol, and first-party cookies.', content: 'video' },
    { id: 'mk_2_2', title: 'Surviving Third-Party Cookie Deprecation in 2024+', type: 'Article', source: 'Simo Ahava Blog', description: 'Server-to-server attribution, hashed user data matching, and privacy compliance.', content: 'article' },
    { id: 'mk_2_3', title: 'Full-Funnel Attribution Model in Python', type: 'Project', source: 'GitHub', description: 'Compares first-touch, last-touch, and linear data-driven multi-touch attribution.', content: 'external' }
  ],
  mk_3: [
    { id: 'mk_3_1', title: 'Lifecycle Marketing & Email Automation Architecture', type: 'Course', source: 'CXL Institute', description: 'Drip campaigns, dynamic user segmentation, event triggers, and churn reactivation.', content: 'video' },
    { id: 'mk_3_2', title: 'Building Behavioral Email Triggers with Customer.io & Segment', type: 'Article', source: 'Segment Guide', description: 'Emitting telemetry events to orchestrate personalized multi-channel user messages.', content: 'article' },
    { id: 'mk_3_3', title: 'SaaS 14-Day Free Trial Email Conversion Sequence', type: 'Project', source: 'GitHub', description: 'Complete automated email templates driving activation, usage, and paid conversion.', content: 'external' }
  ],
  mk_4: [
    { id: 'mk_4_1', title: 'High-Converting Landing Page Design & CRO Frameworks', type: 'Course', source: 'CXL Institute', description: 'LIFT model, value proposition clarity, objection handling, and A/B test sample sizing.', content: 'video' },
    { id: 'mk_4_2', title: 'Statistical Significance & Sample Size in A/B Testing', type: 'Article', source: 'Evan Miller Blog', description: 'Avoiding peeking problems and calculating minimum detectable effect (MDE).', content: 'article' },
    { id: 'mk_4_3', title: 'High-Conversion B2B SaaS Pricing Page Experiment', type: 'Project', source: 'Figma & Code', description: 'A/B test variant with annual toggle, feature matrix, and social proof badges.', content: 'external' }
  ],
  mk_5: [
    { id: 'mk_5_1', title: 'Viral Loop Engineering & Product-Led Growth (PLG)', type: 'Course', source: 'Reforge', description: 'K-factor viral coefficient, viral cycle time, referral loops, and collaborative invite mechanisms.', content: 'video' },
    { id: 'mk_5_2', title: 'Case Study: How Dropbox & Robinhood Built Massive Referral Loops', type: 'Article', source: 'First Round Review', description: 'Two-sided incentives, instant gratification, and gamified waitlist mechanics.', content: 'article' },
    { id: 'mk_5_3', title: 'Full-Stack Referral Engine with Fraud Detection', type: 'Project', source: 'GitHub', description: 'Generates unique referral links, tracks IP abuse, and rewards account credits automatically.', content: 'external' }
  ],
  mk_sub_1: [
    { id: 'mk_sub_1_1', title: 'Building Programmatic SEO Pipelines at Scale', type: 'Course', source: 'Practical Programmatic', description: 'Scraping datasets, database seeding, dynamic content templating, and anti-thin-content strategies.', content: 'video' },
    { id: 'mk_sub_1_2', title: 'How Zapier Scaled to Millions of SEO Landing Pages', type: 'Article', source: 'Growth Design', description: 'App-to-app integration matrix landing pages generating compounding organic traffic.', content: 'article' },
    { id: 'mk_sub_1_3', title: '10,000-Page Programmatic Tech Salary Directory', type: 'Project', source: 'GitHub', description: 'Automated static generation generating city/role breakdown pages with schema markup.', content: 'external' }
  ],
  mk_sub_2: [
    { id: 'mk_sub_2_1', title: 'Automated Creative Variation Generation with AI', type: 'Course', source: 'Marketing AI Institute', description: 'Programmatically generating ad copy variants, banners, and personalized hooks.', content: 'video' },
    { id: 'mk_sub_2_2', title: 'Dynamic Creative Optimization (DCO) in Performance Marketing', type: 'Article', source: 'Search Engine Land', description: 'Testing thousands of headline and asset combinations on Meta and TikTok ads.', content: 'article' },
    { id: 'mk_sub_2_3', title: 'Headless Banner Generator API with Puppeteer & Node', type: 'Project', source: 'GitHub', description: 'Automated microservice generating 1,000 localized banner creatives in minutes.', content: 'external' }
  ]
};

/**
 * Fallback generator for novel or custom steps:
 * Synthesizes 3 contextual resources using the step's title and skills.
 */
export function getFallbackResourcesForTopic(topic) {
  if (!topic) return DEFAULT_RESOURCES;

  const title = topic.title || 'Specialized Module';
  const primarySkill = topic.skills?.[0] || title;
  const secondarySkill = topic.skills?.[1] || 'Modern Architecture';

  return [
    {
      id: `${topic.id || 'res'}_course`,
      title: `Masterclass: ${title}`,
      type: 'Course',
      source: 'Frontend Masters & Coursera',
      description: `Comprehensive in-depth course exploring ${primarySkill} practical applications and core industry workflows.`,
      content: 'video'
    },
    {
      id: `${topic.id || 'res'}_article`,
      title: `Architectural Deep Dive into ${primarySkill}`,
      type: 'Article',
      source: 'Engineering TechBlog',
      description: `Production trade-offs, best practices, and anti-patterns when implementing ${primarySkill} at scale.`,
      content: 'article'
    },
    {
      id: `${topic.id || 'res'}_project`,
      title: `Hands-On Project: Implement with ${primarySkill} & ${secondarySkill}`,
      type: 'Project',
      source: 'GitHub Labs',
      description: `Production-ready portfolio project demonstrating master-level proficiency in ${title}.`,
      content: 'external'
    }
  ];
}

export const DEFAULT_RESOURCES = [
  { id: 'default_1', title: 'Modern Software Engineering Best Practices', type: 'Course', source: 'Coursera', description: 'Learn foundational system design, clean architecture, and modern developer tooling.', content: 'video' },
  { id: 'default_2', title: 'High-Performance Application Architecture Guide', type: 'Article', source: 'Engineering Blog', description: 'A comprehensive guide to building scalable, resilient, and responsive applications.', content: 'article' },
  { id: 'default_3', title: 'Full-Stack Production Showcase Portfolio', type: 'Project', source: 'GitHub', description: 'Build and deploy a real-world enterprise grade web application with full test coverage.', content: 'external' }
];

/**
 * Helper to retrieve resources for any roadmap step topic.
 */
export function getResourcesForStep(topic) {
  if (!topic) return DEFAULT_RESOURCES;
  if (topic.id && TOPIC_RESOURCES[topic.id]) return TOPIC_RESOURCES[topic.id];
  return getFallbackResourcesForTopic(topic);
}
