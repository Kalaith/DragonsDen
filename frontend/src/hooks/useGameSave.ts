import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { GAME_CONSTANTS } from '../constants/gameConstants';

export const useGameSave = (interval: number = GAME_CONSTANTS.AUTO_SAVE_INTERVAL) => {
  const lastSave = useGameStore(state => state.lastSave);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      // Zustand persist middleware handles the actual saving
      useGameStore.setState({ lastSave: Date.now() });
    }, interval);

    return () => clearInterval(saveInterval);
  }, [interval]);
};