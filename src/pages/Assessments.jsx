import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, ArrowRight, BrainCircuit } from 'lucide-react';

export default function Assessments() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const questions = [
    { q: "What type of tasks do you enjoy most?", options: ["Analyzing Data", "Designing Interfaces", "Writing Code", "Managing People"] },
    { q: "How do you prefer to solve problems?", options: ["Logical step-by-step", "Creative brainstorming", "Collaborative discussion", "Researching past solutions"] }
  ];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      // Finish assessment
      navigate('/dashboard');
    }
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ height: '100%' }}>
      <header className="mb-md text-center mt-xl">
        <BrainCircuit size={48} className="text-primary mx-auto mb-sm" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>AI Career Assessment</h1>
        <p className="text-muted">Let's find your perfect match.</p>
      </header>

      <div className="glass-panel interactive flex-1 p-lg flex flex-col justify-center" style={{ padding: 'var(--space-xl)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: 'var(--space-xl)' }} className="text-center">
          {questions[step].q}
        </h2>
        
        <div className="flex flex-col gap-md">
          {questions[step].options.map((opt, i) => (
            <button key={i} className="btn btn-secondary" onClick={handleNext} style={{ justifyContent: 'flex-start', padding: '1rem' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 'var(--space-sm)' }}>
                {String.fromCharCode(65 + i)}
              </div>
              {opt}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-center text-muted" style={{ paddingBottom: 'var(--space-xl)' }}>
        Question {step + 1} of {questions.length}
      </div>
    </div>
  );
}
