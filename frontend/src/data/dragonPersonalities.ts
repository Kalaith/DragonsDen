import { DragonPersonality } from '../types/dragons';

export interface PersonalityTraits {
  name: DragonPersonality;
  description: string;
  statModifiers: {
    attack: number;
    defense: number;
    speed: number;
    intelligence: number;
    magic: number;
    health: number;
    loyalty: number;
  };
  bondingRate: number; // Multiplier for bonding gain/loss
  preferredActivities: string[];
  dislikedActivities: string[];
  specialBehaviors: string[];
  combatTendencies: {
    aggression: number; // 0-100
    cooperation: number; // 0-100
    riskTaking: number; // 0-100
    strategicThinking: number; // 0-100
  };
}

export const DRAGON_PERSONALITIES: Record<DragonPersonality, PersonalityTraits> = {
  aggressive: {
    name: 'aggressive',
    description: 'Fierce and combative, always ready for battle',
    statModifiers: {
      attack: 1.25,
      defense: 0.9,
      speed: 1.1,
      intelligence: 0.95,
      magic: 1.0,
      health: 1.0,
      loyalty: 0.85
    },
    bondingRate: 0.8,
    preferredActivities: ['combat', 'hunting', 'territorial_defense'],
    dislikedActivities: ['peaceful_exploration', 'socializing', 'training_patience'],
    specialBehaviors: ['intimidates_enemies', 'first_to_attack', 'challenges_authority'],
    combatTendencies: {
      aggression: 90,
      cooperation: 30,
      riskTaking: 80,
      strategicThinking: 40
    }
  },
  
  loyal: {
    name: 'loyal',
    description: 'Devoted and trustworthy, forms deep bonds with their master',
    statModifiers: {
      attack: 1.05,
      defense: 1.15,
      speed: 1.0,
      intelligence: 1.1,
      magic: 1.0,
      health: 1.05,
      loyalty: 1.4
    },
    bondingRate: 1.5,
    preferredActivities: ['following_master', 'protecting_allies', 'training'],
    dislikedActivities: ['abandonment', 'betrayal', 'solo_missions'],
    specialBehaviors: ['sacrifices_for_master', 'remembers_kindness', 'seeks_approval'],
    combatTendencies: {
      aggression: 60,
      cooperation: 95,
      riskTaking: 40,
      strategicThinking: 70
    }
  },
  
  cunning: {
    name: 'cunning',
    description: 'Clever and calculating, prefers strategy over brute force',
    statModifiers: {
      attack: 0.95,
      defense: 1.1,
      speed: 1.15,
      intelligence: 1.35,
      magic: 1.2,
      health: 0.9,
      loyalty: 1.0
    },
    bondingRate: 1.1,
    preferredActivities: ['puzzle_solving', 'reconnaissance', 'trap_setting'],
    dislikedActivities: ['direct_confrontation', 'mindless_tasks', 'rushed_decisions'],
    specialBehaviors: ['analyzes_enemies', 'plans_ambushes', 'hoards_information'],
    combatTendencies: {
      aggression: 40,
      cooperation: 60,
      riskTaking: 25,
      strategicThinking: 95
    }
  },
  
  noble: {
    name: 'noble',
    description: 'Honorable and dignified, upholds ancient dragon traditions',
    statModifiers: {
      attack: 1.1,
      defense: 1.2,
      speed: 1.0,
      intelligence: 1.15,
      magic: 1.25,
      health: 1.1,
      loyalty: 1.2
    },
    bondingRate: 1.2,
    preferredActivities: ['ceremonial_flights', 'protecting_weak', 'maintaining_honor'],
    dislikedActivities: ['dishonorable_acts', 'cowardice', 'cruelty'],
    specialBehaviors: ['refuses_dishonor', 'respects_traditions', 'leads_by_example'],
    combatTendencies: {
      aggression: 50,
      cooperation: 80,
      riskTaking: 60,
      strategicThinking: 85
    }
  },
  
  wild: {
    name: 'wild',
    description: 'Untamed and free-spirited, struggles with captivity',
    statModifiers: {
      attack: 1.15,
      defense: 0.85,
      speed: 1.3,
      intelligence: 0.9,
      magic: 1.05,
      health: 1.2,
      loyalty: 0.6
    },
    bondingRate: 0.5,
    preferredActivities: ['free_flight', 'hunting', 'exploring_wilderness'],
    dislikedActivities: ['confinement', 'strict_training', 'civilization'],
    specialBehaviors: ['escapes_frequently', 'distrusts_humans', 'follows_instincts'],
    combatTendencies: {
      aggression: 70,
      cooperation: 20,
      riskTaking: 90,
      strategicThinking: 30
    }
  },
  
  ancient: {
    name: 'ancient',
    description: 'Wise and patient, carries knowledge of forgotten ages',
    statModifiers: {
      attack: 1.0,
      defense: 1.3,
      speed: 0.8,
      intelligence: 1.5,
      magic: 1.4,
      health: 1.25,
      loyalty: 1.1
    },
    bondingRate: 0.7,
    preferredActivities: ['meditation', 'teaching', 'preserving_knowledge'],
    dislikedActivities: ['hasty_decisions', 'disrespect', 'waste'],
    specialBehaviors: ['shares_wisdom', 'long_term_planning', 'remembers_history'],
    combatTendencies: {
      aggression: 30,
      cooperation: 70,
      riskTaking: 20,
      strategicThinking: 100
    }
  },
  
  playful: {
    name: 'playful',
    description: 'Energetic and curious, approaches life with joy',
    statModifiers: {
      attack: 0.9,
      defense: 0.95,
      speed: 1.25,
      intelligence: 1.05,
      magic: 1.1,
      health: 1.0,
      loyalty: 1.25
    },
    bondingRate: 1.3,
    preferredActivities: ['games', 'tricks', 'socializing'],
    dislikedActivities: ['serious_training', 'isolation', 'punishment'],
    specialBehaviors: ['entertains_others', 'learns_quickly', 'lifts_morale'],
    combatTendencies: {
      aggression: 40,
      cooperation: 85,
      riskTaking: 70,
      strategicThinking: 50
    }
  },
  
  protective: {
    name: 'protective',
    description: 'Guardian-natured, prioritizes safety of others over glory',
    statModifiers: {
      attack: 1.0,
      defense: 1.35,
      speed: 0.95,
      intelligence: 1.1,
      magic: 1.15,
      health: 1.3,
      loyalty: 1.3
    },
    bondingRate: 1.4,
    preferredActivities: ['guarding', 'healing_others', 'rescue_missions'],
    dislikedActivities: ['abandoning_allies', 'reckless_attacks', 'leaving_post'],
    specialBehaviors: ['shields_allies', 'prioritizes_healing', 'never_retreats'],
    combatTendencies: {
      aggression: 30,
      cooperation: 90,
      riskTaking: 35,
      strategicThinking: 75
    }
  }
};

