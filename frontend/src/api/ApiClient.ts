import { apiConfig } from '../config/api';
import { useAuthStore } from '../stores/authStore';

export default class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || apiConfig.BACKEND_BASE_URL;
  }

  private async fetchJson<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    if (apiConfig.LOG_REQUESTS) {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
    }

    const authToken = useAuthStore.getState().token;
    const authHeader: Record<string, string> = authToken
      ? { Authorization: `Bearer ${authToken}` }
      : {};
    const extraHeaders =
      options.headers && !Array.isArray(options.headers)
        ? (options.headers as Record<string, string>)
        : {};

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.DEFAULT_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
          ...extraHeaders,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          try {
            await response.json();
          } catch {
            // ignore JSON parse errors for 401
          }
          throw new Error('Not logged in');
        }
        throw new Error(
          `API request failed with status ${response.status}: ${response.statusText}`
        );
      }

      const data: unknown = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`API request timed out after ${apiConfig.DEFAULT_TIMEOUT}ms`);
      }
      throw error;
    }
  }

  public async getConstants(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.CONSTANTS);
  }

  public async getAchievements(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.ACHIEVEMENTS);
  }

  public async getTreasures(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.TREASURES);
  }

  public async getUpgrades(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.UPGRADES);
  }

  public async getUpgradeDefinitions(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.UPGRADE_DEFINITIONS);
  }

  public async getPlayerData(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.PLAYER);
  }

  public async collectGold(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.PLAYER_COLLECT_GOLD, {
      method: 'POST',
    });
  }

  public async sendMinions(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.PLAYER_SEND_MINIONS, {
      method: 'POST',
    });
  }

  public async exploreRuins(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.PLAYER_EXPLORE_RUINS, {
      method: 'POST',
    });
  }

  public async hireGoblin(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.PLAYER_HIRE_GOBLIN, {
      method: 'POST',
    });
  }

  public async prestigePlayer(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.PLAYER_PRESTIGE, {
      method: 'POST',
    });
  }

  public async getSystemStatus(): Promise<any> {
    return this.fetchJson(apiConfig.ENDPOINTS.SYSTEM_STATUS);
  }

  public async getAuthSession(): Promise<any> {
    return this.fetchJson('/api/auth/session');
  }
}
