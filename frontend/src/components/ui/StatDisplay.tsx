import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApiClient from '../../api/ApiClient';

interface StatDisplayProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  showChange?: boolean;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({ 
  icon, 
  label, 
  value, 
  color = 'text-gray-800',
  showChange = false
}) => {
  const [previousValue, setPreviousValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const apiClient = new ApiClient('/api');

  useEffect(() => {
    if (showChange && previousValue !== value) {
      const fetchStatData = async () => {
        try {
          const statData = await apiClient.getConstants();
          console.log('Fetched stat data:', statData);
        } catch (error) {
          console.error('Error fetching stat data:', error);
        }
      };
      fetchStatData();

      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
      const numPrevious = typeof previousValue === 'string' ? parseFloat(previousValue.toString().replace(/[^0-9.-]/g, '')) : previousValue;
      
      if (numValue > numPrevious) {
        setIsIncreasing(true);
        setTimeout(() => setIsIncreasing(false), 1000);
      }
      setPreviousValue(value);
    }
  }, [value, previousValue, showChange]);

  return (
    <motion.div 
      className={`flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${
        isIncreasing ? 'ring-2 ring-green-400 ring-opacity-50' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      animate={isIncreasing ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <motion.span 
          className="text-lg"
          animate={isIncreasing ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.span>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <motion.span 
        className={`font-bold ${color} ${isIncreasing ? 'text-green-600' : ''}`}
        key={value} // This will trigger animation on value change
        initial={{ scale: 1 }}
        animate={{ scale: isIncreasing ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.4 }}
      >
        {value}
        {isIncreasing && showChange && (
          <motion.span
            className="ml-1 text-green-500 text-xs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            ↗
          </motion.span>
        )}
      </motion.span>
    </motion.div>
  );
};
