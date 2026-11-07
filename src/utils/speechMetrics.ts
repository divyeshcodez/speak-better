/**
 * Pure speech analysis logic: filler words detection, WPM calculations,
 * clarity rubric evaluation, and grammar heuristics.
 */

export const COMMON_FILLER_WORDS = [
  'um',
  'uh',
  'er',
  'ah',
  'like',
  'you know',
  'i mean',
  'sort of',
  'kind of',
  'actually',
  'basically',
  'literally',
  'right',
];

export interface FillerAnalysis {
  total: number;
  breakdown: Record<string, number>;
  occurrences: Array<{ word: string; index: number }>;
}

export function countFillerWords(transcript: string): FillerAnalysis {
  if (!transcript || !transcript.trim()) {
    return { total: 0, breakdown: {}, occurrences: [] };
  }

  const normalized = transcript.toLowerCase();
  const breakdown: Record<string, number> = {};
  const occurrences: Array<{ word: string; index: number }> = [];
  let total = 0;

  // Check multi-word fillers first (e.g., "you know", "sort of", "kind of", "i mean")
  const multiWordFillers = COMMON_FILLER_WORDS.filter((w) => w.includes(' '));
  const singleWordFillers = COMMON_FILLER_WORDS.filter((w) => !w.includes(' '));

  for (const filler of multiWordFillers) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(normalized)) !== null) {
      breakdown[filler] = (breakdown[filler] || 0) + 1;
      total += 1;
      occurrences.push({ word: filler, index: match.index });
    }
  }

  // Tokenize words for single-word fillers
  // Split by non-word characters
  const words = normalized.split(/\s+/).map((w) => w.replace(/[.,?!;:()[\]"']/g, ''));
  for (const word of words) {
    if (singleWordFillers.includes(word)) {
      breakdown[word] = (breakdown[word] || 0) + 1;
      total += 1;
    }
  }

  return { total, breakdown, occurrences };
}

export function calculateWpm(wordCount: number, durationSeconds: number): number {
  if (durationSeconds <= 3 || wordCount <= 0) return 0;
  const minutes = durationSeconds / 60;
  return Math.round(wordCount / minutes);
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export interface ClarityRubric {
  score: number; // 0-100
  hasMeaning: boolean;
  hasReason: boolean;
  hasExample: boolean;
  feedbackNotes: string[];
}

export function evaluateClarityRubric(transcript: string): ClarityRubric {
  const lower = (transcript || '').toLowerCase();
  const wordCount = countWords(transcript);

  // Markers for Meaning
  const meaningMarkers = [
    'means',
    'meaning',
    'this quote is about',
    'what it says is',
    'in other words',
    'the message is',
    'it tells us',
    'it implies',
    'signifies',
    'refers to',
    'tells that',
    'suggests that',
  ];

  // Markers for Reason
  const reasonMarkers = [
    'because',
    'the reason is',
    'why is it true',
    'why this is true',
    'it is true because',
    'this happens because',
    'since',
    'due to',
    'therefore',
    'causes us to',
    'the reality is',
    'in life, when we',
  ];

  // Markers for Example
  const exampleMarkers = [
    'for example',
    'for instance',
    'like when',
    'an example of this',
    'take the example',
    'in my own life',
    'in real life',
    'one example',
    'let us say',
    'imagine if',
    'such as',
    'personal story',
  ];

  const hasMeaning = meaningMarkers.some((m) => lower.includes(m)) || wordCount >= 30;
  const hasReason = reasonMarkers.some((m) => lower.includes(m)) || (wordCount >= 50 && lower.includes('so'));
  const hasExample = exampleMarkers.some((m) => lower.includes(m)) || (wordCount >= 70 && (lower.includes('when') || lower.includes('time')));

  let score = 30; // base score for speaking
  const feedbackNotes: string[] = [];

  if (hasMeaning) {
    score += 25;
    feedbackNotes.push('Explained the core message of the quote clearly.');
  } else {
    feedbackNotes.push('Try stating directly: "What this quote means to me is..."');
  }

  if (hasReason) {
    score += 25;
    feedbackNotes.push('Provided a solid reason why this idea holds true in life.');
  } else {
    feedbackNotes.push('Try adding a connecting word: "This is true because..."');
  }

  if (hasExample) {
    score += 20;
    feedbackNotes.push('Shared a vivid example or story to bring the idea to life.');
  } else {
    feedbackNotes.push('Try grounding your explanation: "For example, in everyday life..."');
  }

  if (wordCount < 20) {
    score = Math.min(score, 45);
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    hasMeaning,
    hasReason,
    hasExample,
    feedbackNotes,
  };
}

export interface GrammarItem {
  original: string;
  corrected: string;
  explanation: string;
}

/**
 * Fast client-side grammar heuristic patterns to detect common spoken English mistakes
 * when offline or as an immediate pre-analysis before LLM response.
 */
export function detectCommonGrammarErrors(text: string): GrammarItem[] {
  if (!text) return [];
  const errors: GrammarItem[] = [];
  const lower = text.toLowerCase();

  const rules: Array<{
    regex: RegExp;
    getOriginal: (match: RegExpExecArray) => string;
    corrected: string;
    explanation: string;
  }> = [
    {
      regex: /\b(he|she|it)\s+(don't|dont)\b/i,
      getOriginal: (m) => m[0],
      corrected: '$1 doesn\'t',
      explanation: 'Use "doesn\'t" with third-person singular subjects (he, she, it).',
    },
    {
      regex: /\b(i|we|they|you)\s+(doesn't|doesnt)\b/i,
      getOriginal: (m) => m[0],
      corrected: '$1 don\'t',
      explanation: 'Use "don\'t" with I, we, they, or you.',
    },
    {
      regex: /\b(more\s+better)\b/i,
      getOriginal: (m) => m[0],
      corrected: 'much better',
      explanation: '"Better" is already comparative. Use "much better" or simply "better".',
    },
    {
      regex: /\b(more\s+easier)\b/i,
      getOriginal: (m) => m[0],
      corrected: 'much easier',
      explanation: '"Easier" is already comparative. Say "much easier".',
    },
    {
      regex: /\b(did\s+(went|saw|spoke|ate|took|did))\b/i,
      getOriginal: (m) => m[0],
      corrected: 'did + base verb (e.g. did go, did see)',
      explanation: 'After auxiliary "did", use the base form of the verb (e.g. "did go", not "did went").',
    },
    {
      regex: /\b(explain\s+about)\b/i,
      getOriginal: (m) => m[0],
      corrected: 'explain',
      explanation: '"Explain" is a transitive verb that directly takes an object (say "explain the quote", not "explain about").',
    },
    {
      regex: /\b(discuss\s+about)\b/i,
      getOriginal: (m) => m[0],
      corrected: 'discuss',
      explanation: 'Say "discuss the topic", not "discuss about the topic".',
    },
    {
      regex: /\b(every\s+people)\b/i,
      getOriginal: (m) => m[0],
      corrected: 'every person / everyone',
      explanation: '"Every" takes a singular noun. Say "every person" or "everyone".',
    },
    {
      regex: /\b(according\s+to\s+me)\b/i,
      getOriginal: (m) => m[0],
      corrected: 'in my opinion / from my perspective',
      explanation: 'Native speakers say "in my opinion" rather than "according to me" when expressing personal thoughts.',
    },
    {
      regex: /\b(one\s+of\s+my\s+friend)\b/i,
      getOriginal: (m) => m[0],
      corrected: 'one of my friends',
      explanation: 'Use plural nouns after "one of my" (e.g. "one of my friends").',
    },
  ];

  for (const rule of rules) {
    const match = rule.regex.exec(text);
    if (match) {
      const orig = rule.getOriginal(match);
      let correctedStr = rule.corrected;
      if (rule.corrected.includes('$1')) {
        correctedStr = rule.corrected.replace('$1', match[1]);
      }
      errors.push({
        original: orig,
        corrected: correctedStr,
        explanation: rule.explanation,
      });
    }
  }

  return errors;
}
