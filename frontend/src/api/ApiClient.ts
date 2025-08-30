import { API_CONFIG, getApiUrl, buildEndpoint } from '../config/api';

export default class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.BACKEND_BASE_URL;
  }

  private async fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    if (API_CONFIG.LOG_REQUESTS) {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.DEFAULT_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`API request timed out after ${API_CONFIG.DEFAULT_TIMEOUT}ms`);
      }
      throw error;
    }
  }

  public async getConstants(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.CONSTANTS);
  }

  public async getAchievements(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.ACHIEVEMENTS);
  }

  public async getTreasures(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.TREASURES);
  }

  public async getUpgrades(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.UPGRADES);
  }

  public async getUpgradeDefinitions(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.UPGRADE_DEFINITIONS);
  }

  public async getPlayerData(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.PLAYER);
  }

  public async collectGold(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.PLAYER_COLLECT_GOLD, {
      method: 'POST',
    });
  }

  public async sendMinions(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.PLAYER_SEND_MINIONS, {
      method: 'POST',
    });
  }

  public async exploreRuins(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.PLAYER_EXPLORE_RUINS, {
      method: 'POST',
    });
  }

  public async hireGoblin(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.PLAYER_HIRE_GOBLIN, {
      method: 'POST',
    });
  }

  public async prestigePlayer(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.PLAYER_PRESTIGE, {
      method: 'POST',
    });
  }

  public async getSystemStatus(): Promise<any> {
    return this.fetch(API_CONFIG.ENDPOINTS.SYSTEM_STATUS);
  }
}
