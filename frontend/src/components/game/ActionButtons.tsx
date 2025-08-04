import React from 'react';
import { ActionButton } from '../ui/ActionButton';
import { PrestigeCard } from './PrestigeCard';
import { useGameActions } from '../../hooks/useGameActions';

export const ActionButtons: React.FC = () => {
  const {
    handleCollectGold,
    handleSendMinions,
    handleExploreRuins,
    handleHireMinion,
    handlePrestige,
    goldPerClick,
    minions,
    minionCooldown,
    exploreCooldown,
    hireMinionCost,
    canPrestige,
    prestigeLevel,
    canSendMinions,
    canExplore,
    canHireMinion,
    formatNumber
  } = useGameActions();

  return (
    <div className="space-y-4">
      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 p-4 lg:p-6">
        <ActionButton
          onClick={handleCollectGold}
          variant="primary"
        >
          <span className="block text-center">
            <span className="block text-lg lg:text-xl mb-1">🐉</span>
            <span className="block text-xs lg:text-sm">Collect Gold</span>
            <span className="block text-xs lg:text-sm font-bold">(+{goldPerClick})</span>
          </span>
        </ActionButton>
        
        <ActionButton
          onClick={handleSendMinions}
          disabled={!canSendMinions}
          variant="danger"
          cooldownTime={minionCooldown}
        >
          <span className="block text-center">
            <span className="block text-lg lg:text-xl mb-1">👹</span>
            <span className="block text-xs lg:text-sm">Send Minions</span>
            <span className="block text-xs lg:text-sm font-bold">({minions})</span>
          </span>
        </ActionButton>
        
        <ActionButton
          onClick={handleExploreRuins}
          disabled={!canExplore}
          variant="secondary"
          cooldownTime={exploreCooldown}
        >
          <span className="block text-center">
            <span className="block text-lg lg:text-xl mb-1">🗺️</span>
            <span className="block text-xs lg:text-sm">Explore</span>
            <span className="block text-xs lg:text-sm">Ruins</span>
          </span>
        </ActionButton>
        
        <ActionButton
          onClick={handleHireMinion}
          disabled={!canHireMinion}
          variant="success"
        >
          <span className="block text-center">
            <span className="block text-lg lg:text-xl mb-1">🏰</span>
            <span className="block text-xs lg:text-sm">Hire Minion</span>
            <span className="block text-xs lg:text-sm font-bold">({formatNumber(hireMinionCost)})</span>
          </span>
        </ActionButton>
      </div>

      {/* Prestige Section */}
      <PrestigeCard
        canPrestige={canPrestige}
        currentLevel={prestigeLevel}
        nextLevel={prestigeLevel + 1}
        onPrestige={handlePrestige}
      />
    </div>
  );
};
