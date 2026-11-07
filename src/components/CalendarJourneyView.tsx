import React, { useState } from 'react';
import { ALL_60_QUOTES, DailyQuote } from '../data/quotes';
import { getBracketForDay } from '../utils/streakCalendar';
import { StoredAttempt } from '../db/indexedDb';
import { Check, Lock, Flame, Calendar as CalendarIcon, Play, X, Clock, HelpCircle } from 'lucide-react';

interface CalendarJourneyViewProps {
  currentDay: number;
  completedDayNumbers: number[];
  streak: number;
  longestStreak: number;
  missedYesterday: boolean;
  attempts: StoredAttempt[];
  onSelectDayToPractice: (day: number) => void;
}

export const CalendarJourneyView: React.FC<CalendarJourneyViewProps> = ({
  currentDay,
  completedDayNumbers,
  streak,
  longestStreak,
  missedYesterday,
  attempts,
  onSelectDayToPractice,
}) => {
  const [selectedPastDay, setSelectedPastDay] = useState<{ quote: DailyQuote; attempt?: StoredAttempt } | null>(null);

  const completedSet = new Set(completedDayNumbers);

  const handleDayClick = (dayNum: number) => {
    const isCompleted = completedSet.has(dayNum);
    const isToday = dayNum === currentDay;
    const isPastOrCurrent = dayNum <= currentDay || isCompleted;

    if (!isPastOrCurrent) return; // Future locked

    if (isCompleted) {
      const pastAttempt = attempts.find((a) => a.day === dayNum);
      const q = ALL_60_QUOTES[dayNum - 1];
      setSelectedPastDay({ quote: q, attempt: pastAttempt });
    } else {
      onSelectDayToPractice(dayNum);
    }
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-2xl mx-auto space-y-6">
      {/* Streak & Progression Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <Flame className="w-7 h-7 fill-orange-500" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                  {streak}
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  day streak
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Longest: {longestStreak} days · {completedDayNumbers.length}/60 completed
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-stone-800 bg-stone-100 px-3 py-1.5 rounded-xl">
              Day {currentDay} of 60
            </span>
          </div>
        </div>

        {/* Progress bar towards Day 60 */}
        <div className="space-y-1">
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.round((completedDayNumbers.length / 60) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 font-medium">
            <span>Day 1: Start</span>
            <span>Day 30: Midpoint</span>
            <span>Day 60: Fluency</span>
          </div>
        </div>
      </div>

      {/* Gentle "Missed a Day?" Banner */}
      {missedYesterday && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-1">
          <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-amber-600" />
            <span>Missed a day? No worries at all!</span>
          </p>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            Spoken fluency is built on lifelong consistency, not perfection. Your progress is saved. Continue speaking today to keep your momentum strong!
          </p>
        </div>
      )}

      {/* 4 Phases Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {[1, 2, 3, 4].map((p) => {
          const info = getBracketForDay(p === 1 ? 1 : p === 2 ? 16 : p === 3 ? 31 : 46);
          const isCurrentPhase = getBracketForDay(currentDay).bracket === p;
          return (
            <div
              key={p}
              className={`p-3 rounded-2xl border transition-colors ${
                isCurrentPhase
                  ? 'bg-orange-50/70 border-orange-300 text-orange-950'
                  : 'bg-white border-stone-200/80 text-stone-600'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                <span>Phase {p}</span>
                <span className="font-mono text-[10px] opacity-80">{info.durationLabel}</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-tight">
                {p === 1 && 'Days 1-15: 1 min cues'}
                {p === 2 && 'Days 16-30: 2 min stamina'}
                {p === 3 && 'Days 31-45: 3 min depth'}
                {p === 4 && 'Days 46-60: 3-5 min speeches'}
              </p>
            </div>
          );
        })}
      </div>

      {/* 60-Day Visual Calendar Grid */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">
            60-Day Challenge Map
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Done
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Today
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300" /> Locked
            </span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 sm:gap-2.5 pt-1">
          {Array.from({ length: 60 }, (_, i) => i + 1).map((dayNum) => {
            const isCompleted = completedSet.has(dayNum);
            const isToday = dayNum === currentDay;
            const isLocked = dayNum > currentDay && !isCompleted;

            let btnStyle = 'bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed';
            if (isCompleted) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-xs hover:bg-emerald-600 cursor-pointer';
            } else if (isToday) {
              btnStyle = 'bg-orange-500 text-white border-orange-600 ring-2 ring-orange-300 font-bold shadow-sm hover:bg-orange-600 cursor-pointer animate-pulse';
            } else if (dayNum < currentDay) {
              // Missed / uncompleted past day: can still practice!
              btnStyle = 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50 cursor-pointer';
            }

            return (
              <button
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                disabled={isLocked}
                className={`h-11 sm:h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${btnStyle}`}
                title={`Day ${dayNum}${isCompleted ? ' (Completed)' : isToday ? ' (Today)' : isLocked ? ' (Locked)' : ''}`}
                aria-label={`Day ${dayNum}`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : isLocked ? (
                  <Lock className="w-3.5 h-3.5 opacity-60" />
                ) : (
                  <span className="text-xs font-mono font-bold tabular-nums">
                    {dayNum}
                  </span>
                )}
                <span className="text-[9px] font-medium opacity-80 leading-none mt-0.5">
                  D{dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Past Day Review Drawer / Modal */}
      {selectedPastDay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                Day {selectedPastDay.quote.day} Review
              </span>
              <button
                onClick={() => setSelectedPastDay(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
                aria-label="Close past day details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <blockquote className="font-serif text-lg text-stone-900 leading-snug">
                “{selectedPastDay.quote.quote}”
              </blockquote>
              <p className="text-xs text-stone-500">— {selectedPastDay.quote.author}</p>
            </div>

            {selectedPastDay.attempt ? (
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-xl border border-stone-200/60">
                    <span className="text-[10px] text-stone-400 font-bold block">DURATION</span>
                    <span className="text-sm font-bold font-mono text-stone-900">{selectedPastDay.attempt.durationSeconds}s</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-stone-200/60">
                    <span className="text-[10px] text-stone-400 font-bold block">WPM</span>
                    <span className="text-sm font-bold font-mono text-stone-900">{selectedPastDay.attempt.wpm}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-stone-200/60">
                    <span className="text-[10px] text-stone-400 font-bold block">CLARITY</span>
                    <span className="text-sm font-bold font-mono text-orange-600">{selectedPastDay.attempt.clarityScore}</span>
                  </div>
                </div>

                {selectedPastDay.attempt.transcript && (
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">Your Speech:</span>
                    <p className="text-xs text-stone-700 leading-relaxed italic bg-white p-3 rounded-xl border border-stone-200/60">
                      "{selectedPastDay.attempt.transcript}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-stone-500">
                You marked this day complete. Practice it again anytime!
              </p>
            )}

            <button
              onClick={() => {
                const d = selectedPastDay.quote.day;
                setSelectedPastDay(null);
                onSelectDayToPractice(d);
              }}
              className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Practice Day {selectedPastDay.quote.day} Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
