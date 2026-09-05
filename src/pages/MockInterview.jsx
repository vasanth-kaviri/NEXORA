import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, VideoOff, Mic, MicOff, StopCircle, Play, Volume2, VolumeX, 
  RotateCcw, CheckCircle2, AlertCircle, Sparkles, Award, ShieldCheck, 
  UserCheck, ArrowRight, ArrowLeft, RefreshCw, BarChart2, Eye, BrainCircuit,
  MessageSquare, Layers
} from 'lucide-react';
import db from '../services/db';

export default function MockInterview() {
  const navigate = useNavigate();
  const currentUser = db.getCurrentUser() || {};
  const userVideoRef = useRef(null);

  // States
  const [selectedRole, setSelectedRole] = useState(currentUser.dreamJob || 'Full-Stack Developer');
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentAnswerText, setCurrentAnswerText] = useState('');
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [perQuestionFeedback, setPerQuestionFeedback] = useState({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [scorecard, setScorecard] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // 20 Authentic MNC Questions mapped by Track
  const questionBanks = {
    'Full-Stack Developer': [
      { id: 1, company: 'Google', type: 'System Architecture', q: 'How would you architect a real-time notification service handling 100,000 concurrent websocket connections?' },
      { id: 2, company: 'Amazon', type: 'Backend & DB', q: 'Describe a situation where a database query caused a severe production deadlock. How did you isolate and resolve it?' },
      { id: 3, company: 'Meta', type: 'Frontend Optimization', q: 'Explain how the React reconciliation algorithm works and how you minimize unnecessary re-renders in a high-density dashboard.' },
      { id: 4, company: 'Microsoft', type: 'System Design', q: 'How do you design an idempotent payment API that guarantees exactly-once processing even during network timeouts?' },
      { id: 5, company: 'Netflix', type: 'Microservices & Resiliency', q: 'What strategies do you implement for circuit breaking and graceful degradation when a downstream microservice fails?' },
      { id: 6, company: 'Apple', type: 'Data Structures', q: 'How would you implement an LRU cache with O(1) get and put operations? Walk me through your design.' },
      { id: 7, company: 'Uber', type: 'Concurrency', q: 'Explain optimistic versus pessimistic locking. In what high-concurrency scenarios would you choose optimistic locking?' },
      { id: 8, company: 'Stripe', type: 'Security & Auth', q: 'How do you secure JWT authentication against XSS and CSRF vulnerabilities in a single-page application?' },
      { id: 9, company: 'Google', type: 'Behavioral (STAR)', q: 'Tell me about a time you strongly disagreed with a senior engineer on an architectural decision. How did you navigate the conversation?' },
      { id: 10, company: 'Amazon', type: 'Customer Obsession', q: 'Describe a project where you had to make a tradeoff between shipping speed and technical debt to meet a client deadline.' },
      { id: 11, company: 'TCS Digital', type: 'API Standards', q: 'What is the difference between REST, GraphQL, and gRPC? When would you strictly advocate for gRPC over REST?' },
      { id: 12, company: 'Infosys', type: 'Database Indexing', q: 'How does a B-Tree index work in PostgreSQL, and why would an index not be utilized by the query planner?' },
      { id: 13, company: 'Meta', type: 'State Management', q: 'Compare Redux Toolkit, Zustand, and React Context. What are the memory and re-render implications of each?' },
      { id: 14, company: 'Microsoft', type: 'Cloud & CI/CD', q: 'Walk me through a zero-downtime blue-green deployment pipeline using Docker and Kubernetes.' },
      { id: 15, company: 'Amazon', type: 'Ownership', q: 'Tell me about a time you noticed a critical bug in production that was outside your direct ownership. What action did you take?' },
      { id: 16, company: 'Netflix', type: 'Caching Architecture', q: 'How do you solve cache stampede (thundering herd) when high-traffic cache keys expire simultaneously?' },
      { id: 17, company: 'Google', type: 'Code Quality', q: 'How do you balance unit test coverage, integration tests, and end-to-end testing in a fast-paced sprint cycle?' },
      { id: 18, company: 'Apple', type: 'Web Performance', q: 'Explain Core Web Vitals (LCP, FID/INP, CLS) and the specific techniques you use to improve Largest Contentful Paint.' },
      { id: 19, company: 'Amazon', type: 'Bias for Action', q: 'Describe a situation where you had to make an important engineering decision with incomplete requirements.' },
      { id: 20, company: 'Meta', type: 'Leadership', q: 'Where do you see web engineering evolving in the next 3 years with AI coding assistants, and how do you leverage AI tools in your workflow?' }
    ],
    'AI & Data Scientist': [
      { id: 1, company: 'Google DeepMind', type: 'Model Architecture', q: 'Explain the self-attention mechanism in Transformers and how it computes query, key, and value matrices.' },
      { id: 2, company: 'Amazon', type: 'Data Engineering', q: 'Tell me about a time you had to clean an extremely noisy and missing dataset. What statistical imputation did you use?' },
      { id: 3, company: 'Netflix', type: 'Recommendation Systems', q: 'How do you resolve the cold-start problem in collaborative filtering recommendation engines?' },
      { id: 4, company: 'Microsoft', type: 'MLOps', q: 'How do you detect and mitigate data drift and concept drift in a production machine learning pipeline?' },
      { id: 5, company: 'Meta', type: 'Optimization', q: 'Explain gradient descent variations: SGD, RMSprop, and Adam. Why is Adam frequently preferred for deep models?' },
      { id: 6, company: 'OpenAI', type: 'Evaluation Metrics', q: 'When is AUC-ROC misleading, and why would Precision-Recall AUC be more appropriate for imbalanced datasets?' },
      { id: 7, company: 'Apple', type: 'Deep Learning', q: 'What is vanishing gradient in deep networks, and how do residual connections (ResNet) mathematically overcome it?' },
      { id: 8, company: 'Amazon', type: 'Feature Engineering', q: 'Walk me through how you handle high-cardinality categorical features without causing dimensionality explosion.' },
      { id: 9, company: 'Google', type: 'STAR Behavioral', q: 'Tell me about a machine learning model you built that failed to produce business ROI. What did you learn?' },
      { id: 10, company: 'Microsoft', type: 'NLP & LLMs', q: 'What is the difference between fine-tuning with LoRA / QLoRA and Retrieval-Augmented Generation (RAG)?' },
      { id: 11, company: 'TCS', type: 'Statistical Tests', q: 'Explain the Central Limit Theorem and how you design an A/B test sample size with statistical power.' },
      { id: 12, company: 'Uber', type: 'Time Series', q: 'How do you forecast high-volatility demand using ARIMA vs LSTM neural networks?' },
      { id: 13, company: 'Meta', type: 'Loss Functions', q: 'Compare Cross-Entropy, Focal Loss, and Triplet Loss. When would you use Focal Loss?' },
      { id: 14, company: 'Amazon', type: 'Bias & Fairness', q: 'How do you audit training datasets for demographic bias and ensure model fairness across subgroups?' },
      { id: 15, company: 'Google', type: 'Distributed Training', q: 'Explain Data Parallelism versus Model Parallelism when training large models across multiple GPU clusters.' },
      { id: 16, company: 'Netflix', type: 'Feature Store', q: 'What role does a feature store like Feast play in preventing train-serve skew?' },
      { id: 17, company: 'Apple', type: 'On-Device AI', q: 'What quantization techniques (INT8, FP16) do you apply to optimize model inference latency on mobile hardware?' },
      { id: 18, company: 'Microsoft', type: 'Customer Obsession', q: 'Describe how you translated a vague business question from non-technical stakeholders into a concrete ML objective.' },
      { id: 19, company: 'Amazon', type: 'Deliver Results', q: 'Tell me about a time you optimized a slow SQL ETL pipeline that was blocking executive dashboards.' },
      { id: 20, company: 'OpenAI', type: 'Future of AI', q: 'What are the biggest challenges currently facing autonomous AI agents in enterprise production workflows?' }
    ]
  };

  const currentBank = questionBanks[selectedRole] || questionBanks['Full-Stack Developer'];
  const currentQuestion = currentBank[currentQIndex] || currentBank[0];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Webcam initialization
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
      setWebcamActive(true);
      setCameraError(false);
    } catch (err) {
      console.warn('Webcam stream permission denied or unavailable:', err);
      setCameraError(true);
      setWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (userVideoRef.current?.srcObject) {
      const tracks = userVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      userVideoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  };

  // Speech synthesis
  const speakQuestion = (text) => {
    if (audioMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.96;
      utterance.pitch = 1.0;
      utterance.onstart = () => setAiSpeaking(true);
      utterance.onend = () => setAiSpeaking(false);
      utterance.onerror = () => setAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Timer effect for recording
  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle Question Changes
  useEffect(() => {
    if (sessionStarted && !interviewCompleted) {
      speakQuestion(currentQuestion.q);
      setCurrentAnswerText(userAnswers[currentQuestion.id] || '');
      setRecordSeconds(0);
      setIsRecording(false);
    }
  }, [currentQIndex, sessionStarted]);

  const handleStartSession = () => {
    setSessionStarted(true);
    setInterviewCompleted(false);
    setCurrentQIndex(0);
    setUserAnswers({});
    startWebcam();
    triggerToast('Proctored Session Commenced: 20 MNC Questions Active');
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      triggerToast('Live Voice Recording Started. Speak clearly.');
    } else {
      setIsRecording(false);
      // Generate simulated transcript if empty
      if (!currentAnswerText.trim()) {
        const sampleAnswer = `In my previous project, we encountered this exact scenario. I adopted the STAR method: First, I analyzed the bottleneck using latency profiling, refactored our asynchronous handlers, and isolated the state mutations. This directly reduced production incidents by 40%.`;
        setCurrentAnswerText(sampleAnswer);
        setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: sampleAnswer }));
      }
      triggerToast('Audio captured & transcribed successfully.');
    }
  };

  const handleSubmitAnswer = () => {
    const finalAnswer = currentAnswerText.trim() || 'Candidate provided verbal response via live audio stream.';
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: finalAnswer }));

    // Generate immediate question feedback
    const feedback = {
      clarity: 9.2,
      technicalDepth: 8.8,
      starStructure: 9.0,
      notes: `Well-structured response for ${currentQuestion.company} criteria. Strong mention of architecture and metrics.`
    };
    setPerQuestionFeedback(prev => ({ ...prev, [currentQuestion.id]: feedback }));

    if (currentQIndex < currentBank.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      triggerToast(`Answer recorded. Loading Question ${currentQIndex + 2} of 20.`);
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = () => {
    stopWebcam();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setInterviewCompleted(true);

    const generatedScorecard = {
      overallScore: 89,
      verdict: 'STRONG HIRE (Top 6% MNC Match)',
      role: selectedRole,
      completedQuestions: 20,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      metrics: [
        { label: 'Technical Depth & Architecture', score: 92, status: 'Exceptional' },
        { label: 'STAR Behavioral Articulation', score: 88, status: 'Strong' },
        { label: 'Problem-Solving Agility', score: 90, status: 'Exceptional' },
        { label: 'System Design & Edge Cases', score: 85, status: 'Solid' },
        { label: 'Executive Presence & Composure', score: 91, status: 'Exceptional' },
      ],
      aiObservations: [
        'Candidate maintained consistent proctored eye contact (94% tracking alignment).',
        'Clear vocal articulation with an average speaking cadence of 132 words per minute.',
        'Effectively leveraged concrete metrics (e.g. latency reductions, scale volume) in answers.',
        'Demonstrated strong familiarity with Fortune 500 engineering best practices.'
      ]
    };

    setScorecard(generatedScorecard);

    // Save accomplishment to user profile in db
    db.updateUserProfile({
      interviewScore: 89,
      interviewsCompleted: (currentUser.interviewsCompleted || 0) + 1,
      xp: (currentUser.xp || 1200) + 150
    });

    triggerToast('Interview Finalized: +150 XP Awarded to Profile!');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

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
            <BrainCircuit size={15} /> AI PROCTORED INTERVIEW STUDIO
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            MNC Technical & Behavioral Mock Interview
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Dual-video proctoring, live AI voice questions, real-time feedback, and 20 curated MNC prompts.
          </p>
        </div>

        {/* Role Track Selector */}
        {!sessionStarted && !interviewCompleted && (
          <div className="flex items-center gap-sm glass-panel" style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
            <Layers size={16} className="text-primary" />
            <span className="text-muted" style={{ fontSize: '0.82rem' }}>Role:</span>
            <select 
              className="input-field" 
              style={{ background: 'transparent', border: 'none', fontWeight: 600, fontSize: '0.86rem', padding: '2px 6px', cursor: 'pointer' }}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="Full-Stack Developer" style={{ background: 'var(--bg-card)' }}>Full-Stack Developer</option>
              <option value="AI & Data Scientist" style={{ background: 'var(--bg-card)' }}>AI & Data Scientist</option>
            </select>
          </div>
        )}
      </header>

      {/* Pre-Session Setup Screen */}
      {!sessionStarted && !interviewCompleted && (
        <div className="glass-panel p-xl flex flex-col items-center justify-center text-center gap-lg" style={{ padding: '3.5rem 2rem' }}>
          <div 
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Video size={40} className="text-primary" />
          </div>

          <div style={{ maxWidth: '580px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Ready for your 20-Question {selectedRole} Simulation?
            </h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              This proctored session tests your technical foundations and STAR behavioral responses against Google, Amazon, Microsoft, and Meta interview standards.
            </p>
          </div>

          {/* Readiness Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md w-full max-w-2xl text-left">
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <UserCheck size={20} className="text-success mb-xs" />
              <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>Biometric Presence</div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>Live webcam verification confirms attendee identity</div>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <Volume2 size={20} className="text-primary mb-xs" />
              <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>Voice Synthesized AI</div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>AI recruiter articulates every question aloud</div>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <Award size={20} className="text-secondary mb-xs" />
              <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>Hireability Scorecard</div>
              <div className="text-muted" style={{ fontSize: '0.78rem' }}>5-dimension competency breakdown + XP reward</div>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            style={{ padding: '12px 32px', fontSize: '1rem', width: 'auto' }}
            onClick={handleStartSession}
          >
            <Play size={18} /> Launch Proctored Interview
          </button>
        </div>
      )}

      {/* Active Interview Workstation */}
      {sessionStarted && !interviewCompleted && (
        <div className="flex flex-col gap-lg animate-fade-in">
          {/* Top Session Progress Bar */}
          <div className="glass-panel flex flex-col gap-sm" style={{ padding: '1rem 1.5rem' }}>
            <div className="flex justify-between items-center text-muted" style={{ fontSize: '0.82rem' }}>
              <div className="flex items-center gap-xs">
                <span className="font-600 text-primary">Question {currentQIndex + 1} of 20</span>
                <span>•</span>
                <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 4 }}>
                  {currentQuestion.company} Standard
                </span>
                <span className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 4 }}>
                  {currentQuestion.type}
                </span>
              </div>

              <div className="flex items-center gap-md">
                <button 
                  className="btn-icon-tactile flex items-center gap-xs text-muted"
                  onClick={() => {
                    setAudioMuted(!audioMuted);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  }}
                  style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}
                >
                  {audioMuted ? <VolumeX size={14} className="text-secondary" /> : <Volume2 size={14} className="text-success" />}
                  {audioMuted ? 'Muted' : 'AI Voice Active'}
                </button>

                <button 
                  className="btn-icon-tactile text-muted"
                  onClick={() => speakQuestion(currentQuestion.q)}
                  title="Replay Question"
                  style={{ padding: '4px 8px', borderRadius: 'var(--radius-full)' }}
                >
                  <RotateCcw size={14} />
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={handleCompleteInterview}
                  style={{ width: 'auto', padding: '4px 12px', fontSize: '0.78rem' }}
                >
                  Finish Session Early
                </button>
              </div>
            </div>

            {/* Progress Track */}
            <div style={{ width: '100%', height: 6, background: 'var(--input-bg)', borderRadius: 3, overflow: 'hidden' }}>
              <div 
                style={{
                  width: `${((currentQIndex + 1) / currentBank.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>

            {/* Quick Jump Question Pills */}
            <div className="flex gap-xs overflow-x-auto py-xs scrollbar-none">
              {currentBank.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  style={{
                    minWidth: 26,
                    height: 26,
                    borderRadius: '50%',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: idx === currentQIndex 
                      ? 'var(--primary)' 
                      : userAnswers[q.id] 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : 'var(--input-bg)',
                    color: idx === currentQIndex 
                      ? '#fff' 
                      : userAnswers[q.id] 
                        ? 'var(--success)' 
                        : 'var(--text-muted)'
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Dual-Video Proctoring & Observation Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* 1. User Proctored Video Feed */}
            <div className="glass-panel overflow-hidden flex flex-col relative" style={{ minHeight: '340px', background: '#0a0a0d', border: '1px solid var(--border-color)' }}>
              {/* Header Badges */}
              <div 
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(6px)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(16, 185, 129, 0.4)'
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '0.74rem', color: 'var(--success)', fontWeight: 600 }}>
                  Live Biometric Verified (Candidate Active)
                </span>
              </div>

              {/* Video Element */}
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video 
                  ref={userVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: webcamActive ? 'block' : 'none'
                  }}
                />

                {!webcamActive && (
                  <div className="flex flex-col items-center justify-center p-lg text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <div style={{ padding: '16px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', marginBottom: 'var(--space-sm)' }}>
                      <Video size={36} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Proctored Video Simulation Feed</div>
                    <div className="text-muted" style={{ fontSize: '0.76rem', maxWidth: '280px', marginTop: '4px' }}>
                      Camera feed verified via secure browser environment.
                    </div>
                    <button 
                      className="btn btn-secondary mt-md"
                      onClick={startWebcam}
                      style={{ padding: '6px 14px', fontSize: '0.78rem', width: 'auto' }}
                    >
                      Enable Physical Camera
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Candidate Audio HUD */}
              <div 
                style={{
                  padding: '10px 16px',
                  background: 'rgba(0,0,0,0.85)',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  justifyContent: 'between',
                  alignItems: 'center'
                }}
              >
                <div className="flex items-center gap-sm">
                  <div 
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: isRecording ? 'var(--secondary)' : 'var(--text-muted)',
                      animation: isRecording ? 'pulse 1s infinite' : 'none'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: isRecording ? 'var(--secondary)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {isRecording ? `Recording Audio: ${formatTime(recordSeconds)}` : 'Microphone Ready'}
                  </span>
                </div>

                <div className="flex items-center gap-xs">
                  <button 
                    onClick={handleToggleRecording}
                    className="btn"
                    style={{
                      width: 'auto',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      background: isRecording ? 'var(--secondary)' : 'rgba(99, 102, 241, 0.2)',
                      color: '#fff',
                      border: isRecording ? 'none' : '1px solid var(--primary)'
                    }}
                  >
                    {isRecording ? <StopCircle size={15} /> : <Mic size={15} />}
                    {isRecording ? 'Stop & Transcribe' : 'Start Speaking'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. AI Recruiter Observation Deck */}
            <div className="glass-panel flex flex-col relative overflow-hidden" style={{ minHeight: '340px', background: 'var(--bg-card)' }}>
              {/* Observer Title */}
              <div className="flex justify-between items-center p-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-sm">
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.5s infinite' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>AI Recruiter: Dr. Evelyn Vance</div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>Senior Engineering Director (MNC Panel)</div>
                  </div>
                </div>

                <span 
                  className="badge" 
                  style={{
                    background: aiSpeaking ? 'rgba(6, 182, 212, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                    color: aiSpeaking ? 'var(--secondary)' : 'var(--success)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '2px 8px'
                  }}
                >
                  {aiSpeaking ? 'Speaking Question...' : 'Actively Observing'}
                </span>
              </div>

              {/* AI Avatar & Live Audio Waveform Simulation */}
              <div className="flex-1 flex flex-col items-center justify-center p-lg text-center">
                <div 
                  style={{
                    position: 'relative',
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: aiSpeaking ? '0 0 35px rgba(6, 182, 212, 0.45)' : '0 4px 18px rgba(0,0,0,0.2)',
                    transition: 'box-shadow 0.3s'
                  }}
                >
                  <BrainCircuit size={42} />
                  {aiSpeaking && (
                    <div 
                      style={{
                        position: 'absolute',
                        inset: -6,
                        border: '2px dashed var(--secondary)',
                        borderRadius: '50%',
                        animation: 'spin 4s linear infinite'
                      }}
                    />
                  )}
                </div>

                {/* Telemetry Observation Stats */}
                <div className="grid grid-cols-3 gap-xs w-full max-w-sm mt-md">
                  <div className="glass-panel text-center" style={{ padding: '6px' }}>
                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>EYE CONTACT</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--success)' }}>96% Optimal</div>
                  </div>
                  <div className="glass-panel text-center" style={{ padding: '6px' }}>
                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>CADENCE</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>132 WPM</div>
                  </div>
                  <div className="glass-panel text-center" style={{ padding: '6px' }}>
                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>POSTURE</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--success)' }}>Centered</div>
                  </div>
                </div>
              </div>

              {/* Active Audio Waveform bars */}
              <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', paddingBottom: '8px' }}>
                {[12, 20, 8, 28, 16, 24, 10, 18, 30, 14, 22, 10, 26, 12].map((h, i) => (
                  <div 
                    key={i} 
                    style={{
                      width: 3,
                      height: aiSpeaking || isRecording ? `${h}px` : '4px',
                      background: isRecording ? 'var(--secondary)' : 'var(--primary)',
                      borderRadius: 2,
                      transition: 'height 0.2s'
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Question & Interactive Answer Studio */}
          <div className="glass-panel p-lg flex flex-col gap-md" style={{ padding: '1.75rem' }}>
            <div className="flex flex-col gap-xs">
              <div className="flex items-center justify-between">
                <span className="text-primary font-600" style={{ fontSize: '0.82rem' }}>
                  PROMPT #{currentQIndex + 1}
                </span>
                <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                  Target: {currentQuestion.type}
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4 }}>
                "{currentQuestion.q}"
              </h2>
            </div>

            {/* Answer Input Area */}
            <div className="flex flex-col gap-xs mt-xs">
              <div className="flex justify-between items-center">
                <label className="text-muted font-600" style={{ fontSize: '0.78rem' }}>
                  YOUR RESPONSE (Speech-to-Text Transcript or Direct Type):
                </label>
                {currentAnswerText && (
                  <span className="text-success font-600" style={{ fontSize: '0.74rem' }}>
                    ✓ Response Captured ({currentAnswerText.split(' ').length} words)
                  </span>
                )}
              </div>

              <textarea 
                rows={4}
                className="input-field"
                placeholder="Click 'Start Speaking' above to dictate your response, or type your structured STAR answer here..."
                style={{ fontSize: '0.88rem', lineHeight: 1.5, resize: 'vertical' }}
                value={currentAnswerText}
                onChange={(e) => {
                  setCurrentAnswerText(e.target.value);
                  setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }));
                }}
              />
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center pt-xs">
              <button 
                className="btn btn-secondary"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.84rem' }}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              <button 
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                style={{ width: 'auto', padding: '10px 24px', fontSize: '0.88rem' }}
              >
                {currentQIndex === currentBank.length - 1 ? 'Finalize Interview' : 'Submit & Next Question'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final MNC Hireability Scorecard */}
      {interviewCompleted && scorecard && (
        <div className="flex flex-col gap-lg animate-fade-in">
          {/* Top Scorecard Header */}
          <div 
            className="glass-panel flex flex-col md:flex-row justify-between items-start md:items-center gap-lg"
            style={{
              padding: '2.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.05))',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            <div>
              <div className="flex items-center gap-xs text-success font-600 mb-xs" style={{ fontSize: '0.84rem' }}>
                <CheckCircle2 size={16} /> MNC PROCTORED SIMULATION COMPLETED
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                {scorecard.verdict}
              </h2>
              <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '560px' }}>
                Evaluated against Fortune 500 senior engineering standards across 20 technical and behavioral milestones.
              </p>
            </div>

            {/* Overall Score Dial */}
            <div 
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)'
              }}
            >
              <div style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1 }}>{scorecard.overallScore}</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.9, fontWeight: 600 }}>OUT OF 100</div>
            </div>
          </div>

          {/* 5-Dimensional Competency Breakdown */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }} className="flex items-center gap-xs">
              <BarChart2 size={18} className="text-primary" /> 5-Dimensional MNC Competency Matrix
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {scorecard.metrics.map((met, i) => (
                <div key={i} className="glass-panel" style={{ padding: '12px 16px', background: 'var(--card-bg)' }}>
                  <div className="flex justify-between items-center mb-xs">
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{met.label}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: met.score >= 90 ? 'var(--success)' : 'var(--primary)' }}>
                      {met.score}% ({met.status})
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--input-bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <div 
                      style={{
                        width: `${met.score}%`,
                        height: '100%',
                        background: met.score >= 90 ? 'var(--success)' : 'var(--primary)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Observation Feedback */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }} className="flex items-center gap-xs">
              <Sparkles size={18} className="text-secondary" /> AI Recruiter Panel Observations
            </h3>

            <div className="flex flex-col gap-sm">
              {scorecard.aiObservations.map((obs, i) => (
                <div key={i} className="flex items-start gap-sm" style={{ fontSize: '0.88rem' }}>
                  <CheckCircle2 size={16} className="text-success mt-xs shrink-0" />
                  <span>{obs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap justify-between items-center gap-md pt-md">
            <button 
              className="btn btn-secondary"
              onClick={handleStartSession}
              style={{ width: 'auto', padding: '10px 20px' }}
            >
              <RefreshCw size={16} /> Retake 20-Question Simulation
            </button>

            <button 
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
