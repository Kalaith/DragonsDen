import React from "react";
import { ActionButton } from "../ui/ActionButton";
import { useServerGameStore } from "../../stores/serverGameStore";

export const ServerActionButtons: React.FC = () => {
  const {
    collectGold,
    hireGoblin,
    sendMinions,
    exploreRuins,
    prestige,
    getDisplayGold,
    getDisplayGoblins,
    clearError,
    isLoading,
  } = useServerGameStore();

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return Math.floor(num).toFixed(0);
  };

  const calculateGoblinCost = (): number => {
    return Math.floor(50 * Math.pow(1.2, getDisplayGoblins()));
  };

  const canHireGoblin = (): boolean => {
    return getDisplayGold() >= calculateGoblinCost();
  };

  const canSendMinions = (): boolean => {
    return getDisplayGoblins() > 0;
  };

  const canPrestige = (): boolean => {
    return getDisplayGold() >= 1000000;
  };

  const handleAction = async (action: () => Promise<void>) => {
    clearError(); // Clear any previous errors
    try {
      await action();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 p-4 lg:p-6">
        <ActionButton
          onClick={() => handleAction(collectGold)}
          variant="primary"
          disabled={isLoading}
        >
          <div className="text-center">
            <div className="text-xl lg:text-2xl mb-1">🐉</div>
            <div className="text-xs lg:text-sm leading-tight">
              <div>Collect Gold</div>
              <div className="font-bold">(+1)</div>
            </div>
          </div>
        </ActionButton>

        <ActionButton
          onClick={() => handleAction(sendMinions)}
          disabled={!canSendMinions() || isLoading}
          variant="danger"
        >
          <div className="text-center">
            <div className="text-xl lg:text-2xl mb-1">👹</div>
            <div className="text-xs lg:text-sm leading-tight">
              <div>Send Minions</div>
              <div className="font-bold">({getDisplayGoblins()})</div>
            </div>
          </div>
        </ActionButton>

        <ActionButton
          onClick={() => handleAction(exploreRuins)}
          disabled={isLoading}
          variant="secondary"
        >
          <div className="text-center">
            <div className="text-xl lg:text-2xl mb-1">🗺️</div>
            <div className="text-xs lg:text-sm leading-tight">
              <div>Explore Ruins</div>
            </div>
          </div>
        </ActionButton>

        <ActionButton
          onClick={() => handleAction(hireGoblin)}
          disabled={!canHireGoblin() || isLoading}
          variant="success"
        >
          <div className="text-center">
            <div className="text-xl lg:text-2xl mb-1">🏰</div>
            <div className="text-xs lg:text-sm leading-tight">
              <div>Hire Goblin</div>
              <div className="font-bold">
                ({formatNumber(calculateGoblinCost())})
              </div>
            </div>
          </div>
        </ActionButton>
      </div>

      {/* Prestige Section */}
      {canPrestige() && (
        <div className="p-4 lg:p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold">✨ Prestige Available! ✨</h3>
            <p className="text-sm opacity-90">
              Reset your progress for permanent bonuses
            </p>
          </div>

          <ActionButton
            onClick={() => handleAction(prestige)}
            disabled={isLoading}
            variant="warning"
          >
            <div className="text-center">
              <div className="text-xl mb-1">👑</div>
              <div className="text-sm">
                <div>Prestige</div>
                <div className="font-bold">(1M Gold)</div>
              </div>
            </div>
          </ActionButton>
        </div>
      )}
    </div>
  );
};
