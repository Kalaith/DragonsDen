import axios, { AxiosInstance } from 'axios';
import { apiConfig } from '../config/api';

export interface PlayerActionResponse {
  success: boolean;
  error?: string;
  gold_earned?: number;
  treasure_found?: boolean;
}

class GameApiClient {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: apiConfig.BACKEND_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: apiConfig.DEFAULT_TIMEOUT,
    });

    this.http.interceptors.request.use(
      config => {
        try {
          const authStorageStr = localStorage.getItem('auth-storage');
          if (authStorageStr) {
            const authData = JSON.parse(authStorageStr) as {
              state?: { token?: string };
            };
            const token = authData?.state?.token;
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
        } catch (error) {
          console.warn('Failed to parse auth token from local storage', error);
        }
        return config;
      },
      error => Promise.reject(error)
    );

    this.http.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          const loginUrl =
            error.response?.data?.login_url || import.meta.env.VITE_WEB_HATCHERY_LOGIN_URL;

          if (loginUrl) {
            try {
              const raw = localStorage.getItem('auth-storage');
              const parsed = raw ? JSON.parse(raw) : {};
              const state = parsed?.state ?? {};
              const next = {
                ...parsed,
                state: {
                  ...state,
                  loginUrl,
                },
              };
              localStorage.setItem('auth-storage', JSON.stringify(next));
              window.dispatchEvent(
                new CustomEvent('webhatchery:login-required', { detail: { loginUrl } })
              );
            } catch (storageError) {
              console.warn('Failed to persist login URL to auth storage', storageError);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async getSystemStatus(): Promise<Record<string, unknown>> {
    const response = await this.http.get<Record<string, unknown>>(apiConfig.ENDPOINTS.SYSTEM_STATUS);
    return response.data;
  }

  async getPlayerData(): Promise<Record<string, unknown>> {
    const response = await this.http.get<Record<string, unknown>>(apiConfig.ENDPOINTS.PLAYER);
    return response.data;
  }

  async collectGold(): Promise<PlayerActionResponse> {
    const response = await this.http.post<PlayerActionResponse>(apiConfig.ENDPOINTS.PLAYER_COLLECT_GOLD);
    return response.data;
  }

  async hireGoblin(): Promise<PlayerActionResponse> {
    const response = await this.http.post<PlayerActionResponse>(apiConfig.ENDPOINTS.PLAYER_HIRE_GOBLIN);
    return response.data;
  }

  async sendMinions(): Promise<PlayerActionResponse> {
    const response = await this.http.post<PlayerActionResponse>(apiConfig.ENDPOINTS.PLAYER_SEND_MINIONS);
    return response.data;
  }

  async exploreRuins(): Promise<PlayerActionResponse> {
    const response = await this.http.post<PlayerActionResponse>(apiConfig.ENDPOINTS.PLAYER_EXPLORE_RUINS);
    return response.data;
  }

  async prestigePlayer(): Promise<PlayerActionResponse> {
    const response = await this.http.post<PlayerActionResponse>(apiConfig.ENDPOINTS.PLAYER_PRESTIGE);
    return response.data;
  }
}

export const apiClient = new GameApiClient();
export default apiClient;
