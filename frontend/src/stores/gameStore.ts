import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameState } from "../types/game";
import { Treasure } from "../types/treasures";
import { gameConstants } from "../constants/gameConstants";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

interface GameStore extends GameState {
  // Actions
  collectGold: () => void;
  sendMinions: () => void;
  exploreRuins: () => void;
  buyUpgrade: (upgradeId: string) => void;
  discoverTreasure: () => void;
  prestige: () => void;

  // Calculations
  calculateGoldPerClick: () => number;
  calculateGoldPerSecond: () => number;
  calculateUpgradeCost: (upgradeId: string) => number;

  // Utilities
  formatNumber: (num: number) => string;
  checkAchievements: () => void;
  updateCooldowns: (deltaTime: number) => void;

  // Game Loop
  gameLoop: (deltaTime: number) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      gold: 0,
      totalTreasures: 0,
      uniqueTreasures: new Set(),
      minions: 0,
      goldPerClick: 1,
      goldPerSecond: 0.1,
      upgrades: {},
      discoveredTreasures: [],
      achievements: new Set(),
      prestigeLevel: 0,
      lastSave: Date.now(),
      cooldowns: { minions: 0, explore: 0 },

      collectGold: () => {
        const goldEarned = get().calculateGoldPerClick();
        set((state) => ({
          gold: state.gold + goldEarned,
        }));
        get().checkAchievements();
      },

      sendMinions: () => {
        const state = get();
        if (state.cooldowns.minions <= 0 && state.minions > 0) {
          const goldEarned = state.minions * 10;
          set((prevState) => ({
            gold: prevState.gold + goldEarned,
            cooldowns: {
              ...prevState.cooldowns,
              minions: gameConstants.MINION_COOLDOWN,
            },
          }));
        }
      },

      exploreRuins: () => {
        const state = get();
        if (state.cooldowns.explore <= 0) {
          set((prevState) => ({
            cooldowns: {
              ...prevState.cooldowns,
              explore: gameConstants.EXPLORE_COOLDOWN,
            },
          }));
          // Treasure discovery chance
          if (Math.random() < gameConstants.TREASURE_DISCOVERY_CHANCE) {
            get().discoverTreasure();
          }
        }
      },

      buyUpgrade: (upgradeId: string) => {
        const state = get();
        const cost = get().calculateUpgradeCost(upgradeId);

        // Special case for hiring minions
        if (upgradeId === "hireMinionUpgrade") {
          const hireCost =
            gameConstants.MINION_BASE_COST *
            Math.pow(gameConstants.MINION_COST_MULTIPLIER, state.minions);
          if (state.gold >= hireCost) {
            set((prevState) => ({
              gold: prevState.gold - hireCost,
              minions: prevState.minions + 1,
            }));
          }
          return;
        }

        if (state.gold >= cost) {
          set((prevState) => ({
            gold: prevState.gold - cost,
            upgrades: {
              ...prevState.upgrades,
              [upgradeId]: (prevState.upgrades[upgradeId] || 0) + 1,
            },
          }));
        }
      },

      discoverTreasure: () => {
        // Simplified treasure discovery
        const treasures = [
          "Ancient Coin",
          "Golden Goblet",
          "Dragon Scale",
          "Mystical Crystal",
        ];
        const rarities: Array<"common" | "rare" | "epic" | "legendary"> = [
          "common",
          "rare",
          "epic",
          "legendary",
        ];

        const randomTreasure =
          treasures[Math.floor(Math.random() * treasures.length)];
        const randomRarity =
          rarities[Math.floor(Math.random() * rarities.length)];

        const newTreasure: Treasure = {
          name: randomTreasure,
          rarity: randomRarity,
          description: `A ${randomRarity} ${randomTreasure.toLowerCase()}`,
          effect: "Increases gold per click by 5%",
        };

        set((state) => ({
          discoveredTreasures: [...state.discoveredTreasures, newTreasure],
          totalTreasures: state.totalTreasures + 1,
          uniqueTreasures: new Set([...state.uniqueTreasures, randomTreasure]),
        }));
      },

      prestige: () => {
        const state = get();
        if (state.gold >= gameConstants.PRESTIGE_REQUIREMENT) {
          set(() => ({
            gold: 0,
            totalTreasures: 0,
            uniqueTreasures: new Set(),
            minions: 0,
            goldPerClick: 1,
            goldPerSecond: 0.1,
            upgrades: {},
            discoveredTreasures: [],
            prestigeLevel: state.prestigeLevel + 1,
            cooldowns: { minions: 0, explore: 0 },
          }));
        }
      },

