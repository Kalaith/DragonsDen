import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dragon, BreedingPair } from '../types/dragons';
import { WorldLocation, WeatherSystem, RivalDragonLord } from '../types/world';
import { AchievementSystem, type Achievement } from '../systems/achievementSystem';
import { WeatherSystemManager } from '../systems/weatherSystem';
import { WorldGenerator } from '../systems/worldGeneration';
import { DragonAgingSystem } from '../systems/dragonAging';
import { RuinsExplorationSystem, type ExplorationResult } from '../systems/ruinsExploration';
import { getBondingDecayRate } from '../data/dragonPersonalities';
import type { BattleFormation } from '../types/combat';

interface DragonGameState {
  // Dragons
  dragons: Dragon[];
  activeDragons: string[]; // IDs of dragons in active party
  eggIncubating: boolean;
  incubationTimeLeft: number;

  // World
  discoveredLocations: WorldLocation[];
  currentLocation: string | null;
  worldSeed: string;
  explorationInProgress: boolean;
  explorationTimeLeft: number;

  // Weather
  currentWeather: WeatherSystem;
  weatherHistory: Array<{ weather: string; timestamp: number }>;

  // Rivals
  rivalLords: RivalDragonLord[];
  lastRivalInteraction: number;

  // Player Progress
  playerLevel: number;
  experience: number;
  unlockedFeatures: Set<string>;
  completedTutorials: Set<string>;

  // Resources beyond gold
  dragonEssence: number;
  ancientKnowledge: number;
  magicalComponents: Record<string, number>;
  artifacts: string[];

  // Statistics
  stats: {
    totalPlayTime: number;
    dragonsHatched: number;
    locationsExplored: number;
    combatsWon: number;
    treasuresFound: number;
    achievementsCompleted: number;
    totalGoldEarned: number;
    ruinsCompleted: number;
  };

  // Game Systems
  achievementSystem: AchievementSystem;
  weatherSystem: WeatherSystemManager;
  lastUpdate: number;
}

interface ExplorationCompletionResult {
  success: boolean;
  treasuresFound: number;
  goldFound: number;
  experienceGained: number;
  newDiscoveries: string[];
}

interface CombatOutcome {
  victory: boolean;
  rewards: string[];
}

interface RivalEncounter {
  type: string;
  message: string;
}

interface DragonStorePersistedState {
  dragons: Dragon[];
  activeDragons: string[];
  discoveredLocations: WorldLocation[];
  worldSeed: string;
  playerLevel: number;
  experience: number;
  unlockedFeatures: string[];
  completedTutorials: string[];
  dragonEssence: number;
  ancientKnowledge: number;
  magicalComponents: Record<string, number>;
  artifacts: string[];
  stats: DragonGameState['stats'];
  lastUpdate: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

interface DragonStore extends DragonGameState {
  // Dragon Management
  addDragon: (dragon: Dragon) => void;
  removeDragon: (dragonId: string) => void;
  updateDragon: (dragonId: string, updates: Partial<Dragon>) => void;
  setActiveDragons: (dragonIds: string[]) => void;
  ageDragon: (dragonId: string) => boolean;

  // Dragon Interactions
  performBondingActivity: (dragonId: string, activityId: string) => boolean;
  breedDragons: (parent1Id: string, parent2Id: string) => BreedingPair | null;
  startIncubation: (breedingPair: BreedingPair) => void;

  // World Exploration
  generateWorld: () => void;
  discoverLocation: (locationId: string) => void;
  startExploration: (locationId: string, dragonIds: string[]) => boolean;
  completeExploration: () => ExplorationCompletionResult | null;

  // Combat & Encounters
  engageCombat: (enemies: Dragon[], formation?: BattleFormation) => CombatOutcome;
  encounterRivalLord: (rivalId: string) => RivalEncounter;

  // Ruins Exploration
  exploreRuin: (
    ruinId: string,
    floorIndex: number,
    choices: Record<string, unknown>
  ) => ExplorationResult | null;

  // Resource Management
  spendResource: (resourceType: string, amount: number) => boolean;
  addResource: (resourceType: string, amount: number) => void;

  // Game Loop & Updates
  updateGame: (deltaTime: number) => void;
  checkAchievements: () => Achievement[];

