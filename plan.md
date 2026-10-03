# NEXORA Multi-Domain Expansion & Video Classrooms Integration
## Implementation Plan (`plan.md`)

### Overview
This plan specifies how to expand **NEXORA** into an enterprise multi-domain learning workstation covering **all 12 real-time industry domains** with verified video masterclass integrations, split-screen interactive classrooms, and persistent progress telemetry.

---

### 1. The 12 Real-Time Industry Domains

1. **Full-Stack Web Development** (`fullstack`): Next.js 15, React 19, TypeScript, Node.js, PostgreSQL, Prisma, Tailwind CSS.
2. **Mobile App Development** (`mobile`): React Native, Expo Router, Swift, Kotlin, SQLite, Reanimated 3, EAS.
3. **AI & Deep Learning** (`ai`): PyTorch, Hugging Face, Transformers, RAG Pipelines, LangChain, LoRA Fine-tuning.
4. **Data Science & ML Engineering** (`data`): Python, NumPy, Pandas, Scikit-Learn, XGBoost, MLflow, FastAPI.
5. **Cloud & DevOps Engineering** (`devops`): Docker, Kubernetes, Terraform, AWS, GitHub Actions, Prometheus.
6. **Cybersecurity & Ethical Hacking** (`security`): Kali Linux, Burp Suite, OWASP Top 10, Cryptography, Wireshark, SOC.
7. **Blockchain & Web3** (`blockchain`): Solidity, Ethereum, Hardhat, Ethers.js, IPFS, Foundry, DeFi.
8. **Game Development & Graphics** (`game`): Unity, C#, Unreal Engine 5, C++, HLSL Shaders, Netcode.
9. **Embedded Systems & IoT** (`embedded`): C, C++, FreeRTOS, ESP32, ARM Cortex-M, MQTT, BLE.
10. **UI/UX & Product Design** (`design`): Figma, Design Systems, Micro-Interactions, WCAG Accessibility.
11. **Software QA Automation** (`qa`): Playwright, Cypress, Jest, k6 Load Testing, CI Test Matrices.
12. **Data Analytics & BI** (`analytics`): SQL, Power BI, Tableau, dbt, Snowflake, Dimensional Modeling.

---

### 2. Best APIs for Video Classes

1. **YouTube Data API v3 & YouTube IFrame Player API (Primary Engine)**:
   - Zero bandwidth hosting costs and 4K/1080p adaptive bitrate delivery.
   - Comprehensive video metadata (real video IDs, durations, chapters, thumbnails).
   - IFrame Player API for precise JavaScript event hooks (`onStateChange`, `getCurrentTime`, `onEnded`, speed control `0.5x–2.0x`).
2. **Daily.co WebRTC API (Live Peer Learning & Mentor Rooms)**:
   - Sub-second latency for live video classrooms, pair-programming code-alongs, and mock interview rooms.
3. **Vimeo Player SDK**:
   - For ad-free studio masterclasses and certification courses.

---

### 3. Key Components to Build

- **Backend**:
  - `backend/src/models/videoLecture.model.ts`: Catalog of video masterclasses with chapters and key takeaways.
  - `backend/src/models/videoProgress.model.ts`: User watch history, timestamps, notes, and completion.
  - `backend/src/services/videoProvider.service.ts`: Curated video resolver and YouTube API client.
  - `backend/src/services/roadmapSeed.service.ts`: Complete DAG curriculums for all 12 domains.
  - `backend/src/controllers/video.controller.ts`: Endpoints for video streaming, progress autosave, and XP grants.
  - `backend/src/routes/video.routes.ts`: Express routes under `/api/v1/videos`.

- **Frontend**:
  - `frontend/src/pages/learning/VideoClassroom.jsx`: Split-screen studio with responsive video player on left, and code sandbox + timestamped notes on right.
  - `frontend/src/pages/learning/DomainHub.jsx`: Interactive catalog for exploring all 12 domains with progress bars and video counts.
  - `frontend/src/components/video/VideoPlayer.jsx`: Custom YouTube/Vimeo embed with chapter controls and speed controls.
  - Update `frontend/src/pages/learning/Roadmap.jsx` to launch video classes directly from the Milestone Drawer.

---

### 4. Implementation Checklist

- [ ] **Phase 1**: Populate all 12 domain seed roadmaps in `roadmapSeed.service.ts` and `roadmapData.js`.
- [ ] **Phase 2**: Implement `videoLecture.model.ts`, `videoProgress.model.ts`, and `videoProvider.service.ts`.
- [ ] **Phase 3**: Build `VideoPlayer.jsx` and `VideoClassroom.jsx` split-screen workstation.
- [ ] **Phase 4**: Build `DomainHub.jsx` and integrate navigation across NEXORA.
- [ ] **Phase 5**: Verify zero test files created, compile with `npm run build`, and push to GitHub.
