import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countFillerWords,
  calculateWpm,
  evaluateClarityRubric,
  detectCommonGrammarErrors,
} from './speechMetrics';

test('countFillerWords accurately counts single and multi-word fillers', () => {
  const sample = "Um, so like, I think, you know, this quote means a lot. Actually, it is sort of true.";
  const result = countFillerWords(sample);

  assert.ok(result.total >= 5, `Expected at least 5 fillers, got ${result.total}`);
  assert.equal(result.breakdown['um'], 1);
  assert.equal(result.breakdown['like'], 1);
  assert.equal(result.breakdown['you know'], 1);
  assert.equal(result.breakdown['actually'], 1);
  assert.equal(result.breakdown['sort of'], 1);
});

test('calculateWpm returns correct Words Per Minute', () => {
  // 120 words in 60 seconds = 120 WPM
  assert.equal(calculateWpm(120, 60), 120);
  // 60 words in 30 seconds = 120 WPM
  assert.equal(calculateWpm(60, 30), 120);
  // 0 words or <= 3s should be 0
  assert.equal(calculateWpm(10, 2), 0);
  assert.equal(calculateWpm(0, 45), 0);
});

test('evaluateClarityRubric evaluates meaning, reason, and example', () => {
  const completeSpeech = `
    What this quote means to me is that failure is not the opposite of success, but part of it.
    This is true because when we fail, we learn what doesn't work and adapt our strategy.
    For example, in my own life when I tried to learn how to swim, I sank many times before I succeeded.
  `;
  const result = evaluateClarityRubric(completeSpeech);
  assert.equal(result.hasMeaning, true);
  assert.equal(result.hasReason, true);
  assert.equal(result.hasExample, true);
  assert.ok(result.score >= 80, `Expected score >= 80, got ${result.score}`);
});

test('detectCommonGrammarErrors catches common spoken English patterns', () => {
  const text = "He don't know the answer, and according to me it is more better.";
  const errors = detectCommonGrammarErrors(text);
  assert.ok(errors.length >= 2, `Expected at least 2 errors, found ${errors.length}`);
  const hasDont = errors.some((e) => e.original.toLowerCase().includes("he don't"));
  const hasBetter = errors.some((e) => e.original.toLowerCase().includes("more better"));
  assert.ok(hasDont, 'Should detect "he don\'t" error');
  assert.ok(hasBetter, 'Should detect "more better" error');
});

test('getSpokenLines produces between 10 and 15 simple lines to speak aloud', async () => {
  const { getQuoteForDay, getSpokenLines } = await import('../data/quotes');
  const day1 = getQuoteForDay(1);
  const lines1 = getSpokenLines(day1);

  assert.ok(lines1.length >= 10 && lines1.length <= 15, `Expected 10-15 lines, got ${lines1.length}`);
  assert.ok(lines1[0].includes("Today's quote says"));

  const day15 = getQuoteForDay(15);
  const lines15 = getSpokenLines(day15);
  assert.ok(lines15.length >= 10 && lines15.length <= 15, `Expected 10-15 lines, got ${lines15.length}`);
});
