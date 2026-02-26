import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../api/ApiClient';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

interface ServerGameState {
  // Server-authoritative state
  serverGold: number;
  serverGoblins: number;
  serverAchievements: string[];
  serverTreasures: string[];
  lastServerSync: number;

  // Client-side optimistic state
  optimisticGold: number;
  optimisticGoblins: number;
  goldPerSecond: number;

  // UI state
  isLoading: boolean;
  error: string | null;
  lastAction: string | null;

  // Sync tracking
  pendingActions: Array<{
    id: string;
    type: string;
    data: Record<string, unknown>;
    timestamp: number;
  }>;
}

interface ServerGameStore extends ServerGameState {
  // Server sync actions
  syncWithServer: () => Promise<void>;

  // Game actions (optimistic with server validation)
  collectGold: () => Promise<void>;
  hireGoblin: () => Promise<void>;
  sendMinions: () => Promise<void>;
  exploreRuins: () => Promise<void>;
  prestige: () => Promise<void>;

  // Utility actions
  startOptimisticUpdates: () => void;
  stopOptimisticUpdates: () => void;
  reconcileWithServer: (serverData: unknown) => void;

  // Getters for display
  getDisplayGold: () => number;
  getDisplayGoblins: () => number;

  // Error handling
  clearError: () => void;
}

let optimisticInterval: ReturnType<typeof setInterval> | null = null;

