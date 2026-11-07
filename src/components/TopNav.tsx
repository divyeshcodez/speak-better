import React from 'react';
import { Flame, Bell, Sparkles } from 'lucide-react';

interface TopNavProps {
  currentDay: number;
  streak: number;
  onOpenReminder: () => void;
  onOpenCustomQuote: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentDay,
  streak,
  onOpenReminder,
  onOpenCustomQuote,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
            Q
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-900 leading-none">
              QuoteTalk 60
            </h1>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              Spoken English Fluency
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Custom Quote quick action */}
          <button
            onClick={onOpenCustomQuote}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors min-h-[38px]"
            title="Use your own quote"
            aria-label="Use my own quote"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Own Quote</span>
          </button>

          {/* Daily Streak Indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-800 rounded-xl border border-orange-200/60 min-h-[40px]"
            title={`Current Streak: ${streak} day${streak === 1 ? '' : 's'}`}
            aria-label={`Streak: ${streak} days`}
          >
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-stone-400'}`} />
            <span className="text-xs font-bold tabular-nums">
              {streak} <span className="font-medium text-orange-600/90 text-[11px]">streak</span>
            </span>
          </div>

          {/* Reminder Modal Trigger */}
          <button
            onClick={onOpenReminder}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Set daily practice reminder"
            aria-label="Set daily practice reminder"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
