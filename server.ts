import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { evaluateClarityRubric, detectCommonGrammarErrors } from './src/utils/speechMetrics.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if valid API key is present
const rawApiKey = process.env.GEMINI_API_KEY;
const apiKey = rawApiKey && rawApiKey !== 'MY_GEMINI_API_KEY' && rawApiKey !== 'undefined' ? rawApiKey : null;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const withTimeout = <T>(promise: Promise<T>, ms: number = 5000): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), ms)),
  ]);

/**
 * POST /api/feedback
 * Evaluates spoken expansion of a quote:
 * - Clarity score (meaning, reason, example)
 * - Positive point and one constructive improvement
 * - Grammar mistakes: "You said → Better way to say it"
 */
app.post('/api/feedback', async (req: Request, res: Response) => {
  try {
    const { quote, author, transcript, durationSeconds, wpm, fillerCount, phaseLabel } = req.body;

    if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    // Baseline local calculation
    const rubric = evaluateClarityRubric(transcript);
    const localGrammarErrors = detectCommonGrammarErrors(transcript);

    // If Gemini is available, use gemini-3.8-flash to provide rich, encouraging feedback
    if (ai) {
      try {
        const prompt = `
You are a warm, supportive English speaking coach for an app called QuoteTalk 60.
The user just spoke out loud expanding this quote:
Quote: "${quote}" by ${author}
User's phase: ${phaseLabel || 'Daily Practice'}
Duration: ${durationSeconds || 60}s, WPM: ${wpm || 110}, Filler count: ${fillerCount || 0}

User's spoken transcript:
"${transcript}"

Evaluate this speech constructively and warmly (never harsh in tone):
1. Clarity score (0-100): Did they explain (a) what the quote means, (b) why it's true, and (c) give a real-life example or story?
2. One genuine positive point celebrating something they did well (e.g. good vocabulary, courage, steady pace, clear example).
3. One gentle thing to improve next time (actionable, encouraging, max 2 sentences).
4. Grammar mistakes: identify 0 to 3 real grammar or word-choice errors from the transcript in "You said → Better way to say it" format, with a 1-sentence friendly explanation. If their grammar was natural, return an empty array.
`;

        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: 'You are an encouraging, expert spoken English coach. Always be kind, never harsh, and focus on practical fluency.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  clarityScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
                  meaningExplained: { type: Type.BOOLEAN },
                  reasonExplained: { type: Type.BOOLEAN },
                  exampleGiven: { type: Type.BOOLEAN },
                  positivePoint: { type: Type.STRING, description: 'One warm, specific positive highlight' },
                  improvementPoint: { type: Type.STRING, description: 'One gentle, constructive suggestion' },
                  grammarMistakes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        original: { type: Type.STRING, description: 'Exact phrase spoken' },
                        corrected: { type: Type.STRING, description: 'Natural spoken English equivalent' },
                        explanation: { type: Type.STRING, description: 'Brief friendly reason why' },
                      },
                      required: ['original', 'corrected', 'explanation'],
                    },
                  },
                },
                required: ['clarityScore', 'positivePoint', 'improvementPoint', 'grammarMistakes'],
              },
            },
          }),
          6000
        );

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return res.json({
            clarityScore: parsed.clarityScore ?? rubric.score,
            meaningExplained: parsed.meaningExplained ?? rubric.hasMeaning,
            reasonExplained: parsed.reasonExplained ?? rubric.hasReason,
            exampleGiven: parsed.exampleGiven ?? rubric.hasExample,
            positivePoint: parsed.positivePoint || 'You expressed your thoughts with courage and momentum!',
            improvementPoint: parsed.improvementPoint || 'Try holding your pauses instead of using filler words.',
            grammarMistakes: parsed.grammarMistakes || localGrammarErrors,
            source: 'gemini',
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local rubric:', geminiError);
      }
    }

    // Graceful intelligent fallback
    let positivePoint = 'Great job expressing yourself out loud! Your speaking rhythm shows real momentum.';
    if (wpm >= 110 && wpm <= 160) {
      positivePoint = 'Excellent speaking pace! You maintained a comfortable, conversational rhythm throughout.';
    } else if (rubric.hasExample) {
      positivePoint = 'You shared a relatable example that grounded the quote in real life!';
    }

    let improvementPoint = 'Next time, try organizing your thoughts into: 1) What it means, 2) Why it is true, and 3) An example.';
    if (fillerCount > 5) {
      improvementPoint = 'Notice when you are about to say "um" or "like"—take a brief silent breath instead.';
    } else if (!rubric.hasExample) {
      improvementPoint = 'Try adding a personal story or real-world example to make your explanation vivid.';
    }

    return res.json({
      clarityScore: rubric.score,
      meaningExplained: rubric.hasMeaning,
      reasonExplained: rubric.hasReason,
      exampleGiven: rubric.hasExample,
      positivePoint,
      improvementPoint,
      grammarMistakes: localGrammarErrors,
      source: 'local',
    });
  } catch (error: any) {
    console.error('Error generating feedback:', error);
    return res.status(500).json({ error: 'Failed to process feedback', details: error.message });
  }
});

