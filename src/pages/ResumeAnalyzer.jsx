import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResumeAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: 78,
        strengths: ['Great project descriptions', 'Clear formatting'],
        weaknesses: ['Missing keywords: "TensorFlow", "Scikit-Learn"', 'Summary is too generic']
      });
    }, 2000);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Resume Analyzer</h1>
        <p className="text-muted">AI-powered feedback to land your dream job.</p>
      </header>

      {!result && !analyzing && (
        <div 
          onClick={handleUpload}
          className="glass-panel interactive flex flex-col items-center justify-center gap-md" 
          style={{ padding: 'var(--space-xl)', borderStyle: 'dashed', borderWidth: 2, cursor: 'pointer' }}
        >
          <UploadCloud size={48} className="text-primary" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Upload your resume</h3>
          <p className="text-muted text-center" style={{ fontSize: '0.85rem' }}>PDF, DOCX up to 5MB</p>
        </div>
      )}

      {analyzing && (
        <div className="flex flex-col items-center justify-center" style={{ padding: 'var(--space-xl) 0' }}>
          <div style={{ width: 50, height: 50, border: '4px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p className="mt-md font-600 text-primary">AI is analyzing your resume...</p>
        </div>
      )}

      {result && (
        <div className="animate-fade-in flex flex-col gap-md">
          <div className="glass-panel flex items-center justify-between" style={{ padding: 'var(--space-lg)' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Overall Score</h2>
              <p className="text-muted">Good, but needs keyword optimization.</p>
            </div>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>
              {result.score}
            </div>
          </div>
          
          <div className="flex flex-col gap-sm">
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Strengths</h3>
            {result.strengths.map((s, i) => (
              <div key={i} className="flex items-center gap-sm glass-panel" style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <CheckCircle size={18} className="text-success" />
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-sm mt-sm">
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Areas to Improve</h3>
            {result.weaknesses.map((w, i) => (
              <div key={i} className="flex items-center gap-sm glass-panel" style={{ padding: 'var(--space-sm) var(--space-md)' }}>
                <AlertCircle size={18} className="text-warning" />
                <span>{w}</span>
              </div>
            ))}
          </div>
          
          <button className="btn btn-secondary mt-md" onClick={() => setResult(null)}>Upload Another</button>
        </div>
      )}
    </div>
  );
}
