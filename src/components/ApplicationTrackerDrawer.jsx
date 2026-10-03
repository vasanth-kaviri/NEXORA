import { useState, useEffect } from 'react';
import { 
  Clock, X, Sparkles, Building, CheckCircle2, ChevronRight, 
  AlertCircle, ShieldCheck, Check, Send, Award, FileText, ArrowUpRight,
  TrendingUp, RefreshCw, UserCheck, Phone, Mail, GraduationCap
} from 'lucide-react';
import apiClient from '../services/apiClient';

const STAGES = [
  { id: 'SUBMITTED', label: 'Submitted' },
  { id: 'IN_REVIEW', label: 'In Review' },
  { id: 'TECHNICAL_SCREENING', label: 'Screening' },
  { id: 'INTERVIEW_SCHEDULED', label: 'Interview' },
  { id: 'DECISION', label: 'Decision' }
];

const STAGE_INDEX_MAP = {
  SUBMITTED: 0,
  IN_REVIEW: 1,
  TECHNICAL_SCREENING: 2,
  INTERVIEW_SCHEDULED: 3,
  OFFER_EXTENDED: 4,
  REJECTED: 4,
};

export default function ApplicationTrackerDrawer({ isOpen, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [recruiterActionNote, setRecruiterActionNote] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/v1/applications/user-timeline');
      const list = res.data?.applications || (Array.isArray(res.data) ? res.data : []);
      setApplications(list);
      if (list.length > 0 && !selectedApp) {
        setSelectedApp(list[0]);
      } else if (selectedApp) {
        const refreshed = list.find(a => (a.id || a._id) === (selectedApp.id || selectedApp._id));
        if (refreshed) setSelectedApp(refreshed);
      }
    } catch (err) {
      console.warn('Failed to load user timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTimeline();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      if (isOpen) fetchTimeline();
    };
    window.addEventListener('applications_updated', handleUpdate);
    return () => window.removeEventListener('applications_updated', handleUpdate);
  }, [isOpen]);

  // Recruiter Status Override handler
  const handleTransitionStatus = async (appId, nextStatus) => {
    setUpdatingId(appId);
    try {
      const payload = {
        status: nextStatus,
        recruiterNotes: recruiterActionNote.trim() || undefined,
        actionTakenBy: 'Senior Technical Recruiter',
        recruiterFeedback: {
          technicalRating: nextStatus === 'OFFER_EXTENDED' ? 10 : (nextStatus === 'TECHNICAL_SCREENING' ? 9 : 8),
          strengths: ['Algorithmic problem solving', 'System design velocity', 'Clean API patterns'],
          growthAreas: nextStatus === 'OFFER_EXTENDED' ? [] : ['Distributed caching edge cases']
        }
      };

      const res = await apiClient.patch(`/api/v1/applications/${appId}/status`, payload);
      if (res.success) {
        showToast(`Application transitioned to ${nextStatus.replace('_', ' ')}!`);
        setRecruiterActionNote('');
        await fetchTimeline();
        window.dispatchEvent(new CustomEvent('applications_updated'));
      }
    } catch (err) {
      console.error('Failed to transition status:', err);
      showToast('Error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_REVIEW':
        return (
          <span 
            className="badge animate-pulse" 
            style={{ 
              background: 'rgba(245, 158, 11, 0.15)', 
              color: '#f59e0b', 
              border: '1px solid rgba(245, 158, 11, 0.3)',
              fontWeight: 700,
              fontSize: '0.74rem',
              padding: '3px 10px',
              borderRadius: '9999px'
            }}
          >
            ● IN REVIEW
          </span>
        );
      case 'TECHNICAL_SCREENING':
        return (
          <span 
            className="badge" 
            style={{ 
              background: 'rgba(6, 182, 212, 0.15)', 
              color: '#06b6d4', 
              border: '1px solid rgba(6, 182, 212, 0.4)',
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.25)',
              fontWeight: 700,
              fontSize: '0.74rem',
              padding: '3px 10px',
              borderRadius: '9999px'
            }}
          >
            ✦ TECHNICAL SCREENING
          </span>
        );
      case 'INTERVIEW_SCHEDULED':
        return (
          <span 
            className="badge" 
            style={{ 
              background: 'rgba(99, 102, 241, 0.15)', 
              color: 'var(--primary)', 
              border: '1px solid rgba(99, 102, 241, 0.35)',
              fontWeight: 700,
              fontSize: '0.74rem',
              padding: '3px 10px',
              borderRadius: '9999px'
            }}
          >
            ★ INTERVIEW CONFIRMED
          </span>
        );
      case 'OFFER_EXTENDED':
        return (
          <span 
            className="badge" 
            style={{ 
              background: 'rgba(16, 185, 129, 0.15)', 
              color: '#10b981', 
              border: '1px solid rgba(16, 185, 129, 0.4)',
              fontWeight: 700,
              fontSize: '0.74rem',
              padding: '3px 10px',
              borderRadius: '9999px'
            }}
          >
            🎉 OFFER EXTENDED
          </span>
        );
      case 'REJECTED':
        return (
          <span 
            className="badge" 
            style={{ 
              background: 'rgba(244, 63, 94, 0.15)', 
              color: '#f43f5e', 
              border: '1px solid rgba(244, 63, 94, 0.35)',
              fontWeight: 700,
              fontSize: '0.74rem',
              padding: '3px 10px',
              borderRadius: '9999px'
            }}
          >
            ✕ REJECTED
          </span>
        );
      default:
        return (
          <span 
            className="badge" 
            style={{ 
              background: 'var(--input-bg)', 
              color: 'var(--text-muted)', 
              border: '1px solid var(--border-color)',
              fontWeight: 700,
              fontSize: '0.74rem',
              padding: '3px 10px',
              borderRadius: '9999px'
            }}
          >
            SUBMITTED
          </span>
        );
    }
  };

  const getStepIndex = (status) => {
    return STAGE_INDEX_MAP[status] ?? 0;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      {/* Toast */}
      {toastMessage && (
        <div 
          className="fixed top-5 right-5 z-[9999] px-4 py-2.5 rounded-full font-semibold text-xs flex items-center gap-2 shadow-2xl animate-slide-up"
          style={{ background: 'rgba(16, 185, 129, 0.95)', color: '#fff' }}
        >
          <Sparkles size={15} /> {toastMessage}
        </div>
      )}

      {/* Drawer Container */}
      <div 
        className="w-full max-w-4xl h-full flex flex-col glass-panel animate-slide-left"
        style={{
          background: 'var(--card-bg, #0f172a)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.6)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div 
          className="p-5 flex justify-between items-center shrink-0"
          style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--input-bg)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              style={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Application Tracker & Lifecycle Engine</h2>
                <span className="badge text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {applications.length} ACTIVE
                </span>
              </div>
              <p className="text-muted text-xs">Two-Way Enterprise Candidate Tracking, ATS Screening & Recruiter Timeline</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={fetchTimeline} 
              disabled={loading}
              className="btn-icon-tactile p-2 rounded-full"
              title="Refresh timeline"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-primary' : 'text-muted'} />
            </button>
            <button 
              onClick={onClose}
              className="btn-icon-tactile p-2 rounded-full"
              title="Close drawer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        {applications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3">
            <Building size={48} className="text-muted opacity-40" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Applications Tracked Yet</h3>
            <p className="text-muted text-sm max-w-sm">
              Explore open roles in the catalog, submit 1-click applications, and watch your stage timeline update live.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Column: List of Applications */}
            <div 
              className="w-full md:w-80 shrink-0 flex flex-col gap-2 p-3 overflow-y-auto"
              style={{ borderRight: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.1)' }}
            >
              <span className="text-muted text-[11px] font-bold uppercase tracking-wider px-2 py-1">
                Your Dispatches ({applications.length})
              </span>
              {applications.map((app) => {
                const appId = app.id || app._id;
                const isSelected = selectedApp && (selectedApp.id || selectedApp._id) === appId;
                return (
                  <div
                    key={appId}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected 
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-md' 
                        : 'border-transparent hover:border-border-color hover:bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-muted">{app.company}</span>
                      {getStatusBadge(app.status)}
                    </div>
                    <h4 className="text-sm font-bold text-main line-clamp-1">{app.role || app.title}</h4>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-muted">
                      <span>ATS: {app.atsScore || app.applicantSnapshot?.resumeScore || 86}%</span>
                      <span>{new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Stage & Timeline Details Area */}
            {selectedApp && (
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
                {/* Active Application Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">{selectedApp.company}</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">{selectedApp.jobDetails?.location || 'Global Hybrid'}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-main">{selectedApp.role || selectedApp.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedApp.status)}
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      ATS: {selectedApp.atsScore || selectedApp.applicantSnapshot?.resumeScore || 86}% Match
                    </div>
                  </div>
                </div>

                {/* 5-Stage Visual Progress Stepper */}
                <div className="glass-panel p-4 rounded-xl flex flex-col gap-3" style={{ background: 'var(--input-bg)' }}>
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                    Hiring Pipeline Stepper
                  </span>

                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {STAGES.map((stg, sIdx) => {
                      const currentStep = getStepIndex(selectedApp.status);
                      const isCompleted = sIdx <= currentStep;
                      const isCurrent = sIdx === currentStep;

                      let stepColor = isCompleted ? 'var(--primary)' : 'var(--border-color)';
                      if (selectedApp.status === 'OFFER_EXTENDED' && sIdx === 4) stepColor = '#10b981';
                      if (selectedApp.status === 'REJECTED' && sIdx === 4) stepColor = '#f43f5e';

                      return (
                        <div key={stg.id} className="flex flex-col gap-2">
                          <div 
                            style={{
                              height: 6,
                              borderRadius: 3,
                              background: stepColor,
                              transition: 'all 0.3s ease'
                            }} 
                          />
                          <div className="flex items-center gap-1">
                            {isCompleted ? (
                              <CheckCircle2 size={12} className="text-primary shrink-0" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full border border-muted shrink-0" />
                            )}
                            <span 
                              style={{ 
                                fontSize: '0.72rem', 
                                fontWeight: isCurrent ? 800 : (isCompleted ? 600 : 500),
                                color: isCurrent ? 'var(--text-main)' : 'var(--text-muted)'
                              }}
                            >
                              {stg.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Matched Skills & Applicant Snapshot Dossier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Matched Technical Skills */}
                  <div className="glass-panel p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--input-bg)' }}>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-main">
                      <ShieldCheck size={15} className="text-primary" /> Matched Core Competencies
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(selectedApp.applicantSnapshot?.matchedSkills || []).length > 0 ? (
                        selectedApp.applicantSnapshot.matchedSkills.map((sk) => (
                          <span 
                            key={sk} 
                            className="badge text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                          >
                            ✓ {sk}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-muted">No primary skills matched.</span>
                      )}
                    </div>
                  </div>

                  {/* Candidate Dossier */}
                  <div className="glass-panel p-4 rounded-xl flex flex-col gap-2" style={{ background: 'var(--input-bg)' }}>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-main">
                      <UserCheck size={15} className="text-emerald-400" /> Candidate Submission Details
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                      <div>
                        <span className="text-muted block text-[10px]">Candidate</span>
                        <span className="font-semibold text-main">{selectedApp.applicantSnapshot?.fullName || selectedApp.applicantSnapshot?.name || 'Applicant'}</span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px]">Email</span>
                        <span className="font-semibold text-main truncate block">{selectedApp.applicantSnapshot?.email}</span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px]">Phone</span>
                        <span className="font-semibold text-main">{selectedApp.applicantSnapshot?.phone || 'Not Provided'}</span>
                      </div>
                      <div>
                        <span className="text-muted block text-[10px]">Document</span>
                        <span className="font-semibold text-main truncate block flex items-center gap-1">
                          <FileText size={12} className="text-primary" /> {selectedApp.applicantSnapshot?.resumeName || 'Resume.pdf'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recruiter Evaluation Feedback */}
                {selectedApp.recruiterFeedback && (
                  <div className="glass-panel p-4 rounded-xl flex flex-col gap-2 border border-indigo-500/20" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                        <Award size={16} /> Recruiter Technical Evaluation
                      </div>
                      <span className="text-xs font-bold text-main">
                        Rating: {selectedApp.recruiterFeedback.technicalRating || 9} / 10
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 text-xs">
                      {selectedApp.recruiterFeedback.strengths?.length > 0 && (
                        <div>
                          <span className="text-emerald-400 font-bold block mb-1">Key Strengths:</span>
                          <ul className="list-disc pl-4 text-muted flex flex-col gap-0.5">
                            {selectedApp.recruiterFeedback.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedApp.recruiterFeedback.growthAreas?.length > 0 && (
                        <div>
                          <span className="text-amber-400 font-bold block mb-1">Growth Areas:</span>
                          <ul className="list-disc pl-4 text-muted flex flex-col gap-0.5">
                            {selectedApp.recruiterFeedback.growthAreas.map((g, i) => (
                              <li key={i}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Chronological Event Timeline */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                      Live Audit Timeline & Stage History
                    </span>
                    <span className="text-xs text-muted">
                      {(selectedApp.timeline || []).length} Recorded Events
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-color">
                    {(selectedApp.timeline || []).map((ev, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div 
                          className="w-3.5 h-3.5 rounded-full mt-1 shrink-0 -ml-[19px] border-2 border-card-bg"
                          style={{ background: i === 0 ? 'var(--primary)' : 'var(--border-color)' }}
                        />
                        <div className="glass-panel p-3.5 rounded-xl flex-1 flex flex-col gap-1" style={{ background: 'var(--input-bg)' }}>
                          <div className="flex flex-wrap justify-between items-center gap-1">
                            <span className="text-xs font-bold text-main flex items-center gap-1.5">
                              {getStatusBadge(ev.stage)}
                              <span className="text-muted text-[11px]">via {ev.actionTakenBy || 'Recruiter Engine'}</span>
                            </span>
                            <span className="text-[11px] text-muted">
                              {new Date(ev.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-muted mt-1 leading-relaxed">
                            {ev.recruiterNotes}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two-Way Recruiter Simulation Control Panel */}
                <div className="glass-panel p-4 rounded-xl flex flex-col gap-3 border border-border-color mt-2" style={{ background: 'rgba(0,0,0,0.25)' }}>
                  <div className="flex items-center gap-2 text-xs font-bold text-main">
                    <Sparkles size={15} className="text-amber-400" />
                    <span>Two-Way Recruiter Engine Simulation (Status Override)</span>
                  </div>
                  <p className="text-xs text-muted">
                    Simulate recruiter decisions to test live two-way synchronization in real-time.
                  </p>

                  <input 
                    type="text" 
                    placeholder="Custom recruiter remarks (optional)..."
                    className="input-field text-xs w-full py-1.5 px-3"
                    value={recruiterActionNote}
                    onChange={(e) => setRecruiterActionNote(e.target.value)}
                  />

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      disabled={updatingId === (selectedApp.id || selectedApp._id)}
                      onClick={() => handleTransitionStatus(selectedApp.id || selectedApp._id, 'TECHNICAL_SCREENING')}
                      className="btn text-xs font-bold px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 cursor-pointer"
                    >
                      Advance to Technical Screening
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === (selectedApp.id || selectedApp._id)}
                      onClick={() => handleTransitionStatus(selectedApp.id || selectedApp._id, 'INTERVIEW_SCHEDULED')}
                      className="btn text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 cursor-pointer"
                    >
                      Confirm Interview Loop
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === (selectedApp.id || selectedApp._id)}
                      onClick={() => handleTransitionStatus(selectedApp.id || selectedApp._id, 'OFFER_EXTENDED')}
                      className="btn text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                    >
                      Extend Official Offer
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === (selectedApp.id || selectedApp._id)}
                      onClick={() => handleTransitionStatus(selectedApp.id || selectedApp._id, 'REJECTED')}
                      className="btn text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                    >
                      Decline Application
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