export interface BondingActivity {
  id: string;
  name: string;
  description: string;
  duration: number; // In minutes
  cost: Record<string, number>;
  bondingGain: number;
  personalityModifiers: Record<DragonPersonality, number>;
  requirements?: {
    minLevel?: number;
    traits?: string[];
    weather?: string[];
  };
  risks?: {
    injuryChance: number;
    bondingLoss: number;
    description: string;
  };
}

export const BONDING_ACTIVITIES: BondingActivity[] = [
  {
    id: 'feeding',
    name: 'Hand Feeding',
    description: 'Personally feed your dragon their favorite foods',
    duration: 15,
    cost: { food: 50 },
    bondingGain: 5,
    personalityModifiers: {
      aggressive: 0.5,
      loyal: 1.5,
      cunning: 1.0,
      noble: 1.2,
      wild: 0.3,
      ancient: 1.1,
      playful: 1.3,
      protective: 1.2
    }
  },
  {
    id: 'training',
    name: 'Combat Training',
    description: 'Practice combat maneuvers together',
    duration: 30,
    cost: { energy: 20 },
    bondingGain: 8,
    personalityModifiers: {
      aggressive: 1.8,
      loyal: 1.4,
      cunning: 0.8,
      noble: 1.3,
      wild: 0.6,
      ancient: 0.7,
      playful: 1.1,
      protective: 1.0
    }
  },
  {
    id: 'grooming',
    name: 'Scale Grooming',
    description: 'Carefully clean and polish your dragon\'s scales',
    duration: 45,
    cost: { supplies: 25 },
    bondingGain: 12,
    personalityModifiers: {
      aggressive: 0.4,
      loyal: 1.6,
      cunning: 1.1,
      noble: 1.5,
      wild: 0.2,
      ancient: 1.2,
      playful: 1.4,
      protective: 1.3
    }
  },
  {
    id: 'flying',
    name: 'Flight Practice',
    description: 'Soar through the skies together',
    duration: 60,
    cost: { energy: 30 },
    bondingGain: 15,
    personalityModifiers: {
      aggressive: 1.2,
      loyal: 1.3,
      cunning: 0.9,
      noble: 1.4,
      wild: 1.8,
      ancient: 1.0,
      playful: 1.6,
      protective: 1.1
    },
    requirements: {
      minLevel: 5
    }
  },
  {
    id: 'meditation',
    name: 'Shared Meditation',
    description: 'Meditate together to strengthen mental connection',
    duration: 90,
    cost: {},
    bondingGain: 20,
    personalityModifiers: {
      aggressive: 0.3,
      loyal: 1.2,
      cunning: 1.4,
      noble: 1.6,
      wild: 0.1,
      ancient: 2.0,
      playful: 0.5,
      protective: 1.3
    },
    requirements: {
      minLevel: 10
    }
  }
];

export function calculateBondingGain(
  activity: BondingActivity,
  personality: DragonPersonality,
  currentBonding: number,
  weather?: string
): number {
  let gain = activity.bondingGain;
  
  // Apply personality modifier
  gain *= activity.personalityModifiers[personality];
  
  // Reduce gains at higher bonding levels
  if (currentBonding > 80) {
    gain *= 0.5;
  } else if (currentBonding > 60) {
    gain *= 0.7;
  } else if (currentBonding > 40) {
    gain *= 0.85;
  }
  
  // Weather effects (if applicable)
  if (weather && activity.requirements?.weather) {
    if (activity.requirements.weather.includes(weather)) {
      gain *= 1.2;
    } else if (['storm', 'blizzard'].includes(weather)) {
      gain *= 0.8;
    }
  }
  
  return Math.max(1, Math.round(gain));
}

export function getBondingDecayRate(personality: DragonPersonality, lastActive: number): number {
  const hoursInactive = (Date.now() - lastActive) / (1000 * 60 * 60);
  let decayRate = 0;
  
  // Base decay after 24 hours of inactivity
  if (hoursInactive > 24) {
    decayRate = (hoursInactive - 24) * 0.1;
  }
  
  // Personality modifiers for decay
  const personalityDecayModifiers: Record<DragonPersonality, number> = {
    aggressive: 1.5,
    loyal: 0.3,
    cunning: 1.0,
    noble: 0.7,
    wild: 2.0,
    ancient: 0.5,
    playful: 1.2,
    protective: 0.6
  };
  
  return decayRate * personalityDecayModifiers[personality];
}