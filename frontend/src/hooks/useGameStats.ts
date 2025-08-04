import { useGameStore } from '../stores/gameStore';

export interface GameStat {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  showChange?: boolean;
}

export const useGameStats = () => {
  const { 
    gold, 
    totalTreasures, 
    uniqueTreasures, 
    minions, 
    prestigeLevel,
    achievements,
    calculateGoldPerSecond,
    formatNumber 
  } = useGameStore();  const stats: GameStat[] = [
    {
      icon: '💰',
      label: 'Gold',
      value: formatNumber(gold),
      color: 'text-yellow-600',
      showChange: false // Disable green flash animation for gold
    },
    {
      icon: '⚡',
      label: 'Gold/sec',
      value: formatNumber(calculateGoldPerSecond()),
      color: 'text-green-600',
      showChange: true
    },
    {
      icon: '💎',
      label: 'Total Treasures',
      value: totalTreasures,
      color: 'text-blue-600',
      showChange: true
    },
    {
      icon: '⭐',
      label: 'Unique Treasures',
      value: uniqueTreasures.size,
      color: 'text-purple-600',
      showChange: true
    },
    {
      icon: '👹',
      label: 'Minions',
      value: minions,
      color: 'text-red-600',
      showChange: true
    },
    {
      icon: '🏆',
      label: 'Achievements',
      value: achievements.size,
      color: 'text-orange-600',
      showChange: true
    }
  ];
  // Add prestige level if player has prestiged
  if (prestigeLevel > 0) {
    stats.unshift({
      icon: '🌟',
      label: 'Prestige Level',
      value: prestigeLevel,
      color: 'text-pink-600',
      showChange: false
    });
  }

  return { stats };
};
