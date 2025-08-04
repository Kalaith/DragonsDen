import React from 'react';

interface UpgradeItemProps {
  id: string;
  name: string;
  description: string;
  effect: string;
  currentLevel: number;
  cost: number;
  canAfford: boolean;
  onPurchase: (id: string) => void;
  formatNumber: (num: number) => string;
}

export const UpgradeItem: React.FC<UpgradeItemProps> = ({
  id,
  name,
  description,
  effect,
  currentLevel,
  cost,
  canAfford,
  onPurchase,
  formatNumber
}) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg border">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-xs text-blue-600">{effect}</p>
        </div>
        <div className="text-right ml-4">
          <div className="text-sm text-gray-500">Level {currentLevel}</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-yellow-600 font-semibold">
          💰 {formatNumber(cost)}
        </span>
        <button
          onClick={() => onPurchase(id)}
          disabled={!canAfford}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            canAfford
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canAfford ? 'Buy' : 'Need more gold'}
        </button>
      </div>
    </div>
  );
};
