import React, { useState, useEffect } from 'react';
import { DailyQuote, VocabularyItem, getSpokenLines } from '../data/quotes';
import { X, Volume2, VolumeX, BookmarkPlus, Check, RotateCcw, Copy, Play, ListOrdered, AlignLeft, Sparkles } from 'lucide-react';
import { saveWord } from '../db/indexedDb';

interface ModelAnswerModalProps {
  quote: DailyQuote;
  dayNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onTryAgain: () => void;
  onWordSaved?: () => void;
}

export const ModelAnswerModal: React.FC<ModelAnswerModalProps> = ({
  quote,
  dayNumber,
  isOpen,
  onClose,
  onTryAgain,
  onWordSaved,
}) => {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [activeSpeakingLine, setActiveSpeakingLine] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'lines' | 'paragraph'>('lines');
  const [copiedLines, setCopiedLines] = useState(false);
  const [savedWordsMap, setSavedWordsMap] = useState<Record<string, boolean>>({});

  const spokenLines = getSpokenLines(quote);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleListenAll = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      setActiveSpeakingLine(null);
      return;
    }

    const fullText = spokenLines.join(' ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'en-US';
    utterance.rate = 0.92; // deliberate, clear spoken pace
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsPlayingTTS(true);
    utterance.onend = () => {
      setIsPlayingTTS(false);
      setActiveSpeakingLine(null);
    };
    utterance.onerror = () => {
      setIsPlayingTTS(false);
      setActiveSpeakingLine(null);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakSingleLine = (line: string, index: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setActiveSpeakingLine(index);
    setIsPlayingTTS(false);

    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => setActiveSpeakingLine(null);
    utterance.onerror = () => setActiveSpeakingLine(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyLines = () => {
    const text = spokenLines.map((l, i) => `${i + 1}. ${l}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLines(true);
    setTimeout(() => setCopiedLines(false), 2000);
  };

  const handleSaveWord = async (vocab: VocabularyItem) => {
    const id = vocab.word.toLowerCase().trim();
    await saveWord({
      id,
      word: vocab.word,
      meaning: vocab.meaning,
      example: vocab.exampleSentence,
      addedDate: new Date().toISOString().split('T')[0],
      dayFrom: dayNumber,
    });
    setSavedWordsMap((prev) => ({ ...prev, [id]: true }));
    if (onWordSaved) onWordSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h3 className="text-base font-bold text-stone-900">
                10–15 Line Spoken Script
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Simple words, ready to read and speak out loud (Day {dayNumber})
            </p>
          </div>

          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              setIsPlayingTTS(false);
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close model answer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar: Audio Listen All + Copy + View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-orange-50 rounded-2xl border border-orange-200/60">
          <div className="flex items-center gap-2">
            <button
              onClick={handleListenAll}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 min-h-[38px] ${
                isPlayingTTS
                  ? 'bg-stone-900 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
              }`}
              aria-label={isPlayingTTS ? "Stop reading" : "Listen to all lines"}
            >
              {isPlayingTTS ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingTTS ? 'Stop Audio' : 'Listen All'}</span>
            </button>

            <button
              onClick={handleCopyLines}
              className="px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-orange-100/60 border border-orange-200 rounded-xl transition-colors flex items-center gap-1 min-h-[38px]"
              title="Copy all lines to clipboard"
              aria-label="Copy all lines"
            >
              {copiedLines ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copiedLines ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-0.5 bg-orange-100/60 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('lines')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'lines' ? 'bg-white text-orange-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ListOrdered className="w-3 h-3" />
              <span>10-15 Lines</span>
            </button>
            <button
              onClick={() => setViewMode('paragraph')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'paragraph' ? 'bg-white text-orange-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <AlignLeft className="w-3 h-3" />
              <span>Story</span>
            </button>
          </div>
        </div>

        {/* Content View */}
        {viewMode === 'lines' ? (
          <div className="space-y-2 bg-stone-50/80 rounded-2xl p-3.5 sm:p-4 border border-stone-200/80 max-h-[320px] overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Read these {spokenLines.length} simple lines aloud (tap speaker on any line to hear it):
            </p>
            {spokenLines.map((line, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                  activeSpeakingLine === idx
                    ? 'bg-orange-100/70 border-orange-300 shadow-xs'
                    : 'bg-white border-stone-200/70 hover:border-orange-200'
                }`}
              >
                <span className="w-5 h-5 rounded-md bg-stone-100 text-stone-600 text-[11px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-stone-800 leading-snug flex-1 font-normal">
                  {line}
                </p>
                <button
                  onClick={() => handleSpeakSingleLine(line, idx)}
                  className="p-1 text-stone-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors shrink-0"
                  title="Listen to this line"
                  aria-label={`Listen to line ${idx + 1}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/80 max-h-[320px] overflow-y-auto">
            <p className="text-sm text-stone-800 leading-relaxed font-normal whitespace-pre-line">
              {quote.modelAnswer}
            </p>
          </div>
        )}

        {/* Key Vocabulary to Save */}
        {quote.keyVocabulary && quote.keyVocabulary.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              Key Vocabulary (Tap to Save to Word List)
            </h4>
            <div className="space-y-1.5">
              {quote.keyVocabulary.map((vocab, idx) => {
                const id = vocab.word.toLowerCase().trim();
                const isSaved = savedWordsMap[id];
                return (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-xl border border-stone-200/70 flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-stone-900">
                        {vocab.word}
                      </span>
                      <p className="text-xs text-stone-600">
                        {vocab.meaning}
                      </p>
                      <p className="text-[11px] text-stone-400 italic">
                        "{vocab.exampleSentence}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleSaveWord(vocab)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 min-h-[34px] min-w-[34px] flex items-center justify-center ${
                        isSaved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                      title={isSaved ? "Saved to Word List" : "Save to Word List"}
                      aria-label={`Save ${vocab.word} to word list`}
                    >
                      {isSaved ? <Check className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              setIsPlayingTTS(false);
              onClose();
              onTryAgain();
            }}
            className="flex-1 h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Speaking This Script</span>
          </button>
        </div>
      </div>
    </div>
  );
};
