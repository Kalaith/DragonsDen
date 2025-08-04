import React from 'react';
import { useGameStore } from '../../stores/gameStore';

const Header: React.FC = () => {
  const { prestigeLevel, achievements } = useGameStore();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-red-900 to-orange-800 text-white shadow-lg">
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <h1 className="text-xl sm:text-2xl font-bold">🐉 Dragon's Den</h1>
        {prestigeLevel > 0 && (
          <div className="flex items-center gap-2 bg-yellow-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
            <span>⭐</span>
            <span>Prestige {prestigeLevel}</span>
          </div>
        )}
      </div>
      
      <nav className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-2">
          <span>🏆</span>
          <span className="text-xs sm:text-sm">{achievements.size} Achievements</span>
        </div>
        
        <div className="flex gap-2 sm:gap-4">
          <button className="text-white hover:text-yellow-300 transition-colors text-sm sm:text-base px-2 py-1 rounded">
            Game
          </button>
          <button className="text-white hover:text-yellow-300 transition-colors text-sm sm:text-base px-2 py-1 rounded">
            Achievements
          </button>
          <button className="text-white hover:text-yellow-300 transition-colors text-sm sm:text-base px-2 py-1 rounded">
            Stats
          </button>
        </div>
      </nav>
    </header>
  );
};

export { Header };
