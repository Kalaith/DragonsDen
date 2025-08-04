import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export const useAnimations = (trigger: boolean) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: trigger ? 1 : 0,
      y: trigger ? 0 : -20,
      transition: { duration: 0.3, ease: "easeOut" }
    });
  }, [trigger, controls]);

  return { controls, motion };
};