  // Utilities
  getDragon: (dragonId: string) => Dragon | undefined;
  getActiveDragons: () => Dragon[];
  getCurrentLocation: () => WorldLocation | undefined;
  canAfford: (costs: Record<string, number>) => boolean;
}

const createInitialState = (): DragonGameState => ({
  // Dragons
  dragons: [],
  activeDragons: [],
  eggIncubating: false,
  incubationTimeLeft: 0,

  // World
  discoveredLocations: [],
  currentLocation: null,
  worldSeed: Math.random().toString(36).substring(7),
  explorationInProgress: false,
  explorationTimeLeft: 0,

  // Weather
  currentWeather: {
    current: 'clear',
    duration: 120,
    effects: {
      explorationSpeed: 1.0,
      treasureChance: 1.0,
      dragonMoodEffect: 0.1,
      elementalBonus: [],
      combatModifiers: { accuracy: 1.0, damage: 1.0, speed: 1.0 },
      specialEffects: [],
    },
  },
  weatherHistory: [],

  // Rivals
  rivalLords: [],
  lastRivalInteraction: 0,

  // Player Progress
  playerLevel: 1,
  experience: 0,
  unlockedFeatures: new Set(['basic_exploration', 'dragon_bonding']),
  completedTutorials: new Set(),

  // Resources
  dragonEssence: 0,
  ancientKnowledge: 0,
  magicalComponents: {},
  artifacts: [],

  // Statistics
  stats: {
    totalPlayTime: 0,
    dragonsHatched: 0,
    locationsExplored: 0,
    combatsWon: 0,
    treasuresFound: 0,
    achievementsCompleted: 0,
    totalGoldEarned: 0,
    ruinsCompleted: 0,
  },

  // Game Systems
  achievementSystem: new AchievementSystem(),
  weatherSystem: new WeatherSystemManager(),
  lastUpdate: Date.now(),
});

export const useDragonStore = create<DragonStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      // Dragon Management
      addDragon: (dragon: Dragon) => {
        set(state => ({
          dragons: [...state.dragons, dragon],
          stats: {
            ...state.stats,
            dragonsHatched: state.stats.dragonsHatched + 1,
          },
        }));
      },

      removeDragon: (dragonId: string) => {
        set(state => ({
          dragons: state.dragons.filter(d => d.id !== dragonId),
          activeDragons: state.activeDragons.filter(id => id !== dragonId),
        }));
      },

      updateDragon: (dragonId: string, updates: Partial<Dragon>) => {
        set(state => ({
          dragons: state.dragons.map(d => (d.id === dragonId ? { ...d, ...updates } : d)),
        }));
      },

      setActiveDragons: (dragonIds: string[]) => {
        set({ activeDragons: dragonIds.slice(0, 4) }); // Max 4 active dragons
      },

      ageDragon: (dragonId: string) => {
        const state = get();
        const dragon = state.getDragon(dragonId);

        if (!dragon || !DragonAgingSystem.canAgeUp(dragon, Date.now())) {
          return false;
        }

        const agedDragon = DragonAgingSystem.ageUpDragon(dragon);
        get().updateDragon(dragonId, agedDragon);

        return true;
      },

      // Dragon Interactions
      performBondingActivity: (dragonId: string, activityId: string) => {
        const state = get();
        const dragon = state.getDragon(dragonId);
        void activityId;

        if (!dragon) return false;

        // Find activity and calculate bonding gain
        // This would reference the bonding activities from the personality system
        const bondingGain = Math.min(10, Math.random() * 15);
        const newBonding = Math.min(100, dragon.traits.bonding + bondingGain);

        get().updateDragon(dragonId, {
          traits: { ...dragon.traits, bonding: newBonding },
          lastActive: Date.now(),
        });

        return true;
      },

      breedDragons: (parent1Id: string, parent2Id: string) => {
        const state = get();
        const parent1 = state.getDragon(parent1Id);
        const parent2 = state.getDragon(parent2Id);

        if (!parent1 || !parent2 || parent1.id === parent2.id) {
          return null;
        }

        // Calculate compatibility
        const compatibility = Math.max(
          0,
          Math.min(
            100,
            80 -
              Math.abs(parent1.traits.bonding - parent2.traits.bonding) +
              (parent1.traits.primaryElement === parent2.traits.primaryElement ? 20 : 0)
          )
        );

        const breedingPair: BreedingPair = {
          parent1,
          parent2,
          compatibility,
          estimatedHatchTime: 24 - compatibility / 10, // 14-24 hours based on compatibility
          possibleTraits: {
            primaryElement:
              Math.random() < 0.7 ? parent1.traits.primaryElement : parent2.traits.primaryElement,
            personality:
              Math.random() < 0.5 ? parent1.traits.personality : parent2.traits.personality,
          },
        };

        return breedingPair;
      },

