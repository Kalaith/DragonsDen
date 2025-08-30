export type BiomeType = 'volcanic' | 'frozen' | 'forest' | 'desert' | 'swamp' | 'mountain' | 'ocean' | 'sky_realm' | 'shadow_realm';

export type WeatherType = 'clear' | 'rain' | 'storm' | 'fog' | 'blizzard' | 'sandstorm' | 'eclipse' | 'aurora';

export type LocationDifficulty = 'peaceful' | 'easy' | 'normal' | 'hard' | 'extreme' | 'legendary';

export interface WeatherSystem {
  current: WeatherType;
  duration: number; // Minutes remaining
  effects: {
    explorationSpeed: number; // Multiplier
    treasureChance: number; // Multiplier
    dragonMoodEffect: number; // Positive or negative
    elementalBonus?: { element: string; multiplier: number }[];
  };
}

export interface WorldLocation {
  id: string;
  name: string;
  biome: BiomeType;
  difficulty: LocationDifficulty;
  discovered: boolean;
  explorationProgress: number; // 0-100
  coordinates: { x: number; y: number };
  requiredLevel: number;
  
  resources: {
    commonTreasures: string[];
    rareTreasures: string[];
    uniqueResources: string[];
  };
  
  encounters: {
    wildDragons: string[];
    ancientRuins: AncientRuin[];
    events: WorldEvent[];
  };
  
  environmentEffects: {
    favoredElements: string[];
    resistantElements: string[];
    dangerLevel: number;
  };
}

export interface AncientRuin {
  id: string;
  name: string;
  type: 'temple' | 'tower' | 'tomb' | 'library' | 'fortress' | 'sanctuary';
  explored: boolean;
  floors: RuinFloor[];
  requiredKeys: string[];
  legendaryReward?: string;
}

export interface RuinFloor {
  level: number;
  layout: 'linear' | 'branching' | 'circular' | 'maze';
  challenges: RuinChallenge[];
  treasures: string[];
  guardian?: {
    type: string;
    difficulty: number;
    rewards: string[];
  };
}

export interface RuinChallenge {
  type: 'puzzle' | 'trap' | 'riddle' | 'combat' | 'stealth';
  description: string;
  difficulty: number;
  solution?: string;
  reward: string;
  penalty?: string;
}

export interface WorldEvent {
  id: string;
  name: string;
  type: 'discovery' | 'encounter' | 'weather' | 'seasonal' | 'rare';
  description: string;
  trigger: {
    condition: string;
    probability: number;
    requirements?: string[];
  };
  effects: {
    immediate: Record<string, number>;
    duration?: number;
    ongoing?: Record<string, number>;
  };
  choices?: EventChoice[];
}

export interface EventChoice {
  text: string;
  requirements?: string[];
  outcomes: {
    success: EventOutcome;
    failure?: EventOutcome;
    successChance: number;
  };
}

export interface EventOutcome {
  description: string;
  rewards?: Record<string, number>;
  penalties?: Record<string, number>;
  newEvents?: string[];
  unlockedLocations?: string[];
}

export interface RivalDragonLord {
  id: string;
  name: string;
  level: number;
  reputation: number; // -100 to 100, enemy to ally
  territory: WorldLocation[];
  dragonCollection: {
    count: number;
    averageLevel: number;
    favoriteElements: string[];
  };
  personality: 'aggressive' | 'defensive' | 'cunning' | 'honorable' | 'chaotic';
  lastInteraction: number;
  relationshipHistory: RivalInteraction[];
}

export interface RivalInteraction {
  type: 'battle' | 'trade' | 'negotiation' | 'alliance' | 'betrayal';
  timestamp: number;
  outcome: 'victory' | 'defeat' | 'draw' | 'success' | 'failure';
  reputationChange: number;
  rewards?: string[];
}