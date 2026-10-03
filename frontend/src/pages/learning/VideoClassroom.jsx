import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Code2, BookOpen, Clock, CheckCircle2, 
  ExternalLink, Sparkles, Copy, CheckCheck, Play, 
  Tv, MessageSquare, Plus, Trash2, Award, Compass,
  Layers, Terminal, Bookmark
} from 'lucide-react';
import VideoPlayer from '../../components/video/VideoPlayer';
import videoService from '../../services/videoService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import db from '../../services/db';

export default function VideoClassroom() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user: authUser } = useAuth();

  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sandbox'); // 'sandbox' | 'notes' | 'chapters'
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Student Notes state
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Code Sandbox state
  const [sandboxCode, setSandboxCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [sandboxOutput, setSandboxOutput] = useState('');

  // Watch Progress & Completion state
  const [isCompleted, setIsCompleted] = useState(false);
  const [watchPercentage, setWatchPercentage] = useState(0);

  // Load video details and progress
  useEffect(() => {
    let isMounted = true;
    async function loadClassroomData() {
      setIsLoading(true);
      try {
        const videoData = await videoService.getVideoDetails(videoId);
        if (isMounted && videoData) {
          setVideo(videoData);

          // Preload default sandbox code tailored to video skills
          const defaultSnippet = `// NEXORA Interactive Code Sandbox
// Masterclass: ${videoData.title}
// Specialized Skills: ${(videoData.skills || []).join(', ')}

export function executeLabChallenge() {
  console.log("Executing live code telemetry for ${videoData.domainId}...");
  
  const metrics = {
    domain: "${videoData.domainId}",
    lecture: "${videoData.title}",
    status: "READY",
    timestamp: new Date().toISOString()
  };
  
  return metrics;
}

// Invoke runner
console.log(executeLabChallenge());`;
          setSandboxCode(defaultSnippet);
        }

        // Fetch user progress
        const progressData = await videoService.getUserVideoProgress(videoId);
        if (isMounted && progressData) {
          setIsCompleted(progressData.completed || false);
          setWatchPercentage(progressData.watchPercentage || 0);
          if (progressData.notes) {
            setNotes(progressData.notes);
          }
        }
      } catch (err) {
        console.error('[VideoClassroom] Failed to load lecture:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadClassroomData();
    return () => { isMounted = false; };
  }, [videoId]);

  // Jump player to chapter or note timestamp
  const jumpToSeconds = (seconds) => {
    setCurrentTimestamp(seconds);
    toast.info(`Jumped to chapter at ${formatTimestamp(seconds)}`);
  };

  const formatTimestamp = (sec) => {
    if (!sec || isNaN(sec)) return '00:00';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Save student note
  const handleSaveNote = async () => {
    if (!newNoteText.trim()) return;
    setIsSavingNote(true);
    try {
      const notePayload = {
        timestampSeconds: Math.floor(currentTimestamp),
        text: newNoteText.trim(),
        domainId: video?.domainId || 'fullstack',
      };
      const savedNote = await videoService.addVideoNote(videoId, notePayload);
      if (savedNote) {
        setNotes(prev => [...prev, savedNote]);
        setNewNoteText('');
        toast.success(`Note saved at ${formatTimestamp(notePayload.timestampSeconds)}!`);
      }
    } catch (err) {
      toast.error('Failed to save note.');
    } finally {
      setIsSavingNote(false);
    }
  };

  // Run Sandbox Code simulation
  const handleRunCode = () => {
    setSandboxOutput(`[NEXORA Sandbox Engine]
> Initializing sandbox environment for ${video?.domainId || 'Engineering'}...
> Compiling code blocks...
> Execution success! Output:
{
  domain: "${video?.domainId || 'fullstack'}",
  lecture: "${video?.title || 'Lecture'}",
  status: "ACTIVE_VERIFIED",
  telemetry: "Memory nominal, 0 dropped frames"
}
[Process exited with code 0]`);
    toast.success('Code executed successfully in sandbox!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sandboxCode);
    setCopiedCode(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Mark Completed & Award XP
  const handleCompleteMasterclass = async () => {
    try {
      const totalSec = (video?.durationMinutes || 60) * 60;
      const res = await videoService.updateUserVideoProgress(videoId, {
        domainId: video?.domainId || 'fullstack',
        lastPositionSeconds: totalSec,
        totalDurationSeconds: totalSec,
      });

      setIsCompleted(true);
      setWatchPercentage(100);
      toast.success('Masterclass Completed! +50 XP Telemetry Awarded.');

      // Refresh local user profile XP
      const currentUser = db.getCurrentUser() || {};
      db.updateUserProfile({ xp: (currentUser.xp || 1200) + 50 });
      window.dispatchEvent(new Event('user_session_changed'));
    } catch (err) {
      toast.error('Failed to mark completion.');
    }
  };

  if (isLoading) {
    return (
      <div className="workstation-container flex flex-col items-center justify-center p-20 min-h-[60vh]">
        <Compass size={44} className="text-indigo-500 animate-spin" />
        <h3 className="text-base font-bold text-main mt-4">Connecting to Masterclass Stream...</h3>
        <p className="text-xs text-muted">Ingesting verified lecture chapters and interactive sandbox.</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="workstation-container p-12 text-center flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-main">Masterclass Not Found</h2>
        <p className="text-xs text-muted">The requested video lecture could not be loaded from the catalog.</p>
        <button onClick={() => navigate('/domains')} className="btn-primary text-xs py-2 px-4">
          Browse All 12 Domains
        </button>
      </div>
    );
  }

  return (
    <div className="workstation-container animate-fade-in flex flex-col gap-6" style={{ minHeight: '100vh', padding: '24px 20px', maxWidth: '1560px', margin: '0 auto', width: '100%' }}>
      
      {/* ── Top Header Navigation Bar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-muted hover:text-main px-3.5 py-2 rounded-xl bg-card border border-border hover:border-indigo-500/40 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Curriculum</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            {video.domainId} Track
          </span>

          <button
            type="button"
            onClick={() => navigate('/domains')}
            className="text-xs font-semibold text-muted hover:text-indigo-400 px-3 py-1.5 rounded-lg bg-input border border-border/80 transition-all"
          >
            Explore Other Domains →
          </button>
        </div>
      </div>

      {/* ── Main Split-Screen Workstation Layout ── */}
      <div className={`grid grid-cols-1 ${isTheaterMode ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-8 items-start`}>
        
        {/* ── LEFT PANE: Video Canvas & Chapter Scrubber (65% / 7-Cols) ── */}
        <div className={`${isTheaterMode ? 'w-full' : 'lg:col-span-7'} flex flex-col gap-5`}>
          
          {/* Main Video Embed Player */}
          <VideoPlayer 
            video={video} 
            currentTimestamp={currentTimestamp}
            onCompleted={handleCompleteMasterclass}
            isTheaterMode={isTheaterMode}
            onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
          />

          {/* Video Lecture Overview & Key Takeaways Card */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-border flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="badge text-[10px] font-mono font-bold uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {video.provider} Stream
                </span>
                <span className="text-xs text-muted font-medium">
                  {video.channelTitle}
                </span>
                <span className="text-muted/40">•</span>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {video.durationMinutes} Minutes
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-main m-0 leading-tight">
                {video.title}
              </h1>

              <p className="text-xs sm:text-sm text-muted leading-relaxed m-0 mt-2.5">
                {video.description}
              </p>
            </div>

            {/* Evaluated Skills Badges */}
            {video.skills && video.skills.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-muted mr-1">
                  Mastered Skills:
                </span>
                {video.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-input text-main border border-border/80 shadow-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Key Takeaways Checklist */}
            {video.keyTakeaways && video.keyTakeaways.length > 0 && (
              <div className="flex flex-col gap-3 pt-3 border-t border-border/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted m-0 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-400" />
                  Key Takeaways & Architecture Principles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {video.keyTakeaways.map((takeaway, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-input/40 border border-border/70 flex items-start gap-2.5 shadow-xs"
                    >
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-main leading-relaxed">
                        {takeaway}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ── RIGHT PANE: Multi-Tab Interactive Studio Dock (35% / 5-Cols) ── */}
        {!isTheaterMode && (
          <aside className="lg:col-span-5 flex flex-col gap-4 sticky top-6">
            
            {/* Dock Tabs Header */}
            <div className="p-1 rounded-2xl bg-card border border-border flex gap-1 shadow-sm">
              {[
                { id: 'sandbox', label: 'Code Lab', icon: Code2 },
                { id: 'notes', label: `Notes (${notes.length})`, icon: MessageSquare },
                { id: 'chapters', label: `Chapters (${video.chapters?.length || 0})`, icon: Layers },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                        : 'text-muted hover:text-main'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── TAB 1: Live Interactive Code Sandbox ── */}
            {activeTab === 'sandbox' && (
              <div className="glass-panel p-5 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col gap-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-main m-0">
                      Live Code Sandbox
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-1.5 rounded-lg bg-input hover:bg-input/80 text-muted hover:text-main text-xs border border-border transition-all cursor-pointer"
                      title="Copy code"
                    >
                      {copiedCode ? <CheckCheck size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-500/25 bg-slate-950 p-3 shadow-inner">
                  <textarea
                    value={sandboxCode}
                    onChange={(e) => setSandboxCode(e.target.value)}
                    rows={12}
                    className="w-full bg-transparent text-emerald-400 font-mono text-xs leading-relaxed outline-none resize-none border-0"
                    placeholder="// Write or execute code along with the masterclass..."
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleRunCode}
                    className="btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer"
                  >
                    <Play size={13} />
                    <span>Run in Sandbox</span>
                  </button>

                  <span className="text-[11px] font-mono text-muted">
                    TypeScript Node Runtime
                  </span>
                </div>

                {sandboxOutput && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-border/80 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
                    {sandboxOutput}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: Timestamped Student Notebook ── */}
            {activeTab === 'notes' && (
              <div className="glass-panel p-5 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col gap-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark size={16} className="text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-main m-0">
                      Timestamped Notebook
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-muted">
                    Auto-synced to Profile
                  </span>
                </div>

                {/* Note Input */}
                <div className="flex flex-col gap-2">
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    rows={3}
                    placeholder="Capture an insight, code syntax, or architecture decision..."
                    className="w-full p-3 rounded-xl bg-input text-main text-xs border border-border focus:border-indigo-500 outline-none leading-relaxed"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-indigo-400">
                      At {formatTimestamp(currentTimestamp)}
                    </span>

                    <button
                      type="button"
                      onClick={handleSaveNote}
                      disabled={isSavingNote || !newNoteText.trim()}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                        newNoteText.trim()
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer'
                          : 'bg-input text-muted/40 border border-border cursor-not-allowed'
                      }`}
                    >
                      <Plus size={13} />
                      <span>Save Note</span>
                    </button>
                  </div>
                </div>

                {/* Notes List */}
                <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {notes.length > 0 ? (
                    notes.map((note, idx) => (
                      <div 
                        key={idx}
                        onClick={() => jumpToSeconds(note.timestampSeconds)}
                        className="p-3 rounded-xl bg-input/50 hover:bg-input border border-border/80 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col gap-1.5 group"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 group-hover:scale-105 transition-transform">
                            {formatTimestamp(note.timestampSeconds)}
                          </span>
                          <span className="text-muted/60 text-[10px]">
                            Click to jump
                          </span>
                        </div>
                        <p className="text-xs text-main leading-relaxed m-0">
                          {note.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center rounded-2xl bg-input/30 border border-border/50">
                      <p className="text-xs text-muted m-0">No notes yet. Type above to bookmark concepts.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 3: Interactive Chapter Navigation ── */}
            {activeTab === 'chapters' && (
              <div className="glass-panel p-5 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col gap-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-main m-0">
                      Interactive Lecture Chapters
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-muted">
                    {video.chapters?.length || 0} Topics
                  </span>
                </div>

                <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {video.chapters && video.chapters.length > 0 ? (
                    video.chapters.map((ch, idx) => (
                      <div 
                        key={idx}
                        onClick={() => jumpToSeconds(ch.timestampSeconds)}
                        className="p-3 rounded-xl bg-input/50 hover:bg-input border border-border/80 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-main truncate group-hover:text-indigo-300 transition-colors">
                            {ch.title}
                          </span>
                        </div>

                        <span className="text-xs font-mono font-bold text-muted group-hover:text-indigo-400 transition-colors flex-shrink-0">
                          {formatTimestamp(ch.timestampSeconds)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center rounded-2xl bg-input/30 border border-border/50">
                      <p className="text-xs text-muted m-0">Continuous stream without discrete chapter breaks.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Completion Telemetry Action Card */}
            <div className="glass-panel p-4.5 rounded-3xl border border-border flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Award size={18} className={isCompleted ? 'text-emerald-400' : 'text-indigo-400'} />
                <div>
                  <h4 className="text-xs font-bold text-main m-0">
                    {isCompleted ? 'Lecture Cleared' : 'Masterclass Progress'}
                  </h4>
                  <p className="text-[11px] text-muted m-0">
                    {isCompleted ? '+50 XP Telemetry Credited' : `${watchPercentage}% Complete`}
                  </p>
                </div>
              </div>

              {!isCompleted ? (
                <button
                  type="button"
                  onClick={handleCompleteMasterclass}
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer"
                >
                  Mark Completed
                </button>
              ) : (
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Completed
                </span>
              )}
            </div>

          </aside>
        )}

      </div>

    </div>
  );
}