      startIncubation: (breedingPair: BreedingPair) => {
        set({
          eggIncubating: true,
          incubationTimeLeft: breedingPair.estimatedHatchTime * 60, // Convert to minutes
        });
      },

      // World Exploration
      generateWorld: () => {
        const state = get();
        const config = {
          worldSize: { width: 1000, height: 1000 },
          seed: state.worldSeed,
          biomeDistribution: {
            volcanic: 0.1,
            frozen: 0.1,
            forest: 0.2,
            desert: 0.15,
            swamp: 0.1,
            mountain: 0.15,
            ocean: 0.1,
            sky_realm: 0.05,
            shadow_realm: 0.05,
          },
          difficultyProgression: {
            easyRadius: 200,
            normalRadius: 400,
            hardRadius: 600,
          },
          locationDensity: 0.3,
          ruinProbability: 0.2,
          treasureDensity: 0.4,
        };

        const generator = new WorldGenerator(config);
        const locations = generator.generateWorld();

        set({ discoveredLocations: locations });
      },

      discoverLocation: (locationId: string) => {
        set(state => ({
          discoveredLocations: state.discoveredLocations.map(loc =>
            loc.id === locationId ? { ...loc, discovered: true } : loc
          ),
          stats: {
            ...state.stats,
            locationsExplored: state.stats.locationsExplored + 1,
          },
        }));
      },

      startExploration: (locationId: string, dragonIds: string[]) => {
        const state = get();
        const location = state.discoveredLocations.find(l => l.id === locationId);
        const dragons = dragonIds.map(id => state.getDragon(id)).filter(Boolean);

        if (!location || dragons.length === 0) {
          return false;
        }

        // Check if dragons meet location requirements
        const maxLevel = Math.max(...dragons.map(d => d!.traits.level));
        if (maxLevel < location.requiredLevel) {
          return false;
        }

        // Calculate exploration time based on location difficulty and weather
        const baseTime = {
          peaceful: 30,
          easy: 45,
          normal: 60,
          hard: 90,
          extreme: 120,
          legendary: 180,
        }[location.difficulty];

        const weatherModifier = state.weatherSystem.getWeatherEffect('explorationSpeed');
        const explorationTime = Math.round(baseTime * weatherModifier);

        set({
          currentLocation: locationId,
          explorationInProgress: true,
          explorationTimeLeft: explorationTime,
          activeDragons: dragonIds,
        });

        return true;
      },

      completeExploration: () => {
        const state = get();
        if (!state.explorationInProgress || !state.currentLocation) {
          return null;
        }

        const location = state.discoveredLocations.find(l => l.id === state.currentLocation);
        const dragons = state.getActiveDragons();

        if (!location || dragons.length === 0) {
          return null;
        }

        // Generate exploration results
        const results = {
          success: Math.random() < 0.8, // 80% base success rate
          treasuresFound: Math.floor(Math.random() * 3),
          goldFound: Math.floor(Math.random() * location.requiredLevel * 100),
          experienceGained: location.requiredLevel * 50,
          newDiscoveries: [] as string[],
        };

        // Update location progress
        const progressGain = Math.floor(Math.random() * 20) + 10;
        const newProgress = Math.min(100, location.explorationProgress + progressGain);

        set(state => ({
          explorationInProgress: false,
          explorationTimeLeft: 0,
          currentLocation: null,
          discoveredLocations: state.discoveredLocations.map(loc =>
            loc.id === state.currentLocation ? { ...loc, explorationProgress: newProgress } : loc
          ),
          stats: {
            ...state.stats,
            treasuresFound: state.stats.treasuresFound + results.treasuresFound,
            totalGoldEarned: state.stats.totalGoldEarned + results.goldFound,
          },
        }));

        return results;
      },

      // Combat & Encounters
      engageCombat: (enemies: Dragon[], formation?: BattleFormation) => {
        // Placeholder for combat system
        void enemies;
        void formation;

        const victory = Math.random() < 0.6; // 60% win rate placeholder

        if (victory) {
          set(state => ({
            stats: {
              ...state.stats,
              combatsWon: state.stats.combatsWon + 1,
            },
          }));
        }

        return {
          victory,
          rewards: victory ? ['combat_experience', 'battle_trophy'] : [],
        };
      },

