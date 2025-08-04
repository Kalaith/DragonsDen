import { Treasure } from './treasures';

export interface GameState {
  gold: number;
  totalTreasures: number;
  uniqueTreasures: Set<string>;
  minions: number;
  goldPerClick: number;
  goldPerSecond: number;
  upgrades: Record<string, number>;
  discoveredTreasures: Treasure[];
  achievements: Set<string>;
  prestigeLevel: number;
  lastSave: number;
  cooldowns: Cooldowns;
}

export interface Cooldowns {
  minions: number;
  explore: number;
}

export interface GameBalance {
  baseGoldPerClick: number;
  baseGoldPerSecond: number;
  upgradeCostMultiplier: number;
  treasureDiscoveryChance: number;
  legendaryChance: number;
  epicChance: number;
  rareChance: number;
  prestigeRequirement: number;
}