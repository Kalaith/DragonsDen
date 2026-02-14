import { useGameStore } from '../stores/gameStore';
import { useCooldowns } from './useCooldowns';
import { gameConstants } from '../constants/gameConstants';
import { GameActions } from '../types/actions';

export const useGameActions = (): GameActions => {
  const {
    collectGold,
    sendMinions,
    exploreRuins,
    buyUpgrade,
    prestige,
    calculateGoldPerClick,
    minions,
    gold,
    formatNumber,
    prestigeLevel,
  } = useGameStore();

  const { minionCooldown, exploreCooldown } = useCooldowns();
  const hireMinionCost =
    gameConstants.MINION_BASE_COST * Math.pow(gameConstants.MINION_COST_MULTIPLIER, minions);
  const canPrestige = gold >= gameConstants.PRESTIGE_REQUIREMENT;

  const handleCollectGold = () => {
    collectGold();
  };

  const handleSendMinions = () => {
    if (minionCooldown <= 0 && minions > 0) {
      sendMinions();
    }
  };

  const handleExploreRuins = () => {
    if (exploreCooldown <= 0) {
      exploreRuins();
    }
  };

  const handleHireMinion = () => {
    if (gold >= hireMinionCost) {
      buyUpgrade('hireMinionUpgrade');
    }
  };

  const handlePrestige = () => {
    if (canPrestige) {
      prestige();
    }
  };

  return {
    // Actions
    handleCollectGold,
    handleSendMinions,
    handleExploreRuins,
    handleHireMinion,
    handlePrestige,

    // State
    goldPerClick: calculateGoldPerClick(),
    minions,
    minionCooldown,
    exploreCooldown,
    hireMinionCost,
    canPrestige,
    prestigeLevel,

    // Computed states
    canSendMinions: minionCooldown <= 0 && minions > 0,
    canExplore: exploreCooldown <= 0,
    canHireMinion: gold >= hireMinionCost,

    // Utils
    formatNumber,
  };
};
