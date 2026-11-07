import React, { useState } from 'react';
import { SavedWordItem, saveWord, deleteWord } from '../db/indexedDb';
import { BookmarkCheck, Volume2, Plus, Trash2, Search, X } from 'lucide-react';

interface WordListViewProps {
  words: SavedWordItem[];
  onWordUpdated: () => void;
}

export const WordListView: React.FC<WordListViewProps> = ({ words, onWordUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');

  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    await saveWord({
      id: newWord.toLowerCase().trim(),
      word: newWord.trim(),
      meaning: newMeaning.trim(),
      example: newExample.trim() || `I used the word "${newWord.trim()}" in my speech today.`,
      addedDate: new Date().toISOString().split('T')[0],
    });

    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setShowAddModal(false);
    onWordUpdated();
  };

  const handleDelete = async (id: string) => {
    await deleteWord(id);
    onWordUpdated();
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-orange-600" />
            <span>Personal Word List</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Vocabulary gathered from model answers and your own discoveries
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 shadow-xs min-h-[38px]"
          aria-label="Add new word"
        >
          <Plus className="w-4 h-4" />
          <span>Add Word</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search saved vocabulary..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200/80 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-xs"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Add Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">Add New Word</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWord} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Word</label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Articulate"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Meaning</label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="e.g. Able to speak clearly and coherently"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Example Sentence</label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="e.g. She gave an articulate speech about her ideas."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-orange-500 resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs"
                >
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Words Grid / List */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-stone-200/80 space-y-2">
          <BookmarkCheck className="w-8 h-8 text-stone-300 mx-auto" />
          <h3 className="text-sm font-bold text-stone-800">
            {searchTerm ? 'No matching words found' : 'No saved words yet!'}
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            When reviewing model answers, tap the save button to build your personalized spoken vocabulary list here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredWords.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-2 hover:border-orange-200 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-stone-900 capitalize">
                      {item.word}
                    </span>
                    <button
                      onClick={() => speakText(item.word)}
                      className="p-1 text-stone-400 hover:text-stone-800 transition-colors"
                      title="Listen to pronunciation"
                      aria-label={`Pronounce ${item.word}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-600 rounded-lg transition-colors"
                    title="Remove word"
                    aria-label={`Delete ${item.word}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {item.meaning}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-1">
                <p className="text-[11px] text-stone-500 italic">
                  "{item.example}"
                </p>
                {item.dayFrom && (
                  <span className="text-[10px] text-stone-400 font-medium">
                    Added from Day {item.dayFrom}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
