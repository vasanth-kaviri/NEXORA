import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Target, Rocket, ArrowRight } from 'lucide-react';

const slides = [
  {
    icon: <Target size={48} color="var(--primary)" />,
    title: "Find Your Path",
    description: "Discover the perfect career that aligns with your passions and strengths using AI."
  },
  {
    icon: <Compass size={48} color="var(--accent)" />,
    title: "Personalized Roadmap",
    description: "Get a step-by-step guide tailored just for you to reach your dream job."
  },
  {
    icon: <Rocket size={48} color="var(--secondary)" />,
    title: "Accelerate Growth",
    description: "Track progress, identify skill gaps, and get recommendations to level up."
  }
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="flex flex-col" style={{ height: '100%', padding: 'var(--space-xl) 0' }}>
      <div className="flex justify-end" style={{ padding: '0 var(--space-lg)' }}>
        <button onClick={() => navigate('/login')} className="text-muted" style={{ fontWeight: 600 }}>Skip</button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center animate-fade-in" key={currentSlide} style={{ padding: 'var(--space-lg)' }}>
        <div className="glass-panel flex items-center justify-center" style={{ width: 120, height: 120, borderRadius: '50%', marginBottom: 'var(--space-xl)' }}>
          {slides[currentSlide].icon}
        </div>
        
        <h2 className="text-center" style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: 'var(--space-md)' }}>
          {slides[currentSlide].title}
        </h2>
        
        <p className="text-muted text-center" style={{ fontSize: '1rem', lineHeight: '1.6', maxWidth: '80%' }}>
          {slides[currentSlide].description}
        </p>
      </div>

      <div className="flex flex-col items-center gap-lg" style={{ padding: '0 var(--space-lg)' }}>
        <div className="flex gap-sm">
          {slides.map((_, index) => (
            <div 
              key={index} 
              style={{
                height: 8,
                width: index === currentSlide ? 24 : 8,
                borderRadius: 4,
                background: index === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        
        <button className="btn btn-primary" onClick={handleNext}>
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
