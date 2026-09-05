import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Quiz() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const options = ['A) O(1)', 'B) O(n)', 'C) O(log n)', 'D) O(n^2)'];

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg" style={{ minHeight: '100%', paddingBottom: '90px' }}>
      <header className="mb-sm">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Daily Quiz</h1>
        <p className="text-muted">Topic: Data Structures</p>
      </header>

      <div className="glass-panel flex-1 p-lg flex flex-col justify-center relative" style={{ padding: 'var(--space-xl)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: 'var(--space-xl)' }}>
          What is the time complexity of searching in a perfectly balanced binary search tree?
        </h2>
        
        <div className="flex flex-col gap-md">
          {options.map((opt, i) => (
            <button 
              key={i} 
              disabled={submitted}
              className={`btn ${selected === i ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setSelected(i)} 
              style={{ justifyContent: 'flex-start', padding: '1rem', border: submitted && i === 2 ? '2px solid var(--success)' : 'none' }}
            >
              {opt}
              {submitted && i === 2 && <CheckCircle size={20} className="ml-auto" />}
            </button>
          ))}
        </div>

        {!submitted ? (
          <button className="btn btn-primary mt-xl" onClick={handleSubmit} disabled={selected === null}>
            Submit Answer
          </button>
        ) : (
          <div className="mt-xl text-center">
            <h3 className={selected === 2 ? "text-success" : "text-secondary"} style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: 'var(--space-sm)' }}>
              {selected === 2 ? 'Correct!' : 'Incorrect.'}
            </h3>
            <p className="text-muted mb-md">The correct answer is O(log n) because the search space is halved at each step.</p>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}