      encounterRivalLord: (rivalId: string) => {
        // Placeholder for rival encounters
        void rivalId;
        return {
          type: 'greeting',
          message: 'A rival dragon lord approaches...',
        };
      },

      // Ruins Exploration
      exploreRuin: (ruinId: string, floorIndex: number, choices: Record<string, unknown>) => {
        const state = get();
        const location = state.discoveredLocations.find(l =>
          l.encounters.ancientRuins.some(r => r.id === ruinId)
        );

        if (!location) return null;

        const ruin = location.encounters.ancientRuins.find(r => r.id === ruinId);
        if (!ruin) return null;

        const dragons = state.getActiveDragons();
        const result = RuinsExplorationSystem.exploreFloor(ruin, floorIndex, dragons, choices);

        if (result.success && floorIndex === ruin.floors.length - 1) {
          // Completed entire ruin
          set(state => ({
            stats: {
              ...state.stats,
              ruinsCompleted: state.stats.ruinsCompleted + 1,
            },
          }));
        }

        return result;
      },

      // Resource Management
      spendResource: (resourceType: string, amount: number) => {
        const state = get();

        switch (resourceType) {
          case 'dragonEssence':
            if (state.dragonEssence >= amount) {
              set({ dragonEssence: state.dragonEssence - amount });
              return true;
            }
            break;
          case 'ancientKnowledge':
            if (state.ancientKnowledge >= amount) {
              set({ ancientKnowledge: state.ancientKnowledge - amount });
              return true;
            }
            break;
          default:
            if (state.magicalComponents[resourceType] >= amount) {
              set(state => ({
                magicalComponents: {
                  ...state.magicalComponents,
                  [resourceType]: state.magicalComponents[resourceType] - amount,
                },
              }));
              return true;
            }
        }

        return false;
      },

      addResource: (resourceType: string, amount: number) => {
        switch (resourceType) {
          case 'dragonEssence':
            set(state => ({ dragonEssence: state.dragonEssence + amount }));
            break;
          case 'ancientKnowledge':
            set(state => ({
              ancientKnowledge: state.ancientKnowledge + amount,
            }));
            break;
          default:
            set(state => ({
              magicalComponents: {
                ...state.magicalComponents,
                [resourceType]: (state.magicalComponents[resourceType] || 0) + amount,
              },
            }));
        }
      },

      // Game Loop & Updates
      updateGame: (deltaTime: number) => {
        const state = get();

        // Update play time
        set(state => ({
          stats: {
            ...state.stats,
            totalPlayTime: state.stats.totalPlayTime + deltaTime,
          },
        }));

        // Update weather system
        const currentLocation = state.getCurrentLocation();
        state.weatherSystem.updateWeather(deltaTime, currentLocation?.biome);

        // Update dragon bonding decay
        const updatedDragons = state.dragons.map(dragon => {
          const decay = getBondingDecayRate(dragon.traits.personality, dragon.lastActive);
          const newBonding = Math.max(0, dragon.traits.bonding - decay);

          return {
            ...dragon,
            traits: { ...dragon.traits, bonding: newBonding },
          };
        });

        // Update exploration timer
        if (state.explorationInProgress && state.explorationTimeLeft > 0) {
          const newTimeLeft = Math.max(0, state.explorationTimeLeft - deltaTime / 1000);
          set({ explorationTimeLeft: newTimeLeft });

          if (newTimeLeft === 0) {
            get().completeExploration();
          }
        }

        // Update incubation timer
        if (state.eggIncubating && state.incubationTimeLeft > 0) {
          const newTimeLeft = Math.max(0, state.incubationTimeLeft - deltaTime / 60000); // Convert ms to minutes
          set({ incubationTimeLeft: newTimeLeft });

          if (newTimeLeft === 0) {
            // Hatch egg - placeholder
            set({ eggIncubating: false });
          }
        }

        set({
          dragons: updatedDragons,
          currentWeather: state.weatherSystem.getCurrentWeather(),
          lastUpdate: Date.now(),
        });
      },

      checkAchievements: () => {
        const state = get();
        const newAchievements = state.achievementSystem.checkAchievements({
          stats: state.stats,
          dragons: state.dragons,
          discoveredLocations: state.discoveredLocations,
          totalTreasures: state.stats.treasuresFound,
        });

        if (newAchievements.length > 0) {
          set(state => ({
            stats: {
              ...state.stats,
              achievementsCompleted: state.stats.achievementsCompleted + newAchievements.length,
            },
          }));
        }

        return newAchievements;
      },

