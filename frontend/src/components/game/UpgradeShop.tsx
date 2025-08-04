import React from 'react';
import { UpgradeItem } from './UpgradeItem';
import { useUpgrades } from '../../hooks/useUpgrades';

export const UpgradeShop: React.FC = () => {
  const { upgradeData, handlePurchase, formatNumber } = useUpgrades();

  return (
    <div className="upgrade-card">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🛒 Upgrade Shop</h2>
      
      <div className="space-y-3">
        {upgradeData.map((upgrade) => (
          <UpgradeItem
            key={upgrade.id}
            id={upgrade.id}
            name={upgrade.name}
            description={upgrade.description}
            effect={upgrade.baseEffect}
            currentLevel={upgrade.currentLevel}
            cost={upgrade.cost}
            canAfford={upgrade.canAfford}
            onPurchase={handlePurchase}
            formatNumber={formatNumber}
          />
        ))}
      </div>
    </div>
  );
};
