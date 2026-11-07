import React, { useState, useEffect } from 'react';
import { ALL_60_QUOTES, DailyQuote, getQuoteForDay } from './data/quotes';
import {
  StoredAttempt,
  MistakeNotebookItem,
  SavedWordItem,
  UserProgressData,
  getAllAttempts,
  saveAttempt,
  getMistakes,
  toggleMistakeMastered,
  getAllWords,
  getUserProgress,
  saveUserProgress,
} from './db/indexedDb';
import { calculateStreak, formatDayDate, getBracketForDay } from './utils/streakCalendar';
import { evaluateClarityRubric, detectCommonGrammarErrors } from './utils/speechMetrics';

import { TopNav } from './components/TopNav';
import { BottomTabs, TabId } from './components/BottomTabs';
import { HomeScreen } from './components/HomeScreen';
import { LiveSpeakingScreen } from './components/LiveSpeakingScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { ModelAnswerModal } from './components/ModelAnswerModal';
import { CalendarJourneyView } from './components/CalendarJourneyView';
import { MistakeNotebookView } from './components/MistakeNotebookView';
import { WordListView } from './components/WordListView';
import { WeeklyReportAndCompareView } from './components/WeeklyReportAndCompareView';
import { CustomQuoteModal } from './components/CustomQuoteModal';
import { DailyReminderModal } from './components/DailyReminderModal';
import { Day60CelebrationModal } from './components/Day60CelebrationModal';

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [activeScreen, setActiveScreen] = useState<'home' | 'speaking' | 'feedback'>('home');

  // User Progress & DB State
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState('08:30');
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // Entities
  const [attempts, setAttempts] = useState<StoredAttempt[]>([]);
  const [mistakes, setMistakes] = useState<MistakeNotebookItem[]>([]);
  const [words, setWords] = useState<SavedWordItem[]>([]);

  // Current active quote
  const [activeQuote, setActiveQuote] = useState<DailyQuote>(getQuoteForDay(1));

  // Speaking session configuration
  const [initialSpeakingMode, setInitialSpeakingMode] = useState<'audio' | 'video'>('video');

  // Current session results & feedback
  const [speechResult, setSpeechResult] = useState<{
    transcript: string;
    durationSeconds: number;
    wpm: number;
    fillerCount: number;
    fillerBreakdown: Record<string, number>;
    longPauses: number;
    audioBlob: Blob | null;
    videoBlob?: Blob | null;
    isVideo?: boolean;
  } | null>(null);

  const [feedbackData, setFeedbackData] = useState<{
    clarityScore: number;
    meaningExplained: boolean;
    reasonExplained: boolean;
    exampleGiven: boolean;
    positivePoint: string;
    improvementPoint: string;
    grammarMistakes: Array<{ original: string; corrected: string; explanation: string }>;
    isLoading?: boolean;
  }>({
    clarityScore: 75,
    meaningExplained: true,
    reasonExplained: true,
    exampleGiven: true,
    positivePoint: 'Great job speaking out loud with confidence!',
    improvementPoint: 'Keep expanding on personal examples.',
    grammarMistakes: [],
  });

  // Modals
  const [isModelAnswerOpen, setIsModelAnswerOpen] = useState(false);
  const [isCustomQuoteOpen, setIsCustomQuoteOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isDay60CelebrationOpen, setIsDay60CelebrationOpen] = useState(false);

  // Load from IndexedDB on mount
  useEffect(() => {
    async function initData() {
      try {
        const progress = await getUserProgress();
        setCurrentDay(progress.currentDay || 1);
        setCompletedDays(progress.completedDays || []);
        setCompletedDates(progress.completedDates || []);
        setReminderTime(progress.reminderTime || '08:30');
        setReminderEnabled(progress.reminderEnabled ?? false);

        setActiveQuote(getQuoteForDay(progress.currentDay || 1));

        const allAtt = await getAllAttempts();
        setAttempts(allAtt);

        const allMistakes = await getMistakes();
        setMistakes(allMistakes);

        const allWords = await getAllWords();
        setWords(allWords);
      } catch (err) {
        console.warn('DB initialization note:', err);
      }
    }

    initData();
  }, []);

  const refreshDBEntities = async () => {
    try {
      const allAtt = await getAllAttempts();
      setAttempts(allAtt);
      const allMistakes = await getMistakes();
      setMistakes(allMistakes);
      const allWords = await getAllWords();
      setWords(allWords);
    } catch (_) {}
  };

  // Streak calculations
  const todayStr = formatDayDate(new Date());
  const streakState = calculateStreak(completedDates, todayStr);

  // Handlers
  const handleStartSpeaking = (mode: 'audio' | 'video' = 'audio') => {
    setInitialSpeakingMode(mode);
    setActiveScreen('speaking');
  };

  const handleStartVideoReel = () => {
    setInitialSpeakingMode('video');
    setActiveScreen('speaking');
  };

  const handleFinishSpeaking = async (result: {
    transcript: string;
    durationSeconds: number;
    wpm: number;
    fillerCount: number;
    fillerBreakdown: Record<string, number>;
    longPauses: number;
    audioBlob: Blob | null;
    videoBlob?: Blob | null;
    isVideo?: boolean;
  }) => {
    setSpeechResult(result);
    setActiveScreen('feedback');

    // Immediate local pre-evaluation
    const localRubric = evaluateClarityRubric(result.transcript);
    const localGrammar = detectCommonGrammarErrors(result.transcript);
    const bracket = getBracketForDay(activeQuote.day);

    setFeedbackData({
      clarityScore: localRubric.score,
      meaningExplained: localRubric.hasMeaning,
      reasonExplained: localRubric.hasReason,
      exampleGiven: localRubric.hasExample,
      positivePoint:
        result.wpm >= 110 && result.wpm <= 160
          ? 'You maintained a very natural, conversational speaking rhythm throughout!'
          : 'You spoke with courage and completed the time challenge!',
      improvementPoint:
        result.fillerCount > 4
          ? 'Notice when you pause—take a breath instead of saying "um" or "like".'
          : 'Try to anchor your points with a personal story for maximum clarity.',
      grammarMistakes: localGrammar,
      isLoading: true,
    });

    // Call server-side Gemini API endpoint
    try {
      const resp = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote: activeQuote.quote,
          author: activeQuote.author,
          transcript: result.transcript,
          durationSeconds: result.durationSeconds,
          wpm: result.wpm,
          fillerCount: result.fillerCount,
          phaseLabel: bracket.name,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setFeedbackData({
          clarityScore: data.clarityScore ?? localRubric.score,
          meaningExplained: data.meaningExplained ?? localRubric.hasMeaning,
          reasonExplained: data.reasonExplained ?? localRubric.hasReason,
          exampleGiven: data.exampleGiven ?? localRubric.hasExample,
          positivePoint: data.positivePoint,
          improvementPoint: data.improvementPoint,
          grammarMistakes: data.grammarMistakes || localGrammar,
          isLoading: false,
        });
      }
    } catch (apiErr) {
      console.warn('API feedback error, relying on local heuristic:', apiErr);
      setFeedbackData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleMarkDayComplete = async () => {
    if (!speechResult) return;

    const todayDate = formatDayDate(new Date());
    const dayNum = activeQuote.day || currentDay;

    // Save attempt to IndexedDB
    const attemptId = `attempt-${dayNum}-${Date.now()}`;
    const storedAttempt: StoredAttempt = {
      id: attemptId,
      day: dayNum,
      dateStr: todayDate,
      quote: activeQuote.quote,
      author: activeQuote.author,
      transcript: speechResult.transcript,
      audioBlob: speechResult.audioBlob,
      videoBlob: speechResult.videoBlob,
      isVideo: speechResult.isVideo,
      durationSeconds: speechResult.durationSeconds,
      wpm: speechResult.wpm,
      fillerCount: speechResult.fillerCount,
      fillerBreakdown: speechResult.fillerBreakdown,
      longPauses: speechResult.longPauses,
      clarityScore: feedbackData.clarityScore,
      positivePoint: feedbackData.positivePoint,
      improvementPoint: feedbackData.improvementPoint,
      grammarMistakes: feedbackData.grammarMistakes,
      timestamp: Date.now(),
      isCustomQuote: activeQuote.day === 0,
    };

    await saveAttempt(storedAttempt);

    // Update completedDays and dates
    const newCompletedDays = Array.from(new Set([...completedDays, dayNum]));
    const newCompletedDates = Array.from(new Set([...completedDates, todayDate]));

    // Advance day if on regular progression
    let nextDay = currentDay;
    if (dayNum === currentDay && currentDay < 60) {
      nextDay = currentDay + 1;
    }

    const updatedProgress: UserProgressData = {
      id: 'singleton',
      currentDay: nextDay,
      completedDays: newCompletedDays,
      completedDates: newCompletedDates,
      reminderTime,
      reminderEnabled,
    };

    await saveUserProgress(updatedProgress);
    setCurrentDay(nextDay);
    setCompletedDays(newCompletedDays);
    setCompletedDates(newCompletedDates);

    await refreshDBEntities();

    // Check Day 60 completion celebration
    if (dayNum === 60) {
      setIsDay60CelebrationOpen(true);
    }

    // Return to home screen with next day quote
    setActiveQuote(getQuoteForDay(nextDay));
    setActiveScreen('home');
    setSpeechResult(null);
  };

  const handleTryAgain = () => {
    setActiveScreen('speaking');
  };

  const handleSelectDayToPractice = (dayNum: number) => {
    setActiveQuote(getQuoteForDay(dayNum));
    setActiveTab('today');
    setActiveScreen('home');
  };

  const handleUseCustomQuote = (customQuote: DailyQuote) => {
    setActiveQuote(customQuote);
    setActiveTab('today');
    setActiveScreen('home');
  };

  const handleSaveReminder = async (time: string, enabled: boolean) => {
    setReminderTime(time);
    setReminderEnabled(enabled);
    await saveUserProgress({
      id: 'singleton',
      currentDay,
      completedDays,
      completedDates,
      reminderTime: time,
      reminderEnabled: enabled,
    });
  };

  const handleToggleMistake = async (id: string) => {
    await toggleMistakeMastered(id);
    const updated = await getMistakes();
    setMistakes(updated);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-between">
      {/* Top Bar */}
      <TopNav
        currentDay={currentDay}
        streak={streakState.currentStreak}
        onOpenReminder={() => setIsReminderOpen(true)}
        onOpenCustomQuote={() => setIsCustomQuoteOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto">
        {activeTab === 'today' && (
          <>
            {activeScreen === 'home' && (
              <HomeScreen
                quote={activeQuote}
                dayNumber={activeQuote.day || currentDay}
                isCompletedToday={completedDays.includes(activeQuote.day || currentDay)}
                onStartSpeaking={() => handleStartSpeaking('audio')}
                onStartVideoReel={handleStartVideoReel}
                onOpenCustomQuote={() => setIsCustomQuoteOpen(true)}
                onOpenModelAnswer={() => setIsModelAnswerOpen(true)}
                onNavigateToDay={handleSelectDayToPractice}
              />
            )}

            {activeScreen === 'speaking' && (
              <LiveSpeakingScreen
                quote={activeQuote}
                dayNumber={activeQuote.day || currentDay}
                initialVideoMode={initialSpeakingMode === 'video'}
                onFinishSpeaking={handleFinishSpeaking}
                onCancel={() => setActiveScreen('home')}
              />
            )}

            {activeScreen === 'feedback' && speechResult && (
              <FeedbackScreen
                quote={activeQuote}
                dayNumber={activeQuote.day || currentDay}
                speechResult={speechResult}
                feedbackData={feedbackData}
                onTryAgain={handleTryAgain}
                onMarkDayComplete={handleMarkDayComplete}
                onShowModelAnswer={() => setIsModelAnswerOpen(true)}
              />
            )}
          </>
        )}

        {activeTab === 'journey' && (
          <CalendarJourneyView
            currentDay={currentDay}
            completedDayNumbers={completedDays}
            streak={streakState.currentStreak}
            longestStreak={streakState.longestStreak}
            missedYesterday={streakState.missedYesterday}
            attempts={attempts}
            onSelectDayToPractice={handleSelectDayToPractice}
          />
        )}

        {activeTab === 'notebook' && (
          <MistakeNotebookView
            mistakes={mistakes}
            onToggleMastered={handleToggleMistake}
          />
        )}

        {activeTab === 'vocab' && (
          <WordListView
            words={words}
            onWordUpdated={refreshDBEntities}
          />
        )}

        {activeTab === 'stats' && (
          <WeeklyReportAndCompareView
            attempts={attempts}
            onStartReRecordDay1={() => handleSelectDayToPractice(1)}
            onOpenDay60Celebration={() => setIsDay60CelebrationOpen(true)}
          />
        )}
      </main>

      {/* Bottom Tabs */}
      <BottomTabs
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'today' && activeScreen === 'speaking') {
            // Keep speaking if already in session
          } else if (tab === 'today' && !speechResult) {
            setActiveScreen('home');
          }
        }}
        mistakesCount={mistakes.filter((m) => !m.mastered).length}
        wordsCount={words.length}
      />

      {/* Modals */}
      <ModelAnswerModal
        quote={activeQuote}
        dayNumber={activeQuote.day || currentDay}
        isOpen={isModelAnswerOpen}
        onClose={() => setIsModelAnswerOpen(false)}
        onTryAgain={() => {
          setIsModelAnswerOpen(false);
          setActiveScreen('speaking');
        }}
        onWordSaved={refreshDBEntities}
      />

      <CustomQuoteModal
        isOpen={isCustomQuoteOpen}
        onClose={() => setIsCustomQuoteOpen(false)}
        onUseQuote={handleUseCustomQuote}
        onStartDirectRecording={(customQuote, mode) => {
          setActiveQuote(customQuote);
          setInitialSpeakingMode(mode);
          setActiveTab('today');
          setActiveScreen('speaking');
        }}
      />

      <DailyReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        reminderTime={reminderTime}
        reminderEnabled={reminderEnabled}
        onSaveReminder={handleSaveReminder}
      />

      <Day60CelebrationModal
        isOpen={isDay60CelebrationOpen}
        onClose={() => setIsDay60CelebrationOpen(false)}
        totalMinutes={Math.round(attempts.reduce((acc, a) => acc + a.durationSeconds, 0) / 60)}
        avgWpm={
          attempts.length > 0
            ? Math.round(attempts.reduce((acc, a) => acc + a.wpm, 0) / attempts.length)
            : 120
        }
        totalAttempts={attempts.length}
      />
    </div>
  );
}
