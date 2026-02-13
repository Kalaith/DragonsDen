
// API Configuration for Dragons Den
const getBackendUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    throw new Error(
      "VITE_API_BASE_URL environment variable is not set. " +
        "Please set it in your .env file (e.g., VITE_API_BASE_URL=http://127.0.0.1/dragons_den)",
    );
  }
  return url;
};

export const apiConfig = {
  // Backend server configuration
  BACKEND_BASE_URL: getBackendUrl(),

  // API endpoints
  ENDPOINTS: {
    CONSTANTS: "/api/constants",
    ACHIEVEMENTS: "/api/achievements",
    TREASURES: "/api/treasures",
    UPGRADES: "/api/upgrades",
    UPGRADE_DEFINITIONS: "/api/upgrade-definitions",
    PLAYER: "/api/player",
    PLAYER_COLLECT_GOLD: "/api/player/collect-gold",
    PLAYER_SEND_MINIONS: "/api/player/send-minions",
    PLAYER_EXPLORE_RUINS: "/api/player/explore-ruins",
    PLAYER_HIRE_GOBLIN: "/api/player/hire-goblin",
    PLAYER_PRESTIGE: "/api/player/prestige",
    SYSTEM_STATUS: "/api/status",
  },

  // Request configuration
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,

  // Development settings
  MOCK_API: import.meta.env.VITE_MOCK_API === "true",
  LOG_REQUESTS: import.meta.env.NODE_ENV === "development",
};

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
  return `${apiConfig.BACKEND_BASE_URL}${endpoint}`;
}

// Helper function to replace URL parameters
export function buildEndpoint(
  endpoint: string,
  params: Record<string, string>,
): string {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  return url;
}

