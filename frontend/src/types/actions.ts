// Action handler types for better type safety
export interface GameActionHandlers {
  handleCollectGold: () => void;
  handleSendMinions: () => void;
  handleExploreRuins: () => void;
  handleHireMinion: () => void;
  handlePrestige: () => void;
}

export interface GameActionState {
  goldPerClick: number;
  minions: number;
  minionCooldown: number;
  exploreCooldown: number;
  hireMinionCost: number;
  canPrestige: boolean;
  prestigeLevel: number;
  canSendMinions: boolean;
  canExplore: boolean;
  canHireMinion: boolean;
  formatNumber: (num: number) => string;
}

export type GameActions = GameActionHandlers & GameActionState;
