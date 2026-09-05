import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Terminal, ArrowLeft, Menu,
  PanelLeftClose, PanelLeftOpen, X,
  FolderOpen, File, Activity,
} from 'lucide-react';

/**
 * ChatbotLayout
 *
 * The full-screen dark shell for the AI Mentor chatbot page.
 * Extracted from Chatbot.jsx so the page component can focus purely
 * on chat state and message rendering.
 *
 * State/callbacks are prop-drilled from Chatbot.jsx:
 *  - isSidebarOpen / setIsSidebarOpen
 *  - isTerminalOpen / setIsTerminalOpen
 *  - attachedFiles / setAttachedFiles (for sidebar file attach)
 *  - terminalLogs
 *  - children  — the center chat canvas content
 */
export default function ChatbotLayout({
  isSidebarOpen,
  setIsSidebarOpen,
  isTerminalOpen,
  setIsTerminalOpen,
  attachedFiles,
  setAttachedFiles,
  terminalLogs,
  terminalEndRef,
  onResetChat,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#050505] text-gray-300 font-sans selection:bg-indigo-500/30">

      {/* ── Top Navigation Bar ── */}
      <header className="w-full h-14 flex justify-between items-center px-4 bg-[#0B0F19]/80 backdrop-blur-md border-b border-white/[0.08] shrink-0 z-30">
        <div className="flex items-center gap-3">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white lg:hidden"
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Desktop panel toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white hidden lg:block"
            title="Toggle Sidebar"
          >
            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2 ml-2">
            <Sparkles size={18} className="text-indigo-400" />
            <span className="font-semibold text-[15px] text-gray-100 tracking-wide hidden sm:inline-block">
              AI Career Mentor
            </span>
            <span className="flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium shadow-[0_0_8px_rgba(16,185,129,0.15)]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active AI
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onResetChat && (
            <button
              onClick={onResetChat}
              className="px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-colors hidden sm:inline-block"
              title="Start New Chat Session"
            >
              New Chat
            </button>
          )}

          {/* Insights Console toggle */}
          <button
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-xs font-mono border ${
              isTerminalOpen
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'bg-[#0B0F19] text-gray-400 border-white/10 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Terminal size={15} />
            <span className="hidden sm:inline">Insights Console</span>
          </button>
        </div>
      </header>

      {/* ── Main Workspace Split ── */}
      <div className="flex-1 flex overflow-hidden relative w-full">

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ── Left Sidebar (Workspace) ── */}
        <div
          className={`absolute lg:relative z-40 h-full bg-[#0d1117] border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out overflow-hidden shadow-2xl lg:shadow-none ${
            isSidebarOpen
              ? 'w-72 opacity-100 translate-x-0'
              : 'w-0 opacity-0 -translate-x-full lg:translate-x-0 lg:w-0 lg:border-r-0'
          }`}
        >
          <div className="p-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2 border-b border-gray-800">
            <FolderOpen size={14} /> Workspace
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
            {['Resume_2026.pdf', 'CoverLetter.docx', 'Portfolio.link', 'Job_Description.txt', 'Skills.csv'].map(
              (file) => (
                <button
                  key={file}
                  onClick={() => {
                    if (!attachedFiles.includes(file))
                      setAttachedFiles([...attachedFiles, file]);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 text-sm text-gray-400 hover:text-gray-100 transition-colors text-left group"
                >
                  <File size={16} className="text-blue-400 group-hover:text-blue-300" />
                  <span className="flex-1 truncate">{file}</span>
                  <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 text-gray-500 bg-gray-900 px-2 py-0.5 rounded">
                    Attach
                  </span>
                </button>
              )
            )}
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="bg-white/5 p-3.5 rounded-lg flex items-center gap-3">
              <Activity size={20} className="text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-white">System Status</span>
                <span className="text-[11px] text-gray-400 font-mono mt-0.5">Latency: 12ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Center Chat Canvas (injected via children) ── */}
        {children}

        {/* ── Bottom Terminal Panel ── */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[#0B0F19] border-t border-white/10 z-30 transition-all duration-300 ease-in-out ${
            isTerminalOpen ? 'h-64 opacity-100' : 'h-0 opacity-0 overflow-hidden border-t-0'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2 bg-[#050505] border-b border-gray-800">
            <span className="text-xs text-gray-400 font-mono flex items-center gap-2">
              <Terminal size={14} /> Insights Console
            </span>
            <button onClick={() => setIsTerminalOpen(false)} className="text-gray-500 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <div className="p-4 h-[calc(100%-36px)] overflow-y-auto font-mono text-xs text-gray-400 flex flex-col gap-1.5 leading-relaxed">
            {terminalLogs.map((log, i) => (
              <div
                key={i}
                className={`${
                  log.includes('SUCCESS')
                    ? 'text-green-400'
                    : log.includes('ERROR')
                    ? 'text-red-400'
                    : log.includes('INFO')
                    ? 'text-blue-400'
                    : ''
                }`}
              >
                <span className="opacity-50 select-none mr-2">{'>'}</span>
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
