import { Dragon, DragonAge, DragonStats } from '../types/dragons';

export interface AgeRequirements {
  experience: number;
  minimumTime: number; // Time in hours
  specialRequirements?: {
    bonding?: number;
    victories?: number;
    treasuresFound?: number;
    locationsExplored?: number;
  };
}

export interface AgeModifiers {
  statMultipliers: Partial<DragonStats>;
  specialAbilities: string[];
  appearance: {
    sizeMultiplier: number;
    colorIntensity: number;
    specialFeatures: string[];
  };
  behaviorChanges: {
    wisdomGain: number;
    patienceChange: number;
    energyChange: number;
  };
}

export const AGE_REQUIREMENTS: Record<DragonAge, AgeRequirements> = {
  hatchling: {
    experience: 0,
    minimumTime: 0
  },
  
  juvenile: {
    experience: 500,
    minimumTime: 12, // 12 hours
    specialRequirements: {
      bonding: 25
    }
  },
  
  adult: {
    experience: 2500,
    minimumTime: 72, // 3 days
    specialRequirements: {
      bonding: 60,
      victories: 10,
      locationsExplored: 3
    }
  },
  
  elder: {
    experience: 10000,
    minimumTime: 336, // 2 weeks
    specialRequirements: {
      bonding: 80,
      victories: 50,
      treasuresFound: 25,
      locationsExplored: 8
    }
  },
  
  ancient: {
    experience: 50000,
    minimumTime: 1680, // 10 weeks
    specialRequirements: {
      bonding: 95,
      victories: 200,
      treasuresFound: 100,
      locationsExplored: 15
    }
  }
};

export const AGE_MODIFIERS: Record<DragonAge, AgeModifiers> = {
  hatchling: {
    statMultipliers: {
      attack: 0.6,
      defense: 0.5,
      speed: 1.2,
      intelligence: 0.4,
      magic: 0.3,
      health: 0.4,
      loyalty: 1.5
    },
    specialAbilities: ['curiosity', 'rapid_learning'],
    appearance: {
      sizeMultiplier: 0.3,
      colorIntensity: 0.7,
      specialFeatures: ['baby_eyes', 'soft_scales']
    },
    behaviorChanges: {
      wisdomGain: 0.5,
      patienceChange: -0.8,
      energyChange: 1.5
    }
  },
  
  juvenile: {
    statMultipliers: {
      attack: 0.8,
      defense: 0.75,
      speed: 1.4,
      intelligence: 0.7,
      magic: 0.6,
      health: 0.7,
      loyalty: 1.3
    },
    specialAbilities: ['playful_energy', 'growth_spurt'],
    appearance: {
      sizeMultiplier: 0.6,
      colorIntensity: 0.85,
      specialFeatures: ['developing_horns', 'bright_eyes']
    },
    behaviorChanges: {
      wisdomGain: 0.8,
      patienceChange: -0.5,
      energyChange: 1.3
    }
  },
  
  adult: {
    statMultipliers: {
      attack: 1.0,
      defense: 1.0,
      speed: 1.0,
      intelligence: 1.0,
      magic: 1.0,
      health: 1.0,
      loyalty: 1.0
    },
    specialAbilities: ['prime_strength', 'balanced_power'],
    appearance: {
      sizeMultiplier: 1.0,
      colorIntensity: 1.0,
      specialFeatures: ['full_horns', 'mature_scales']
    },
    behaviorChanges: {
      wisdomGain: 1.0,
      patienceChange: 0.0,
      energyChange: 1.0
    }
  },
  
  elder: {
    statMultipliers: {
      attack: 1.3,
      defense: 1.4,
      speed: 0.9,
      intelligence: 1.6,
      magic: 1.5,
      health: 1.3,
      loyalty: 1.2
    },
    specialAbilities: ['elder_wisdom', 'experienced_fighter', 'magical_mastery'],
    appearance: {
      sizeMultiplier: 1.4,
      colorIntensity: 1.2,
      specialFeatures: ['battle_scars', 'wise_eyes', 'ornate_horns']
    },
    behaviorChanges: {
      wisdomGain: 1.5,
      patienceChange: 0.5,
      energyChange: 0.8
    }
  },
  
  ancient: {
    statMultipliers: {
      attack: 1.8,
      defense: 2.0,
      speed: 0.7,
      intelligence: 2.5,
      magic: 2.2,
      health: 1.8,
      loyalty: 1.5
    },
    specialAbilities: ['ancient_power', 'timeless_wisdom', 'elemental_mastery', 'legendary_presence'],
    appearance: {
      sizeMultiplier: 2.0,
      colorIntensity: 1.5,
      specialFeatures: ['glowing_runes', 'crystalline_scales', 'ethereal_aura', 'crown_spikes']
    },
    behaviorChanges: {
      wisdomGain: 2.0,
      patienceChange: 1.0,
      energyChange: 0.6
    }
  }
};

export class DragonAgingSystem {
  static canAgeUp(dragon: Dragon, currentTime: number): boolean {
    const currentAge = dragon.traits.age;
    const nextAge = this.getNextAge(currentAge);
    
    if (!nextAge) return false;
    
    const requirements = AGE_REQUIREMENTS[nextAge];
    const hoursAlive = (currentTime - dragon.discoveredAt) / (1000 * 60 * 60);
    
    // Check basic requirements
    if (dragon.traits.experience < requirements.experience) return false;
    if (hoursAlive < requirements.minimumTime) return false;
    
    // Check special requirements
    if (requirements.specialRequirements) {
      const special = requirements.specialRequirements;
      
      if (special.bonding && dragon.traits.bonding < special.bonding) return false;
      // Note: victories, treasuresFound, locationsExplored would need to be tracked in dragon stats
    }
    
    return true;
  }
  
