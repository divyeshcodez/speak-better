import React, { useState, useEffect, useRef } from 'react';
import { DailyQuote, getSpokenLines } from '../data/quotes';
import { getBracketForDay } from '../utils/streakCalendar';
import { countFillerWords, calculateWpm, countWords } from '../utils/speechMetrics';
import { useSpeechRecognition } from '../utils/useSpeechRecognition';
import { useAudioRecorder } from '../utils/useAudioRecorder';
import {
  Square,
  Eye,
  EyeOff,
  AlertCircle,
  Volume2,
  Mic,
  Video,
  VideoOff,
  Clock,
  Sparkles,
  Camera,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LiveSpeakingScreenProps {
  quote: DailyQuote;
  dayNumber: number;
  initialVideoMode?: boolean;
  onFinishSpeaking: (result: {
    transcript: string;
    durationSeconds: number;
    wpm: number;
    fillerCount: number;
    fillerBreakdown: Record<string, number>;
    longPauses: number;
    audioBlob: Blob | null;
    videoBlob?: Blob | null;
    isVideo?: boolean;
  }) => void;
  onCancel: () => void;
}

export const LiveSpeakingScreen: React.FC<LiveSpeakingScreenProps> = ({
  quote,
  dayNumber,
  initialVideoMode = false,
  onFinishSpeaking,
  onCancel,
}) => {
  const bracketInfo = getBracketForDay(dayNumber);
  const targetSeconds = bracketInfo.targetSeconds;
  const spokenLines = getSpokenLines(quote);

  const [isVideoMode, setIsVideoMode] = useState(initialVideoMode);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showCues, setShowCues] = useState(bracketInfo.cueMode === 'visible');
  const [showScript, setShowScript] = useState(true); // default open so user has lines ready to speak!
  const [activeTeleprompterLine, setActiveTeleprompterLine] = useState(0);
  const [longPauses, setLongPauses] = useState(0);
  const [manualText, setManualText] = useState('');
  const [useManualMode, setUseManualMode] = useState(false);

  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);

  // Web Speech API
  const {
    isSupported: speechSupported,
    transcript,
    interimTranscript,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  // Media Recorder for both Audio & Video recording
  const {
    isRecording,
    mediaBlob,
    videoStream,
    isVideo,
    error: mediaError,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  const timerRef = useRef<any>(null);
  const lastSpokenTimeRef = useRef<number>(Date.now());
  const activeTranscript = useManualMode ? manualText : (transcript + ' ' + interimTranscript).trim();

  // Metrics
  const fillerAnalysis = countFillerWords(activeTranscript);
  const totalWords = countWords(activeTranscript);
  const liveWpm = calculateWpm(totalWords, secondsElapsed);

  // Initialize recording on mount
  useEffect(() => {
    async function init() {
      if (speechSupported) {
        startListening();
      }
      await startRecording(isVideoMode);
      lastSpokenTimeRef.current = Date.now();
    }

    init();

    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => {
        const next = prev + 1;
        const now = Date.now();
        if (now - lastSpokenTimeRef.current > 5000) {
          setLongPauses((p) => p + 1);
          lastSpokenTimeRef.current = now;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopListening();
      stopRecording();
    };
  }, [isVideoMode]);

  // Attach live camera stream to video preview element
  useEffect(() => {
    if (cameraVideoRef.current && videoStream) {
      cameraVideoRef.current.srcObject = videoStream;
    }
  }, [videoStream, isVideoMode]);

  // Update last spoken marker
  useEffect(() => {
    if (transcript || interimTranscript) {
      lastSpokenTimeRef.current = Date.now();
    }
  }, [transcript, interimTranscript]);

  const handleStop = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopListening();
    const recordedBlob = await stopRecording();

    const finalTranscript = activeTranscript.trim() || spokenLines.slice(0, 5).join(' ');
    const finalWords = countWords(finalTranscript);
    const finalWpm = calculateWpm(finalWords, Math.max(1, secondsElapsed));

    onFinishSpeaking({
      transcript: finalTranscript,
      durationSeconds: Math.max(1, secondsElapsed),
      wpm: finalWpm,
      fillerCount: fillerAnalysis.total,
      fillerBreakdown: fillerAnalysis.breakdown,
      longPauses,
      audioBlob: recordedBlob,
      videoBlob: isVideoMode ? recordedBlob : null,
      isVideo: isVideoMode,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, Math.round((secondsElapsed / targetSeconds) * 100));

  return (
    <div className="pb-36 pt-2 px-4 max-w-2xl mx-auto space-y-4">
      {/* Top Header: Cancel, Mode Switcher, Target */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={onCancel}
          className="text-stone-500 hover:text-stone-800 font-medium py-1 px-2 rounded-lg hover:bg-stone-100 min-h-[38px] flex items-center"
          aria-label="Cancel session"
        >
          Cancel
        </button>

        {/* Audio vs Video Mode Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl border border-stone-200/80">
          <button
            onClick={() => setIsVideoMode(false)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
              !isVideoMode ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-label="Switch to audio only mode"
          >
            <Mic className="w-3.5 h-3.5 text-orange-600" />
            <span>Audio</span>
          </button>
          <button
            onClick={() => setIsVideoMode(true)}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
              isVideoMode ? 'bg-orange-600 text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-label="Switch to video reel mode"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Reel Video</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
          <Clock className="w-3 h-3 text-stone-500" />
          <span>{bracketInfo.durationLabel}</span>
        </div>
      </div>

      {/* Video Reel Mode: Live Camera + Teleprompter Overlay */}
      {isVideoMode && (
        <div className="relative rounded-3xl overflow-hidden bg-stone-950 aspect-[9/14] sm:aspect-[9/12] w-full max-w-md mx-auto shadow-2xl border-2 border-stone-800 flex flex-col justify-between">
          {/* Live Camera Stream */}
          <video
            ref={cameraVideoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${videoStream ? 'block' : 'hidden'}`}
          />
          {!videoStream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-stone-900 via-stone-950 to-black">
              <Camera className="w-12 h-12 text-orange-500/80 mb-2 animate-pulse" />
              <p className="text-xs font-semibold text-stone-200">Reel Camera Recording Active</p>
              <p className="text-[11px] text-stone-400 max-w-xs mt-1">
                {mediaError ? 'Microphone audio recording active' : 'Connecting camera preview for Instagram Reel...'}
              </p>
            </div>
          )}

          {/* Top HUD: Recording dot + Timer + Live WPM */}
          <div className="relative z-20 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold font-mono text-white tabular-nums tracking-wide">
                REC {formatTime(secondsElapsed)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-white/90">
              <span className="bg-black/50 px-2 py-0.5 rounded-full border border-white/10 font-mono">
                {liveWpm} WPM
              </span>
              <span className={`px-2 py-0.5 rounded-full border font-mono ${
                fillerAnalysis.total > 0 ? 'bg-amber-500/80 text-white border-amber-400' : 'bg-emerald-500/80 text-white border-emerald-400'
              }`}>
                {fillerAnalysis.total} Fillers
              </span>
            </div>
          </div>

          {/* Teleprompter Overlay on top of Camera */}
          <div className="relative z-20 px-3 py-2 space-y-2">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-white shadow-lg space-y-2 max-h-[220px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Reel Script ({activeTeleprompterLine + 1}/{spokenLines.length})</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTeleprompterLine((p) => Math.max(0, p - 1))}
                    disabled={activeTeleprompterLine === 0}
                    className="p-1 text-white/70 hover:text-white disabled:opacity-30"
                    title="Previous line"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTeleprompterLine((p) => Math.min(spokenLines.length - 1, p + 1))}
                    disabled={activeTeleprompterLine === spokenLines.length - 1}
                    className="p-1 text-white/70 hover:text-white disabled:opacity-30"
                    title="Next line"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active line prominent + next line preview */}
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-bold text-white leading-snug drop-shadow-md">
                  {activeTeleprompterLine + 1}. {spokenLines[activeTeleprompterLine]}
                </p>
                {activeTeleprompterLine < spokenLines.length - 1 && (
                  <p className="text-xs text-white/60 leading-tight">
                    Next: {spokenLines[activeTeleprompterLine + 1]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Live Speech-to-Text Caption Overlay */}
          <div className="relative z-20 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
            <p className="text-xs text-white/90 font-medium italic text-center drop-shadow-sm truncate">
              {transcript || interimTranscript || 'Speak lines looking at the camera...'}
            </p>
          </div>
        </div>
      )}

      {/* Quote Banner (for Audio Mode) */}
      {!isVideoMode && (
        <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-sm space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
            Day {dayNumber} · Expanding Quote
          </p>
          <blockquote className="font-serif text-lg sm:text-xl leading-snug">
            “{quote.quote}”
          </blockquote>
          <p className="text-xs text-stone-400 font-medium">— {quote.author}</p>
        </div>
      )}

      {/* Metrics HUD (Audio Mode) */}
      {!isVideoMode && (
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Speaking Time
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums mt-0.5">
              {formatTime(secondsElapsed)}
            </span>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Speed (WPM)
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums mt-0.5">
              {liveWpm}
            </span>
            <span className="text-[10px] font-medium text-stone-500 mt-1">
              {liveWpm < 100 ? 'Steady' : liveWpm <= 160 ? 'Conversational' : 'Fast pace'}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Filler Words
            </span>
            <span className={`text-xl sm:text-2xl font-bold font-mono tabular-nums mt-0.5 ${fillerAnalysis.total > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {fillerAnalysis.total}
            </span>
            <span className="text-[10px] font-medium text-stone-500 mt-1">
              {fillerAnalysis.total === 0 ? 'Crystal clear' : 'um / like / you know'}
            </span>
          </div>
        </div>
      )}

      {/* Browser Speech API Warning / Manual Fallback */}
      {(!speechSupported || speechError) && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Speech Recognition Status</span>
          </div>
          <p className="leading-relaxed">
            {!speechSupported
              ? "Your browser does not natively support the Web Speech API. We are still recording your microphone and video! You can also type what you said below."
              : speechError}
          </p>
          <button
            onClick={() => setUseManualMode(true)}
            className="px-3 py-1.5 bg-amber-200/70 hover:bg-amber-200 text-amber-950 font-semibold rounded-lg transition-colors"
          >
            Enable Text / Simulation Mode
          </button>
        </div>
      )}

      {/* 10-15 Line Script Helper Card (Read & Speak) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              10–15 Line Spoken Script
            </h3>
          </div>
          <button
            onClick={() => setShowScript(!showScript)}
            className="text-xs font-bold text-orange-700 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200/60 transition-colors flex items-center gap-1 min-h-[36px]"
            aria-label={showScript ? "Hide 10-15 line script" : "Show 10-15 line script"}
          >
            {showScript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showScript ? "Hide Script" : "Show 10-15 Lines"}</span>
          </button>
        </div>

        {showScript ? (
          <div className="space-y-2 pt-1 max-h-[220px] overflow-y-auto bg-stone-50 p-3 rounded-xl border border-stone-200/70">
            <p className="text-[11px] font-semibold text-stone-500 mb-1">
              Read these simple lines out loud into the microphone:
            </p>
            {spokenLines.map((line, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 bg-white p-2 rounded-lg border border-stone-200/60 shadow-2xs"
              >
                <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs text-stone-800 font-medium leading-snug">
                  {line}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500">
            Need words to speak? Tap <span className="font-semibold text-orange-700">"Show 10-15 Lines"</span> to read an easy script out loud.
          </p>
        )}
      </div>

      {/* Live Scrolling Transcript Card (Audio Mode) */}
      {!isVideoMode && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-2 min-h-[120px] max-h-[200px] overflow-y-auto">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            <span>Live Speech-to-Text</span>
            <span className="flex items-center gap-1.5 text-orange-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Listening...</span>
            </span>
          </div>

          {useManualMode ? (
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Type your speech expansion here, or speak out loud while your mic records..."
              className="w-full h-24 p-2 text-sm border border-stone-200 rounded-xl focus:outline-orange-500"
            />
          ) : (
            <div className="text-sm text-stone-800 leading-relaxed font-normal">
              {transcript ? (
                <span>
                  {transcript}{' '}
                  <span className="text-stone-400 italic">{interimTranscript}</span>
                </span>
              ) : (
                <span className="text-stone-400 italic">
                  Speak now... Your words will appear here live.
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Finish / Stop Recording Button */}
      <div className="flex flex-col items-center justify-center pt-2 space-y-2">
        <button
          onClick={handleStop}
          className={`w-full max-w-sm h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer min-h-[48px] ${
            isVideoMode
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20 active:scale-[0.98]'
              : 'bg-stone-900 hover:bg-stone-800 text-white shadow-stone-900/15 active:scale-[0.98]'
          }`}
          aria-label={isVideoMode ? "Finish & save video reel" : "Finish speaking and view feedback"}
        >
          <Square className="w-5 h-5 fill-white" />
          <span>{isVideoMode ? 'Finish & Save Video' : 'Finish Speaking'}</span>
        </button>

        <p className="text-xs text-stone-500 text-center">
          {isVideoMode
            ? 'When done, you can watch your video and download it to post on Instagram!'
            : 'Tap when done to view your instant feedback, grammar tips & model answer'}
        </p>
      </div>
    </div>
  );
};
