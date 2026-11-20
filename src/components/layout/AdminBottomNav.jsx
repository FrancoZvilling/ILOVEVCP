import React from 'react';
import { BarChart3, Inbox, Store, MapPin, Calendar } from 'lucide-react';

export default function AdminBottomNav({ activeTab, onTabChange, pendingCount = 0 }) {
  const tabs = [
    { id: 'metrics', label: 'Auditoría', icon: BarChart3 },
    { id: 'moderation', label: 'Pendientes', icon: Inbox, badge: pendingCount },
    { id: 'businesses', label: 'Locales', icon: Store },
    { id: 'localities', label: 'Zonas', icon: MapPin },
    { id: 'events', label: 'Eventos', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E12]/95 backdrop-blur-md border-t border-gold-border/30 max-w-md mx-auto sm:rounded-b-[38px]">
      <div className="flex items-center justify-around py-2.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 cursor-pointer"
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-[#F5D77F] bg-[#D4AF37]/20 shadow-gold-glow/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-[#0B0B0E] text-[9px] font-black flex items-center justify-center border border-[#0E0E12]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] sm:text-[10px] tracking-wide font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#F5D77F] font-semibold' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