      calculateGoldPerClick: () => {
        const state = get();
        let base = 1;
        const clawLevel = state.upgrades.clawSharpness || 0;
        base *= 1 + clawLevel * gameConstants.CLAW_EFFECTIVENESS;

        // Apply treasure bonuses
        state.discoveredTreasures.forEach((treasure) => {
          if (treasure.name === "Ancient Golden Goblet") {
            base *= 1.05;
          }
        });

        return Math.ceil(base);
      },

      calculateGoldPerSecond: () => {
        const state = get();
        let base = 0.1;
        const minionLevel = state.upgrades.minionEfficiency || 0;
        base +=
          state.minions *
          (1 + minionLevel * gameConstants.MINION_EFFECTIVENESS);
        return base;
      },

      calculateUpgradeCost: (upgradeId: string) => {
        const state = get();
        const level = state.upgrades[upgradeId] || 0;
        const baseCost =
          gameConstants.UPGRADE_BASE_COSTS[
            upgradeId as keyof typeof gameConstants.UPGRADE_BASE_COSTS
          ] || 100;
        return Math.floor(
          baseCost * Math.pow(gameConstants.UPGRADE_COST_MULTIPLIER, level),
        );
      },

      formatNumber: (num: number) => {
        if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
        if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
        if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
        return Math.floor(num).toString();
      },

      checkAchievements: () => {
        const state = get();
        const newAchievements = new Set(state.achievements);

        if (state.gold >= 1000 && !newAchievements.has("first_thousand")) {
          newAchievements.add("first_thousand");
        }
        if (
          state.totalTreasures >= 10 &&
          !newAchievements.has("treasure_hunter")
        ) {
          newAchievements.add("treasure_hunter");
        }

        if (newAchievements.size > state.achievements.size) {
          set({ achievements: newAchievements });
        }
      },

      updateCooldowns: (deltaTime: number) => {
        set((state) => ({
          cooldowns: {
            minions: Math.max(0, state.cooldowns.minions - deltaTime),
            explore: Math.max(0, state.cooldowns.explore - deltaTime),
          },
        }));
      },

      gameLoop: (deltaTime: number) => {
        const state = get();
        const passiveGold = state.calculateGoldPerSecond() * deltaTime;

        set((prevState) => ({
          gold: prevState.gold + passiveGold,
        }));

        get().updateCooldowns(deltaTime);
      },
    }),
    {
      name: "dragon-hoard-game",
      partialize: (state) => ({
        gold: state.gold,
        totalTreasures: state.totalTreasures,
        uniqueTreasures: Array.from(state.uniqueTreasures),
        minions: state.minions,
        upgrades: state.upgrades,
        discoveredTreasures: state.discoveredTreasures,
        achievements: Array.from(state.achievements),
        prestigeLevel: state.prestigeLevel,
        lastSave: state.lastSave,
      }),
      merge: (persistedState: unknown, currentState) => {
        if (!isRecord(persistedState)) return currentState;

        const uniqueTreasures = Array.isArray(persistedState.uniqueTreasures)
          ? persistedState.uniqueTreasures.filter(
              (v): v is string => typeof v === "string",
            )
          : [];

        const achievements = Array.isArray(persistedState.achievements)
          ? persistedState.achievements.filter(
              (v): v is string => typeof v === "string",
            )
          : [];

        return {
          ...currentState,
          gold:
            typeof persistedState.gold === "number"
              ? persistedState.gold
              : currentState.gold,
          totalTreasures:
            typeof persistedState.totalTreasures === "number"
              ? persistedState.totalTreasures
              : currentState.totalTreasures,
          uniqueTreasures: new Set(uniqueTreasures),
          minions:
            typeof persistedState.minions === "number"
              ? persistedState.minions
              : currentState.minions,
          upgrades: isRecord(persistedState.upgrades)
            ? (persistedState.upgrades as Record<string, number>)
            : currentState.upgrades,
          discoveredTreasures: Array.isArray(persistedState.discoveredTreasures)
            ? (persistedState.discoveredTreasures as Treasure[])
            : currentState.discoveredTreasures,
          achievements: new Set(achievements),
          prestigeLevel:
            typeof persistedState.prestigeLevel === "number"
              ? persistedState.prestigeLevel
              : currentState.prestigeLevel,
          lastSave:
            typeof persistedState.lastSave === "number"
              ? persistedState.lastSave
              : currentState.lastSave,
        };
      },
    },
  ),
);
