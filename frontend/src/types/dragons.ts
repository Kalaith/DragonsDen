export type ElementType =
  | 'fire'
  | 'ice'
  | 'earth'
  | 'air'
  | 'shadow'
  | 'light'
  | 'poison'
  | 'lightning';

export type DragonRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type DragonPersonality =
  | 'aggressive'
  | 'loyal'
  | 'cunning'
  | 'noble'
  | 'wild'
  | 'ancient'
  | 'playful'
  | 'protective';

export type DragonAge = 'hatchling' | 'juvenile' | 'adult' | 'elder' | 'ancient';

export type DragonAbilityType = 'passive' | 'active' | 'ultimate';

export interface DragonStats {
  attack: number;
  defense: number;
  speed: number;
  intelligence: number;
  magic: number;
  health: number;
  loyalty: number;
}

export interface DragonTraits {
  primaryElement: ElementType;
  secondaryElement?: ElementType;
  personality: DragonPersonality;
  rarity: DragonRarity;
  age: DragonAge;
  bonding: number; // 0-100, relationship strength with player
  experience: number;
  level: number;
}

export interface DragonAbility {
  id: string;
  name: string;
  type: DragonAbilityType;
  description: string;
  cooldown: number;
  manaCost: number;
  damage?: number;
  effect?: string;
  requiredLevel: number;
  elementType: ElementType;
}

export interface DragonGenetics {
  genes: Record<string, number>; // Genetic values for breeding
  mutations: string[]; // Special mutations affecting appearance or abilities
  bloodline: string; // Ancestral lineage
}

export interface Dragon {
  id: string;
  name: string;
  stats: DragonStats;
  traits: DragonTraits;
  abilities: DragonAbility[];
  genetics: DragonGenetics;
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    pattern: string;
    size: number; // Relative size multiplier
    specialFeatures: string[];
  };
  discoveredAt: number; // Timestamp
  lastActive: number; // Timestamp for bonding decay
  isInParty: boolean;
  position?: { x: number; y: number }; // Formation position
}

export interface BreedingPair {
  parent1: Dragon;
  parent2: Dragon;
  compatibility: number; // 0-100
  estimatedHatchTime: number;
  possibleTraits: Partial<DragonTraits>;
}

export interface ElementalAdvantage {
  element: ElementType;
  strongAgainst: ElementType[];
  weakAgainst: ElementType[];
  immuneTo?: ElementType[];
}
