export type TreasureRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Treasure {
  name: string;
  rarity: TreasureRarity;
  description: string;
  effect: string;
}

export interface TreasureData extends Treasure {
  id: string;
  discoveredAt: number;
}