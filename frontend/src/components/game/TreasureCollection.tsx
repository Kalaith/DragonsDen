import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { TreasureCard } from './TreasureCard';

export const TreasureCollection: React.FC = () => {
  const { discoveredTreasures } = useGameStore();

  return (
    <div className="upgrade-card">
      <h2 className="text-xl font-bold mb-4 text-gray-800">💎 Treasure Collection</h2>
      {discoveredTreasures.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No treasures discovered yet...</p>
          <p className="text-sm text-gray-400 mt-2">Explore ruins to find treasures!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {discoveredTreasures.map((treasure, index) => (
            <TreasureCard key={`${treasure.name}-${index}`} treasure={treasure} />
          ))}
        </div>
      )}
    </div>
  );
};