      // Utilities
      getDragon: (dragonId: string) => {
        return get().dragons.find(d => d.id === dragonId);
      },

      getActiveDragons: () => {
        const state = get();
        return state.activeDragons.map(id => state.getDragon(id)).filter(Boolean) as Dragon[];
      },

      getCurrentLocation: () => {
        const state = get();
        return state.currentLocation
          ? state.discoveredLocations.find(l => l.id === state.currentLocation)
          : undefined;
      },

      canAfford: (costs: Record<string, number>) => {
        const state = get();

        for (const [resource, amount] of Object.entries(costs)) {
          switch (resource) {
            case 'dragonEssence':
              if (state.dragonEssence < amount) return false;
              break;
            case 'ancientKnowledge':
              if (state.ancientKnowledge < amount) return false;
              break;
            default:
              if ((state.magicalComponents[resource] || 0) < amount) return false;
          }
        }

        return true;
      },
    }),
    {
      name: 'dragon-den-enhanced',
      partialize: state => ({
        dragons: state.dragons,
        activeDragons: state.activeDragons,
        discoveredLocations: state.discoveredLocations,
        worldSeed: state.worldSeed,
        playerLevel: state.playerLevel,
        experience: state.experience,
        unlockedFeatures: Array.from(state.unlockedFeatures),
        completedTutorials: Array.from(state.completedTutorials),
        dragonEssence: state.dragonEssence,
        ancientKnowledge: state.ancientKnowledge,
        magicalComponents: state.magicalComponents,
        artifacts: state.artifacts,
        stats: state.stats,
        lastUpdate: state.lastUpdate,
      }),
      merge: (persistedState: unknown, currentState) => {
        if (!isRecord(persistedState)) {
          return {
            ...currentState,
            achievementSystem: new AchievementSystem(),
            weatherSystem: new WeatherSystemManager(),
          };
        }

        const ps = persistedState as Partial<DragonStorePersistedState>;

        const unlockedFeatures = Array.isArray(ps.unlockedFeatures)
          ? ps.unlockedFeatures.filter((v): v is string => typeof v === 'string')
          : [];

        const completedTutorials = Array.isArray(ps.completedTutorials)
          ? ps.completedTutorials.filter((v): v is string => typeof v === 'string')
          : [];

        const magicalComponents = isRecord(ps.magicalComponents)
          ? Object.fromEntries(
              Object.entries(ps.magicalComponents).filter(([, v]) => typeof v === 'number')
            )
          : currentState.magicalComponents;

        return {
          ...currentState,
          dragons: Array.isArray(ps.dragons) ? (ps.dragons as Dragon[]) : currentState.dragons,
          activeDragons: Array.isArray(ps.activeDragons)
            ? ps.activeDragons.filter((v): v is string => typeof v === 'string')
            : currentState.activeDragons,
          discoveredLocations: Array.isArray(ps.discoveredLocations)
            ? (ps.discoveredLocations as WorldLocation[])
            : currentState.discoveredLocations,
          worldSeed: typeof ps.worldSeed === 'string' ? ps.worldSeed : currentState.worldSeed,
          playerLevel:
            typeof ps.playerLevel === 'number' ? ps.playerLevel : currentState.playerLevel,
          experience: typeof ps.experience === 'number' ? ps.experience : currentState.experience,
          unlockedFeatures: new Set(unlockedFeatures),
          completedTutorials: new Set(completedTutorials),
          dragonEssence:
            typeof ps.dragonEssence === 'number' ? ps.dragonEssence : currentState.dragonEssence,
          ancientKnowledge:
            typeof ps.ancientKnowledge === 'number'
              ? ps.ancientKnowledge
              : currentState.ancientKnowledge,
          magicalComponents,
          artifacts: Array.isArray(ps.artifacts)
            ? ps.artifacts.filter((v): v is string => typeof v === 'string')
            : currentState.artifacts,
          stats: isRecord(ps.stats) ? (ps.stats as DragonGameState['stats']) : currentState.stats,
          lastUpdate: typeof ps.lastUpdate === 'number' ? ps.lastUpdate : currentState.lastUpdate,
          // Reinitialize systems on load
          achievementSystem: new AchievementSystem(),
          weatherSystem: new WeatherSystemManager(),
        };
      },
    }
  )
);
