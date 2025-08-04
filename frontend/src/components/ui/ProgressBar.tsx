import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, className = '' }) => {
  const progress = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full bg-gray-200 rounded-lg overflow-hidden h-4 ${className}`}>
      <motion.div
        className="h-full bg-blue-500 rounded-lg"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
};

export default ProgressBar;