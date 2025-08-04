import { useGameStore } from '../stores/gameStore';

export const useCooldowns = () => {
  const cooldowns = useGameStore(state => state.cooldowns);

  return {
    minionCooldown: cooldowns.minions,
    exploreCooldown: cooldowns.explore,
    isMinionsReady: cooldowns.minions <= 0,
    isExploreReady: cooldowns.explore <= 0,
  };
};