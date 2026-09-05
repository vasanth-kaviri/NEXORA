import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';

export default function CareerGoal() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in flex flex-col gap-lg h-full">
      <header className="mb-md text-center mt-xl">
        <Target size={48} className="text-primary mx-auto mb-sm" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Select Career Goal</h1>
        <p className="text-muted">What is your dream job?</p>
      </header>

      <div className="flex flex-col gap-md">
        {['Data Scientist', 'Software Engineer', 'UX/UI Designer', 'Product Manager', 'Cybersecurity Analyst'].map((goal, i) => (
          <button 
            key={i} 
            className={`btn btn-secondary delay-${(i+1)*100} interactive`}
            onClick={() => navigate('/dashboard')}
          >
            {goal}
          </button>
        ))}
      </div>
    </div>
  );
}
