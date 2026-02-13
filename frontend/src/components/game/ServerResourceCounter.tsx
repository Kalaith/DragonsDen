import React from "react";
import { motion } from "framer-motion";
import { useServerGameStore } from "../../stores/serverGameStore";
import { StatDisplay } from "../ui/StatDisplay";

export const ServerResourceCounter: React.FC = () => {
  const {
    getDisplayGold,
    getDisplayGoblins,
    goldPerSecond,
    isLoading,
    error,
    lastAction,
    pendingActions,
  } = useServerGameStore();

  const formatNumber = (num: number): string => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return Math.floor(num).toFixed(0);
  };

  return (
    <motion.div
      className="resource-counter"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Resources */}
      <div className="grid grid-cols-2 gap-4">
        <StatDisplay
          icon="💰"
          label="Gold"
          value={formatNumber(getDisplayGold())}
          color="text-yellow-600"
          showChange={true}
        />

        <StatDisplay
          icon="👹"
          label="Goblins"
          value={getDisplayGoblins().toString()}
          color="text-red-600"
        />
      </div>

      {/* Gold Per Second Display */}
      <div className="mt-2 text-center">
        <div className="text-sm text-gray-600">
          +{goldPerSecond.toFixed(1)} gold/sec
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-3 text-xs">
        {/* Server Status */}
        <div className="flex items-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}
          />
          <span className="text-gray-600">
            {isLoading ? "Syncing..." : "Server Connected"}
          </span>
        </div>

        {/* Pending Actions */}
        {pendingActions.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-gray-600">
              {pendingActions.length} pending
            </span>
          </div>
        )}

        {/* Last Action */}
        {lastAction && <div className="text-gray-500">Last: {lastAction}</div>}
      </div>

      {/* Error Display */}
      {error && error !== "Not logged in" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm"
        >
          ⚠️ {error}
        </motion.div>
      )}
    </motion.div>
  );
};
