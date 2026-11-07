import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStreak,
  getBracketForDay,
  calculateWeeklyReport,
} from './streakCalendar';

test('calculateStreak correctly increments for consecutive active days', () => {
  const dates = ['2026-11-05', '2026-11-06', '2026-11-07'];
  const streak = calculateStreak(dates, '2026-11-07');
  assert.equal(streak.currentStreak, 3);
  assert.equal(streak.longestStreak, 3);
  assert.equal(streak.missedYesterday, false);
});

test('calculateStreak allows gentle continuation if missed a day', () => {
  const dates = ['2026-11-01', '2026-11-02', '2026-11-05'];
  const streak = calculateStreak(dates, '2026-11-07');
  assert.equal(streak.missedYesterday, true);
  assert.equal(streak.totalCompletedDays, 3);
  assert.equal(streak.canContinueWithoutReset, true);
});

test('getBracketForDay returns the correct progression parameters for all 4 phases', () => {
  const b1 = getBracketForDay(5);
  assert.equal(b1.bracket, 1);
  assert.equal(b1.targetSeconds, 60);

  const b2 = getBracketForDay(20);
  assert.equal(b2.bracket, 2);
  assert.equal(b2.targetSeconds, 120);

  const b3 = getBracketForDay(35);
  assert.equal(b3.bracket, 3);
  assert.equal(b3.targetSeconds, 180);

  const b4 = getBracketForDay(55);
  assert.equal(b4.bracket, 4);
  assert.equal(b4.targetSeconds, 240);
});

test('calculateWeeklyReport aggregates speaking minutes, WPM, and clarity score', () => {
  const attempts = [
    { day: 1, dateStr: '2026-11-01', durationSeconds: 60, fillerCount: 4, wpm: 110, clarityScore: 75 },
    { day: 2, dateStr: '2026-11-02', durationSeconds: 70, fillerCount: 3, wpm: 120, clarityScore: 80 },
    { day: 3, dateStr: '2026-11-03', durationSeconds: 65, fillerCount: 2, wpm: 125, clarityScore: 85 },
  ];

  const report = calculateWeeklyReport(attempts);
  assert.ok(report.totalMinutesSpoken > 3, 'Total minutes should be > 3');
  assert.equal(report.totalAttempts, 3);
  assert.ok(report.avgWpm >= 115, 'Average WPM should be approx 118');
  assert.equal(report.avgClarity, 80);
});
