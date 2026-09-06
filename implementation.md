# NEXORA Platform — Complete Architecture & Implementation Guide

## 1. Executive Platform Overview

**NEXORA** is a next-generation, AI-orchestrated career intelligence platform engineered for software engineers, data scientists, and systems architects. It bridges the gap between academic theory and high-bar enterprise hiring benchmarks (FAANG/Tier-1 tech) through:
- **Calibrated Interactive Roadmaps**: Dynamic curriculum paths tailored to 12+ specialized engineering domains.
- **Proctored Mock Interview Lab**: AI-driven voice questioning, live answer recording, and automated rubrics.
- **ATS Semantic Resume Studio**: Keyword extraction, parse score diagnostics, and recruiter match metrics.
- **Peer Nexus Workstations**: Collaborative challenges, live activity telemetry, and hackathon registrations.
- **Executive Onboarding & Auth**: Linear/Vercel-inspired authentication flow with Two-Factor OTP verification.

---

## 2. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 (`react`, `react-dom`) | Modern component architecture, hooks, and transitions |
| **Routing** | React Router v7 (`react-router-dom`) | Declarative client-side routing, nested layouts, and protected shells |
| **Styling** | Tailwind CSS v4 + Vanilla CSS Design Tokens | Skeuomorphic & glassmorphic luxury tokens, responsive utilities |
| **Icons** | Lucide React | Unified, consistent iconography |
| **Backend / BaaS** | Firebase v12 (`firebase/auth`, `firebase/database`) | Authentication & Realtime Database sync |
| **Persistence** | LocalStorage + Firebase Hybrid Cache | Instant optimistic UI updates with cloud persistence fallback |
| **Build & Tooling** | Vite 8 + Rolldown/ESBuild | Ultra-fast HMR and optimized production bundling |

---

## 3. Directory Structure

