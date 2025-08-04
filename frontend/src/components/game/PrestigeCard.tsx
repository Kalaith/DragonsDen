import React from 'react';

interface PrestigeCardProps {
  canPrestige: boolean;
  currentLevel: number;
  nextLevel: number;
  onPrestige: () => void;
}

export const PrestigeCard: React.FC<PrestigeCardProps> = ({
  canPrestige,
  currentLevel,
  nextLevel,
  onPrestige
}) => {
  if (!canPrestige) return null;

  return (
    <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mx-6">
      <div className="text-center text-white mb-3">
        <h3 className="text-lg font-bold">✨ Prestige Available! ✨</h3>
        <p className="text-sm opacity-90">
          Reset your progress for permanent bonuses and prestige level {nextLevel}
        </p>
      </div>
      <button
        onClick={onPrestige}
        className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
      >
        🌟 PRESTIGE NOW 🌟
      </button>
    </div>
  );
};
