export default class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return response.json();
  }

  public async getConstants(): Promise<any> {
    return this.fetch('/api/constants');
  }

  public async getAchievements(): Promise<any> {
    return this.fetch('/api/achievements');
  }

  public async getTreasures(): Promise<any> {
    return this.fetch('/api/treasures');
  }

  public async getUpgrades(): Promise<any> {
    return this.fetch('/api/upgrades');
  }

  public async getUpgradeDefinitions(): Promise<any> {
    return this.fetch('/api/upgrade-definitions');
  }

  public async getPlayerData(playerId: string): Promise<any> {
    return this.fetch(`/api/player/${playerId}`);
  }

  public async savePlayerData(playerId: string, data: any): Promise<any> {
    return this.fetch(`/api/player/${playerId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  public async prestigePlayer(playerId: string): Promise<any> {
    return this.fetch(`/api/player/${playerId}/prestige`, {
      method: 'POST',
    });
  }
}