```
NEXORA/
├── public/                     # Static assets, icons, and platform manifests
│   ├── favicon.svg             # NEXORA geometric vector branding
│   └── ...
├── src/
│   ├── components/             # Reusable UI & Domain Components
│   │   ├── brand/              # Vector logo & animated badge marks (NexoraLogo.jsx)
│   │   ├── ui/                 # Atomic design elements (Pills, Buttons, Inputs, Modals)
│   │   ├── CountryCodePicker.jsx # International dial code selector
│   │   ├── GlobalSearch.jsx    # Universal command search bar
│   │   ├── GoogleAuthButton.jsx# Google OAuth button with fallback modal
│   │   ├── IconInput.jsx       # Accessible input with icon slots & password toggle
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Collapsible desktop & mobile drawer navigation
│   │   ├── SocialTicker.jsx    # Infinite scrolling social ecosystem ticker
│   │   └── ...
│   ├── contexts/               # React Context Providers
│   │   ├── ThemeContext.jsx    # Dark/Light theme switching & persistence
│   │   └── ToastContext.jsx    # Non-blocking animated toast notification system
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useCountryCodes.js  # Country code data & search filtering
│   │   └── useDebounce.js      # Debounced search & event handlers
│   ├── layouts/                # Shared Application Shells
│   │   ├── AdminLayout.jsx     # Admin portal shell with dedicated sidebar & metrics
│   │   ├── AuthLayout.jsx      # Minimalist Linear/Vercel split screen layout
│   │   └── Layout.jsx          # Primary student workstation shell (Sidebar + Header)
│   ├── pages/                  # Application Route Views
│   │   ├── admin/              # Administrative Management Suite
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── ManageNotifications.jsx
│   │   │   ├── ManagePaths.jsx
│   │   │   ├── ManageResources.jsx
│   │   │   ├── ManageStudents.jsx
│   │   │   └── Reports.jsx
│   │   ├── About.jsx           # Platform architecture, core pillars & methodology
│   │   ├── Achievements.jsx    # Badges, XP unlocks & engineering milestones
│   │   ├── Assessments.jsx     # Diagnostic skill tests & problem sets
│   │   ├── CareerGoal.jsx      # Career target calibrator
│   │   ├── Chatbot.jsx         # NEXORA AI Mentor (24/7 technical guidance)
│   │   ├── Colleges.jsx        # Campus placement directory & university benchmarks
│   │   ├── CompleteProfile.jsx # 2-Stage executive onboarding flow
│   │   ├── Dashboard.jsx       # Refactored modular workstation (Overview/Learning/Community)
│   │   ├── Explore.jsx         # Track discovery & trending tech domains
│   │   ├── ForgotPassword.jsx  # Single-use secure password reset protocol
│   │   ├── Hackathons.jsx      # Active competition radar & grant registrations
│   │   ├── Help.jsx            # Platform documentation & FAQ
│   │   ├── Jobs.jsx            # Filtered job listings & target recruiter pipeline
│   │   ├── LanguageSettings.jsx# Internationalization & locale preferences
│   │   ├── Login.jsx           # Spacious email/phone sign-in with Google OAuth
│   │   ├── MockInterview.jsx   # Live voice AI interview workstation & rubric scoring
│   │   ├── NotificationDetail.jsx # Deep-dive announcement view
│   │   ├── Notifications.jsx   # Real-time alert stream & milestone pings
│   │   ├── NotificationSettings.jsx # Telemetry & communication preferences
│   │   ├── Onboarding.jsx      # Initial welcome tour & orientation
│   │   ├── PeerLearning.jsx    # Real-time peer workstation & shared coding lab
│   │   ├── PrivacySettings.jsx # GDPR/data privacy controls & account purge
│   │   ├── Profile.jsx         # Public portfolio, skill radars & resume link
│   │   ├── Progress.jsx        # Velocity telemetry & curriculum analytics
│   │   ├── Projects.jsx        # Production portfolio starter kits & labs
│   │   ├── Quiz.jsx            # Timed MCQ challenges & aptitude tests
│   │   ├── ResourceViewer.jsx  # Interactive sandbox & document study view
│   │   ├── Resources.jsx       # Complete curriculum library & format filter
│   │   ├── ResumeAnalyzer.jsx  # ATS semantic keyword scanner & PDF audit
│   │   ├── Roadmap.jsx         # Interactive dynamic path node tree
│   │   ├── Scholarships.jsx    # Financial aid, grants & fellowship directory
│   │   ├── Settings.jsx        # Central account configuration
│   │   ├── Signup.jsx          # 2-Step account registration with 4-box OTP verification
│   │   ├── SkillGap.jsx        # Competency differential analysis
│   │   ├── Splash.jsx          # High-conversion platform landing page
│   │   ├── Subscription.jsx    # Pro Tier upgrade & entitlement management
│   │   ├── TaskPage.jsx        # Focused milestone task execution view
│   │   └── Terms.jsx           # Legal Terms of Service specification
│   ├── services/               # State & Service Abstractions
│   │   ├── db.js               # Local client-side DB & mock storage engine
│   │   ├── firebase.js         # Firebase App initialization & config
│   │   ├── firebaseAuth.js     # Firebase Authentication handlers
│   │   └── realtimeDb.js       # Firebase Realtime Database live sync engine
│   ├── utils/                  # Domain Data & Helper Utilities
│   │   ├── collegesData.js     # University & institution catalog
│   │   ├── jobsData.js         # Curated job openings & salary metrics
│   │   ├── notificationData.js # Default system alerts & pings
│   │   ├── resourceData.js     # Deep curriculum resource catalog
│   │   ├── roadmapData.js      # Track milestone steps, competencies & roadmaps
│   │   └── scholarshipData.js  # Global scholarship & grant listings
│   ├── App.jsx                 # Route definition table & context wrapping
│   ├── index.css               # Design system tokens, CSS reset & animations
│   └── main.jsx                # Application root entry point
├── package.json                # Project dependencies & scripts
├── vite.config.js              # Vite bundler configuration
└── ...
```

---

## 4. Complete Application Route Map

