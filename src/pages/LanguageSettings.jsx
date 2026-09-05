import { useState } from 'react';
import { Check } from 'lucide-react';

export default function LanguageSettings() {
  const [selectedLang, setSelectedLang] = useState('en');

  const languages = [
    { code: 'en', name: 'English (US)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'zh', name: '中文 (Chinese)' },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Language</h1>
        <p className="text-muted">Choose your preferred language.</p>
      </header>

      <div className="glass-panel" style={{ padding: '0 var(--space-md)' }}>
        {languages.map((lang, index) => (
          <div 
            key={lang.code}
            className="flex items-center justify-between interactive" 
            style={{ 
              padding: 'var(--space-md) 0', 
              borderBottom: index === languages.length - 1 ? 'none' : '1px solid var(--border-color)', 
              cursor: 'pointer' 
            }}
            onClick={() => setSelectedLang(lang.code)}
          >
            <span style={{ fontWeight: selectedLang === lang.code ? '600' : '400', color: selectedLang === lang.code ? 'var(--primary)' : 'var(--text-main)' }}>
              {lang.name}
            </span>
            {selectedLang === lang.code && <Check size={20} className="text-primary" />}
          </div>
        ))}
      </div>
    </div>
  );
}
