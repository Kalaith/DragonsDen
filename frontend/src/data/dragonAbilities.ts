
import {
  DragonAbility,
  ElementType,
  DragonAbilityType,
} from "../types/dragons";

export const dragonAbilities: Record<string, DragonAbility> = {
  // Fire Element Abilities
  flame_breath: {
    id: "flame_breath",
    name: "Flame Breath",
    type: "active",
    description: "Breathe a cone of searing flames at enemies",
    cooldown: 8000, // 8 seconds
    manaCost: 25,
    damage: 120,
    effect: "Deals fire damage over time for 3 turns",
    requiredLevel: 1,
    elementType: "fire",
  },

  inferno: {
    id: "inferno",
    name: "Inferno",
    type: "ultimate",
    description: "Create a massive explosion of fire around yourself",
    cooldown: 45000, // 45 seconds
    manaCost: 80,
    damage: 300,
    effect: "Area damage, burns all enemies in range",
    requiredLevel: 15,
    elementType: "fire",
  },

  fire_immunity: {
    id: "fire_immunity",
    name: "Fire Immunity",
    type: "passive",
    description: "Complete immunity to fire damage and effects",
    cooldown: 0,
    manaCost: 0,
    effect: "Immune to fire damage, +25% fire damage dealt",
    requiredLevel: 5,
    elementType: "fire",
  },

  // Ice Element Abilities
  frost_bolt: {
    id: "frost_bolt",
    name: "Frost Bolt",
    type: "active",
    description: "Launch a piercing bolt of ice at target",
    cooldown: 5000, // 5 seconds
    manaCost: 20,
    damage: 85,
    effect: "Slows target movement by 50% for 2 turns",
    requiredLevel: 1,
    elementType: "ice",
  },

  blizzard: {
    id: "blizzard",
    name: "Blizzard",
    type: "ultimate",
    description: "Summon a devastating ice storm",
    cooldown: 60000, // 60 seconds
    manaCost: 100,
    damage: 180,
    effect: "Area damage, creates ice terrain, slows all enemies",
    requiredLevel: 20,
    elementType: "ice",
  },

  ice_armor: {
    id: "ice_armor",
    name: "Ice Armor",
    type: "passive",
    description: "Natural armor of ice provides protection",
    cooldown: 0,
    manaCost: 0,
    effect: "+30% defense, reflects 20% damage as ice damage",
    requiredLevel: 8,
    elementType: "ice",
  },

  // Earth Element Abilities
  earthquake: {
    id: "earthquake",
    name: "Earthquake",
    type: "active",
    description: "Shake the ground to damage and stun enemies",
    cooldown: 12000, // 12 seconds
    manaCost: 40,
    damage: 100,
    effect: "Stuns enemies for 1 turn, damages based on proximity",
    requiredLevel: 3,
    elementType: "earth",
  },

  mountain_fortress: {
    id: "mountain_fortress",
    name: "Mountain Fortress",
    type: "ultimate",
    description: "Transform into an impregnable stone fortress",
    cooldown: 90000, // 90 seconds
    manaCost: 120,
    effect: "+200% defense, immunity to movement, cannot attack",
    requiredLevel: 25,
    elementType: "earth",
  },

  stone_skin: {
    id: "stone_skin",
    name: "Stone Skin",
    type: "passive",
    description: "Hardened skin provides constant protection",
    cooldown: 0,
    manaCost: 0,
    effect: "+40% defense, -10% speed, immune to minor damage",
    requiredLevel: 6,
    elementType: "earth",
  },

  // Air Element Abilities
  wind_slash: {
    id: "wind_slash",
    name: "Wind Slash",
    type: "active",
    description: "Create cutting winds that slice through enemies",
    cooldown: 6000, // 6 seconds
    manaCost: 18,
    damage: 95,
    effect: "Ignores 25% of armor, higher critical hit chance",
    requiredLevel: 1,
    elementType: "air",
  },

  tornado: {
    id: "tornado",
    name: "Tornado",
    type: "ultimate",
    description: "Summon a massive tornado to devastate the battlefield",
    cooldown: 75000, // 75 seconds
    manaCost: 110,
    damage: 250,
    effect: "Moves randomly, pulls enemies in, persistent damage",
    requiredLevel: 22,
    elementType: "air",
  },

  flight_mastery: {
    id: "flight_mastery",
    name: "Flight Mastery",
    type: "passive",
    description: "Unparalleled mastery of aerial movement",
    cooldown: 0,
    manaCost: 0,
    effect: "+50% speed, +25% evasion, immune to ground effects",
    requiredLevel: 4,
    elementType: "air",
  },

  // Shadow Element Abilities
  shadow_strike: {
    id: "shadow_strike",
    name: "Shadow Strike",
    type: "active",
    description: "Strike from the shadows with deadly precision",
    cooldown: 10000, // 10 seconds
    manaCost: 30,
    damage: 140,
    effect: "Always hits, ignores armor, causes fear",
    requiredLevel: 2,
    elementType: "shadow",
  },

  void_collapse: {
    id: "void_collapse",
    name: "Void Collapse",
    type: "ultimate",
    description: "Tear reality itself to create a devastating void",
    cooldown: 120000, // 2 minutes
    manaCost: 150,
    damage: 400,
    effect: "True damage, ignores all defenses and immunities",
    requiredLevel: 30,
    elementType: "shadow",
  },

  shadow_veil: {
    id: "shadow_veil",
    name: "Shadow Veil",
    type: "passive",
    description: "Wrapped in shadows, hard to detect and target",
    cooldown: 0,
    manaCost: 0,
    effect: "+60% evasion, +25% critical hit chance, -20% healing received",
    requiredLevel: 10,
    elementType: "shadow",
  },

  // Light Element Abilities
  holy_beam: {
    id: "holy_beam",
    name: "Holy Beam",
    type: "active",
    description: "Channel pure light energy into a focused beam",
    cooldown: 7000, // 7 seconds
    manaCost: 25,
    damage: 110,
    effect: "Extra damage to shadow creatures, heals nearby allies",
    requiredLevel: 1,
    elementType: "light",
  },

  divine_judgment: {
    id: "divine_judgment",
    name: "Divine Judgment",
    type: "ultimate",
    description: "Call down heavenly wrath upon all enemies",
    cooldown: 80000, // 80 seconds
    manaCost: 130,
    damage: 280,
    effect: "Area damage, purges debuffs from allies, smites undead",
    requiredLevel: 26,
    elementType: "light",
  },

  healing_aura: {
    id: "healing_aura",
    name: "Healing Aura",
    type: "passive",
    description: "Radiates healing energy that aids nearby allies",
    cooldown: 0,
    manaCost: 0,
    effect: "Heals self and allies each turn, +50% healing effectiveness",
    requiredLevel: 7,
    elementType: "light",
  },

  // Poison Element Abilities
  toxic_cloud: {
    id: "toxic_cloud",
    name: "Toxic Cloud",
    type: "active",
    description: "Release a cloud of poisonous gas",
    cooldown: 15000, // 15 seconds
    manaCost: 35,
    damage: 60,
    effect: "Area poison, damage over time, reduces healing",
    requiredLevel: 2,
    elementType: "poison",
  },

  plague_breath: {
    id: "plague_breath",
    name: "Plague Breath",
    type: "ultimate",
    description: "Exhale a virulent plague that spreads between enemies",
    cooldown: 100000, // 100 seconds
    manaCost: 140,
    damage: 200,
    effect: "Spreads between enemies, stacks damage, prevents healing",
    requiredLevel: 28,
    elementType: "poison",
  },

  poison_immunity: {
    id: "poison_immunity",
    name: "Poison Immunity",
    type: "passive",
    description: "Immune to all toxins and poisons",
    cooldown: 0,
    manaCost: 0,
    effect:
      "Immune to poison, +30% poison damage, regenerates in toxic environments",
    requiredLevel: 9,
    elementType: "poison",
  },

  // Lightning Element Abilities
  lightning_bolt: {
    id: "lightning_bolt",
    name: "Lightning Bolt",
    type: "active",
    description: "Strike enemies with a bolt of pure electricity",
    cooldown: 4000, // 4 seconds
    manaCost: 22,
    damage: 125,
    effect: "Chains to nearby enemies, chance to stun",
    requiredLevel: 1,
    elementType: "lightning",
  },

  storm_lord: {
    id: "storm_lord",
    name: "Storm Lord",
    type: "ultimate",
    description: "Become one with the storm itself",
    cooldown: 70000, // 70 seconds
    manaCost: 120,
    effect: "Lightning strikes random enemies each turn, +100% speed",
    requiredLevel: 24,
    elementType: "lightning",
  },

  electric_scales: {
    id: "electric_scales",
    name: "Electric Scales",
    type: "passive",
    description: "Scales crackling with electricity shock attackers",
    cooldown: 0,
    manaCost: 0,
    effect: "Reflects lightning damage to attackers, +25% speed",
    requiredLevel: 11,
    elementType: "lightning",
  },
};