| Path | Component | Shell Layout | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `Splash.jsx` | Standard Layout | Public | Landing page with hero, live demos, and call-to-action |
| `/onboarding` | `Onboarding.jsx` | Standard Layout | Public | Orientation slides and platform capabilities tour |
| `/login` | `Login.jsx` | AuthLayout | Public | Sign-in via Email, Phone, or Google OAuth |
| `/signup` | `Signup.jsx` | AuthLayout | Public | 2-Step registration (Credentials → 4-box OTP verification) |
| `/forgot-password` | `ForgotPassword.jsx` | AuthLayout | Public | Password recovery dispatch link |
| `/complete-profile` | `CompleteProfile.jsx`| AuthLayout | Authenticated | 2-Stage executive onboarding (Identity → Career Trajectory) |
| `/dashboard` | `Dashboard.jsx` | Standard Layout | Authenticated | Modular command center (Overview, Learning Stream, Community) |
| `/roadmap` | `Roadmap.jsx` | Standard Layout | Authenticated | Interactive milestone progression tree matching Dream Job |
| `/explore` | `Explore.jsx` | Standard Layout | Authenticated | Browse 12+ career tracks and tech disciplines |
| `/profile` | `Profile.jsx` | Standard Layout | Authenticated | Candidate public profile, bio, education, and skill badges |
| `/career-goal` | `CareerGoal.jsx` | Standard Layout | Authenticated | Switch target dream job and recalculate career trajectory |
| `/assessments` | `Assessments.jsx` | Standard Layout | Authenticated | Diagnostic tests and benchmark examinations |
| `/skill-gap` | `SkillGap.jsx` | Standard Layout | Authenticated | Differential analysis between current score & enterprise standard |
| `/resources` | `Resources.jsx` | Standard Layout | Authenticated | Full technical library with type filtering |
| `/resource/:id` | `ResourceViewer.jsx` | Standard Layout | Authenticated | In-depth reader and study sandbox for a single resource |
| `/resume` | `ResumeAnalyzer.jsx` | Standard Layout | Authenticated | ATS keyword scanner, PDF parser, and resume scorecard |
| `/mock-interview`| `MockInterview.jsx` | Standard Layout | Authenticated | Proctored AI voice interview room with live evaluation |
| `/chatbot` | `Chatbot.jsx` | Standard Layout | Authenticated | 24/7 technical AI mentor workstation |
| `/jobs` | `Jobs.jsx` | Standard Layout | Authenticated | Targeted openings filtered by user competency |
| `/scholarships` | `Scholarships.jsx` | Standard Layout | Authenticated | Grant and fellowship matching engine |
| `/peer-learning`| `PeerLearning.jsx` | Standard Layout | Authenticated | Real-time virtual collaborative coding workstation |
| `/projects` | `Projects.jsx` | Standard Layout | Authenticated | Full-stack project specs, boilerplates, and test suites |
| `/hackathons` | `Hackathons.jsx` | Standard Layout | Authenticated | Curated competitions and active registrations |
| `/colleges` | `Colleges.jsx` | Standard Layout | Authenticated | Partner institutions and placement benchmarks |
| `/notifications` | `Notifications.jsx` | Standard Layout | Authenticated | Alert inbox and system announcement list |
| `/notification/:id` | `NotificationDetail.jsx` | Standard Layout | Authenticated | Announcement deep dive view |
| `/task/:taskId` | `TaskPage.jsx` | Standard Layout | Authenticated | Dedicated sprint task detail and completion flow |
| `/quiz` | `Quiz.jsx` | Standard Layout | Authenticated | Timed technical multiple-choice challenges |
| `/progress` | `Progress.jsx` | Standard Layout | Authenticated | Comprehensive velocity analytics and XP progress |
| `/achievements` | `Achievements.jsx` | Standard Layout | Authenticated | Trophy room, badges, and competency certifications |
| `/subscription` | `Subscription.jsx` | Standard Layout | Authenticated | Pro entitlement manager and billing plans |
| `/settings` | `Settings.jsx` | Standard Layout | Authenticated | Account preferences and theme toggle |
| `/settings/notifications` | `NotificationSettings.jsx` | Standard Layout | Authenticated | Email, browser, and push frequency settings |
| `/settings/privacy` | `PrivacySettings.jsx` | Standard Layout | Authenticated | Data export, cookie policy, and account deletion |
| `/settings/language` | `LanguageSettings.jsx` | Standard Layout | Authenticated | Locale and timezone selection |
| `/help` | `Help.jsx` | Standard Layout | Public/Auth | Knowledge base, FAQs, and ticket submission |
| `/about` | `About.jsx` | Standard Layout | Public/Auth | Platform architecture, core pillars, and leadership vision |
| `/terms` | `Terms.jsx` | Standard Layout | Public/Auth | Legal Terms of Service agreement |
| `/admin/login` | `AdminLogin.jsx` | Standalone | Admin | Administrative portal authentication |
| `/admin/dashboard` | `AdminDashboard.jsx` | AdminLayout | Admin | Platform-wide candidate metrics and telemetry |
| `/admin/students` | `ManageStudents.jsx` | AdminLayout | Admin | Candidate roster, progress audits, and account management |
| `/admin/paths` | `ManagePaths.jsx` | AdminLayout | Admin | Dynamic roadmap curriculum editor |
| `/admin/resources`| `ManageResources.jsx`| AdminLayout | Admin | Learning library content moderation |
| `/admin/reports` | `Reports.jsx` | AdminLayout | Admin | System export and analytics generation |
| `/admin/notifications` | `ManageNotifications.jsx` | AdminLayout | Admin | Push notification broadcast transmitter |