  static ageUpDragon(dragon: Dragon): Dragon {
    const nextAge = this.getNextAge(dragon.traits.age);
    if (!nextAge || !this.canAgeUp(dragon, Date.now())) return dragon;
    
    const newModifiers = AGE_MODIFIERS[nextAge];
    const oldModifiers = AGE_MODIFIERS[dragon.traits.age];
    
    // Calculate new stats by removing old age modifiers and applying new ones
    const newStats: DragonStats = { ...dragon.stats };
    
    Object.keys(newStats).forEach(statKey => {
      const key = statKey as keyof DragonStats;
      const baseValue = newStats[key] / (oldModifiers.statMultipliers[key] || 1);
      newStats[key] = Math.round(baseValue * (newModifiers.statMultipliers[key] || 1));
    });
    
    // Update appearance
    const newAppearance = {
      ...dragon.appearance,
      size: dragon.appearance.size * (newModifiers.appearance.sizeMultiplier / (AGE_MODIFIERS[dragon.traits.age].appearance.sizeMultiplier)),
      specialFeatures: [
        ...dragon.appearance.specialFeatures.filter(f => !AGE_MODIFIERS[dragon.traits.age].appearance.specialFeatures.includes(f)),
        ...newModifiers.appearance.specialFeatures
      ]
    };
    
    return {
      ...dragon,
      stats: newStats,
      traits: {
        ...dragon.traits,
        age: nextAge,
        level: dragon.traits.level + this.getAgeBonusLevels(nextAge)
      },
      appearance: newAppearance,
      abilities: [
        ...dragon.abilities,
        // Add age-specific abilities here
      ]
    };
  }
  
  static getNextAge(currentAge: DragonAge): DragonAge | null {
    const ageOrder: DragonAge[] = ['hatchling', 'juvenile', 'adult', 'elder', 'ancient'];
    const currentIndex = ageOrder.indexOf(currentAge);
    
    if (currentIndex === -1 || currentIndex === ageOrder.length - 1) return null;
    
    return ageOrder[currentIndex + 1];
  }
  
  static getAgeBonusLevels(age: DragonAge): number {
    const bonusLevels = {
      hatchling: 0,
      juvenile: 2,
      adult: 5,
      elder: 10,
      ancient: 20
    };
    
    return bonusLevels[age];
  }
  
  static calculateExperienceGain(dragon: Dragon, activity: string, success: boolean): number {
    let baseExp = 0;
    
    switch (activity) {
      case 'combat_victory': baseExp = 100; break;
      case 'exploration': baseExp = 25; break;
      case 'treasure_found': baseExp = 50; break;
      case 'training': baseExp = 15; break;
      case 'bonding': baseExp = 10; break;
      default: baseExp = 5;
    }
    
    if (!success) baseExp *= 0.3; // Reduced exp for failures
    
    // Age modifiers for experience gain
    const ageModifiers = {
      hatchling: 2.0,  // Learn quickly when young
      juvenile: 1.5,
      adult: 1.0,
      elder: 0.7,      // Harder to learn new things
      ancient: 0.5
    };
    
    baseExp *= ageModifiers[dragon.traits.age];
    
    // Intelligence bonus
    baseExp *= (1 + (dragon.stats.intelligence - 100) / 200);
    
    return Math.round(baseExp);
  }
  
  static getAgeDescription(age: DragonAge): string {
    const descriptions = {
      hatchling: 'A young dragon, full of curiosity and energy, learning about the world.',
      juvenile: 'A growing dragon, developing their abilities and personality.',
      adult: 'A mature dragon at the peak of their physical capabilities.',
      elder: 'A seasoned dragon with great wisdom and magical power.',
      ancient: 'A legendary dragon of immense power and unfathomable wisdom.'
    };
    
    return descriptions[age];
  }
  
  static getTimeToNextAge(dragon: Dragon): { hours: number; requirements: string[] } {
    const nextAge = this.getNextAge(dragon.traits.age);
    if (!nextAge) return { hours: 0, requirements: ['Already at maximum age'] };
    
    const requirements = AGE_REQUIREMENTS[nextAge];
    const currentTime = Date.now();
    const hoursAlive = (currentTime - dragon.discoveredAt) / (1000 * 60 * 60);
    
    const timeRemaining = Math.max(0, requirements.minimumTime - hoursAlive);
    const missingRequirements: string[] = [];
    
    if (dragon.traits.experience < requirements.experience) {
      missingRequirements.push(`${requirements.experience - dragon.traits.experience} more experience`);
    }
    
    if (requirements.specialRequirements) {
      const special = requirements.specialRequirements;
      if (special.bonding && dragon.traits.bonding < special.bonding) {
        missingRequirements.push(`${special.bonding - dragon.traits.bonding} more bonding`);
      }
    }
    
    return {
      hours: timeRemaining,
      requirements: missingRequirements.length > 0 ? missingRequirements : ['Time requirement only']
    };
  }
}