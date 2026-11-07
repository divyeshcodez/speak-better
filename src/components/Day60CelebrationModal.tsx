import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Share2, Check, X, Flame, Sparkles } from 'lucide-react';

interface Day60CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalMinutes: number;
  avgWpm: number;
  totalAttempts: number;
}

export const Day60CelebrationModal: React.FC<Day60CelebrationModalProps> = ({
  isOpen,
  onClose,
  totalMinutes,
  avgWpm,
  totalAttempts,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#fbbf24', '#10b981', '#3b82f6'],
        });
      } catch (_) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const [copied, setCopied] = React.useState(false);

  const handleCopyCard = () => {
    const text = `🎉 I just completed the QuoteTalk 60-Day Spoken English Challenge! 🎤\n\n` +
      `⏱️ Total Spoken English: ${totalMinutes} minutes\n` +
      `📈 Average Conversational Pace: ${avgWpm} WPM\n` +
      `🏆 60 Daily Quotes Expanded Live out loud\n\n` +
      `Built with QuoteTalk 60. From hesitant pauses to effortless spoken fluency!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
          aria-label="Close celebration"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25">
          <Award className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Challenge Accomplished
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
            Day 60 Champion!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs mx-auto">
            You completed 60 days of live spoken English expansions. Your dedication has forged real vocal confidence and fluency.
          </p>
        </div>

        {/* Shareable Certificate Card Container */}
        <div className="bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-2xl p-5 shadow-inner space-y-4 text-left border border-stone-800">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                QuoteTalk 60 Certificate
              </p>
              <h4 className="text-base font-bold text-white">
                Spoken English Fluency Graduate
              </h4>
            </div>
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-stone-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold block">MINUTES</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {totalMinutes}m
              </span>
            </div>
            <div className="bg-stone-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold block">SPEED</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {avgWpm}
              </span>
            </div>
            <div className="bg-stone-800/80 p-2.5 rounded-xl">
              <span className="text-[10px] text-stone-400 font-bold block">DAYS</span>
              <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                60/60
              </span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 italic">
            "The journey of a thousand miles begins with a single step." — Lao Tzu
          </p>
        </div>

        {/* Share & Download Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleCopyCard}
            className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Share Completion Card'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
          >
            Keep Exploring Past Days & Notebook
          </button>
        </div>
      </div>
    </div>
  );
};
