import { useState } from 'react';
import { Mail, Phone, ChevronDown, ChevronUp } from 'lucide-react';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "How do I update my dream job or domain?",
      a: "You can update your dream job and domain at any time by navigating to your Profile (top right avatar) and clicking the 'Edit Profile' button."
    },
    {
      q: "Are the mock interviews recorded?",
      a: "No, all mock interviews are processed in real-time by our AI and are not recorded or saved to ensure your privacy."
    },
    {
      q: "Why am I not receiving job match alerts?",
      a: "Please check your Notification Settings in the Profile menu. Ensure that 'Job & Internship Alerts' is toggled on. Also, verify that your email is correct."
    },
    {
      q: "How does the AI Mentor work?",
      a: "The AI Mentor analyzes your current skills against your dream job requirements and provides personalized daily tasks, resource recommendations, and answers career questions."
    }
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-lg">
      <header className="mb-md">
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Help & Support</h1>
        <p className="text-muted">We're here to help you succeed.</p>
      </header>

      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: 'var(--space-md)' }}>Contact Us</h2>
        <div className="flex flex-col gap-sm">
          <div className="glass-panel flex items-center gap-md interactive" style={{ padding: 'var(--space-md)' }}>
            <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}>
              <Mail className="text-primary" size={24} />
            </div>
            <div>
              <span style={{ fontWeight: '600', display: 'block' }}>Email Support</span>
              <a href="mailto:support@nexora.ai" className="text-primary" style={{ fontSize: '0.9rem' }}>support@nexora.ai</a>
            </div>
          </div>
          
          <div className="glass-panel flex items-center gap-md interactive" style={{ padding: 'var(--space-md)' }}>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%' }}>
              <Phone className="text-success" size={24} />
            </div>
            <div>
              <span style={{ fontWeight: '600', display: 'block' }}>Phone Support</span>
              <a href="tel:+18005550199" className="text-muted" style={{ fontSize: '0.9rem' }}>+1 (800) 555-0199</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-md">
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: 'var(--space-md)' }}>Frequently Asked Questions</h2>
        <div className="flex flex-col gap-sm">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              <div 
                className="flex items-center justify-between interactive" 
                style={{ padding: 'var(--space-md)', cursor: 'pointer' }}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span style={{ fontWeight: '500' }}>{faq.q}</span>
                {openFaq === index ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-muted" />}
              </div>
              {openFaq === index && (
                <div style={{ padding: '0 var(--space-md) var(--space-md) var(--space-md)', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, animation: 'fadeIn 0.2s ease-out' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
