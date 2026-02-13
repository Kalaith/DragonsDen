
// Environment configuration for Dragons Den frontend
interface EnvironmentConfig {
  apiBaseUrl: string;
  environment: "development" | "production" | "preview";
  features: {
    enableDebugMode: boolean;
    enableOfflineMode: boolean;
    enablePerformanceMonitoring: boolean;
  };
}

const validateEnvironment = (): EnvironmentConfig => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const environment = import.meta.env.VITE_ENVIRONMENT || "development";

  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is required for Dragons Den frontend");
  }

  return {
    apiBaseUrl,
    environment: environment as EnvironmentConfig["environment"],
    features: {
      enableDebugMode:
        import.meta.env.VITE_DEBUG_MODE === "true" ||
        environment === "development",
      enableOfflineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE === "true",
      enablePerformanceMonitoring:
        import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === "true",
    },
  };
};

export const env = validateEnvironment();

// Type-safe environment variable access
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue!;
};

