import { useState } from 'react';
import { Mail, Phone, ChevronDown, ChevronUp, Send, CheckCircle2, MessageSquare, HelpCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import notificationService from '../../services/notificationService';

export default function Help() {
  const toast = useToast();
  const [openFaq, setOpenFaq] = useState(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Career Roadmap');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error('Please complete all ticket fields.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 600));

    // Register notification
    await notificationService.pushInAppNotification({
      title: 'Support Ticket Received',
      message: `Your inquiry regarding "${ticketSubject}" was logged. Engineering support will reply within 4 hours.`,
      type: 'info'
    });

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success('Support ticket submitted successfully!');
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="animate-fade-in flex flex-col gap-lg pb-12">
      <header className="mb-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          <HelpCircle size={15} /> Student Assistance Hub
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Help & Support</h1>
        <p className="text-muted text-sm">We're here to support your engineering trajectory 24/7.</p>
      </header>

      {/* Fast Contact Channels */}
      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: 'var(--space-md)' }}>Direct Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <div className="glass-panel flex items-center gap-md interactive" style={{ padding: 'var(--space-md)' }}>
            <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%' }}>
              <Mail className="text-primary" size={24} />
            </div>
            <div>
              <span style={{ fontWeight: '600', display: 'block' }}>Email Support</span>
              <a href="mailto:support@nexora.ai" className="text-primary hover:underline text-sm">support@nexora.ai</a>
            </div>
          </div>
          
          <div className="glass-panel flex items-center gap-md interactive" style={{ padding: 'var(--space-md)' }}>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%' }}>
              <Phone className="text-success" size={24} />
            </div>
            <div>
              <span style={{ fontWeight: '600', display: 'block' }}>Direct Priority Line</span>
              <a href="tel:+18005550199" className="text-muted hover:text-main text-sm">+1 (800) 555-0199</a>
            </div>
          </div>
        </div>
      </section>

      {/* In-app Ticket Submission Form */}
      <section className="glass-panel p-5 sm:p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={18} className="text-primary" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Open a Priority Support Ticket</h2>
        </div>
        <p className="text-muted text-xs sm:text-sm mb-4">
          Need assistance with interview prep, roadmaps, or technical assessments? Our engineering advisors respond within 4 hours.
        </p>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} />
              <span className="text-sm font-semibold">Your ticket has been dispatched to engineering support!</span>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs underline font-medium cursor-pointer"
            >
              Submit another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Issue Category</label>
                <select
                  className="input-field w-full cursor-pointer"
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                >
                  <option value="Career Roadmap">Career Roadmap Calibration</option>
                  <option value="AI Mock Interview">AI Mock Interview Simulator</option>
                  <option value="Resume ATS Scan">Resume ATS Scan & Optimizer</option>
                  <option value="Billing & Pro Plan">Billing &amp; Pro Membership</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Issue generating dynamic questions"
                  className="input-field w-full"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1">Describe the problem</label>
              <textarea
                rows={3}
                placeholder="Provide details so our mentors can provide exact guidance..."
                className="input-field w-full resize-none"
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary self-start flex items-center gap-2 px-6 py-2.5 rounded-xl cursor-pointer mt-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Dispatching Ticket...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </form>
        )}
      </section>

      {/* Frequently Asked Questions */}
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
                <span style={{ fontWeight: '500', fontSize: '0.94rem' }}>{faq.q}</span>
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
