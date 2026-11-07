import React, { useState, useEffect, useRef } from 'react';
import { DailyQuote } from '../data/quotes';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Volume2,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  Download,
  Video,
} from 'lucide-react';

interface FeedbackScreenProps {
  quote: DailyQuote;
  dayNumber: number;
  speechResult: {
    transcript: string;
    durationSeconds: number;
    wpm: number;
    fillerCount: number;
    fillerBreakdown: Record<string, number>;
    longPauses: number;
    audioBlob: Blob | null;
    videoBlob?: Blob | null;
    isVideo?: boolean;
  };
  feedbackData: {
    clarityScore: number;
    meaningExplained: boolean;
    reasonExplained: boolean;
    exampleGiven: boolean;
    positivePoint: string;
    improvementPoint: string;
    grammarMistakes: Array<{ original: string; corrected: string; explanation: string }>;
    isLoading?: boolean;
  };
  onTryAgain: () => void;
  onMarkDayComplete: () => void;
  onShowModelAnswer: () => void;
}

export const FeedbackScreen: React.FC<FeedbackScreenProps> = ({
  quote,
  dayNumber,
  speechResult,
  feedbackData,
  onTryAgain,
  onMarkDayComplete,
  onShowModelAnswer,
}) => {
  // Media playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const blobToPlay = speechResult.videoBlob || speechResult.audioBlob;
    if (blobToPlay) {
      const url = URL.createObjectURL(blobToPlay);
      setMediaUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [speechResult.audioBlob, speechResult.videoBlob]);

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleDownloadVideo = () => {
    const blob = speechResult.videoBlob || speechResult.audioBlob;
    if (!blob || !mediaUrl) return;

    const isVid = speechResult.isVideo || blob.type.startsWith('video');
    const ext = blob.type.includes('mp4') ? 'mp4' : isVid ? 'webm' : 'webm';
    const filename = `QuoteTalk_Reel_Day${dayNumber}_${Date.now()}.${ext}`;

    const a = document.createElement('a');
    a.href = mediaUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="pb-36 pt-2 px-4 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Day {dayNumber} Feedback
        </span>
        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
          {speechResult.isVideo ? 'Your Reel Video is Ready!' : 'Great Speaking Session!'}
        </h2>
        <p className="text-xs text-stone-500">
          {speechResult.isVideo
            ? 'Watch your recorded video below, download it for Instagram Reels, or review metrics.'
            : 'Here is your warm performance breakdown and ways to shine next time.'}
        </p>
      </div>

      {/* Video Reel Player (if video was recorded) */}
      {speechResult.isVideo && mediaUrl ? (
        <div className="bg-stone-950 rounded-3xl p-4 shadow-xl border border-stone-800 space-y-3">
          <div className="relative rounded-2xl overflow-hidden aspect-[9/13] sm:aspect-video bg-black max-w-sm mx-auto shadow-inner">
            <video
              src={mediaUrl}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 max-w-sm mx-auto">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Video className="w-4 h-4 text-orange-500" />
                <span>Instagram Reel Video</span>
              </p>
              <p className="text-[11px] text-stone-400">
                Duration: {formatSeconds(speechResult.durationSeconds)} · {speechResult.wpm} WPM
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownloadVideo}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 min-h-[42px]"
                aria-label="Download video for Instagram"
              >
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Audio Playback Bar */
        mediaUrl && (
          <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAudioPlay}
                className="w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
                aria-label={isPlayingAudio ? "Pause recording" : "Play recording"}
              >
                {isPlayingAudio ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>
              <div>
                <p className="text-xs font-bold text-stone-100">
                  Listen to Your Speech
                </p>
                <p className="text-[11px] text-stone-400">
                  Duration: {formatSeconds(speechResult.durationSeconds)}
                </p>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={mediaUrl}
              onEnded={() => setIsPlayingAudio(false)}
              className="hidden"
            />

            <button
              onClick={handleDownloadVideo}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
              title="Download recording"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        )
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Clarity Score */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Clarity Score
          </span>
          <div className="my-1">
            <span className="text-2xl font-bold font-mono text-orange-600 tabular-nums">
              {feedbackData.clarityScore}
            </span>
            <span className="text-xs text-stone-400 font-medium">/100</span>
          </div>
          <span className="text-[11px] font-medium text-stone-600">
            {feedbackData.clarityScore >= 80 ? 'Excellent clarity' : feedbackData.clarityScore >= 60 ? 'Clear & steady' : 'Good first try'}
          </span>
        </div>

        {/* Speed (WPM) */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Speed (WPM)
          </span>
          <div className="my-1">
            <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {speechResult.wpm}
            </span>
            <span className="text-xs text-stone-400 font-medium"> wpm</span>
          </div>
          <span className="text-[11px] font-medium text-stone-600">
            {speechResult.wpm >= 110 && speechResult.wpm <= 160
              ? 'Conversational'
              : speechResult.wpm < 110
              ? 'Calm & Steady'
              : 'Fast-paced'}
          </span>
        </div>

        {/* Filler Words */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Fillers
          </span>
          <div className="my-1">
            <span className={`text-2xl font-bold font-mono tabular-nums ${speechResult.fillerCount > 4 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {speechResult.fillerCount}
            </span>
            <span className="text-xs text-stone-400 font-medium"> words</span>
          </div>
          <span className="text-[11px] font-medium text-stone-600 truncate">
            {speechResult.fillerCount === 0 ? 'No fillers!' : 'um / like / etc.'}
          </span>
        </div>

        {/* Long Pauses */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Long Pauses
          </span>
          <div className="my-1">
            <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {speechResult.longPauses}
            </span>
            <span className="text-xs text-stone-400 font-medium"> (&gt;5s)</span>
          </div>
          <span className="text-[11px] font-medium text-stone-600">
            {speechResult.longPauses === 0 ? 'Smooth flow' : 'Thinking time'}
          </span>
        </div>
      </div>

      {/* Explanation Rubric Checklist */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/70 space-y-3">
        <span className="text-xs font-bold text-stone-900 uppercase tracking-wide block">
          Explanation Elements
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="bg-white p-3 rounded-xl border border-stone-200/60 flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 shrink-0 ${feedbackData.meaningExplained ? 'text-emerald-600' : 'text-stone-300'}`}
            />
            <span className={`text-xs font-medium ${feedbackData.meaningExplained ? 'text-stone-800' : 'text-stone-500'}`}>
              Explained Meaning
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-stone-200/60 flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 shrink-0 ${feedbackData.reasonExplained ? 'text-emerald-600' : 'text-stone-300'}`}
            />
            <span className={`text-xs font-medium ${feedbackData.reasonExplained ? 'text-stone-800' : 'text-stone-500'}`}>
              Explained Reason Why
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-stone-200/60 flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 shrink-0 ${feedbackData.exampleGiven ? 'text-emerald-600' : 'text-stone-300'}`}
            />
            <span className={`text-xs font-medium ${feedbackData.exampleGiven ? 'text-stone-800' : 'text-stone-500'}`}>
              Gave Real Example
            </span>
          </div>
        </div>
      </div>

      {/* Coach's Warm Highlight: 1 Positive + 1 To Improve */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        {/* Positive Point */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              What Went Well
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {feedbackData.positivePoint}
            </p>
          </div>
        </div>

        <div className="h-px bg-stone-100" />

        {/* Improvement Point */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wide">
              One Thing to Improve
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {feedbackData.improvementPoint}
            </p>
          </div>
        </div>
      </div>

      {/* Grammar Corrections: "You said → Better way to say it" */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-orange-600" />
            <span>Grammar & Natural Phrasing</span>
          </h3>
          <span className="text-[11px] text-stone-500">
            {feedbackData.grammarMistakes.length === 0 ? 'Natural speech!' : `${feedbackData.grammarMistakes.length} tip${feedbackData.grammarMistakes.length > 1 ? 's' : ''}`}
          </span>
        </div>

        {feedbackData.grammarMistakes.length === 0 ? (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
            Your spoken sentences sounded clear and natural. No major grammar slips were detected!
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {feedbackData.grammarMistakes.map((mistake, idx) => (
              <div
                key={idx}
                className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60 space-y-1.5"
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs text-stone-400 font-medium">You said:</span>
                  <span className="text-xs font-medium text-stone-700 line-through bg-stone-200/60 px-1.5 py-0.5 rounded">
                    "{mistake.original}"
                  </span>
                  <span className="text-xs font-bold text-stone-400">→</span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                    "{mistake.corrected}"
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {mistake.explanation}
                </p>
              </div>
            ))}
            <p className="text-[11px] text-stone-400 italic">
              These have been automatically saved to your Mistake Notebook for quick revision.
            </p>
          </div>
        )}
      </div>

      {/* Transcript Review Accordion */}
      <details className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs text-xs group">
        <summary className="font-semibold text-stone-800 cursor-pointer flex items-center justify-between">
          <span>View Full Spoken Transcript</span>
          <span className="text-stone-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p className="mt-3 text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
          "{speechResult.transcript}"
        </p>
      </details>

      {/* Show Model Answer Button */}
      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200/70 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-orange-950">
            Hear how a native speaker would expand it
          </p>
          <p className="text-xs text-orange-800/80">
            Listen to the model answer, learn vocabulary, and retry
          </p>
        </div>
        <button
          onClick={onShowModelAnswer}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 min-h-[42px]"
          aria-label="Show model answer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Model Answer</span>
        </button>
      </div>

      {/* Action Buttons: Try Again & Mark Day Complete */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onTryAgain}
          className="h-12 rounded-xl bg-white border border-stone-300 text-stone-800 font-semibold text-xs sm:text-sm hover:bg-stone-50 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
          aria-label="Retry this quote"
        >
          <RotateCcw className="w-4 h-4 text-stone-500" />
          <span>Try Again</span>
        </button>

        <button
          onClick={onMarkDayComplete}
          className="h-12 rounded-xl bg-stone-900 text-white font-bold text-xs sm:text-sm hover:bg-stone-800 active:scale-[0.98] shadow-md transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
          aria-label="Mark Day Complete"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Mark Day Complete</span>
        </button>
      </div>
    </div>
  );
};
