import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/ApiClient';
import { apiConfig } from '../../config/api';

interface ApiStatusProps {
  className?: string;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<{
    connected: boolean;
    message: string;
    timestamp: string;
  }>({
    connected: false,
    message: 'Checking connection...',
    timestamp: '',
  });

  const testConnection = async () => {
    try {
      setStatus({
        connected: false,
        message: 'Testing connection...',
        timestamp: new Date().toLocaleTimeString(),
      });

      // Test connection with system status endpoint
      await apiClient.getSystemStatus();

      setStatus({
        connected: true,
        message: `Connected to ${apiConfig.BACKEND_BASE_URL}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatus({
        connected: false,
        message: `Connection failed: ${errorMessage}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  useEffect(() => {
    testConnection();

    // Test connection every 30 seconds
    const interval = setInterval(testConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`bg-gray-100 rounded-lg p-3 border-l-4 ${
        status.connected ? 'border-green-500' : 'border-red-500'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${status.connected ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="text-sm font-medium text-gray-700">API Status</span>
        </div>
        <button
          onClick={testConnection}
          className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
        >
          Retry
        </button>
      </div>

      <div className="mt-1">
        <p className={`text-xs ${status.connected ? 'text-green-700' : 'text-red-700'}`}>
          {status.message}
        </p>
        {status.timestamp && (
          <p className="text-xs text-gray-500 mt-1">Last checked: {status.timestamp}</p>
        )}
      </div>

      {import.meta.env.DEV && (
        <div className="mt-2 text-xs text-gray-600 border-t border-gray-200 pt-2">
          <p>
            <strong>Backend URL:</strong> {apiConfig.BACKEND_BASE_URL}
          </p>
          <p>
            <strong>Environment:</strong> {import.meta.env.MODE}
          </p>
        </div>
      )}
    </div>
  );
};
