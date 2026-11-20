import React from 'react';
import { ScanLine, BarChart3, Store } from 'lucide-react';

export default function MerchantBottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'scanner', label: 'Escanear QR', icon: ScanLine },
    { id: 'metrics', label: 'Métricas', icon: BarChart3 },
    { id: 'business', label: 'Mi Local', icon: Store },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E12]/95 backdrop-blur-md border-t border-gold-border/30 max-w-md mx-auto sm:rounded-b-[38px]">
      <div className="flex items-center justify-around py-3 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 cursor-pointer"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-[#F5D77F] bg-[#D4AF37]/20 shadow-gold-glow/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[10px] tracking-wide font-medium transition-colors duration-200 ${
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
