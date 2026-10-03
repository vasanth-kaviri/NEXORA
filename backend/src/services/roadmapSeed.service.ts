import { MilestoneStatus, ResourceType, ICodeSnippet, IQuizQuestion } from '../models/roadmap.model';

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
  summary: string;
  keyTopics: string[];
  codeSnippet: ICodeSnippet;
  quiz: IQuizQuestion[];
  taskPrompt: string;
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

export const SEED_ROADMAPS: Record<string, ISeedRoadmap> = {
  // ── 1. Mobile App Developer ────────────────────────────────────────────────
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
            description: 'Master JSX components, StyleSheet primitives, Expo Router file-based stack navigation, and safe area handling across devices.',
            estimatedHours: 25,
            skills: ['React Native', 'Expo', 'File-based Routing', 'TypeScript'],
            summary: 'Modern cross-platform mobile engineering centers on declarative UI components coupled to native platform views via the React Native runtime. With Expo Router and the New Architecture (Fabric renderer and TurboModules), developers structure applications with file-based routing and synchronous C++ JSI bindings, eliminating bridge serializations and ensuring strict 60fps render pipelines across iOS and Android.',
            keyTopics: [
              'Fabric rendering pipeline and synchronous JSI C++ layout calculation via Yoga',
              'Expo Router file-system convention with dynamic route segments and modal stacks',
              'Edge-to-edge safe area insets and adaptive layout with React Native StyleSheet primitives',
              'Cross-platform platform-specific extensions (.ios.tsx, .android.tsx) and design tokens',
            ],
            codeSnippet: {
              title: 'Expo Router Stack Layout with Typed Screen Options',
              language: 'typescript',
              code: `import { Stack } from 'expo-router';\nimport { useColorScheme } from 'react-native';\n\nexport default function RootLayout() {\n  const colorScheme = useColorScheme();\n  const isDark = colorScheme === 'dark';\n\n  return (\n    <Stack\n      screenOptions={{\n        headerStyle: {\n          backgroundColor: isDark ? '#0f172a' : '#ffffff',\n        },\n        headerTintColor: isDark ? '#f8fafc' : '#0f172a',\n        headerTitleStyle: { fontWeight: '700', fontSize: 18 },\n        animation: 'slide_from_right',\n      }}\n    >\n      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />\n      <Stack.Screen name="modal/details" options={{ presentation: 'modal', title: 'Milestone Execution' }} />\n    </Stack>\n  );\n}`,
            },
            resources: [
              { title: 'Expo Router Official Documentation', url: 'https://docs.expo.dev/router/introduction/', type: 'DOCS' },
              { title: 'React Native New Architecture Guide', url: 'https://reactnative.dev/docs/the-new-architecture/landing-page', type: 'ARTICLE' },
            ],
            quiz: [
              {
                question: 'Which rendering engine replaces the legacy asynchronous JSON bridge in React Native?',
                options: ['Fabric & TurboModules (JSI)', 'WebKit WebView', 'V8 IPC Channel', 'Skia Canvas 2D'],
                correctIndex: 0,
              },
              {
                question: 'In Expo Router, how do you define a modal presentation screen in stack navigation?',
                options: ['Set presentation: "modal" in Stack.Screen options', 'Wrap with HTML <dialog> tag', 'Invoke navigator.openModal()', 'modal="true" attribute'],
                correctIndex: 0,
              },
              {
                question: 'Why should SafeAreaProvider wrap the application root?',
                options: ['To measure display cutouts, notches, and home indicator insets dynamically', 'To prevent screenshots', 'To enforce landscape orientation', 'To compress images'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Scaffold an Expo Router application with a bottom tab navigator and a nested details modal screen. Apply dark/light theme tokens and protect header safe-area insets.',
          },
          {
            milestoneId: 'mob_m2',
            title: 'Navigation & Native Device State',
            description: 'Implement deep linking, bottom tabs, drawer navigation, modal sheets, and global client state synchronization.',
            estimatedHours: 20,
            skills: ['React Navigation', 'Deep Linking', 'Zustand', 'Context API'],
            summary: 'Production mobile applications require seamless deep linking to handle universal links and push notification routes. Combining React Navigation with a lightweight reactive state store like Zustand guarantees predictable client state synchronization, immediate hydration from persistent storage, and decoupled business logic outside the UI render tree.',
            keyTopics: [
              'Custom deep linking schemes (myapp://) and universal iOS/Android web links',
              'Atomic reactive state management with Zustand and AsyncStorage persistence middleware',
              'Handling hardware back buttons on Android with BackHandler listeners',
            ],
            codeSnippet: {
              title: 'Zustand Persistent Mobile Store with Typed Selectors',
              language: 'typescript',
              code: `import { create } from 'zustand';\nimport { persist, createJSONStorage } from 'zustand/middleware';\nimport AsyncStorage from '@react-native-async-storage/async-storage';\n\ninterface AuthState {\n  userToken: string | null;\n  setToken: (token: string | null) => void;\n}\n\nexport const useMobileStore = create<AuthState>()(\n  persist(\n    (set) => ({\n      userToken: null,\n      setToken: (token) => set({ userToken: token }),\n    }),\n    { name: 'nexora_vault', storage: createJSONStorage(() => AsyncStorage) }\n  )\n);`,
            },
            resources: [
              { title: 'React Navigation Deep Linking Architecture', url: 'https://reactnavigation.org/docs/deep-linking/', type: 'DOCS' },
              { title: 'Zustand State Management for React Native', url: 'https://docs.pmnd.rs/zustand/getting-started/introduction', type: 'DOCS' },
            ],
            quiz: [
              {
                question: 'Which component is required to handle deep links seamlessly across cold and warm app starts?',
                options: ['A linking configuration with prefixes and path-to-screen mappings', 'An HTTP proxy server running locally', 'A native C++ background daemon', 'An Android Service in Java only'],
                correctIndex: 0,
              },
              {
                question: 'What is the primary benefit of Zustand over React Context for frequently updated mobile state?',
                options: ['Selective re-rendering via selector functions prevents unnecessary component re-renders', 'Zustand runs in a web worker thread', 'Zustand compiles to WebAssembly', 'Context cannot store objects'],
                correctIndex: 0,
              },
              {
                question: 'How does Android handle back navigation when hardware back button is pressed?',
                options: ['It triggers hardware BackHandler event which can be intercepted and prevented', 'It terminates the OS', 'It clears SQLite', 'It refreshes the browser'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Configure a custom linking config supporting paths like "nexora://roadmap/:milestoneId". Connect it to a persistent Zustand auth slice with AsyncStorage.',
          },
        ],
      },
    ],
  },

  // ── 2. Full-Stack Web Development ──────────────────────────────────────────
  fullstack: {
    role: 'Full Stack Developer',
    domain: 'Web Development',
    matchKeys: ['fullstack', 'full-stack', 'web', 'mern', 'react', 'node', 'frontend', 'backend', 'next.js', 'nextjs'],
    description: 'Master end-to-end full-stack engineering from modern Next.js/React architectures to distributed microservices, database tuning, and cloud deployments.',
    phases: [
      {
        phaseId: 'fs_p1',
        phaseTitle: 'Phase 1: Modern React 19, Server Components & Design Systems',
        order: 1,
        milestones: [
          {
            milestoneId: 'fs_m1',
            title: 'Modern React 19 Architecture & Server Components',
            description: 'Master React 19 server components, concurrent mode, custom hooks, state machines, and compound component patterns.',
            estimatedHours: 25,
            skills: ['React 19', 'Server Components', 'Custom Hooks', 'Compound Components'],
            summary: 'Modern enterprise frontends require deep comprehension of React 19 Server Components (RSC), Suspense streaming, and compound component architecture. RSC executes data fetching on the server, shipping zero client-side JavaScript for static subtree renders while maintaining seamless hydration for interactive components.',
            keyTopics: [
              'React Server Components vs Client Hydration boundaries ("use client")',
              'Compound component architecture with React.Children and Context delegation',
              'Concurrent mode, useTransition, and non-blocking state updates',
            ],
            codeSnippet: {
              title: 'Compound Component with Typed Context and Accessibility',
              language: 'typescript',
              code: `import React, { createContext, useContext, useState } from 'react';\n\ninterface TabsContextType {\n  activeTab: string;\n  setActiveTab: (id: string) => void;\n}\nconst TabsContext = createContext<TabsContextType | null>(null);\n\nexport function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {\n  const [activeTab, setActiveTab] = useState(defaultTab);\n  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;\n}`,
            },
            resources: [
              { title: 'React 19 Official Documentation & Architecture', url: 'https://react.dev/blog/2024/04/25/react-19', type: 'DOCS' },
              { title: 'Mastering Compound Components in React', url: 'https://kentcdodds.com/blog/compound-components-with-react-hooks', type: 'ARTICLE' },
            ],
            quiz: [
              {
                question: 'What is the main bundle-size advantage of React Server Components (RSC)?',
                options: ['Server Component dependencies never get bundled into client-side JavaScript', 'They compress HTML into ZIP archives', 'They replace CSS with SVG images', 'They force clients to download WebAssembly'],
                correctIndex: 0,
              },
              {
                question: 'Which hook marks state transitions as non-blocking to prevent UI freezes?',
                options: ['useTransition()', 'useEffect()', 'useLayoutEffect()', 'useRef()'],
                correctIndex: 0,
              },
              {
                question: 'What pattern allows subcomponents like Tabs.Trigger and Tabs.Content to share state implicitly?',
                options: ['Compound Component pattern backed by React Context', 'Global window variables', 'Writing to localStorage on every keypress', 'Calling eval() on props'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Build a reusable Tabs compound component supporting accessible keyboard navigation (arrow keys), active indicator pill animation, and lazy mounting.',
          },
          {
            milestoneId: 'fs_m2',
            title: 'Design Systems & Glassmorphic CSS Architecture',
            description: 'Architect production-grade CSS design systems using Tailwind CSS, CSS Variables, glassmorphism, and responsive breakpoints.',
            estimatedHours: 20,
            skills: ['Tailwind CSS', 'CSS Architecture', 'Responsive Design', 'Accessibility'],
            summary: 'Scalable design systems rely on semantic token abstractions (colors, typography, spacing, elevations) defined as CSS variables that adapt dynamically across dark/light themes. Pairing utility-first CSS with strict WCAG 2.1 AA accessibility guidelines produces visually breathtaking interfaces that remain accessible to all users.',
            keyTopics: [
              'Semantic CSS design tokens and dynamic CSS custom properties',
              'Tailwind responsive utility layering and container queries',
              'Glassmorphism techniques using backdrop-filter: blur() with subtle alpha borders',
            ],
            codeSnippet: {
              title: 'Ultra-Modern Glassmorphic Card Token System',
              language: 'css',
              code: `:root {\n  --bg-card: rgba(15, 23, 42, 0.75);\n  --border-glass: rgba(99, 102, 241, 0.18);\n}\n.glass-panel {\n  background: var(--bg-card);\n  backdrop-filter: blur(16px);\n  border: 1px solid var(--border-glass);\n  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);\n}`,
            },
            resources: [
              { title: 'Tailwind CSS Official Design System Guide', url: 'https://tailwindcss.com/docs', type: 'DOCS' },
              { title: 'W3C Web Content Accessibility Guidelines (WCAG) 2.1', url: 'https://www.w3.org/TR/WCAG21/', type: 'DOCS' },
            ],
            quiz: [
              {
                question: 'Which CSS property creates frosted-glass translucent blur effects on underlying content?',
                options: ['backdrop-filter: blur()', 'filter: invert()', 'opacity: 0.5', 'box-shadow: inset'],
                correctIndex: 0,
              },
              {
                question: 'What is the minimum WCAG 2.1 AA contrast ratio required for normal body text against background?',
                options: ['4.5:1', '2:1', '10:1', '1:1'],
                correctIndex: 0,
              },
              {
                question: 'Why are CSS custom properties (--variable) preferred over SASS variables for theming?',
                options: ['CSS custom properties resolve at runtime and can be overridden dynamically by theme classes', 'CSS variables can only store numbers', 'SASS variables are faster in Chrome', 'CSS variables run in Node.js'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Create a dark/light responsive layout with a glassmorphic sidebar and data cards utilizing semantic CSS variables and responsive grid auto-fit columns.',
          },
        ],
      },
    ],
  },

  // ── 3. AI & Deep Learning ──────────────────────────────────────────────────
  ai: {
    role: 'AI / Machine Learning Engineer',
    domain: 'Artificial Intelligence',
    matchKeys: ['ai', 'machine learning', 'ml', 'deep learning', 'nlp', 'llm', 'computer vision', 'pytorch'],
    description: 'Train, fine-tune, and deploy state-of-the-art machine learning models, neural networks, transformers, and scalable RAG pipelines for production inference.',
    phases: [
      {
        phaseId: 'ai_p1',
        phaseTitle: 'Phase 1: Mathematical Foundations & Neural Backpropagation',
        order: 1,
        milestones: [
          {
            milestoneId: 'ai_m1',
            title: 'PyTorch Deep Neural Networks & Autograd',
            description: 'Build multilayer perceptrons (MLP), backprop autograd engines, and GPU training loops in PyTorch.',
            estimatedHours: 35,
            skills: ['PyTorch', 'Autograd', 'CUDA Training', 'Backpropagation'],
            summary: 'Deep neural networks learn representations through compositions of linear transformations and non-linear activations. Implementing automatic differentiation with PyTorch autograd computational graphs provides foundational understanding of gradient descent and weight updates.',
            keyTopics: [
              'Computational graphs, forward passes, and backward automatic differentiation',
              'Stochastic gradient descent with momentum and AdamW optimization',
              'Loss landscapes, weight initialization, and batch normalization',
            ],
            codeSnippet: {
              title: 'PyTorch Training Loop with Gradient Clipping',
              language: 'typescript',
              code: `import torch\nimport torch.nn as nn\n\nclass MLP(nn.Module):\n    def __init__(self, in_features, out_features):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(in_features, 128),\n            nn.ReLU(),\n            nn.Linear(128, out_features)\n        )\n    def forward(self, x):\n        return self.net(x)`,
            },
            resources: [
              { title: 'PyTorch Deep Learning Tutorials', url: 'https://pytorch.org/tutorials/', type: 'DOCS' },
              { title: 'Karpathy Neural Networks: Zero to Hero', url: 'https://karpathy.ai/zero-to-hero.html', type: 'VIDEO' },
            ],
            quiz: [
              {
                question: 'Why is zero_grad() called before backward() in PyTorch training loops?',
                options: ['PyTorch accumulates gradients by default on backward calls', 'To reset neural network weights', 'To clear GPU VRAM', 'To stop training'],
                correctIndex: 0,
              },
              {
                question: 'Which activation function avoids the vanishing gradient problem in deep hidden layers?',
                options: ['ReLU / GELU', 'Sigmoid', 'Step Function', 'Linear'],
                correctIndex: 0,
              },
              {
                question: 'What is the purpose of gradient clipping?',
                options: ['To prevent exploding gradients from destabilizing training', 'To make models run on CPU', 'To reduce dataset size', 'To prune weights to zero'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Implement a PyTorch training pipeline on a synthetic classification dataset with learning rate warm-up and validation evaluation.',
          },
          {
            milestoneId: 'ai_m2',
            title: 'Transformers, Attention & Hugging Face',
            description: 'Master scaled dot-product attention, multi-head attention mechanisms, BERT/GPT architectures, and Hugging Face fine-tuning.',
            estimatedHours: 35,
            skills: ['Transformers', 'Attention Mechanism', 'Hugging Face', 'LoRA Fine-tuning'],
            summary: 'Transformers replace recurrent networks with self-attention mechanisms, allowing parallel computation across long sequences. Understanding query-key-value vector interactions is the cornerstone of modern LLMs.',
            keyTopics: [
              'Scaled dot-product attention: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V',
              'Positional encodings (sinusoidal, RoPE) for sequence token ordering',
              'Parameter-efficient fine-tuning with Low-Rank Adaptation (LoRA)',
            ],
            codeSnippet: {
              title: 'Multi-Head Attention PyTorch Block',
              language: 'typescript',
              code: `import torch.nn.functional as F\n\ndef scaled_dot_product_attention(q, k, v, mask=None):\n    d_k = q.size(-1)\n    scores = torch.matmul(q, k.transpose(-2, -1)) / (d_k ** 0.5)\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, -1e9)\n    return torch.matmul(F.softmax(scores, dim=-1), v)`,
            },
            resources: [
              { title: 'Attention Is All You Need Paper', url: 'https://arxiv.org/abs/1706.03762', type: 'DOCS' },
              { title: 'Hugging Face Transformers Documentation', url: 'https://huggingface.co/docs/transformers', type: 'DOCS' },
            ],
            quiz: [
              {
                question: 'Why do we scale QK^T by sqrt(d_k) before taking softmax in attention?',
                options: ['To prevent dot products from growing large in magnitude and pushing softmax into regions with tiny gradients', 'To convert matrices into integers', 'To sort tokens alphabetically', 'To reduce token length'],
                correctIndex: 0,
              },
              {
                question: 'What is the role of causal masking in GPT decoder self-attention?',
                options: ['Prevents tokens from attending to subsequent tokens in the sequence', 'Hides toxic words', 'Compresses embeddings', 'Enforces bilingual translation'],
                correctIndex: 0,
              },
              {
                question: 'How does LoRA fine-tuning reduce GPU memory requirements?',
                options: ['Freezes pre-trained weights and injects trainable rank decomposition matrices into layers', 'Quantizes text into ASCII', 'Removes all attention heads', 'Runs inference on mobile CPU'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Fine-tune a Hugging Face transformer model using PEFT/LoRA for sentiment classification with WandB telemetry logging.',
          },
        ],
      },
    ],
  },

  // ── 4. Data Science & ML Engineering ───────────────────────────────────────
  data: {
    role: 'Data Scientist & Machine Learning Engineer',
    domain: 'Data Science & Analytics',
    matchKeys: ['data', 'data science', 'analytics', 'pandas', 'scikit', 'xgboost', 'eda'],
    description: 'Master mathematical modeling, statistical analysis, deep neural networks, and production ML pipelines.',
    phases: [
      {
        phaseId: 'data_p1',
        phaseTitle: 'Phase 1: Scientific Computing & Classical ML',
        order: 1,
        milestones: [
          {
            milestoneId: 'ds_m1',
            title: 'NumPy Vectorization & Pandas Data Pipelines',
            description: 'Master vectorized computations with NumPy, manipulation with Pandas, and data wrangling.',
            estimatedHours: 25,
            skills: ['NumPy', 'Pandas', 'Vectorization', 'Data Cleaning'],
            summary: 'Data Science foundations rely on high-performance C-backed array representations in NumPy and tabular indexing in Pandas. Vectorized column operations execute orders of magnitude faster than iterative Python loops.',
            keyTopics: [
              'Broadcasting rules and memory strides in NumPy multidimensional arrays',
              'Handling missing values, categorical encoding, and date parsing in Pandas',
              'Aggregations and grouped transformations using groupby and apply',
            ],
            codeSnippet: {
              title: 'Vectorized Outlier Detection & Z-Score Imputation',
              language: 'typescript',
              code: `import numpy as np\nimport pandas as pd\n\ndef clean_features(df: pd.DataFrame, column: str) -> pd.DataFrame:\n    mean = df[column].mean()\n    std = df[column].std()\n    z_scores = np.abs((df[column] - mean) / std)\n    return df[z_scores < 3.0]`,
            },
            resources: [
              { title: 'Python Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'DOCS' },
              { title: 'Pandas Performance Guide', url: 'https://pandas.pydata.org/docs/user_guide/enhancingperf.html', type: 'ARTICLE' },
            ],
            quiz: [
              {
                question: 'Why is vectorization in NumPy faster than standard Python for-loops?',
                options: ['Computations are executed in pre-compiled C loops without Python interpreter overhead', 'NumPy compiles code into HTML', 'Python loops only run on single cores', 'NumPy runs on external servers'],
                correctIndex: 0,
              },
              {
                question: 'What is broadcasting in NumPy?',
                options: ['Rules allowing NumPy to perform arithmetic operations on arrays of different shapes', 'Streaming data via WebSockets', 'Sending audio to Bluetooth', 'Printing data to console'],
                correctIndex: 0,
              },
              {
                question: 'Which method efficiently calculates aggregates across grouped categories in Pandas?',
                options: ['df.groupby("category").agg(...)', 'Iterating rows with a while loop', 'Converting DataFrame to a JSON string', 'Calling eval() on CSV data'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Build an automated data cleaning script that reads CSV files with malformed data, imputes missing values, and calculates statistical distributions.',
          },
        ],
      },
    ],
  },

  // ── 5. Cloud & DevOps Engineering ──────────────────────────────────────────
  devops: {
    role: 'Cloud & DevOps Engineer',
    domain: 'Cloud Infrastructure & DevOps',
    matchKeys: ['devops', 'cloud', 'aws', 'docker', 'kubernetes', 'k8s', 'terraform', 'ci/cd'],
    description: 'Automate zero-downtime infrastructure with Docker, Kubernetes, Terraform Infrastructure as Code (IaC), AWS, and continuous deployment.',
    phases: [
      {
        phaseId: 'dev_p1',
        phaseTitle: 'Phase 1: Containerization, Kubernetes & GitOps',
        order: 1,
        milestones: [
          {
            milestoneId: 'dev_m1',
            title: 'Multi-Stage Docker & Kubernetes Orchestration',
            description: 'Containerize microservices with multi-stage Docker builds and deploy self-healing Kubernetes clusters.',
            estimatedHours: 30,
            skills: ['Docker', 'Kubernetes', 'K8s Ingress', 'Helm', 'Container Security'],
            summary: 'Containerization packages application runtimes into immutable, isolated OCI images. Orchestration with Kubernetes coordinates scheduling, automated rollouts, service discovery, and cluster health monitoring.',
            keyTopics: [
              'Multi-stage Dockerfiles optimizing image size and eliminating build tool vulnerabilities',
              'Kubernetes primitives: Pods, Deployments, ReplicaSets, Services, and Ingress',
              'Resource limits (requests and limits) preventing CPU and memory starvation',
            ],
            codeSnippet: {
              title: 'Production Multi-Stage Dockerfile with Security Hardening',
              language: 'dockerfile',
              code: `FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runner\nWORKDIR /app\nUSER node\nCOPY --from=builder /app/dist ./dist\nEXPOSE 3000\nCMD ["node", "dist/server.js"]`,
            },
            resources: [
              { title: 'Docker Official Documentation', url: 'https://docs.docker.com/', type: 'DOCS' },
              { title: 'Kubernetes Official Guides', url: 'https://kubernetes.io/docs/', type: 'DOCS' },
            ],
            quiz: [
              {
                question: 'Why should production containers NOT run as the root user?',
                options: ['To mitigate privilege escalation attacks if a container is compromised', 'Root containers use 10x more RAM', 'Kubernetes disallows root containers entirely', 'Docker cannot compile as root'],
                correctIndex: 0,
              },
              {
                question: 'What is the role of a Kubernetes Service of type ClusterIP?',
                options: ['Provides an internal stable IP and DNS entry for load balancing traffic across matching pods', 'Exposes the pod directly to the public internet', 'Saves logs to disk', 'Backs up database tables'],
                correctIndex: 0,
              },
              {
                question: 'What is the benefit of multi-stage Docker builds?',
                options: ['Produces minimal final images containing only runtime artifacts, reducing attack surface and download size', 'Allows running multiple OS versions concurrently in one container', 'Eliminates the need for package.json', 'Bypasses image registries'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Write a multi-stage Dockerfile for an Express API and create Kubernetes Deployment and Service YAML manifests with liveness/readiness probes.',
          },
        ],
      },
    ],
  },

  // ── 6. Cybersecurity & Ethical Hacking ──────────────────────────────────────
  security: {
    role: 'Cybersecurity Analyst & Ethical Hacker',
    domain: 'Cybersecurity',
    matchKeys: ['security', 'cybersecurity', 'hacking', 'penetration testing', 'infosec', 'pentest', 'soc'],
    description: 'Defend systems from modern threats through ethical hacking, vulnerability assessments, OWASP testing, cryptography, and SIEM monitoring.',
    phases: [
      {
        phaseId: 'sec_p1',
        phaseTitle: 'Phase 1: Web Application Security & OWASP Top 10',
        order: 1,
        milestones: [
          {
            milestoneId: 'sec_m1',
            title: 'OWASP Top 10 Vulnerabilities & API Hardening',
            description: 'Audit and exploit web vulnerabilities including SQL Injection, XSS, CSRF, SSRF, and Broken Access Control.',
            estimatedHours: 30,
            skills: ['OWASP Top 10', 'Burp Suite', 'SQL Injection', 'XSS', 'API Security'],
            summary: 'Application security engineers discover and patch vulnerabilities before malicious actors exploit them. Understanding offensive exploitation techniques allows defenders to build resilient security architectures.',
            keyTopics: [
              'SQL Injection mechanics and parameterized query remediation',
              'Cross-Site Scripting (Reflected, Stored, DOM-based) and Content Security Policy (CSP)',
              'Server-Side Request Forgery (SSRF) and metadata service protections',
            ],
            codeSnippet: {
              title: 'Strict Security Headers & Content Security Policy Middleware',
              language: 'typescript',
              code: `import helmet from 'helmet';\n\nexport const securityMiddleware = helmet({\n  contentSecurityPolicy: {\n    directives: {\n      defaultSrc: ["'self'"],\n      scriptSrc: ["'self'"],\n      objectSrc: ["'none'"],\n    },\n  },\n  hsts: { maxAge: 31536000, includeSubDomains: true },\n});`,
            },
            resources: [
              { title: 'OWASP Top 10 Documentation', url: 'https://owasp.org/Top10/', type: 'DOCS' },
              { title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', type: 'ARTICLE' },
            ],
            quiz: [
              {
                question: 'What is the most effective defense against SQL Injection vulnerabilities?',
                options: ['Using parameterized queries / prepared statements instead of string concatenation', 'Filtering apostrophes with regex', 'Encrypting the SQL table names', 'Hiding the database behind port 8080'],
                correctIndex: 0,
              },
              {
                question: 'Which HTTP response header restricts the origins from which scripts and assets can be loaded?',
                options: ['Content-Security-Policy', 'X-Powered-By', 'Access-Control-Allow-Origin', 'Set-Cookie'],
                correctIndex: 0,
              },
              {
                question: 'What is Broken Object Level Authorization (BOLA / IDOR)?',
                options: ['When an API endpoint accesses records by ID without verifying if the requesting user owns that record', 'A broken Wi-Fi router password', 'An unminified JavaScript bundle', 'A hardware CPU defect'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Set up an intentional vulnerable endpoint in a sandbox, exploit an IDOR vulnerability, and write the patch verifying authorization ownership.',
          },
        ],
      },
    ],
  },

  // ── 7. Blockchain & Web3 ───────────────────────────────────────────────────
  blockchain: {
    role: 'Blockchain & Smart Contract Engineer',
    domain: 'Blockchain & Web3',
    matchKeys: ['blockchain', 'web3', 'solidity', 'ethereum', 'smart contract', 'crypto', 'defi'],
    description: 'Architect decentralized applications (DApps), smart contracts with Solidity, token standards, and DeFi protocols.',
    phases: [
      {
        phaseId: 'bc_p1',
        phaseTitle: 'Phase 1: Solidity & EVM Architecture',
        order: 1,
        milestones: [
          {
            milestoneId: 'bc_m1',
            title: 'Solidity Smart Contracts & Gas Optimization',
            description: 'Write, compile, and audit Solidity contracts adhering to ERC-20 and ERC-721 token standards with gas optimization.',
            estimatedHours: 35,
            skills: ['Solidity', 'Hardhat', 'EVM', 'Gas Optimization', 'Foundry'],
            summary: 'Smart contracts execute immutably on the Ethereum Virtual Machine (EVM). Because execution requires gas fees paid in ETH, developers write contracts that minimize storage writes and guard against reentrancy attacks.',
            keyTopics: [
              'EVM storage layout (32-byte storage slots, packing variables, memory vs storage)',
              'Reentrancy attacks and the Checks-Effects-Interactions pattern',
              'ERC-20 token standard implementation and event emitting',
            ],
            codeSnippet: {
              title: 'Reentrancy-Protected Solidity Vault Contract',
              language: 'typescript',
              code: `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract SecureVault {\n  mapping(address => uint256) public balances;\n  bool private locked;\n\n  modifier nonReentrant() {\n    require(!locked, "ReentrancyGuard");\n    locked = true; _;\n    locked = false;\n  }\n  function deposit() external payable { balances[msg.sender] += msg.value; }\n}`,
            },
            resources: [
              { title: 'Solidity Official Documentation', url: 'https://docs.soliditylang.org/', type: 'DOCS' },
              { title: 'OpenZeppelin Smart Contract Library', url: 'https://docs.openzeppelin.com/', type: 'DOCS' },
            ],
            quiz: [
              {
                question: 'What pattern prevents reentrancy attacks in smart contracts?',
                options: ['Checks-Effects-Interactions pattern and nonReentrant mutex modifiers', 'Using while loops', 'Calling transfer() inside a constructor', 'Writing comments on every line'],
                correctIndex: 0,
              },
              {
                question: 'Why is writing to contract storage (SSTORE) the most expensive operation in EVM?',
                options: ['Storage is persisted permanently across all global validator nodes in the blockchain state trie', 'Storage is kept in RAM', 'EVM compiles to Java', 'Miners charge per character'],
                correctIndex: 0,
              },
              {
                question: 'Which tool suite provides fast Rust-based testing and fuzzing for Solidity contracts?',
                options: ['Foundry (forge)', 'WordPress', 'Webpack', 'Postman'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Write a Solidity ERC-20 staking contract with variable packing for gas efficiency and unit tests in Foundry.',
          },
        ],
      },
    ],
  },

  // ── 8. Game Development ────────────────────────────────────────────────────
  game: {
    role: 'Game Developer & Graphics Engineer',
    domain: 'Game Development',
    matchKeys: ['game', 'game dev', 'unity', 'unreal', 'c#', 'c++', 'shaders', '3d'],
    description: 'Design immersive 2D and 3D games with Unity and Unreal Engine, physics simulation, HLSL shader programming, and multiplayer netcode.',
    phases: [
      {
        phaseId: 'game_p1',
        phaseTitle: 'Phase 1: 3D Engine Architecture & Gameplay Loop',
        order: 1,
        milestones: [
          {
            milestoneId: 'game_m1',
            title: 'Game Loop, Vector Math & Physics Simulation',
            description: 'Master fixed time-step loops, linear algebra transformations, quaternions, and rigid body physics.',
            estimatedHours: 30,
            skills: ['Game Loop', 'Vector Math', 'Quaternions', 'Rigid Body Physics', 'C#'],
            summary: 'Video games operate on real-time simulation loops running at 60 to 144 frames per second. Understanding vector transformations, dot products, cross products, and quaternion rotations is fundamental for 3D game engines.',
            keyTopics: [
              'Frame-rate independent delta time (Time.deltaTime) updates',
              'Quaternions avoiding gimbal lock in 3D rotations',
              'Collision detection (AABB, raycasting, SAT) and impulse resolution',
            ],
            codeSnippet: {
              title: 'Frame-Rate Independent Physics Controller in C#',
              language: 'csharp',
              code: `using UnityEngine;\n\npublic class PlayerController : MonoBehaviour {\n    public float speed = 10f;\n    private Rigidbody rb;\n    void Start() { rb = GetComponent<Rigidbody>(); }\n    void FixedUpdate() {\n        float h = Input.GetAxisRaw("Horizontal");\n        float v = Input.GetAxisRaw("Vertical");\n        Vector3 movement = new Vector3(h, 0f, v).normalized * speed;\n        rb.MovePosition(rb.position + movement * Time.fixedDeltaTime);\n    }\n}`,
            },
            resources: [
              { title: 'Unity Engine Documentation', url: 'https://docs.unity3d.com/Manual/', type: 'DOCS' },
              { title: '3D Math Primer for Graphics and Game Development', url: 'https://gamemath.com/', type: 'ARTICLE' },
            ],
            quiz: [
              {
                question: 'Why should physics calculations happen in FixedUpdate() rather than Update() in game engines?',
                options: ['FixedUpdate runs at a deterministic, constant tick rate required for stable physics simulation', 'Update is only for audio', 'FixedUpdate runs on the GPU', 'Update has no access to variables'],
                correctIndex: 0,
              },
              {
                question: 'What problem do Quaternions solve in 3D rotation math?',
                options: ['Gimbal lock and non-linear interpolation artifacts seen in Euler angles', 'Slow internet ping', 'Pixel distortion', 'Sound latency'],
                correctIndex: 0,
              },
              {
                question: 'What is the purpose of multiplying movement speed by Time.deltaTime in the game loop?',
                options: ['To ensure movement is frame-rate independent regardless of whether the game runs at 30 or 144 FPS', 'To speed up rendering', 'To decrease physics gravity', 'To save player score'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Build a 3D character controller with raycast ground detection, smooth camera tracking, and collision bounds in Unity.',
          },
        ],
      },
    ],
  },

  // ── 9. Embedded Systems & IoT ───────────────────────────────────────────────
  embedded: {
    role: 'Embedded Systems & IoT Engineer',
    domain: 'Embedded Systems & Hardware',
    matchKeys: ['embedded', 'iot', 'hardware', 'c', 'c++', 'esp32', 'arduino', 'freertos', 'microcontroller'],
    description: 'Program low-level microcontrollers, real-time operating systems (FreeRTOS), hardware registers, and wireless IoT sensor protocols.',
    phases: [
      {
        phaseId: 'emb_p1',
        phaseTitle: 'Phase 1: Bare-Metal Microcontroller Architecture',
        order: 1,
        milestones: [
          {
            milestoneId: 'emb_m1',
            title: 'Bare-Metal C, Memory-Mapped Registers & GPIOs',
            description: 'Write hardware drivers manipulating memory-mapped peripheral registers, timers, and interrupt service routines.',
            estimatedHours: 30,
            skills: ['Embedded C', 'Memory-Mapped I/O', 'GPIOs', 'Timers', 'Interrupts (ISRs)'],
            summary: 'Embedded systems interface directly with physical silicon hardware. By reading and writing to specific 32-bit peripheral registers mapped into the CPU memory address space, firmware engineers configure clocks, GPIO pins, and communication buses with sub-microsecond precision.',
            keyTopics: [
              'Memory-mapped register manipulation using volatile pointers and bitwise masks',
              'Interrupt Service Routines (ISRs) and atomic operations',
              'Serial communication protocols: UART, I2C, and SPI timing diagrams',
            ],
            codeSnippet: {
              title: 'Bare-Metal Register GPIO Toggle in C',
              language: 'c',
              code: `#include <stdint.h>\n#define GPIOA_BASE   0x40020000UL\n#define GPIOA_ODR    (*(volatile uint32_t *)(GPIOA_BASE + 0x14))\n\nvoid toggle_led(void) {\n    GPIOA_ODR ^= (1UL << 5); // Toggle Pin 5\n}`,
            },
            resources: [
              { title: 'ARM Architecture Reference Manual', url: 'https://developer.arm.com/', type: 'DOCS' },
              { title: 'ESP-IDF Programming Guide', url: 'https://docs.espressif.com/projects/esp-idf/en/latest/', type: 'DOCS' },
            ],
            quiz: [
              {
                question: 'Why is the "volatile" keyword essential when defining pointers to hardware registers in C?',
                options: ['Tells the compiler not to optimize away reads/writes because the register value can change asynchronously outside program control', 'Encrypts the pointer', 'Makes the variable available in global scope', 'Forces the CPU into sleep mode'],
                correctIndex: 0,
              },
              {
                question: 'Which serial protocol uses two bidirectional open-drain lines (SDA and SCL) with pull-up resistors?',
                options: ['I2C', 'SPI', 'UART', 'Ethernet'],
                correctIndex: 0,
              },
              {
                question: 'What is a critical rule for writing Interrupt Service Routines (ISRs)?',
                options: ['Keep them short and fast; never perform blocking delays or dynamic memory allocations', 'Always print to stdout', 'Reboot the device at the end', 'Declare all variables as strings'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Write a C firmware module that initializes a hardware timer to generate an interrupt every 500ms and toggles an LED state.',
          },
        ],
      },
    ],
  },

  // ── 10. UI/UX & Product Design ─────────────────────────────────────────────
  design: {
    role: 'UI/UX & Product Designer',
    domain: 'Product & Design Systems',
    matchKeys: ['design', 'ui', 'ux', 'product design', 'figma', 'wireframe', 'prototyping'],
    description: 'Design intuitive, accessible user experiences using modern design systems, Figma component architectures, and usability heuristics.',
    phases: [
      {
        phaseId: 'des_p1',
        phaseTitle: 'Phase 1: Design Systems, Tokens & Accessibility',
        order: 1,
        milestones: [
          {
            milestoneId: 'des_m1',
            title: 'Figma Auto-Layout & Design System Tokens',
            description: 'Architect atomic design systems with nested Figma components, responsive auto-layout, variables, and WCAG contrast checks.',
            estimatedHours: 25,
            skills: ['Figma', 'Design Systems', 'Auto-Layout', 'Design Tokens', 'WCAG AA'],
            summary: 'Modern product design bridges the gap between creative visual expression and rigorous engineering constraints. Crafting reusable Figma components backed by design tokens enables rapid prototyping and seamless developer handoff.',
            keyTopics: [
              'Atomic design methodology: Atoms, Molecules, Organisms, Templates, and Pages',
              'Figma Auto-Layout (flexbox mental model) for responsive component resizing',
              'WCAG 2.1 AA accessibility standards for color contrast and visual hierarchy',
            ],
            codeSnippet: {
              title: 'Design Token System Schema in JSON',
              language: 'json',
              code: `{\n  "color": {\n    "brand": { "primary": { "value": "#4f46e5" }, "accent": { "value": "#38bdf8" } },\n    "surface": { "canvas": { "value": "#0f172a" }, "card": { "value": "rgba(30, 41, 59, 0.8)" } }\n  }\n}`,
            },
            resources: [
              { title: 'Figma Best Practices Guide', url: 'https://help.figma.com/', type: 'DOCS' },
              { title: 'Nielsen Norman Group Usability Heuristics', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/', type: 'ARTICLE' },
            ],
            quiz: [
              {
                question: 'What is the primary benefit of Figma Auto-Layout?',
                options: ['Allows designs to resize and respond adaptively to different screen sizes and content lengths', 'Exports designs directly to the App Store', 'Converts images to audio', 'Automatically writes TypeScript code'],
                correctIndex: 0,
              },
              {
                question: 'What is the minimum WCAG 2.1 AA contrast ratio required for large text (18pt+ or 14pt bold)?',
                options: ['3:1', '1:1', '7:1', '4.5:1'],
                correctIndex: 0,
              },
              {
                question: 'What is the purpose of design tokens?',
                options: ['Platform-agnostic single source of truth for design decisions like colors and spacing', 'Cryptocurrency tokens for purchasing themes', 'Figma user passwords', 'CSS animation tags'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Design a complete responsive design system in Figma including typography scale, dark mode tokens, and accessible button variants.',
          },
        ],
      },
    ],
  },

  // ── 11. QA & Test Automation ───────────────────────────────────────────────
  qa: {
    role: 'QA Automation Engineer (SDET)',
    domain: 'Quality Assurance & Automation',
    matchKeys: ['qa', 'test', 'automation', 'sdet', 'playwright', 'cypress', 'selenium', 'testing'],
    description: 'Ensure software reliability through automated end-to-end testing with Playwright, performance benchmarking, API validation, and CI testing.',
    phases: [
      {
        phaseId: 'qa_p1',
        phaseTitle: 'Phase 1: Modern E2E Browser Automation with Playwright',
        order: 1,
        milestones: [
          {
            milestoneId: 'qa_m1',
            title: 'Playwright E2E Testing & Page Object Model',
            description: 'Build robust end-to-end test automation suites using Playwright, TypeScript, and the Page Object Model (POM) pattern.',
            estimatedHours: 25,
            skills: ['Playwright', 'TypeScript', 'Page Object Model', 'API Mocking', 'CI Automation'],
            summary: 'Software Development Engineers in Test (SDETs) write automation frameworks that simulate real user interactions across browsers. Playwright provides built-in auto-waiting, network request interception, and multi-browser execution.',
            keyTopics: [
              'Auto-waiting mechanisms eliminating arbitrary sleep timeouts in tests',
              'Page Object Model (POM) separating test specifications from UI locator implementation',
              'Mocking network responses and inspecting network payloads',
            ],
            codeSnippet: {
              title: 'Playwright Page Object Model in TypeScript',
              language: 'typescript',
              code: `import { Page, Locator } from '@playwright/test';\n\nexport class RoadmapPage {\n  readonly page: Page;\n  readonly drawer: Locator;\n  constructor(page: Page) {\n    this.page = page;\n    this.drawer = page.locator('[data-testid="learning-drawer"]');\n  }\n  async openMilestone(title: string) {\n    await this.page.getByText(title).click();\n  }\n}`,
            },
            resources: [
              { title: 'Playwright Official Documentation', url: 'https://playwright.dev/docs/intro', type: 'DOCS' },
              { title: 'Page Object Model Best Practices', url: 'https://playwright.dev/docs/pom', type: 'ARTICLE' },
            ],
            quiz: [
              {
                question: 'Why does Playwright have fewer flaky tests than legacy Selenium frameworks?',
                options: ['Playwright automatically waits for elements to be actionable (visible, stable, enabled) before performing clicks', 'Playwright only tests one page at a time', 'Selenium is written in PHP', 'Playwright disables JavaScript'],
                correctIndex: 0,
              },
              {
                question: 'What is the primary architectural benefit of the Page Object Model (POM)?',
                options: ['Centralizes UI selectors so layout changes only need updating in one place rather than across dozens of tests', 'Compiles tests to C++', 'Runs tests on physical mobile towers', 'Removes the need for assertions'],
                correctIndex: 0,
              },
              {
                question: 'How do you intercept and mock API responses in Playwright?',
                options: ['Using page.route() to fulfill requests with mock JSON data', 'Editing the user hosts file', 'Stopping the database server', 'Modifying CSS stylesheets'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Write a Playwright test suite using the Page Object Model that verifies student login, opens the roadmap, and validates drawer tab navigation.',
          },
        ],
      },
    ],
  },

  // ── 12. Data Analytics & Business Intelligence ─────────────────────────────
  analytics: {
    role: 'Data Analyst & Business Intelligence Specialist',
    domain: 'Business Intelligence & Data Analytics',
    matchKeys: ['analytics', 'bi', 'business intelligence', 'sql', 'power bi', 'tableau', 'dbt'],
    description: 'Transform complex business data into strategic decisions using advanced SQL window functions, dimensional modeling, Power BI, and dbt.',
    phases: [
      {
        phaseId: 'ana_p1',
        phaseTitle: 'Phase 1: Advanced Analytical SQL & Data Warehousing',
        order: 1,
        milestones: [
          {
            milestoneId: 'ana_m1',
            title: 'Advanced Analytical SQL: Window Functions & CTEs',
            description: 'Master analytical SQL queries with Common Table Expressions (CTEs), ranking, running totals, and partition window functions.',
            estimatedHours: 25,
            skills: ['SQL', 'Window Functions', 'CTEs', 'Data Modeling', 'Aggregations'],
            summary: 'Business Intelligence specialists transform raw operational database transactions into clean analytical metrics. SQL window functions allow calculations across partitions of rows without collapsing rows like standard GROUP BY clauses.',
            keyTopics: [
              'Window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), and LAG()',
              'Cumulative metrics using SUM() OVER (PARTITION BY ... ORDER BY ...)',
              'Common Table Expressions (WITH clauses) structuring complex queries for readability',
            ],
            codeSnippet: {
              title: 'Monthly User Retention Cohort Analysis in SQL',
              language: 'sql',
              code: `WITH monthly_users AS (\n  SELECT user_id, DATE_TRUNC('month', created_at) AS signup_month\n  FROM users\n)\nSELECT signup_month, COUNT(user_id) AS cohort_size,\n       ROW_NUMBER() OVER (ORDER BY signup_month) AS cohort_index\nFROM monthly_users\nGROUP BY signup_month;`,
            },
            resources: [
              { title: 'PostgreSQL Window Functions Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial-window.html', type: 'DOCS' },
              { title: 'Mode Analytics SQL Guide', url: 'https://mode.com/sql-tutorial/', type: 'ARTICLE' },
            ],
            quiz: [
              {
                question: 'What is the main difference between GROUP BY and window functions (OVER)?',
                options: ['Window functions compute values across row partitions while retaining individual row identity; GROUP BY collapses rows into single summaries', 'Window functions only work on numbers', 'GROUP BY is only for SQLite', 'Window functions cannot compute sums'],
                correctIndex: 0,
              },
              {
                question: 'Which window function returns the value from the previous row within a partition?',
                options: ['LAG()', 'LEAD()', 'FIRST_VALUE()', 'COUNT()'],
                correctIndex: 0,
              },
              {
                question: 'What is the difference between RANK() and DENSE_RANK() when there is a tie?',
                options: ['RANK() leaves gaps in the ranking sequence; DENSE_RANK() leaves no gaps', 'DENSE_RANK() only ranks negative numbers', 'RANK() returns text', 'There is no difference'],
                correctIndex: 0,
              },
            ],
            taskPrompt: 'Write a SQL analytics query computing a rolling 7-day revenue average and month-over-month percentage growth partitioned by product category.',
          },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RESOLVER HELPER (Matches user roles against all 12 domains)
// ─────────────────────────────────────────────────────────────────────────────

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

  // Fallback to Fullstack or Mobile App Developer
  return SEED_ROADMAPS.fullstack || SEED_ROADMAPS.mobile;
}
