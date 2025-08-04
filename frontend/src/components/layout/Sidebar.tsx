import React from 'react';
import { StatDisplay } from '../ui/StatDisplay';
import { useGameStats } from '../../hooks/useGameStats';

export const Sidebar: React.FC = () => {
  const { stats } = useGameStats();

  return (
    <aside className="w-full lg:w-64 p-4 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 shadow-sm">
      <header className="mb-4 lg:mb-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800">📊 Game Stats</h2>
        <p className="text-xs lg:text-sm text-gray-500 mt-1">Your current progress</p>
      </header>
      
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-2 lg:gap-0">
        {stats.map((stat, index) => (
          <StatDisplay
            key={`${stat.label}-${index}`}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            showChange={stat.showChange}
          />
        ))}
      </div>
      
      <footer className="mt-4 lg:mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Dragon's Den v1.0
        </p>
      </footer>
    </aside>
  );
};