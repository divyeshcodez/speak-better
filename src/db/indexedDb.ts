/**
 * IndexedDB wrapper for QuoteTalk 60
 * Stores attempts (with audio blobs), mistake notebook, personal word list, and progress.
 */

export interface StoredAttempt {
  id: string; // e.g. "attempt-day-1-174208000"
  day: number;
  dateStr: string; // YYYY-MM-DD
  quote: string;
  author: string;
  transcript: string;
  audioBlob: Blob | null;
  videoBlob?: Blob | null;
  isVideo?: boolean;
  durationSeconds: number;
  wpm: number;
  fillerCount: number;
  fillerBreakdown: Record<string, number>;
  longPauses: number;
  clarityScore: number;
  positivePoint: string;
  improvementPoint: string;
  grammarMistakes: Array<{ original: string; corrected: string; explanation: string }>;
  timestamp: number;
  isCustomQuote?: boolean;
}

export interface MistakeNotebookItem {
  id: string; // e.g. "err-he-dont"
  original: string;
  corrected: string;
  explanation: string;
  occurrences: number;
  lastSeenDate: string;
  mastered: boolean;
}

export interface SavedWordItem {
  id: string;
  word: string;
  meaning: string;
  example: string;
  addedDate: string;
  dayFrom?: number;
}

export interface UserProgressData {
  id: string; // "singleton"
  currentDay: number;
  completedDays: number[];
  completedDates: string[];
  reminderTime: string; // "08:30"
  reminderEnabled: boolean;
  hasSeenWelcome?: boolean;
}

const DB_NAME = 'QuoteTalk60_DB';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('attempts')) {
        const attemptsStore = db.createObjectStore('attempts', { keyPath: 'id' });
        attemptsStore.createIndex('day', 'day', { unique: false });
        attemptsStore.createIndex('dateStr', 'dateStr', { unique: false });
        attemptsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains('mistakes')) {
        db.createObjectStore('mistakes', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('words')) {
        db.createObjectStore('words', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAttempt(attempt: StoredAttempt): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['attempts', 'mistakes'], 'readwrite');
    const attemptsStore = tx.objectStore('attempts');
    const mistakesStore = tx.objectStore('mistakes');

    attemptsStore.put(attempt);

    // Automatically update mistake notebook
    if (attempt.grammarMistakes && attempt.grammarMistakes.length > 0) {
      for (const m of attempt.grammarMistakes) {
        const mistakeKey = m.original.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
        const getReq = mistakesStore.get(mistakeKey);
        getReq.onsuccess = () => {
          const existing: MistakeNotebookItem = getReq.result;
          if (existing) {
            existing.occurrences += 1;
            existing.lastSeenDate = attempt.dateStr;
            mistakesStore.put(existing);
          } else {
            const newItem: MistakeNotebookItem = {
              id: mistakeKey,
              original: m.original,
              corrected: m.corrected,
              explanation: m.explanation,
              occurrences: 1,
              lastSeenDate: attempt.dateStr,
              mastered: false,
            };
            mistakesStore.put(newItem);
          }
        };
      }
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllAttempts(): Promise<StoredAttempt[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('attempts', 'readonly');
    const store = tx.objectStore('attempts');
    const req = store.getAll();
    req.onsuccess = () => {
      const items: StoredAttempt[] = req.result || [];
      items.sort((a, b) => a.timestamp - b.timestamp);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getAttemptsForDay(day: number): Promise<StoredAttempt[]> {
  const all = await getAllAttempts();
  return all.filter((a) => a.day === day);
}

export async function getMistakes(): Promise<MistakeNotebookItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('mistakes', 'readonly');
    const store = tx.objectStore('mistakes');
    const req = store.getAll();
    req.onsuccess = () => {
      const items: MistakeNotebookItem[] = req.result || [];
      items.sort((a, b) => b.occurrences - a.occurrences);
      resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function toggleMistakeMastered(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('mistakes', 'readwrite');
    const store = tx.objectStore('mistakes');
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const item: MistakeNotebookItem = getReq.result;
      if (item) {
        item.mastered = !item.mastered;
        store.put(item);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveWord(wordItem: SavedWordItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('words', 'readwrite');
    const store = tx.objectStore('words');
    store.put(wordItem);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllWords(): Promise<SavedWordItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('words', 'readonly');
    const store = tx.objectStore('words');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteWord(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('words', 'readwrite');
    const store = tx.objectStore('words');
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getUserProgress(): Promise<UserProgressData> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('progress', 'readonly');
    const store = tx.objectStore('progress');
    const req = store.get('singleton');
    req.onsuccess = () => {
      if (req.result) {
        resolve(req.result);
      } else {
        const defaultData: UserProgressData = {
          id: 'singleton',
          currentDay: 1,
          completedDays: [],
          completedDates: [],
          reminderTime: '08:30',
          reminderEnabled: false,
          hasSeenWelcome: true,
        };
        resolve(defaultData);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveUserProgress(progress: UserProgressData): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('progress', 'readwrite');
    const store = tx.objectStore('progress');
    store.put({ ...progress, id: 'singleton' });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
