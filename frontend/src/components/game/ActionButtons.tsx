import React from "react";
import { ActionButton } from "../ui/ActionButton";
import { PrestigeCard } from "./PrestigeCard";
import { useGameActions } from "../../hooks/useGameActions";

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
    formatNumber,
  } = useGameActions();

  return (
    <div className="space-y-4">
      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 p-4 lg:p-6">
        <ActionButton onClick={handleCollectGold} variant="primary">
          <div className="text-center">
            <div className="text-xl lg:text-2xl mb-1">🐉</div>
            <div className="text-xs lg:text-sm leading-tight">
              <div>Collect Gold</div>
              <div className="font-bold">(+{goldPerClick})</div>
            </div>
          </div>
        </ActionButton>

        <ActionButton
          onClick={handleSendMinions}
          disabled={!canSendMinions}
          variant="danger"
          cooldownTime={minionCooldown}
        >
          <div className="text-center">
            <div className="text-xl lg:text-2xl mb-1">👹</div>
            <div className="text-xs lg:text-sm leading-tight">
              <div>Send Minions</div>
              <div className="font-bold">({minions})</div>
            </div>
          </div>
        </ActionButton>

        <ActionButton
          onClick={handleExploreRuins}
          disabled={!canExplore}
          variant="secondary"
          cooldownTime={exploreCooldown}
        >
          <div className="text-center">
            <div className="text-xl lg:text-2xl mb-1">🗺️</div>
            <div className="text-xs lg:text-sm leading-tight">
              <div>Explore Ruins</div>
            </div>
          </div>
        </ActionButton>

        <ActionButton
          onClick={handleHireMinion}
          disabled={!canHireMinion}
          variant="success"
        >
          <div className="text-center">
            <div className="text-xl lg:text-2xl mb-1">🏰</div>
            <div className="text-xs lg:text-sm leading-tight">
              <div>Hire Minion</div>
              <div className="font-bold">({formatNumber(hireMinionCost)})</div>
            </div>
          </div>
        </ActionButton>
      </div>

      {/* Prestige Section */}
      <PrestigeCard
        canPrestige={canPrestige}
        nextLevel={prestigeLevel + 1}
        onPrestige={handlePrestige}
      />
    </div>
  );
};
