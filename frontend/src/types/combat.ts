import { Dragon, ElementType } from './dragons';

export type CombatPhase = 'preparation' | 'positioning' | 'battle' | 'resolution';

export type BattleType = 'skirmish' | 'siege' | 'aerial' | 'dungeon' | 'arena' | 'raid';

export type FormationPosition = 'frontline' | 'midline' | 'backline' | 'reserve' | 'aerial';

export interface BattleFormation {
  positions: Record<FormationPosition, Dragon[]>;
  bonuses: FormationBonus[];
  weaknesses: FormationWeakness[];
}

export interface FormationBonus {
  name: string;
  description: string;
  conditions: string[];
  effects: Record<string, number>;
}

export interface FormationWeakness {
  name: string;
  description: string;
  vulnerability: string;
  penalty: Record<string, number>;
}

export interface CombatAction {
  id: string;
  dragonId: string;
  type: 'attack' | 'defend' | 'ability' | 'move' | 'item';
  targetId?: string;
  abilityId?: string;
  priority: number;
  energyCost: number;
}

export interface CombatResult {
  success: boolean;
  damage: number;
  effects: CombatEffect[];
  criticalHit: boolean;
  elementalAdvantage?: number;
  description: string;
}

export interface CombatEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'status';
  value: number;
  duration: number;
  elementType?: ElementType;
  description: string;
}

export interface BattleState {
  id: string;
  type: BattleType;
  phase: CombatPhase;
  currentTurn: number;
  playerTeam: BattleDragon[];
  enemyTeam: BattleDragon[];
  battlefield: Battlefield;
  weather: {
    type: string;
    effects: Record<string, number>;
    turnsRemaining: number;
  };
  turnOrder: string[];
  activeEffects: Map<string, CombatEffect[]>;
}

export interface BattleDragon extends Dragon {
  currentHealth: number;
  currentMana: number;
  currentEnergy: number;
  position: BattlePosition;
  statusEffects: StatusEffect[];
  combatStats: {
    damageDealt: number;
    damageTaken: number;
    abilitiesUsed: number;
    criticalHits: number;
  };
}

export interface BattlePosition {
  x: number;
  y: number;
  z: number; // Altitude for aerial combat
  facing: number; // Direction in degrees
  canMove: boolean;
  movementRange: number;
}

export interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'neutral';
  description: string;
  duration: number;
  effects: Record<string, number>;
  stackable: boolean;
  currentStacks: number;
}

export interface Battlefield {
  width: number;
  height: number;
  altitudeLevels: number;
  terrain: TerrainTile[][];
  objectives: BattleObjective[];
  environmentalHazards: EnvironmentalHazard[];
}

export interface TerrainTile {
  type: 'ground' | 'water' | 'lava' | 'ice' | 'forest' | 'mountain' | 'void';
  elevation: number;
  movementCost: number;
  effects: Record<string, number>;
  isPassable: boolean;
  isOccupied: boolean;
}

export interface BattleObjective {
  type: 'defeat_all' | 'protect_target' | 'capture_points' | 'survive_time' | 'reach_location';
  description: string;
  isComplete: boolean;
  progress: number;
  maxProgress: number;
  rewards: Record<string, number>;
}

export interface EnvironmentalHazard {
  id: string;
  name: string;
  type: 'fire_pit' | 'ice_storm' | 'lightning_field' | 'poison_cloud' | 'gravity_well';
  position: { x: number; y: number; z?: number };
  radius: number;
  damage: number;
  elementType: ElementType;
  duration: number;
  affectedElements: {
    immune: ElementType[];
    vulnerable: ElementType[];
    resistant: ElementType[];
  };
}

export interface SiegeWeapon {
  id: string;
  name: string;
  type: 'catapult' | 'ballista' | 'ram' | 'tower' | 'cannon';
  health: number;
  maxHealth: number;
  damage: number;
  range: number;
  operatorRequirement: number; // Number of dragons needed
  constructionTime: number;
  cost: Record<string, number>;
}

export interface Fortification {
  id: string;
  name: string;
  type: 'wall' | 'tower' | 'gate' | 'keep' | 'moat';
  health: number;
  maxHealth: number;
  defenseBonus: number;
  capacity: number; // Number of defenders it can hold
  constructionCost: Record<string, number>;
  maintainanceCost: Record<string, number>;
}