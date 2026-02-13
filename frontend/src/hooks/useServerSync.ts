import { useEffect, useRef } from "react";
import { useServerGameStore } from "../stores/serverGameStore";

export const useServerSync = () => {
  const {
    syncWithServer,
    startOptimisticUpdates,
    stopOptimisticUpdates,
    lastServerSync,
    isLoading,
  } = useServerGameStore();

  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial sync on mount
    syncWithServer();

    // Start optimistic updates (client-side gold accumulation)
    startOptimisticUpdates();

    // Set up periodic server sync (every 30 seconds)
    syncIntervalRef.current = setInterval(() => {
      if (!isLoading) {
        syncWithServer();
      }
    }, 30000);

    // Sync on window focus (player comes back to tab)
    const handleFocus = () => {
      const timeSinceSync = Date.now() - lastServerSync;
      if (timeSinceSync > 5000) {
        // Only sync if it's been more than 5 seconds
        syncWithServer();
      }
    };

    window.addEventListener("focus", handleFocus);

    // Sync before page unload
    const handleBeforeUnload = () => {
      syncWithServer();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup
      stopOptimisticUpdates();

      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }

      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Return sync functions for manual control
  return {
    syncNow: syncWithServer,
    isLoading,
  };
};
