import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../../api';

interface FloatingNumberProps {
  value: number;
  x: number;
  y: number;
  onComplete?: () => void;
}

export const FloatingNumber: React.FC<FloatingNumberProps> = ({ 
  value, 
  x, 
  y, 
  onComplete 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 1, 
            y: 0, 
            x: x, 
            top: y 
          }}
          animate={{ 
            opacity: 0, 
            y: -50 
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 2, 
            ease: "easeOut" 
          }}
          className="floating-number"
          style={{
            position: 'fixed',
            left: x,
            top: y,
            pointerEvents: 'none',
            zIndex: 1000,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#10B981'
          }}
        >
          +{value}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
