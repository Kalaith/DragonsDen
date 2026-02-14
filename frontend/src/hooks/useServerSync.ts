import { useEffect, useRef } from 'react';
import { useServerGameStore } from '../stores/serverGameStore';

export const useServerSync = () => {
  const { syncWithServer, startOptimisticUpdates, stopOptimisticUpdates, isLoading } =
    useServerGameStore();

  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syncWithServerRef = useRef(syncWithServer);
  const startOptimisticUpdatesRef = useRef(startOptimisticUpdates);
  const stopOptimisticUpdatesRef = useRef(stopOptimisticUpdates);

  useEffect(() => {
    syncWithServerRef.current = syncWithServer;
    startOptimisticUpdatesRef.current = startOptimisticUpdates;
    stopOptimisticUpdatesRef.current = stopOptimisticUpdates;
  }, [syncWithServer, startOptimisticUpdates, stopOptimisticUpdates]);

  useEffect(() => {
    // Initial sync on mount
    syncWithServerRef.current();

    // Start optimistic updates (client-side gold accumulation)
    startOptimisticUpdatesRef.current();

    // Set up periodic server sync (every 30 seconds)
    syncIntervalRef.current = setInterval(() => {
      const { isLoading: currentlyLoading } = useServerGameStore.getState();
      if (!currentlyLoading) {
        syncWithServerRef.current();
      }
    }, 30000);

    // Sync on window focus (player comes back to tab)
    const handleFocus = () => {
      const { lastServerSync } = useServerGameStore.getState();
      const timeSinceSync = Date.now() - lastServerSync;
      if (timeSinceSync > 5000) {
        // Only sync if it's been more than 5 seconds
        syncWithServerRef.current();
      }
    };

    window.addEventListener('focus', handleFocus);

    // Sync before page unload
    const handleBeforeUnload = () => {
      syncWithServerRef.current();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup
      stopOptimisticUpdatesRef.current();

      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }

      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Return sync functions for manual control
  return {
    syncNow: syncWithServer,
    isLoading,
  };
};
