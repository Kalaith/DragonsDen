import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  cooldownTime?: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  variant,
  children,
  cooldownTime
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'secondary':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'warning':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const baseClasses = 'action-button text-white relative';
  const variantClasses = disabled ? 'bg-gray-400 cursor-not-allowed' : getVariantClasses();
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses}`}
    >
      {children}
      {cooldownTime && cooldownTime > 0 && (
        <div className="cooldown-overlay">
          {Math.ceil(cooldownTime)}s
        </div>
      )}
    </button>
  );
};
