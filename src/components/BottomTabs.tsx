import React from 'react';
import { Mic, Calendar, BookOpen, BookmarkCheck, BarChart3 } from 'lucide-react';

export type TabId = 'today' | 'journey' | 'notebook' | 'vocab' | 'stats';

interface BottomTabsProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  mistakesCount?: number;
  wordsCount?: number;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  onSelectTab,
  mistakesCount = 0,
  wordsCount = 0,
}) => {
  const tabs = [
    { id: 'today' as TabId, label: 'Today', icon: Mic },
    { id: 'journey' as TabId, label: '60 Days', icon: Calendar },
    { id: 'notebook' as TabId, label: 'Notebook', icon: BookOpen, badge: mistakesCount },
    { id: 'vocab' as TabId, label: 'Words', icon: BookmarkCheck, badge: wordsCount },
    { id: 'stats' as TabId, label: 'Progress', icon: BarChart3 },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Main Navigation"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
                isActive ? 'text-orange-600 font-semibold' : 'text-stone-500 hover:text-stone-900'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[56px]">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-orange-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