export const useServerGameStore = create<ServerGameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      serverGold: 0,
      serverGoblins: 0,
      serverAchievements: [],
      serverTreasures: [],
      lastServerSync: 0,

      optimisticGold: 0,
      optimisticGoblins: 0,
      goldPerSecond: 1, // Base rate: 1 gold per second

      isLoading: false,
      error: null,
      lastAction: null,
      pendingActions: [],

      // Sync with server
      syncWithServer: async () => {
        try {
          set({ isLoading: true, error: null });

          const serverData = await apiClient.getPlayerData();

          get().reconcileWithServer(serverData);

          set({
            lastServerSync: Date.now(),
            isLoading: false,
          });
        } catch (error: unknown) {
          console.error('Server sync failed:', error);
          set({
            error: error instanceof Error ? error.message : 'Sync failed',
            isLoading: false,
          });
        }
      },

      // Reconcile optimistic state with server state
      reconcileWithServer: (serverData: unknown) => {
        if (!isRecord(serverData)) {
          set({ error: 'Invalid server data' });
          return;
        }

        const serverGold = toNumber(serverData.gold);
        const serverGoblins = toNumber(serverData.goblins);

        set({
          serverGold,
          serverGoblins,
          serverAchievements: toStringArray(serverData.achievements),
          serverTreasures: toStringArray(serverData.treasures),

          // Reset optimistic state to match server
          optimisticGold: serverGold,
          optimisticGoblins: serverGoblins,

          // Clear pending actions that are now resolved
          pendingActions: [],
        });

        // Update gold per second based on goblins
        const newGoldPerSecond = 1 + serverGoblins * 0.1;
        set({ goldPerSecond: newGoldPerSecond });
      },

      // Collect gold (click action)
      collectGold: async () => {
        const actionId = `collect_${Date.now()}`;

        try {
          // Optimistic update
          set(state => ({
            optimisticGold: state.optimisticGold + 1,
            lastAction: 'collect',
            pendingActions: [
              ...state.pendingActions,
              {
                id: actionId,
                type: 'collect',
                data: {},
                timestamp: Date.now(),
              },
            ],
          }));

          // Server validation
          const result = await apiClient.collectGold();

          if (result.success) {
            // Remove pending action
            set(state => ({
              pendingActions: state.pendingActions.filter(a => a.id !== actionId),
            }));
          } else {
            throw new Error('Server rejected gold collection');
          }
        } catch {
          // Revert optimistic update
          set(state => ({
            optimisticGold: Math.max(0, state.optimisticGold - 1),
            error: 'Failed to collect gold',
            pendingActions: state.pendingActions.filter(a => a.id !== actionId),
          }));
        }
      },

      // Hire goblin
      hireGoblin: async () => {
        const state = get();
        const cost = 50 * Math.pow(1.2, state.optimisticGoblins); // Estimate cost

        if (state.optimisticGold < cost) {
          set({ error: 'Not enough gold to hire goblin' });
          return;
        }

        const actionId = `hire_${Date.now()}`;

        try {
          // Optimistic update
          set(prevState => ({
            optimisticGold: prevState.optimisticGold - cost,
            optimisticGoblins: prevState.optimisticGoblins + 1,
            goldPerSecond: 1 + (prevState.optimisticGoblins + 1) * 0.1,
            lastAction: 'hire',
            pendingActions: [
              ...prevState.pendingActions,
              {
                id: actionId,
                type: 'hire',
                data: { cost },
                timestamp: Date.now(),
              },
            ],
          }));

          // Server validation
          const result = await apiClient.hireGoblin();

          if (result.success) {
            // Remove pending action
            set(state => ({
              pendingActions: state.pendingActions.filter(a => a.id !== actionId),
            }));
          } else {
            throw new Error(result.error || 'Server rejected hire request');
          }
        } catch (error) {
          // Revert optimistic update
          set(prevState => ({
            optimisticGold: prevState.optimisticGold + cost,
            optimisticGoblins: Math.max(0, prevState.optimisticGoblins - 1),
            goldPerSecond: 1 + Math.max(0, prevState.optimisticGoblins - 1) * 0.1,
            error: error instanceof Error ? error.message : 'Failed to hire goblin',
            pendingActions: prevState.pendingActions.filter(a => a.id !== actionId),
          }));
        }
      },

      // Send minions
      sendMinions: async () => {
        const state = get();

        if (state.optimisticGoblins <= 0) {
          set({ error: 'No goblins to send' });
          return;
        }

        const actionId = `send_${Date.now()}`;

        try {
          // Optimistic update (estimate earnings)
          const estimatedEarnings = state.optimisticGoblins * 2;
          set(prevState => ({
            optimisticGold: prevState.optimisticGold + estimatedEarnings,
            lastAction: 'send_minions',
            pendingActions: [
              ...prevState.pendingActions,
              {
                id: actionId,
                type: 'send',
                data: { earnings: estimatedEarnings },
                timestamp: Date.now(),
              },
            ],
          }));

          // Server validation
          const result = await apiClient.sendMinions();

          if (result.success) {
            const actualEarnings = toNumber(result.gold_earned);

            // Adjust for difference between estimate and actual
            set(state => ({
              optimisticGold: state.optimisticGold - estimatedEarnings + actualEarnings,
              pendingActions: state.pendingActions.filter(a => a.id !== actionId),
            }));
          } else {
            throw new Error(result.error || 'Server rejected send minions');
          }
        } catch (error) {
          // Revert optimistic update
          const estimatedEarnings = state.optimisticGoblins * 2;
          set(prevState => ({
            optimisticGold: Math.max(0, prevState.optimisticGold - estimatedEarnings),
            error: error instanceof Error ? error.message : 'Failed to send minions',
            pendingActions: prevState.pendingActions.filter(a => a.id !== actionId),
          }));
        }
      },

      // Explore ruins
      exploreRuins: async () => {
        const actionId = `explore_${Date.now()}`;

        try {
          set(state => ({
            lastAction: 'explore',
            pendingActions: [
              ...state.pendingActions,
              {
                id: actionId,
                type: 'explore',
                data: {},
                timestamp: Date.now(),
              },
            ],
          }));

          const result = await apiClient.exploreRuins();

          set(state => ({
            pendingActions: state.pendingActions.filter(a => a.id !== actionId),
          }));

          if (result.treasure_found) {
            // Trigger sync to get updated treasures
            await get().syncWithServer();
          }
        } catch {
          set(state => ({
            error: 'Failed to explore ruins',
            pendingActions: state.pendingActions.filter(a => a.id !== actionId),
          }));
        }
      },

      // Prestige
      prestige: async () => {
        const state = get();
        const prestigeRequirement = 1000000;

        if (state.optimisticGold < prestigeRequirement) {
          set({ error: 'Not enough gold for prestige' });
          return;
        }

        try {
          const result = await apiClient.prestigePlayer();

          if (result.success) {
            // Reset state
            set({
              serverGold: 0,
              serverGoblins: 0,
              optimisticGold: 0,
              optimisticGoblins: 0,
              goldPerSecond: 1,
              lastAction: 'prestige',
            });
          } else {
            throw new Error(result.error || 'Prestige failed');
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Prestige failed',
          });
        }
      },

      // Start optimistic updates (gold accumulation)
      startOptimisticUpdates: () => {
        if (optimisticInterval) return;

        optimisticInterval = setInterval(() => {
          const state = get();
          set({
            optimisticGold: state.optimisticGold + state.goldPerSecond / 10, // Update 10 times per second
          });
        }, 100);
      },

      // Stop optimistic updates
      stopOptimisticUpdates: () => {
        if (optimisticInterval) {
          clearInterval(optimisticInterval);
          optimisticInterval = null;
        }
      },

      // Display getters
      getDisplayGold: () => {
        return get().optimisticGold;
      },

      getDisplayGoblins: () => {
        return get().optimisticGoblins;
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'server-game-store',
      partialize: state => ({
        serverGold: state.serverGold,
        serverGoblins: state.serverGoblins,
        serverAchievements: state.serverAchievements,
        serverTreasures: state.serverTreasures,
        lastServerSync: state.lastServerSync,
        goldPerSecond: state.goldPerSecond,
      }),
      merge: (persistedState: unknown, currentState) => {
        if (!isRecord(persistedState)) return currentState;

        const serverGold = toNumber(persistedState.serverGold);
        const serverGoblins = toNumber(persistedState.serverGoblins);

        return {
          ...currentState,
          serverGold,
          serverGoblins,
          serverAchievements: toStringArray(persistedState.serverAchievements),
          serverTreasures: toStringArray(persistedState.serverTreasures),
          lastServerSync: toNumber(persistedState.lastServerSync),
          goldPerSecond: toNumber(persistedState.goldPerSecond) || currentState.goldPerSecond,
          // Reset optimistic state to server state on load
          optimisticGold: serverGold,
          optimisticGoblins: serverGoblins,
          isLoading: false,
          error: null,
          pendingActions: [],
        };
      },
    }
  )
);
