import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit, ArrowRight, CheckCircle2, RotateCcw, Sparkles, Award, 
  Layers, Compass, TrendingUp, BarChart2, ShieldCheck, ChevronRight 
} from 'lucide-react';
import db from '../services/db';

export default function Assessments() {
  const navigate = useNavigate();
  const currentUser = db.getCurrentUser() || {};

  // 10 Real-World Diagnostic Questions
  const diagnosticQuestions = [
    {
      id: 1,
      domain: 'Engineering Logic',
      question: 'When a critical API endpoint starts responding with 504 Gateway Timeouts under sudden traffic spikes, what is your initial instinct?',
      options: [
        { text: 'Profile database connection pools, slow queries, and cache miss rates', points: { engineering: 4, data: 2, design: 0 } },
        { text: 'Inspect frontend network waterfalls and user-facing error states', points: { engineering: 2, data: 0, design: 3 } },
        { text: 'Analyze traffic access logs and identify bot scrapers or DDoS patterns', points: { engineering: 3, security: 4, data: 2 } },
        { text: 'Spin up immediate horizontal auto-scaling and investigate afterwards', points: { cloud: 4, engineering: 3, design: 0 } }
      ]
    },
    {
      id: 2,
      domain: 'Problem Solving Focus',
      question: 'Which type of technical problem energizes you the most when working on a project?',
      options: [
        { text: 'Building clean, reactive user interfaces with delightful micro-animations', points: { design: 4, engineering: 3 } },
        { text: 'Training neural networks and uncovering non-obvious statistical correlations', points: { data: 5, engineering: 2 } },
        { text: 'Architecting resilient cloud clusters, containers, and automated CI/CD pipelines', points: { cloud: 5, security: 2 } },
        { text: 'Hunting security vulnerabilities, testing cryptographic auth, and hardening APIs', points: { security: 5, engineering: 2 } }
      ]
    },
    {
      id: 3,
      domain: 'Data Reasoning',
      question: 'When given a raw dataset with 20% missing values and high variance, how do you approach it?',
      options: [
        { text: 'Apply domain-specific statistical imputation and study the underlying distribution', points: { data: 5, engineering: 2 } },
        { text: 'Build a quick visual dashboard to display null patterns to business teams', points: { design: 3, data: 3 } },
        { text: 'Write automated validation schemas and reject corrupt records at the ingestion boundary', points: { engineering: 4, security: 3 } },
        { text: 'Set up an automated ETL pipeline with Apache Spark or dbt', points: { cloud: 3, data: 4 } }
      ]
    },
    {
      id: 4,
      domain: 'System Tradeoffs',
      question: 'In a collaborative sprint, what do you consider the biggest failure mode of modern software projects?',
      options: [
        { text: 'Convoluted, clunky user experience that confuses end users', points: { design: 5, engineering: 2 } },
        { text: 'Unscalable architecture that collapses when user volume triples', points: { engineering: 4, cloud: 4 } },
        { text: 'Lax security policies that expose customer records to data breaches', points: { security: 5, cloud: 2 } },
        { text: 'Hallucinating AI models deployed without drift detection and rigorous guardrails', points: { data: 5, engineering: 2 } }
      ]
    },
    {
      id: 5,
      domain: 'Architecture Design',
      question: 'How do you structure complex state in a large-scale web application?',
      options: [
        { text: 'Modular client state stores (Zustand/Redux) paired with optimistic server caches', points: { engineering: 5, design: 2 } },
        { text: 'Relational normalized PostgreSQL schemas with strict foreign key constraints', points: { engineering: 4, data: 3 } },
        { text: 'Immutable event streams using Kafka or Redis Pub/Sub', points: { engineering: 4, cloud: 4 } },
        { text: 'Micro-frontends isolated behind a unified API gateway', points: { cloud: 4, engineering: 3 } }
      ]
    },
    {
      id: 6,
      domain: 'AI & Automation',
      question: 'How do you view the role of generative AI and LLMs in modern products?',
      options: [
        { text: 'As core intelligence engines (RAG, fine-tuned models, autonomous reasoning)', points: { data: 5, engineering: 3 } },
        { text: 'As conversational and ambient user interface amplifiers (copilots, smart forms)', points: { design: 4, engineering: 3 } },
        { text: 'As specialized infrastructure services running on quantized GPU clusters', points: { cloud: 5, engineering: 2 } },
        { text: 'As emerging attack vectors requiring strict prompt injection defenses', points: { security: 5, engineering: 2 } }
      ]
    },
    {
      id: 7,
      domain: 'Security Mindset',
      question: 'When implementing user authentication, what is your top priority?',
      options: [
        { text: 'HttpOnly secure SameSite cookies, refresh token rotation, and MFA enforcement', points: { security: 5, engineering: 3 } },
        { text: 'Seamless frictionless social login with 1-click biometric passkeys', points: { design: 4, engineering: 3 } },
        { text: 'Decentralized OAuth2/OIDC provider scalable across multi-region services', points: { cloud: 4, security: 3 } },
        { text: 'Real-time anomaly detection flagging suspicious IP login velocity', points: { security: 4, data: 4 } }
      ]
    },
    {
      id: 8,
      domain: 'Product Empathy',
      question: 'A user reports that a complex enterprise workflow feels confusing and slow. How do you respond?',
      options: [
        { text: 'Conduct user session replays, usability interviews, and simplify the design hierarchy', points: { design: 5, engineering: 1 } },
        { text: 'Profile network waterfalls, lazy-load assets, and improve Core Web Vitals', points: { engineering: 4, cloud: 2 } },
        { text: 'Analyze behavioral funnel telemetry to pinpoint exact drop-off steps', points: { data: 5, design: 2 } },
        { text: 'Implement background optimistic updates so the UI responds instantaneously', points: { engineering: 5, design: 2 } }
      ]
    },
    {
      id: 9,
      domain: 'Engineering Agility',
      question: 'You have 48 hours to launch a proof-of-concept for high-level stakeholders. What is your strategy?',
      options: [
        { text: 'Build a high-fidelity interactive prototype in Figma demonstrating the key user flow', points: { design: 5, engineering: 1 } },
        { text: 'Spin up a clean React + Node.js full-stack app with mock endpoints and deploy to Vercel', points: { engineering: 5, cloud: 2 } },
        { text: 'Assemble an automated Python script and Streamlit dashboard displaying real outputs', points: { data: 5, engineering: 2 } },
        { text: 'Provision a serverless stack with automated cloud functions and minimal ops', points: { cloud: 5, engineering: 2 } }
      ]
    },
    {
      id: 10,
      domain: 'Career Vision',
      question: 'Where do you see yourself delivering the highest impact in 3 years?',
      options: [
        { text: 'Designing end-to-end mission-critical software systems as a Staff Engineer', points: { engineering: 5, cloud: 3 } },
        { text: 'Leading transformative AI research and deploying intelligent agents at scale', points: { data: 5, engineering: 2 } },
        { text: 'Orchestrating planetary-scale resilient infrastructure and developer platforms', points: { cloud: 5, security: 3 } },
        { text: 'Directing product design and pioneering inclusive, award-winning user experiences', points: { design: 5, engineering: 1 } }
      ]
    }
  ];

  // States
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [results, setResults] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentStep]: optionIndex
    }));
  };

  const handleNextStep = () => {
    if (selectedAnswers[currentStep] === undefined) return;

    if (currentStep < diagnosticQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      computeResults();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const computeResults = () => {
    const scores = { engineering: 0, data: 0, cloud: 0, design: 0, security: 0 };

    Object.entries(selectedAnswers).forEach(([qIdx, optIdx]) => {
      const q = diagnosticQuestions[Number(qIdx)];
      const opt = q.options[optIdx];
      Object.entries(opt.points || {}).forEach(([dim, pts]) => {
        scores[dim] = (scores[dim] || 0) + pts;
      });
    });

    const recommendations = [
      {
        role: 'Full-Stack Developer',
        match: Math.min(98, 70 + Math.round((scores.engineering / 40) * 28)),
        archetype: 'System Architect & Product Builder',
        description: 'You excel at transforming architectural abstractions into responsive, robust production web platforms.',
        tag: 'Recommended Match #1'
      },
      {
        role: 'AI & Data Scientist',
        match: Math.min(95, 65 + Math.round((scores.data / 35) * 30)),
        archetype: 'Intelligent Systems Specialist',
        description: 'You have high statistical curiosity and love building model pipelines from complex data patterns.',
        tag: 'Recommended Match #2'
      },
      {
        role: 'Cloud & DevOps Engineer',
        match: Math.min(94, 60 + Math.round((scores.cloud / 30) * 34)),
        archetype: 'Infrastructure & Scalability Leader',
        description: 'Your instincts prioritize reliability, automated CI/CD pipelines, and high-availability systems.',
        tag: 'Recommended Match #3'
      }
    ].sort((a, b) => b.match - a.match);

    setResults({
      scores,
      primaryArchetype: recommendations[0].archetype,
      topMatches: recommendations
    });

    setAssessmentComplete(true);
    triggerToast('AI Diagnostic Evaluation Complete!');
  };

  const handleAdoptGoal = (role) => {
    db.updateUserProfile({
      targetRole: role,
      careerGoal: role,
      dreamJob: role
    });

    triggerToast(`Career goal set to "${role}"! Initializing Roadmap.`);
    setTimeout(() => {
      navigate('/roadmap');
    }, 800);
  };

  const handleRetake = () => {
    setCurrentStep(0);
    setSelectedAnswers({});
    setAssessmentComplete(false);
    setResults(null);
  };

  const currentQ = diagnosticQuestions[currentStep];

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
            <BrainCircuit size={15} /> PSYCHOMETRIC & TECHNICAL DIAGNOSTIC
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            AI Real-World Career Assessment
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            10 practical engineering scenarios that decode your optimal career trajectory.
          </p>
        </div>

        {!assessmentComplete && (
          <span className="badge glass-panel" style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.82rem' }}>
            Stage {currentStep + 1} of 10
          </span>
        )}
      </header>

      {/* Active Assessment Steps */}
      {!assessmentComplete && (
        <div className="flex flex-col gap-lg animate-fade-in">
          {/* Progress Indicator */}
          <div className="glass-panel flex flex-col gap-xs" style={{ padding: '1rem 1.5rem' }}>
            <div className="flex justify-between items-center text-muted" style={{ fontSize: '0.82rem' }}>
              <span>Dimension: <strong>{currentQ.domain}</strong></span>
              <span>{Math.round(((currentStep + 1) / diagnosticQuestions.length) * 100)}% Complete</span>
            </div>

            <div style={{ width: '100%', height: 6, background: 'var(--input-bg)', borderRadius: 3, overflow: 'hidden' }}>
              <div 
                style={{
                  width: `${((currentStep + 1) / diagnosticQuestions.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-panel p-xl flex flex-col gap-lg" style={{ padding: '2.25rem 2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.45 }}>
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-md">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentStep] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className="glass-panel interactive"
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--card-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="flex items-center gap-md">
                      <div 
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: isSelected ? 'var(--primary)' : 'var(--input-bg)',
                          color: isSelected ? '#fff' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          shrink: 0
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span style={{ fontSize: '0.94rem', fontWeight: isSelected ? 600 : 400 }}>
                        {option.text}
                      </span>
                    </div>

                    {isSelected && <CheckCircle2 size={20} className="text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center pt-sm">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={currentStep === 0}
                onClick={handlePrevStep}
                style={{ width: 'auto', padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Previous
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={selectedAnswers[currentStep] === undefined}
                onClick={handleNextStep}
                style={{ width: 'auto', padding: '10px 24px', fontSize: '0.88rem' }}
              >
                {currentStep === diagnosticQuestions.length - 1 ? 'Compute Career Diagnostics' : 'Next Scenario'}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Results Dashboard */}
      {assessmentComplete && results && (
        <div className="flex flex-col gap-lg animate-fade-in">
          {/* Top Archetype Banner */}
          <div 
            className="glass-panel flex flex-col md:flex-row justify-between items-start md:items-center gap-lg"
            style={{
              padding: '2.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(6, 182, 212, 0.05))',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            <div>
              <div className="flex items-center gap-xs text-secondary font-600 mb-xs" style={{ fontSize: '0.84rem' }}>
                <Sparkles size={16} /> DIAGNOSTIC PROFILE GENERATED
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                Primary Archetype: {results.primaryArchetype}
              </h2>
              <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '580px' }}>
                Your responses reveal exceptional engineering pragmatism and system intuition. Below are your top 3 calibrated pathways with hiring affinity scores.
              </p>
            </div>

            <div 
              style={{
                width: 105,
                height: 105,
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
              <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
                {results.topMatches[0].match}%
              </div>
              <div style={{ fontSize: '0.68rem', opacity: 0.85, fontWeight: 600 }}>TOP MATCH</div>
            </div>
          </div>

          {/* Top 3 Pathways Grid */}
          <div className="flex flex-col gap-md">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
              Top Calibrated Career Pathways
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {results.topMatches.map((rec, i) => (
                <div 
                  key={i} 
                  className="glass-panel flex flex-col justify-between"
                  style={{
                    padding: '1.5rem',
                    border: i === 0 ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: i === 0 ? 'rgba(99, 102, 241, 0.06)' : 'var(--card-bg)'
                  }}
                >
                  <div>
                    <div className="flex justify-between items-center mb-xs">
                      <span className="badge" style={{ background: i === 0 ? 'var(--primary)' : 'var(--input-bg)', color: i === 0 ? '#fff' : 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>
                        {rec.tag}
                      </span>
                      <span className="font-800" style={{ color: 'var(--success)', fontSize: '1.1rem' }}>
                        {rec.match}%
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '8px' }}>
                      {rec.role}
                    </h4>

                    <p className="text-muted" style={{ fontSize: '0.84rem', lineHeight: 1.5, marginTop: '6px' }}>
                      {rec.description}
                    </p>
                  </div>

                  <button 
                    className={`btn ${i === 0 ? 'btn-primary' : 'btn-secondary'} w-full mt-lg`}
                    onClick={() => handleAdoptGoal(rec.role)}
                    style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                  >
                    Adopt This Career Goal
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap justify-between items-center gap-md pt-md">
            <button 
              className="btn btn-secondary"
              onClick={handleRetake}
              style={{ width: 'auto', padding: '10px 20px' }}
            >
              <RotateCcw size={16} /> Retake Assessment
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