---

## 5. Summary of Recent Core Implementations

### A. Authentication & Onboarding Redesign
1. **Split-Screen Brand Showcase (`AuthLayout.jsx`)**:
   - Replaced noisy terminal logs and badges with a luxury brand showcase featuring a vector velocity curve, subtle glows, and high-contrast typography in dark and light modes.
2. **Spacious Forms (`Login.jsx`, `Signup.jsx`)**:
   - Resolved CSS cascade reset issue that collapsed utility margins.
   - Built an electric indigo segmented pill switcher (`Email Address` / `Phone Number`), interactive password visibility toggles (`showPassword`), and Google OAuth integration.
3. **Clean 4-Box OTP Verification Screen (`Signup.jsx` Step 2)**:
   - Eliminated debug buttons and bypass links.
   - Centered 4-box segmented inputs with auto-focus navigation, backspace handling, clipboard paste distribution, and an active 35s resend countdown timer.
4. **2-Stage Executive Onboarding Flow (`CompleteProfile.jsx`)**:
   - **Stage 1**: Candidate Identity & Academic Foundation.
   - **Stage 2**: Career Trajectory Calibration with domain chips and real-time live roadmap preview matching the selected target role.

### B. Executive Dashboard Refactoring (`Dashboard.jsx`)
1. **Modular Tabs Structure**:
   - **Overview**: 4 KPI Metric cards, Trajectory Hero with milestone progress, Daily Sprint Objectives, Quick Launchers, and Competency Radar.
   - **Learning Stream**: Track context banner, format filter pills (`Courses`, `Projects`, `Articles`, `Videos`), and 3-column resource cards.
   - **Community & Feedback**: Live `SocialTicker`, peer velocity feed, active hackathons, and Candidate Feedback Desk.
2. **Breathing Room**:
   - Elevated major container spacing to `gap-6` (24px) and internal card padding to `p-5 sm:p-6`.
3. **Consolidated Bulky Blocks into Dedicated Modals & Executive Footer**:
   - Transformed the 100-line static About section into an on-demand **Platform Specs Modal** (`AboutNexoraModal`).
   - Added a **Quick Feedback Modal** (`QuickFeedbackModal`) for fast transmission from any view.
   - Streamlined executive footer replacing 250 lines of static cards at the bottom with a clean status indicator and legal links.
4. **Fluid Multi-Device Ergonomics**:
   - Desktop (1440px): 12-column responsive layout (8/4 split rail).
   - Tablet (768px): Adaptive 2-column stacked layout.
   - Mobile (390px): Horizontally scrollable segmented tab switcher and 2x2 metric cards.
   - Deep-Link Anchor Sync: `#contact-feedback-section` automatically switches to the Community tab and smoothly scrolls to the form.
