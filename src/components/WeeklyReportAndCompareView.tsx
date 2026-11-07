import React, { useState } from 'react';
import { StoredAttempt } from '../db/indexedDb';
import { calculateWeeklyReport, DayAttemptSummary } from '../utils/streakCalendar';
import { BarChart3, TrendingUp, Sparkles, Volume2, Award, Play, Pause, Flame } from 'lucide-react';

interface WeeklyReportAndCompareViewProps {
  attempts: StoredAttempt[];
  onStartReRecordDay1: () => void;
  onOpenDay60Celebration?: () => void;
}

export const WeeklyReportAndCompareView: React.FC<WeeklyReportAndCompareViewProps> = ({
  attempts,
  onStartReRecordDay1,
  onOpenDay60Celebration,
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'compare'>('report');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const attemptSummaries: DayAttemptSummary[] = attempts.map((a) => ({
    day: a.day,
    dateStr: a.dateStr,
    durationSeconds: a.durationSeconds,
    fillerCount: a.fillerCount,
    wpm: a.wpm,
    clarityScore: a.clarityScore,
  }));

  const weeklyStats = calculateWeeklyReport(attemptSummaries);

  // Day 1 vs Day 60 attempts lookup
  const day1Attempt = attempts.find((a) => a.day === 1);
  const day60Attempt = attempts.find((a) => a.day === 60);

  const handleToggleAudio = (id: string, blob: Blob | null) => {
    if (!blob) return;
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => setPlayingAudioId(null);
      audio.play();
    }
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-2xl mx-auto space-y-6">
      {/* Top Header & Segmented Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <span>Progress & Milestones</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Track your weekly speaking evolution & compare Day 1 vs Day 60
          </p>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
            activeTab === 'report' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Weekly Report
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
            activeTab === 'compare' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Day 1 vs Day 60 Comparison
        </button>
      </div>

      {activeTab === 'report' ? (
        <div className="space-y-4">
          {/* Top 4 KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Minutes Spoken */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Spoken This Week
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                  {weeklyStats.totalMinutesSpoken}
                </span>
                <span className="text-xs text-stone-500">mins</span>
              </div>
              <p className="text-[10px] text-stone-400">
                {weeklyStats.daysActiveThisWeek} active session{weeklyStats.daysActiveThisWeek === 1 ? '' : 's'}
              </p>
            </div>

            {/* Speaking Speed */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Avg Speed
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                  {weeklyStats.avgWpm}
                </span>
                <span className="text-xs text-stone-500">wpm</span>
              </div>
              <p className="text-[10px] text-stone-400">
                {weeklyStats.speedTrend === 'accelerating' ? 'Confident pace' : 'Conversational rhythm'}
              </p>
            </div>

            {/* Clarity Score */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Avg Clarity
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-orange-600 tabular-nums">
                  {weeklyStats.avgClarity}
                </span>
                <span className="text-xs text-stone-400">/100</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Based on prompt rubric
              </p>
            </div>

            {/* Filler Reduction */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Filler Rate
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
                  {weeklyStats.avgFillersPerMin}
                </span>
                <span className="text-xs text-stone-500">/min</span>
              </div>
              <p className="text-[10px] text-stone-400">
                {weeklyStats.fillerReductionPct > 0 ? `-${weeklyStats.fillerReductionPct}% trend` : 'Steady reduction'}
              </p>
            </div>
          </div>

          {/* Visual Activity Chart (Last 7 Sessions) */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                Recent Speaking Sessions Duration
              </h3>
              <span className="text-xs text-stone-500 font-medium">Last 7 sessions</span>
            </div>

            {attempts.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">
                Complete your first speaking session to see your weekly performance graph!
              </p>
            ) : (
              <div className="flex items-end justify-between gap-2 h-32 pt-4 px-2">
                {attempts.slice(-7).map((att, idx) => {
                  const maxSec = Math.max(...attempts.slice(-7).map((a) => a.durationSeconds), 60);
                  const heightPercent = Math.min(100, Math.max(15, Math.round((att.durationSeconds / maxSec) * 100)));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-stone-600 tabular-nums">
                        {att.durationSeconds}s
                      </span>
                      <div
                        className="w-full max-w-[36px] bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-lg transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] font-medium text-stone-400 truncate">
                        D{att.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Weekly Summary Highlights */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/70 space-y-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Coach's Weekly Observation</span>
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {weeklyStats.totalMinutesSpoken >= 5
                ? `You have logged ${weeklyStats.totalMinutesSpoken} minutes of live English speaking this week! Your vocal stamina is clearly increasing, and your conversational pace (${weeklyStats.avgWpm} WPM) is becoming second nature.`
                : 'Every minute spoken counts. Speaking out loud live daily creates vocal muscle memory that reading alone can never build.'}
            </p>
          </div>
        </div>
      ) : (
        /* Day 1 vs Day 60 Comparison View */
        <div className="space-y-5">
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200/80 space-y-1 text-center sm:text-left">
            <h3 className="text-xs font-bold text-orange-950 uppercase tracking-wide">
              Day 1 vs Day 60 Transformation
            </h3>
            <p className="text-xs text-orange-900/90 leading-relaxed">
              On Day 60, Lao Tzu's quote returns: "The journey of a thousand miles begins with a single step." Re-record your expansion of this quote and witness how much your fluency, speed, and confidence have transformed!
            </p>
          </div>

          {/* Comparison Cards: Day 1 vs Day 60 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Day 1 Column */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500 uppercase">
                  Day 1 · First Step
                </span>
                <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                  {day1Attempt ? 'Completed' : 'Not recorded yet'}
                </span>
              </div>

              {day1Attempt ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-stone-50 p-2 rounded-xl">
                      <span className="text-[10px] text-stone-400 font-bold block">DURATION</span>
                      <span className="text-sm font-bold font-mono text-stone-900">{day1Attempt.durationSeconds}s</span>
                    </div>
                    <div className="bg-stone-50 p-2 rounded-xl">
                      <span className="text-[10px] text-stone-400 font-bold block">SPEED</span>
                      <span className="text-sm font-bold font-mono text-stone-900">{day1Attempt.wpm} wpm</span>
                    </div>
                    <div className="bg-stone-50 p-2 rounded-xl">
                      <span className="text-[10px] text-stone-400 font-bold block">FILLERS</span>
                      <span className="text-sm font-bold font-mono text-stone-900">{day1Attempt.fillerCount}</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 italic">
                    "{day1Attempt.transcript}"
                  </div>

                  {day1Attempt.audioBlob && (
                    <button
                      onClick={() => handleToggleAudio('day1', day1Attempt.audioBlob)}
                      className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {playingAudioId === 'day1' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{playingAudioId === 'day1' ? 'Pause Day 1' : 'Play Day 1 Voice'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <p className="text-xs text-stone-500">
                    Day 1 recording not found. Re-record Day 1 anytime to benchmark your voice!
                  </p>
                  <button
                    onClick={onStartReRecordDay1}
                    className="px-3 py-1.5 bg-stone-900 text-white text-xs font-bold rounded-xl"
                  >
                    Record Day 1 Baseline
                  </button>
                </div>
              )}
            </div>

            {/* Day 60 Column */}
            <div className="bg-white rounded-3xl p-5 border-2 border-orange-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                <span className="text-xs font-bold text-orange-600 uppercase">
                  Day 60 · Fluency Milestone
                </span>
                <span className="text-xs font-semibold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                  {day60Attempt ? 'Completed!' : 'Challenge Milestone'}
                </span>
              </div>

              {day60Attempt ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-orange-50/70 p-2 rounded-xl">
                      <span className="text-[10px] text-orange-500 font-bold block">DURATION</span>
                      <span className="text-sm font-bold font-mono text-stone-900">{day60Attempt.durationSeconds}s</span>
                    </div>
                    <div className="bg-orange-50/70 p-2 rounded-xl">
                      <span className="text-[10px] text-orange-500 font-bold block">SPEED</span>
                      <span className="text-sm font-bold font-mono text-stone-900">{day60Attempt.wpm} wpm</span>
                    </div>
                    <div className="bg-orange-50/70 p-2 rounded-xl">
                      <span className="text-[10px] text-orange-500 font-bold block">FILLERS</span>
                      <span className="text-sm font-bold font-mono text-emerald-600">{day60Attempt.fillerCount}</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-700 bg-orange-50/50 p-3 rounded-xl border border-orange-100 italic">
                    "{day60Attempt.transcript}"
                  </div>

                  {day60Attempt.audioBlob && (
                    <button
                      onClick={() => handleToggleAudio('day60', day60Attempt.audioBlob)}
                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {playingAudioId === 'day60' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{playingAudioId === 'day60' ? 'Pause Day 60' : 'Play Day 60 Voice'}</span>
                    </button>
                  )}

                  {onOpenDay60Celebration && (
                    <button
                      onClick={onOpenDay60Celebration}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>View Completion Certificate</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <Award className="w-8 h-8 text-orange-400 mx-auto" />
                  <p className="text-xs text-stone-600">
                    Once you reach Day 60, re-record Lao Tzu's quote to unlock your full side-by-side fluency transformation!
                  </p>
                  <button
                    onClick={onStartReRecordDay1}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Test Day 1 Quote Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
