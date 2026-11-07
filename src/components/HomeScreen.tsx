import React, { useState } from 'react';
import { DailyQuote, getSpokenLines } from '../data/quotes';
import { getBracketForDay } from '../utils/streakCalendar';
import { Mic, Sparkles, HelpCircle, Clock, Award, Video, ChevronDown, ChevronUp, Copy, Check, Volume2 } from 'lucide-react';

interface HomeScreenProps {
  quote: DailyQuote;
  dayNumber: number;
  isCompletedToday: boolean;
  onStartSpeaking: () => void;
  onStartVideoReel?: () => void;
  onOpenCustomQuote: () => void;
  onOpenModelAnswer: () => void;
  onNavigateToDay?: (day: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  quote,
  dayNumber,
  isCompletedToday,
  onStartSpeaking,
  onStartVideoReel,
  onOpenCustomQuote,
  onOpenModelAnswer,
}) => {
  const bracketInfo = getBracketForDay(dayNumber);
  const spokenLines = getSpokenLines(quote);
  const [showScriptPreview, setShowScriptPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLines = () => {
    navigator.clipboard.writeText(spokenLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-36 pt-2 px-4 max-w-2xl mx-auto space-y-6">
      {/* Day & Progression Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900 text-sm">
            Day {dayNumber} of 60
          </span>
          <span aria-hidden="true">·</span>
          <span>{quote.theme}</span>
        </div>
        <div className="flex items-center gap-1.5 text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/50">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold">{bracketInfo.durationLabel}</span>
        </div>
      </div>

      {/* Quote Display Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 relative overflow-hidden">
        {/* Subtle decorative quotation mark */}
        <div
          className="absolute -top-4 -right-2 text-stone-100 font-serif text-9xl select-none pointer-events-none -z-0 opacity-80"
          aria-hidden="true"
        >
          “
        </div>

        <div className="relative z-10 space-y-4">
          <blockquote className="font-serif text-2xl sm:text-3xl text-stone-900 leading-snug tracking-tight">
            “{quote.quote}”
          </blockquote>

          <div className="flex items-center justify-between pt-2">
            <cite className="text-sm font-semibold text-stone-600 not-italic">
              — {quote.author}
            </cite>

            <button
              onClick={onOpenCustomQuote}
              className="text-xs font-semibold text-orange-700 hover:text-orange-900 flex items-center gap-1.5 min-h-[38px] py-1.5 px-3 rounded-xl bg-orange-50/80 hover:bg-orange-100/70 border border-orange-200/60 transition-colors"
              aria-label="Use my own quote"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Use my own quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Action Zone: Video Reel + Live Mic */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-950 rounded-3xl p-6 text-white shadow-xl shadow-stone-900/10 space-y-5">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Instagram Reel & Speech Studio
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Ready to Speak Out Loud?
          </h2>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Expand the quote into simple words. Record a 9:16 selfie video for Instagram Reels with on-screen teleprompter lines!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Main Action: Video Reel for Instagram */}
          <button
            onClick={onStartVideoReel || onStartSpeaking}
            className="group relative flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 active:scale-[0.98] transition-all min-h-[56px] cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="leading-tight flex items-center gap-1.5">
                Record Video Reel
                <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                  Reel
                </span>
              </div>
              <div className="text-[11px] text-orange-100 font-normal opacity-90">
                Selfie camera + 10-15 line script
              </div>
            </div>
          </button>

          {/* Secondary Action: Audio Only Mic */}
          <button
            onClick={onStartSpeaking}
            className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 hover:text-white font-semibold text-sm border border-stone-700/80 active:scale-[0.98] transition-all min-h-[56px] cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-700/80 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-left">
              <div className="leading-tight">Speak Live (Audio)</div>
              <div className="text-[11px] text-stone-400 font-normal">
                Mic + live speech recognition
              </div>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-800">
          <span>✓ Instant video download for Instagram</span>
          <span>✓ WPM & filler word counter</span>
        </div>
      </div>

      {/* 10-15 Lines Spoken Script Preview Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                10–15 Line Speaking Script
              </h3>
              <p className="text-[11px] text-stone-500">
                Simple lines ready to speak aloud for your video reel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyLines}
              className="text-xs text-stone-500 hover:text-stone-800 p-1.5 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1"
              title="Copy script"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setShowScriptPreview(!showScriptPreview)}
              className="text-xs font-semibold text-orange-700 hover:text-orange-900 p-1.5 rounded-lg hover:bg-orange-50 flex items-center gap-1"
            >
              <span className="text-[11px]">{showScriptPreview ? 'Hide' : 'View'}</span>
              {showScriptPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {showScriptPreview ? (
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="bg-stone-50 rounded-xl p-3.5 space-y-1.5 max-h-72 overflow-y-auto text-xs leading-relaxed text-stone-800 divide-y divide-stone-100">
              {spokenLines.map((line, idx) => (
                <div key={idx} className="pt-1.5 first:pt-0 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100/80 text-orange-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="flex-1 font-medium">{line}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={onOpenModelAnswer}
                className="text-xs font-semibold text-orange-700 hover:underline flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Listen with Text-to-Speech & Key Words →
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-600 italic">
            "{spokenLines[0]}" ... ({spokenLines.length} lines total)
          </p>
        )}
      </div>

      {/* Core Task Cue Card */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/70 space-y-3">
        <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
          <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
          <span>Speaking Cue Checklist</span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          While recording your video, touch on these 3 points for maximum clarity:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {quote.cues.map((cue, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-3 border border-stone-200/60 shadow-xs flex items-start gap-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-xs font-medium text-stone-800 leading-tight">
                {cue}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Special Day 60 Milestone Note */}
      {dayNumber === 60 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              Grand Milestone: Day 60 Re-record!
            </h2>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Today you re-record the Day 1 quote! When you finish, you can compare your Day 1 recording with Day 60 side by side.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
