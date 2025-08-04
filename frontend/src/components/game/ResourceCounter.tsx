import React from 'react';
import { useGameStore } from '../../stores/gameStore';

interface ResourceItemProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-2">
    <span className="text-xl">{icon}</span>
    <div className="flex flex-col">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`font-bold text-lg ${color}`}>{value}</span>
    </div>
  </div>
);

export const ResourceCounter: React.FC = () => {
  const { gold, totalTreasures, uniqueTreasures, minions, formatNumber, calculateGoldPerSecond } = useGameStore();

  return (
    <div className="resource-counter">
      <ResourceItem icon="💰" label="Gold" value={formatNumber(gold)} color="text-yellow-600" />
      <ResourceItem icon="💎" label="Treasures" value={totalTreasures} color="text-blue-600" />
      <ResourceItem icon="⭐" label="Unique" value={uniqueTreasures.size} color="text-purple-600" />
      <ResourceItem icon="👹" label="Minions" value={minions} color="text-red-600" />
      <ResourceItem icon="⚡" label="Gold/sec" value={formatNumber(calculateGoldPerSecond())} color="text-green-600" />
    </div>
  );
};
