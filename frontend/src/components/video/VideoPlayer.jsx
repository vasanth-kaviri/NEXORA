import { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, 
  Maximize2, Minimize2, Sparkles, Clock, CheckCircle2,
  Tv, Film, Layers, Award
} from 'lucide-react';

export default function VideoPlayer({ 
  video, 
  currentTimestamp = 0, 
  onTimestampChange, 
  onProgressUpdate,
  onCompleted,
  isTheaterMode,
  onToggleTheater
}) {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const videoId = video?.videoId || 'W6NZfCO5SIk';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&rel=0&start=${Math.floor(currentTimestamp)}`;

  // Jump to timestamp when currentTimestamp changes externally (e.g. clicking a chapter or note)
  useEffect(() => {
    if (iframeRef.current && currentTimestamp > 0 && isPlaying) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [currentTimestamp, true] }),
        '*'
      );
    }
  }, [currentTimestamp]);

  const handleSeek = (seconds) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
        '*'
      );
    }
  };

  const formatSeconds = (sec) => {
    if (!sec || isNaN(sec)) return '00:00';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`flex flex-col gap-3 w-full transition-all ${isTheaterMode ? 'max-w-6xl' : 'max-w-full'}`}>
      
      {/* Video Frame Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/25 bg-black shadow-2xl group">
        
        {/* Top Header Bar */}
        <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
          <div className="flex items-center gap-2 truncate">
            <span className="badge text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles size={11} /> Masterclass Studio
            </span>
            <span className="text-xs font-bold text-white truncate drop-shadow-sm">
              {video?.title || 'Interactive Engineering Video'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleTheater && (
              <button
                type="button"
                onClick={onToggleTheater}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs flex items-center gap-1 border border-white/20 transition-all cursor-pointer"
                title={isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
              >
                <Tv size={14} />
                <span className="hidden sm:inline text-[11px] font-semibold">{isTheaterMode ? 'Standard' : 'Theater'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Video Canvas Container */}
        {isPlaying ? (
          <div className="w-full aspect-video bg-black">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={video?.title || 'Video Player'}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div 
            onClick={() => setIsPlaying(true)}
            className="w-full aspect-video bg-slate-950 relative flex items-center justify-center cursor-pointer group/poster overflow-hidden"
          >
            {/* Background Thumbnail Image with Soft Gradient */}
            <img 
              src={video?.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={video?.title}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/poster:opacity-75 group-hover/poster:scale-105 transition-all duration-500"
              onError={(e) => {
                e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Glowing Big Play Button */}
            <div className="relative z-10 flex flex-col items-center gap-3 text-center p-6">
              <div className="w-20 h-20 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/50 ring-4 ring-white/10 group-hover/poster:scale-110 transition-all">
                <Play size={34} className="ml-1 text-white fill-white" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/70 border border-indigo-500/30 px-2.5 py-1 rounded-md">
                  {video?.durationMinutes ? `${video.durationMinutes} Minutes Masterclass` : 'Full Course Stream'}
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-white mt-2 max-w-lg leading-snug drop-shadow-md">
                  {video?.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md line-clamp-1">
                  Presented by {video?.channelTitle || 'Verified Industry Instructor'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Metadata & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 py-1">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted flex items-center gap-1.5">
            <Clock size={13} className="text-indigo-400" />
            <span>Duration: {video?.durationMinutes || 60}m</span>
          </span>

          <span className="text-muted/40">•</span>

          <span className="text-xs font-medium text-muted">
            Channel: <strong className="text-main">{video?.channelTitle || 'Verified Instructor'}</strong>
          </span>

          {video?.difficulty && (
            <>
              <span className="text-muted/40">•</span>
              <span className="badge text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {video.difficulty}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {video?.chapters && video.chapters.length > 0 && (
            <span className="text-[11px] font-mono text-muted flex items-center gap-1 bg-input px-2.5 py-1 rounded-lg border border-border">
              <Layers size={11} className="text-indigo-400" />
              <span>{video.chapters.length} Interactive Chapters</span>
            </span>
          )}

          {onCompleted && (
            <button
              type="button"
              onClick={onCompleted}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 size={13} />
              <span>Mark Complete (+50 XP)</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
