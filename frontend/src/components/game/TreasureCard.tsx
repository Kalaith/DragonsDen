import React from 'react';
import { Treasure } from '../../types/treasures';

const getRarityStyles = (rarity: string) => {
  switch (rarity) {
    case 'legendary':
      return 'border-yellow-400 bg-yellow-50 text-yellow-800';
    case 'epic':
      return 'border-purple-400 bg-purple-50 text-purple-800';
    case 'rare':
      return 'border-blue-400 bg-blue-50 text-blue-800';
    default:
      return 'border-gray-400 bg-gray-50 text-gray-800';
  }
};

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return '👑';
    case 'epic': return '💜';
    case 'rare': return '💙';
    default: return '🤍';
  }
};

interface TreasureCardProps {
  treasure: Treasure;
}

export const TreasureCard: React.FC<TreasureCardProps> = ({ treasure }) => {
  const rarityStyles = getRarityStyles(treasure.rarity);
  const rarityIcon = getRarityIcon(treasure.rarity);

  return (
    <div className={`treasure-card ${rarityStyles} treasure-discover`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">{treasure.name}</h3>
        <span className="text-lg">{rarityIcon}</span>
      </div>
      
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xs font-semibold capitalize px-2 py-1 rounded-full bg-white/50">
          {treasure.rarity}
        </span>
      </div>
      
      <p className="text-xs opacity-75 line-clamp-2">
        {treasure.description}
      </p>
      
      <div className="mt-2 pt-2 border-t border-current border-opacity-20">
        <p className="text-xs font-medium">
          {treasure.effect}
        </p>
      </div>
    </div>
  );
};