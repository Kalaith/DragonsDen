export interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  effect: string;
  maxLevel: number;
}

export interface UpgradeState {
  level: number;
  cost: number;
  canAfford: boolean;
  isMaxLevel: boolean;
}