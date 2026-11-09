import React from 'react';
import { Home, Map, Tag, User } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'map', label: 'Mapa', icon: Map },
    { id: 'coupons', label: 'Cupones', icon: Tag },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0E12]/95 backdrop-blur-md border-t border-white/5 max-w-md mx-auto sm:rounded-b-[38px]">
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
                    ? 'text-[#F5D77F] bg-[#D4AF37]/15 shadow-gold-glow/20'
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
