export interface UpgradeDefinition {
  id: string;
  name: string;
  description: string;
  baseEffect: string;
}

export const upgradeDefinitions: UpgradeDefinition[] = [
  {
    id: 'clawSharpness',
    name: 'Claw Sharpness',
    description: 'Sharper claws collect more gold per click',
    baseEffect: '+50% gold per click per level'
  },
  {
    id: 'minionEfficiency',
    name: 'Minion Efficiency',
    description: 'Your minions become more efficient',
    baseEffect: '+20% minion effectiveness per level'
  },
  {
    id: 'treasureHunting',
    name: 'Treasure Hunting',
    description: 'Better at finding rare treasures',
    baseEffect: 'Increased treasure discovery chance'
  }
];
