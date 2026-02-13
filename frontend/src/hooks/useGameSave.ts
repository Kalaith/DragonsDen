import { useEffect } from "react";
import { useGameStore } from "../stores/gameStore";
import { gameConstants } from "../constants/gameConstants";

export const useGameSave = (
  interval: number = gameConstants.AUTO_SAVE_INTERVAL,
) => {
  useEffect(() => {
    const saveInterval = setInterval(() => {
      // Zustand persist middleware handles the actual saving
      useGameStore.setState({ lastSave: Date.now() });
    }, interval);

    return () => clearInterval(saveInterval);
  }, [interval]);
};
