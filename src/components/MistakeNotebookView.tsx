import React, { useState } from 'react';
import { MistakeNotebookItem } from '../db/indexedDb';
import { BookOpen, CheckCircle, Circle, Sparkles, Volume2, ArrowRight } from 'lucide-react';

interface MistakeNotebookViewProps {
  mistakes: MistakeNotebookItem[];
  onToggleMastered: (id: string) => void;
}

export const MistakeNotebookView: React.FC<MistakeNotebookViewProps> = ({
  mistakes,
  onToggleMastered,
}) => {
  const [filter, setFilter] = useState<'all' | 'needs_practice' | 'mastered'>('all');
  const [activeFlashcard, setActiveFlashcard] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const filteredMistakes = mistakes.filter((m) => {
    if (filter === 'needs_practice') return !m.mastered;
    if (filter === 'mastered') return m.mastered;
    return true;
  });

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            <span>Mistake Notebook</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Auto-saved grammar slips from your live speech for rapid revision
          </p>
        </div>

        {/* Quick Flashcard Review Button */}
        {mistakes.length > 0 && (
          <button
            onClick={() => {
              setActiveFlashcard(0);
              setShowAnswer(false);
            }}
            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-semibold rounded-xl border border-orange-200/60 transition-colors flex items-center gap-1 min-h-[38px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Quiz</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] ${
            filter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          All ({mistakes.length})
        </button>
        <button
          onClick={() => setFilter('needs_practice')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] ${
            filter === 'needs_practice' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Practice ({mistakes.filter((m) => !m.mastered).length})
        </button>
        <button
          onClick={() => setFilter('mastered')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] ${
            filter === 'mastered' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Mastered ({mistakes.filter((m) => m.mastered).length})
        </button>
      </div>

      {/* Flashcard Quiz Modal */}
      {activeFlashcard !== null && mistakes[activeFlashcard] && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-400 font-bold uppercase">
              <span>Quick Flashcard ({activeFlashcard + 1}/{mistakes.length})</span>
              <button
                onClick={() => setActiveFlashcard(null)}
                className="text-stone-500 hover:text-stone-900 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-center space-y-3">
              <span className="text-[11px] font-bold text-stone-400 uppercase">How would you say this naturally?</span>
              <p className="text-base font-semibold text-stone-800">
                "{mistakes[activeFlashcard].original}"
              </p>

              {showAnswer ? (
                <div className="pt-3 border-t border-stone-200/80 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      "{mistakes[activeFlashcard].corrected}"
                    </span>
                    <button
                      onClick={() => speakText(mistakes[activeFlashcard].corrected)}
                      className="p-1 text-stone-500 hover:text-stone-800"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-stone-600">
                    {mistakes[activeFlashcard].explanation}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl mt-2"
                >
                  Show Natural Phrasing
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={() => {
                  onToggleMastered(mistakes[activeFlashcard].id);
                  if (activeFlashcard < mistakes.length - 1) {
                    setActiveFlashcard(activeFlashcard + 1);
                    setShowAnswer(false);
                  } else {
                    setActiveFlashcard(null);
                  }
                }}
                className="flex-1 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200"
              >
                Mark Mastered
              </button>
              <button
                onClick={() => {
                  if (activeFlashcard < mistakes.length - 1) {
                    setActiveFlashcard(activeFlashcard + 1);
                    setShowAnswer(false);
                  } else {
                    setActiveFlashcard(null);
                  }
                }}
                className="flex-1 py-2 text-xs font-bold text-stone-800 bg-stone-100 rounded-xl"
              >
                Next Card →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List of Mistakes */}
      {filteredMistakes.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-stone-200/80 space-y-2">
          <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="text-sm font-bold text-stone-800">
            {filter === 'all'
              ? 'No mistakes recorded yet!'
              : filter === 'needs_practice'
              ? 'All caught up! No mistakes needing practice.'
              : 'No mastered mistakes yet.'}
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            As you practice speaking daily quotes, any grammatical slips or word choices will be automatically collected here for friendly review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMistakes.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.mastered
                  ? 'bg-stone-50/70 border-stone-200 opacity-75'
                  : 'bg-white border-stone-200/80 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs font-medium text-stone-500 line-through bg-stone-100 px-1.5 py-0.5 rounded">
                      "{item.original}"
                    </span>
                    <span className="text-xs font-bold text-stone-400">→</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span>"{item.corrected}"</span>
                      <button
                        onClick={() => speakText(item.corrected)}
                        className="text-emerald-700 hover:text-emerald-900 ml-0.5"
                        title="Listen to correct pronunciation"
                        aria-label={`Listen to ${item.corrected}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.explanation}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                    <span>Noticed {item.occurrences} time{item.occurrences === 1 ? '' : 's'}</span>
                    <span aria-hidden="true">·</span>
                    <span>Last seen {item.lastSeenDate}</span>
                  </div>
                </div>

                {/* Mastered toggle */}
                <button
                  onClick={() => onToggleMastered(item.id)}
                  className={`p-2 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
                    item.mastered
                      ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                      : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                  }`}
                  title={item.mastered ? "Mark as needing practice" : "Mark as mastered"}
                  aria-label={item.mastered ? "Mark as needing practice" : "Mark as mastered"}
                >
                  {item.mastered ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
