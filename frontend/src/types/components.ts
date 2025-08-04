// UI Component Props
export interface StatDisplayProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  showChange?: boolean;
}

export interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
  cooldownTime?: number;
}

export interface PrestigeCardProps {
  canPrestige: boolean;
  currentLevel: number;
  nextLevel: number;
  onPrestige: () => void;
}

export interface UpgradeItemProps {
  id: string;
  name: string;
  description: string;
  effect: string;
  currentLevel: number;
  cost: number;
  canAfford: boolean;
  onPurchase: (id: string) => void;
  formatNumber: (num: number) => string;
}

// Layout Component Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
