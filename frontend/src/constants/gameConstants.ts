// Game Balance Constants
export const GAME_CONSTANTS = {
  PRESTIGE_REQUIREMENT: 1000000, // 1M gold
  MINION_BASE_COST: 50,
  MINION_COST_MULTIPLIER: 1.2,
  
  // Cooldowns (in seconds)
  MINION_COOLDOWN: 30,
  EXPLORE_COOLDOWN: 60,
  
  // Treasure Discovery
  TREASURE_DISCOVERY_CHANCE: 0.3, // 30%
  
  // Save Interval
  AUTO_SAVE_INTERVAL: 10000, // 10 seconds
  
  // Upgrade multipliers
  CLAW_EFFECTIVENESS: 0.5, // 50% per level
  MINION_EFFECTIVENESS: 0.2, // 20% per level
  
  // Upgrade base costs
  UPGRADE_BASE_COSTS: {
    clawSharpness: 100,
    minionEfficiency: 500,
    treasureHunting: 1000
  },
  
  UPGRADE_COST_MULTIPLIER: 1.5
} as const;
