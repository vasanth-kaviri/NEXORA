import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * LiveCountdown Component
 * Formats time remaining until a target ISO date or date string.
 */
export default function LiveCountdown({ targetDate, label = 'Closes in' }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  function calculateTimeLeft(target) {
    if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted">
        <Clock size={12} /> Deadline Closed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-primary font-semibold bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md">
      <Clock size={12} className="animate-pulse-subtle" />
      <span>{label}</span>
      <span>
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:{String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    </span>
  );
}