export function getAbilitiesByElement(element: ElementType): DragonAbility[] {
  return Object.values(dragonAbilities).filter(
    (ability) => ability.elementType === element,
  );
}

export function getAbilitiesByType(type: DragonAbilityType): DragonAbility[] {
  return Object.values(dragonAbilities).filter(
    (ability) => ability.type === type,
  );
}

export function getAvailableAbilities(
  element: ElementType,
  level: number,
): DragonAbility[] {
  return getAbilitiesByElement(element).filter(
    (ability) => ability.requiredLevel <= level,
  );
}

export function calculateAbilityCooldown(
  baseTime: number,
  intelligence: number,
  level: number,
): number {
  // Higher intelligence and level reduce cooldowns
  const intModifier = Math.max(0.5, 1 - (intelligence - 100) / 500);
  const levelModifier = Math.max(0.7, 1 - level * 0.01);

  return Math.round(baseTime * intModifier * levelModifier);
}

export function calculateAbilityDamage(
  baseDamage: number,
  stats: { attack: number; magic: number; level: number },
): number {
  const attackModifier = stats.attack / 100;
  const magicModifier = stats.magic / 100;
  const levelModifier = 1 + stats.level * 0.05;

  return Math.round(
    baseDamage * attackModifier * magicModifier * levelModifier,
  );
}

