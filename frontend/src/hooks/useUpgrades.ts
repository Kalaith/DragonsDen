import { useGameStore } from '../stores/gameStore';
import { upgradeDefinitions } from '../data/upgradeDefinitions';

export const useUpgrades = () => {
  const { upgrades, buyUpgrade, calculateUpgradeCost, gold, formatNumber } = useGameStore();

  const getUpgradeData = () => {
    return upgradeDefinitions.map((upgradeDef) => {
      const currentLevel = upgrades[upgradeDef.id] || 0;
      const cost = calculateUpgradeCost(upgradeDef.id);
      const canAfford = gold >= cost;
      
      return {
        ...upgradeDef,
        currentLevel,
        cost,
        canAfford
      };
    });
  };

  const handlePurchase = (upgradeId: string) => {
    buyUpgrade(upgradeId);
  };

  return {
    upgradeData: getUpgradeData(),
    handlePurchase,
    formatNumber
  };
};
