import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useGameLoop = () => {
  const gameLoop = useGameStore(state => state.gameLoop);
  const updateCooldowns = useGameStore(state => state.updateCooldowns);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      gameLoop(deltaTime);
      updateCooldowns(deltaTime);

      requestAnimationFrame(loop);
    };

    const animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [gameLoop, updateCooldowns]);
};