/**
 * Pure streak, calendar progression, and weekly statistics logic.
 */

export interface DayAttemptSummary {
  day: number;
  dateStr: string; // YYYY-MM-DD
  durationSeconds: number;
  fillerCount: number;
  wpm: number;
  clarityScore: number;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  totalCompletedDays: number;
  missedYesterday: boolean;
  canContinueWithoutReset: boolean;
}

export function formatDayDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateStreak(
  completedDates: string[], // List of unique YYYY-MM-DD strings sorted or unsorted
  todayStr: string
): StreakState {
  if (!completedDates || completedDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletedDays: 0,
      missedYesterday: false,
      canContinueWithoutReset: true,
    };
  }

  // Deduplicate and sort descending
  const uniqueDates = Array.from(new Set(completedDates)).sort().reverse();
  const totalCompletedDays = uniqueDates.length;

  // Check if today is completed
  const hasCompletedToday = uniqueDates.includes(todayStr);

  // Determine yesterday's date
  const today = new Date(todayStr + 'T00:00:00');
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDayDate(yesterday);

  const hasCompletedYesterday = uniqueDates.includes(yesterdayStr);

  let currentStreak = 0;
  let checkDate = hasCompletedToday ? today : yesterday;

  // If didn't complete today or yesterday, streak has lapsed (or missed a day)
  const missedYesterday = !hasCompletedToday && !hasCompletedYesterday;

  if (hasCompletedToday || hasCompletedYesterday) {
    // Walk back day by day
    const cursor = new Date(checkDate);
    while (true) {
      const cStr = formatDayDate(cursor);
      if (uniqueDates.includes(cStr)) {
        currentStreak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  const sortedAsc = Array.from(new Set(completedDates)).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedAsc) {
    const curDate = new Date(dStr + 'T00:00:00');
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diff = Math.round((curDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        tempStreak++;
      } else if (diff === 0) {
        // same day, ignore
      } else {
        tempStreak = 1;
      }
    }
    prevDate = curDate;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    totalCompletedDays,
    missedYesterday,
    canContinueWithoutReset: true, // Gentle policy: user can always continue
  };
}

export type DayBracket = 1 | 2 | 3 | 4;

export interface BracketInfo {
  bracket: DayBracket;
  name: string;
  targetSeconds: number;
  durationLabel: string;
  cueMode: 'visible' | 'hidden_by_default' | 'opinion_depth' | 'speech_structure';
  instruction: string;
}

export function getBracketForDay(day: number): BracketInfo {
  if (day <= 15) {
    return {
      bracket: 1,
      name: 'Phase 1: Foundations',
      targetSeconds: 60,
      durationLabel: '1 minute',
      cueMode: 'visible',
      instruction: 'Simple quotes, no pressure. Follow the 3 gentle prompt cues.',
    };
  }
  if (day <= 30) {
    return {
      bracket: 2,
      name: 'Phase 2: Stamina Building',
      targetSeconds: 120,
      durationLabel: '2 minutes',
      cueMode: 'hidden_by_default',
      instruction: 'Speak freely for 2 minutes without relying on prompt cues.',
    };
  }
  if (day <= 45) {
    return {
      bracket: 3,
      name: 'Phase 3: Perspective & Depth',
      targetSeconds: 180,
      durationLabel: '3 minutes',
      cueMode: 'opinion_depth',
      instruction: 'Go deeper into your own opinions and philosophical viewpoints.',
    };
  }
  return {
    bracket: 4,
    name: 'Phase 4: Mini Speeches',
    targetSeconds: 240, // 3-5 minutes (target 4)
    durationLabel: '3 to 5 minutes',
    cueMode: 'speech_structure',
    instruction: 'Deliver a structured mini-speech: strong opening, two main points, and a powerful closing line.',
  };
}

export interface WeeklyReportStats {
  totalMinutesSpoken: number;
  totalAttempts: number;
  avgWpm: number;
  avgClarity: number;
  avgFillersPerMin: number;
  fillerReductionPct: number;
  speedTrend: 'steady' | 'accelerating' | 'conversational';
  daysActiveThisWeek: number;
}

export function calculateWeeklyReport(attempts: DayAttemptSummary[]): WeeklyReportStats {
  if (!attempts || attempts.length === 0) {
    return {
      totalMinutesSpoken: 0,
      totalAttempts: 0,
      avgWpm: 0,
      avgClarity: 0,
      avgFillersPerMin: 0,
      fillerReductionPct: 0,
      speedTrend: 'conversational',
      daysActiveThisWeek: 0,
    };
  }

  // Filter last 7 attempts or attempts within last 7 days
  const recent = attempts.slice(-7);
  let totalSec = 0;
  let totalWpm = 0;
  let totalClarity = 0;
  let totalFillers = 0;
  const daysSet = new Set<string>();

  for (const a of recent) {
    totalSec += a.durationSeconds;
    totalWpm += a.wpm;
    totalClarity += a.clarityScore;
    totalFillers += a.fillerCount;
    if (a.dateStr) daysSet.add(a.dateStr);
  }

  const count = recent.length;
  const totalMin = Math.round((totalSec / 60) * 10) / 10;
  const avgWpm = Math.round(totalWpm / count);
  const avgClarity = Math.round(totalClarity / count);
  const avgFillersPerMin = totalMin > 0 ? Math.round((totalFillers / totalMin) * 10) / 10 : 0;

  // Compare first half of recent to second half to see filler reduction
  let fillerReductionPct = 0;
  if (recent.length >= 4) {
    const half = Math.floor(recent.length / 2);
    const firstHalfFillers = recent.slice(0, half).reduce((acc, x) => acc + x.fillerCount, 0) / half;
    const secondHalfFillers = recent.slice(half).reduce((acc, x) => acc + x.fillerCount, 0) / (recent.length - half);
    if (firstHalfFillers > 0) {
      fillerReductionPct = Math.round(((firstHalfFillers - secondHalfFillers) / firstHalfFillers) * 100);
    }
  }

  let speedTrend: 'steady' | 'accelerating' | 'conversational' = 'conversational';
  if (avgWpm > 140) speedTrend = 'accelerating';
  else if (avgWpm < 100) speedTrend = 'steady';

  return {
    totalMinutesSpoken: totalMin,
    totalAttempts: count,
    avgWpm,
    avgClarity,
    avgFillersPerMin,
    fillerReductionPct: Math.max(0, fillerReductionPct),
    speedTrend,
    daysActiveThisWeek: daysSet.size || count,
  };
}
