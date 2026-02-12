export type AchievementCategory = 
  | 'exploration' 
  | 'combat' 
  | 'collection' 
  | 'dragon_mastery' 
  | 'wealth' 
  | 'special' 
  | 'legendary';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface AchievementReward {
  gold?: number;
  experience?: number;
  items?: string[];
  dragonUnlock?: string;
  abilityUnlock?: string;
  locationUnlock?: string;
  cosmetics?: string[];
  title?: string;
}

export interface AchievementRequirement {
  type: string;
  target: number;
  current?: number;
  conditions?: Record<string, any>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  icon: string;
  
  requirements: AchievementRequirement[];
  rewards: AchievementReward;
  
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt?: number;
  progress: number; // 0-100
  
  prerequisiteAchievements?: string[];
  secretAchievement: boolean;
  oneTimeOnly: boolean;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  // Exploration Achievements
  first_steps: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first exploration',
    category: 'exploration',
    rarity: 'common',
    icon: 'footsteps',
    requirements: [
      { type: 'explorations_completed', target: 1 }
    ],
    rewards: { gold: 100, experience: 50 },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  world_explorer: {
    id: 'world_explorer',
    name: 'World Explorer',
    description: 'Discover 10 different locations',
    category: 'exploration',
    rarity: 'rare',
    icon: 'map',
    requirements: [
      { type: 'locations_discovered', target: 10 }
    ],
    rewards: { 
      gold: 1000, 
      experience: 200,
      items: ['explorer_compass'],
      title: 'Explorer'
    },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  realm_master: {
    id: 'realm_master',
    name: 'Realm Master',
    description: 'Fully explore all biome types',
    category: 'exploration',
    rarity: 'legendary',
    icon: 'crown_world',
    requirements: [
      { type: 'biomes_mastered', target: 9 }
    ],
    rewards: { 
      gold: 10000, 
      experience: 1000,
      dragonUnlock: 'world_dragon',
      title: 'Realm Master'
    },
    isUnlocked: false,
    isCompleted: false,
    progress: 0,
    prerequisiteAchievements: ['world_explorer'],
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  // Dragon Mastery Achievements
  first_hatch: {
    id: 'first_hatch',
    name: 'First Hatch',
    description: 'Hatch your first dragon egg',
    category: 'dragon_mastery',
    rarity: 'common',
    icon: 'dragon_egg',
    requirements: [
      { type: 'dragons_hatched', target: 1 }
    ],
    rewards: { gold: 500, experience: 100 },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  bond_master: {
    id: 'bond_master',
    name: 'Bond Master',
    description: 'Achieve maximum bonding with a dragon',
    category: 'dragon_mastery',
    rarity: 'epic',
    icon: 'heart_dragon',
    requirements: [
      { type: 'max_bonding_achieved', target: 1 }
    ],
    rewards: { 
      gold: 2500, 
      experience: 500,
      abilityUnlock: 'telepathic_link',
      title: 'Dragon Whisperer'
    },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  ancient_wisdom: {
    id: 'ancient_wisdom',
    name: 'Ancient Wisdom',
    description: 'Have a dragon reach Ancient age',
    category: 'dragon_mastery',
    rarity: 'legendary',
    icon: 'ancient_dragon',
    requirements: [
      { type: 'ancient_dragons', target: 1 }
    ],
    rewards: { 
      gold: 25000, 
      experience: 2000,
      items: ['wisdom_crystal'],
      title: 'Ancient Keeper'
    },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  // Combat Achievements
  first_victory: {
    id: 'first_victory',
    name: 'First Victory',
    description: 'Win your first combat',
    category: 'combat',
    rarity: 'common',
    icon: 'sword',
    requirements: [
      { type: 'combats_won', target: 1 }
    ],
    rewards: { gold: 200, experience: 75 },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  elemental_master: {
    id: 'elemental_master',
    name: 'Elemental Master',
    description: 'Win combats with dragons of each element type',
    category: 'combat',
    rarity: 'epic',
    icon: 'elemental_circle',
    requirements: [
      { type: 'elemental_victories', target: 8, conditions: { unique_elements: true } }
    ],
    rewards: { 
      gold: 5000, 
      experience: 1000,
      abilityUnlock: 'elemental_mastery',
      title: 'Elemental Lord'
    },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  perfect_formation: {
    id: 'perfect_formation',
    name: 'Perfect Formation',
    description: 'Win a battle without losing any dragons',
    category: 'combat',
    rarity: 'rare',
    icon: 'formation',
    requirements: [
      { type: 'flawless_victories', target: 1 }
    ],
    rewards: { 
      gold: 1500, 
      experience: 300,
      items: ['tactical_manual']
    },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: false
  },
  
  // Collection Achievements
  treasure_hunter: {
    id: 'treasure_hunter',
    name: 'Treasure Hunter',
    description: 'Collect 100 treasures',
    category: 'collection',
    rarity: 'rare',
    icon: 'treasure_chest',
    requirements: [
      { type: 'treasures_collected', target: 100 }
    ],
    rewards: { 
      gold: 2000, 
      experience: 400,
      items: ['treasure_detector'],
      title: 'Treasure Hunter'
    },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  legendary_collector: {
    id: 'legendary_collector',
    name: 'Legendary Collector',
    description: 'Own 10 legendary treasures',
    category: 'collection',
    rarity: 'legendary',
    icon: 'legendary_gem',
    requirements: [
      { type: 'legendary_treasures', target: 10 }
    ],
    rewards: { 
      gold: 15000, 
      experience: 1500,
      items: ['collectors_crown'],
      title: 'Legendary Collector'
    },
    isUnlocked: false,
    isCompleted: false,
    progress: 0,
    prerequisiteAchievements: ['treasure_hunter'],
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  // Wealth Achievements
  gold_digger: {
    id: 'gold_digger',
    name: 'Gold Digger',
    description: 'Accumulate 10,000 gold',
    category: 'wealth',
    rarity: 'common',
    icon: 'gold_pile',
    requirements: [
      { type: 'gold_accumulated', target: 10000 }
    ],
    rewards: { experience: 200, items: ['golden_pickaxe'] },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  dragon_tycoon: {
    id: 'dragon_tycoon',
    name: 'Dragon Tycoon',
    description: 'Accumulate 1,000,000 gold',
    category: 'wealth',
    rarity: 'epic',
    icon: 'golden_dragon',
    requirements: [
      { type: 'gold_accumulated', target: 1000000 }
    ],
    rewards: { 
      experience: 2000,
      items: ['tycoon_ring'],
      title: 'Dragon Tycoon'
    },
    isUnlocked: false,
    isCompleted: false,
    progress: 0,
    prerequisiteAchievements: ['gold_digger'],
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  // Special Achievements
  speed_runner: {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete an exploration in under 5 minutes',
    category: 'special',
    rarity: 'rare',
    icon: 'lightning_bolt',
    requirements: [
      { type: 'fast_exploration', target: 1, conditions: { time_limit: 300 } }
    ],
    rewards: { 
      gold: 1000, 
      experience: 250,
      items: ['speed_boots']
    },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: false
  },
  
  weather_master: {
    id: 'weather_master',
    name: 'Weather Master',
    description: 'Successfully explore in all weather conditions',
    category: 'special',
    rarity: 'epic',
    icon: 'weather_vane',
    requirements: [
      { type: 'weather_explorations', target: 8, conditions: { unique_weathers: true } }
    ],
    rewards: { 
      gold: 3000, 
      experience: 750,
      abilityUnlock: 'weather_control',
      title: 'Storm Caller'
    },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  },
  
  // Secret Achievements
  shadow_walker: {
    id: 'shadow_walker',
    name: 'Shadow Walker',
    description: 'Explore the Shadow Realm during an eclipse',
    category: 'special',
    rarity: 'legendary',
    icon: 'shadow_moon',
    requirements: [
      { type: 'special_exploration', target: 1, conditions: { biome: 'shadow_realm', weather: 'eclipse' } }
    ],
    rewards: { 
      gold: 10000, 
      experience: 2000,
      dragonUnlock: 'eclipse_dragon',
      title: 'Shadow Walker'
    },
    isUnlocked: false,
    isCompleted: false,
    progress: 0,
    secretAchievement: true,
    oneTimeOnly: true
  },
  
  time_keeper: {
    id: 'time_keeper',
    name: 'Time Keeper',
    description: 'Play the game for 100 hours total',
    category: 'special',
    rarity: 'epic',
    icon: 'hourglass',
    requirements: [
      { type: 'playtime_hours', target: 100 }
    ],
    rewards: { 
      gold: 5000, 
      experience: 1000,
      items: ['time_crystal'],
      title: 'Time Keeper'
    },
    isUnlocked: true,
    isCompleted: false,
    progress: 0,
    secretAchievement: true,
    oneTimeOnly: true
  },
  
  // Legendary Achievements
  dragon_god: {
    id: 'dragon_god',
    name: 'Dragon God',
    description: 'Complete all other achievements',
    category: 'legendary',
    rarity: 'mythic',
    icon: 'divine_dragon',
    requirements: [
      { type: 'achievements_completed', target: 95 } // All except this one
    ],
    rewards: { 
      gold: 100000, 
      experience: 10000,
      dragonUnlock: 'divine_dragon',
      cosmetics: ['divine_aura', 'golden_crown'],
      title: 'Dragon God'
    },
    isUnlocked: false,
    isCompleted: false,
    progress: 0,
    secretAchievement: false,
    oneTimeOnly: true
  }
};

export class AchievementSystem {
  private achievements: Map<string, Achievement> = new Map();
  private unlockedAchievements: Set<string> = new Set();
  private completedAchievements: Set<string> = new Set();
  
  constructor() {
    // Initialize achievements
    Object.entries(ACHIEVEMENTS).forEach(([id, achievement]) => {
      this.achievements.set(id, { ...achievement });
      
      if (achievement.isUnlocked) {
        this.unlockedAchievements.add(id);
      }
      
      if (achievement.isCompleted) {
        this.completedAchievements.add(id);
      }
    });
  }
  
  checkAchievements(gameState: any): Achievement[] {
    const newlyCompleted: Achievement[] = [];
    
    for (const [id, achievement] of this.achievements) {
      if (!this.unlockedAchievements.has(id)) {
        if (this.checkUnlockConditions(achievement, gameState)) {
          this.unlockAchievement(id);
        }
      }
      
      if (this.unlockedAchievements.has(id) && !this.completedAchievements.has(id)) {
        const progress = this.calculateProgress(achievement, gameState);
        achievement.progress = progress;
        
        if (progress >= 100) {
          this.completeAchievement(id);
          newlyCompleted.push(achievement);
        }
      }
    }
    
    return newlyCompleted;
  }
  
  private checkUnlockConditions(achievement: Achievement, gameState: any): boolean {
    void gameState;
    // Check prerequisites
    if (achievement.prerequisiteAchievements) {
      for (const prereq of achievement.prerequisiteAchievements) {
        if (!this.completedAchievements.has(prereq)) {
          return false;
        }
      }
    }
    
    // Check if already unlocked
    if (achievement.isUnlocked) {
      return true;
    }
    
    // Add specific unlock conditions here based on game state
    return false;
  }
  
  private calculateProgress(achievement: Achievement, gameState: any): number {
    let totalProgress = 0;
    const numRequirements = achievement.requirements.length;
    
    for (const requirement of achievement.requirements) {
      const current = this.getCurrentValue(requirement, gameState);
      const progress = Math.min(100, (current / requirement.target) * 100);
      totalProgress += progress;
    }
    
    return Math.floor(totalProgress / numRequirements);
  }
  
  private getCurrentValue(requirement: AchievementRequirement, gameState: any): number {
    switch (requirement.type) {
      case 'explorations_completed':
        return gameState.stats?.explorationsCompleted || 0;
      
      case 'locations_discovered':
        return gameState.discoveredLocations?.size || 0;
      
      case 'combats_won':
        return gameState.stats?.combatsWon || 0;
      
      case 'treasures_collected':
        return gameState.totalTreasures || 0;
      
      case 'gold_accumulated':
        return gameState.stats?.totalGoldEarned || 0;
      
      case 'dragons_hatched':
        return gameState.dragons?.length || 0;
      
      case 'playtime_hours':
        return (gameState.stats?.totalPlayTime || 0) / (1000 * 60 * 60);
      
      default:
        return 0;
    }
  }
  
  private unlockAchievement(id: string): void {
    const achievement = this.achievements.get(id);
    if (achievement) {
      achievement.isUnlocked = true;
      this.unlockedAchievements.add(id);
    }
  }
  
  private completeAchievement(id: string): void {
    const achievement = this.achievements.get(id);
    if (achievement) {
      achievement.isCompleted = true;
      achievement.completedAt = Date.now();
      achievement.progress = 100;
      this.completedAchievements.add(id);
    }
  }
  
  // Public methods
  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id);
  }
  
  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }
  
  getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return this.getAllAchievements().filter(a => a.category === category);
  }
  
  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.isUnlocked);
  }
  
  getCompletedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.isCompleted);
  }
  
  getSecretAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.secretAchievement);
  }
  
  getCompletionStats(): { total: number; completed: number; percentage: number } {
    const total = this.achievements.size;
    const completed = this.completedAchievements.size;
    const percentage = Math.floor((completed / total) * 100);
    
    return { total, completed, percentage };
  }
  
  getCategoryStats(category: AchievementCategory): { total: number; completed: number; percentage: number } {
    const categoryAchievements = this.getAchievementsByCategory(category);
    const total = categoryAchievements.length;
    const completed = categoryAchievements.filter(a => a.isCompleted).length;
    const percentage = total > 0 ? Math.floor((completed / total) * 100) : 0;
    
    return { total, completed, percentage };
  }
  
  getTotalRewards(): AchievementReward {
    const totalRewards: AchievementReward = {
      gold: 0,
      experience: 0,
      items: [],
      cosmetics: []
    };
    
    for (const achievement of this.getCompletedAchievements()) {
      if (achievement.rewards.gold) {
        totalRewards.gold = (totalRewards.gold || 0) + achievement.rewards.gold;
      }
      
      if (achievement.rewards.experience) {
        totalRewards.experience = (totalRewards.experience || 0) + achievement.rewards.experience;
      }
      
      if (achievement.rewards.items) {
        totalRewards.items = [...(totalRewards.items || []), ...achievement.rewards.items];
      }
      
      if (achievement.rewards.cosmetics) {
        totalRewards.cosmetics = [...(totalRewards.cosmetics || []), ...achievement.rewards.cosmetics];
      }
    }
    
    return totalRewards;
  }
  
  // Manual achievement triggering for special cases
  triggerSpecialAchievement(id: string, gameState: any): boolean {
    void gameState;
    const achievement = this.achievements.get(id);
    if (!achievement || achievement.isCompleted) {
      return false;
    }
    
    if (!achievement.isUnlocked) {
      this.unlockAchievement(id);
    }
    
    this.completeAchievement(id);
    return true;
  }
}