/**
 * POST /api/model-answer
 * Generates an inspiring, simple-English model expansion of any quote with key vocabulary
 */
app.post('/api/model-answer', async (req: Request, res: Response) => {
  try {
    const { quote, author, dayNumber } = req.body;

    if (!quote || typeof quote !== 'string') {
      return res.status(400).json({ error: 'Quote is required' });
    }

    if (ai) {
      try {
        const prompt = `
Create a simple, spoken-English expansion of this quote in exactly 10 to 15 simple lines so the learner can speak it out loud:
Quote: "${quote}" by ${author || 'Unknown'}
Day number: ${dayNumber || 1} of 60

Requirements:
- Written in 10 to 15 short, clear lines that are easy to pronounce in one breath.
- Use simple, natural everyday English (no complicated jargon).
- Structure of the 10-15 lines:
  Line 1: Introduce the quote simply.
  Lines 2-4: What does it mean in simple words?
  Lines 5-8: Why is it true in our life?
  Lines 9-12: A simple real-life example or personal story.
  Lines 13-15: An encouraging closing thought.
- Return an array of 10 to 15 spokenLines, plus the combined modelAnswer string, and 2 key vocabulary words.
`;

        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: 'You are an encouraging English speech coach providing 10-15 simple spoken lines for out-loud speaking practice.',
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  spokenLines: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Array of 10 to 15 simple spoken lines to read aloud',
                  },
                  modelAnswer: { type: Type.STRING, description: 'All lines joined by newlines' },
                  keyVocabulary: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        word: { type: Type.STRING },
                        meaning: { type: Type.STRING },
                        exampleSentence: { type: Type.STRING },
                      },
                      required: ['word', 'meaning', 'exampleSentence'],
                    },
                  },
                },
                required: ['spokenLines', 'modelAnswer', 'keyVocabulary'],
              },
            },
          }),
          6000
        );

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          const lines = Array.isArray(parsed.spokenLines) && parsed.spokenLines.length > 0
            ? parsed.spokenLines
            : parsed.modelAnswer.split('\n').filter(Boolean);

          return res.json({
            spokenLines: lines,
            modelAnswer: parsed.modelAnswer || lines.join('\n'),
            keyVocabulary: parsed.keyVocabulary || [],
          });
        }
      } catch (geminiError) {
        console.warn('Gemini model-answer generation error:', geminiError);
      }
    }

    // Default 12-line fallback in simple words
    const fallbackLines = [
      `Today's quote says: "${quote}" by ${author || 'a wise author'}.`,
      "What does this really mean in simple words?",
      "It means that every big journey begins with just one small step.",
      "You do not need to finish everything on day one.",
      "You only need the courage to get started.",
      "Why is this idea true in our everyday life?",
      "Because when we delay and wait, fear gets bigger and bigger.",
      "Taking one small action immediately destroys hesitation.",
      "Let me share a simple real-life example.",
      "When I decided to practice speaking English, I felt nervous.",
      "I was worried about making grammar mistakes.",
      "So I decided to speak out loud for just one minute every morning.",
      "That one small daily habit changed my confidence completely.",
      "Remember: consistency matters far more than perfection.",
      "Take your single step today, speak up, and be proud of your voice!",
    ];

    return res.json({
      spokenLines: fallbackLines,
      modelAnswer: fallbackLines.join('\n'),
      keyVocabulary: [
        { word: 'Confidence', meaning: 'A feeling of self-assurance arising from appreciation of your abilities', exampleSentence: 'Speaking out loud builds daily confidence.' },
        { word: 'Consistency', meaning: 'Doing something regularly and repeatedly', exampleSentence: 'Consistency beats occasional intense effort.' },
      ],
    });
  } catch (error: any) {
    console.error('Error generating model answer:', error);
    return res.status(500).json({ error: 'Failed to generate model answer', details: error.message });
  }
});

// Dev vs Prod Vite mounting
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`QuoteTalk 60 server running on port ${PORT} (isProd=${isProd})`);
  });
}

startServer();
