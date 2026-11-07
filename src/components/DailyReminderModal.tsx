import React, { useState } from 'react';
import { X, Bell, Check } from 'lucide-react';

interface DailyReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderTime: string;
  reminderEnabled: boolean;
  onSaveReminder: (time: string, enabled: boolean) => void;
}

export const DailyReminderModal: React.FC<DailyReminderModalProps> = ({
  isOpen,
  onClose,
  reminderTime,
  reminderEnabled,
  onSaveReminder,
}) => {
  const [time, setTime] = useState(reminderTime || '08:30');
  const [enabled, setEnabled] = useState(reminderEnabled ?? true);
  const [savedNotification, setSavedNotification] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    // Request notification permission if enabling
    if (enabled && 'Notification' in window && Notification.permission !== 'granted') {
      try {
        await Notification.requestPermission();
      } catch (_) {}
    }

    onSaveReminder(time, enabled);
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-600" />
            <h3 className="text-base font-bold text-stone-900">
              Daily Speaking Reminder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          Set a consistent time each day to step up to the mic for your 60-second quote expansion.
        </p>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-200/70">
            <span className="text-xs font-bold text-stone-800">
              Enable Reminder
            </span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Reminder Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-mono font-bold text-stone-800 focus:outline-orange-500"
            />
          </div>
        </div>

        {savedNotification && (
          <div className="p-2 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-emerald-200">
            <Check className="w-4 h-4" />
            <span>Reminder preference saved!</span>
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold text-stone-600 bg-stone-100 rounded-xl min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors min-h-[44px]"
          >
            Save Reminder
          </button>
        </div>
      </div>
    </div>
  );
};
