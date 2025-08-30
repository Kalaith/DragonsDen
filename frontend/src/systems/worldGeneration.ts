import { WorldLocation, BiomeType, LocationDifficulty, AncientRuin, WorldEvent } from '../types/world';
import { ElementType } from '../types/dragons';

export interface WorldGenerationConfig {
  worldSize: { width: number; height: number };
  seed: string;
  biomeDistribution: Record<BiomeType, number>;
  difficultyProgression: {
    easyRadius: number;
    normalRadius: number;
    hardRadius: number;
  };
  locationDensity: number;
  ruinProbability: number;
  treasureDensity: number;
}

export class WorldGenerator {
  private config: WorldGenerationConfig;
  private rng: SeededRandom;
  
  constructor(config: WorldGenerationConfig) {
    this.config = config;
    this.rng = new SeededRandom(config.seed);
  }
  
  generateWorld(): WorldLocation[] {
    const locations: WorldLocation[] = [];
    const { width, height } = this.config.worldSize;
    
    // Generate base terrain using Perlin noise-like algorithm
    const heightMap = this.generateHeightMap(width, height);
    const biomeMap = this.generateBiomes(heightMap, width, height);
    
    // Generate locations based on interesting terrain features
    for (let x = 0; x < width; x += 5) { // Every 5 units to avoid overcrowding
      for (let y = 0; y < height; y += 5) {
        if (this.rng.random() < this.config.locationDensity) {
          const location = this.generateLocation(x, y, biomeMap[x][y], heightMap[x][y]);
          locations.push(location);
        }
      }
    }
    
    // Ensure starting area has appropriate locations
    this.ensureStartingArea(locations);
    
    // Add connecting paths and logical progression
    this.addLocationConnections(locations);
    
    return locations;
  }
  
  private generateHeightMap(width: number, height: number): number[][] {
    const heightMap: number[][] = [];
    
    for (let x = 0; x < width; x++) {
      heightMap[x] = [];
      for (let y = 0; y < height; y++) {
        // Simplified noise generation - in production you'd use proper Perlin noise
        let height = 0;
        let amplitude = 1;
        let frequency = 0.01;
        
        // Multiple octaves for more realistic terrain
        for (let i = 0; i < 6; i++) {
          height += amplitude * this.noise(x * frequency, y * frequency);
          amplitude *= 0.5;
          frequency *= 2;
        }
        
        heightMap[x][y] = Math.max(0, Math.min(1, (height + 1) / 2));
      }
    }
    
    return heightMap;
  }
  
  private generateBiomes(heightMap: number[][], width: number, height: number): BiomeType[][] {
    const biomeMap: BiomeType[][] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let x = 0; x < width; x++) {
      biomeMap[x] = [];
      for (let y = 0; y < height; y++) {
        const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const normalizedDistance = distanceFromCenter / Math.sqrt(centerX ** 2 + centerY ** 2);
        const height = heightMap[x][y];
        
        biomeMap[x][y] = this.determineBiome(height, normalizedDistance, x, y);
      }
    }
    
    return biomeMap;
  }
  
  private determineBiome(height: number, distanceFromCenter: number, x: number, y: number): BiomeType {
    // Use position-based noise for biome variation
    const biomeNoise = this.noise(x * 0.005, y * 0.005);
    
    // High altitude areas
    if (height > 0.8) {
      return distanceFromCenter > 0.7 ? 'mountain' : 'sky_realm';
    }
    
    // Water areas
    if (height < 0.3) {
      return 'ocean';
    }
    
    // Extreme distance from center suggests hostile environments
    if (distanceFromCenter > 0.8) {
      if (biomeNoise > 0.3) return 'shadow_realm';
      if (biomeNoise > 0.0) return 'volcanic';
      return 'desert';
    }
    
    // Mid-range areas based on height and noise
    if (height > 0.6) {
      return biomeNoise > 0.2 ? 'mountain' : 'frozen';
    }
    
    if (height > 0.4) {
      if (biomeNoise > 0.4) return 'forest';
      if (biomeNoise > 0.0) return 'desert';
      return 'swamp';
    }
    
    // Default temperate areas
    return biomeNoise > 0.0 ? 'forest' : 'swamp';
  }
  
  private generateLocation(x: number, y: number, biome: BiomeType, height: number): WorldLocation {
    const centerDistance = Math.sqrt(x ** 2 + y ** 2);
    const difficulty = this.calculateDifficulty(centerDistance);
    const name = this.generateLocationName(biome, difficulty);
    
    const location: WorldLocation = {
      id: `loc_${x}_${y}`,
      name,
      biome,
      difficulty,
      discovered: centerDistance < 50, // Only starting area is discovered
      explorationProgress: 0,
      coordinates: { x, y },
      requiredLevel: this.calculateRequiredLevel(difficulty, centerDistance),
      
      resources: this.generateResources(biome, difficulty, height),
      encounters: this.generateEncounters(biome, difficulty),
      environmentEffects: this.generateEnvironmentalEffects(biome)
    };
    
    return location;
  }
  
  private calculateDifficulty(distanceFromCenter: number): LocationDifficulty {
    const { easyRadius, normalRadius, hardRadius } = this.config.difficultyProgression;
    
    if (distanceFromCenter < easyRadius) return 'peaceful';
    if (distanceFromCenter < easyRadius * 1.5) return 'easy';
    if (distanceFromCenter < normalRadius) return 'normal';
    if (distanceFromCenter < hardRadius) return 'hard';
    if (distanceFromCenter < hardRadius * 1.5) return 'extreme';
    return 'legendary';
  }
  
  private generateLocationName(biome: BiomeType, difficulty: LocationDifficulty): string {
    const biomeNames = {
      volcanic: ['Ember', 'Flame', 'Magma', 'Inferno', 'Cinder'],
      frozen: ['Frost', 'Ice', 'Blizzard', 'Crystal', 'Winter'],
      forest: ['Green', 'Wild', 'Ancient', 'Mystic', 'Elder'],
      desert: ['Sand', 'Dune', 'Mirage', 'Oasis', 'Scorching'],
      swamp: ['Murky', 'Bog', 'Mist', 'Thorn', 'Decay'],
      mountain: ['Peak', 'Summit', 'Ridge', 'Crag', 'Stone'],
      ocean: ['Deep', 'Wave', 'Tide', 'Coral', 'Abyss'],
      sky_realm: ['Cloud', 'Wind', 'Storm', 'Celestial', 'Ethereal'],
      shadow_realm: ['Shadow', 'Void', 'Dark', 'Nightmare', 'Cursed']
    };
    
    const suffixes = {
      peaceful: ['Haven', 'Sanctuary', 'Garden', 'Vale', 'Rest'],
      easy: ['Grove', 'Meadow', 'Hill', 'Brook', 'Glade'],
      normal: ['Land', 'Territory', 'Region', 'Domain', 'Expanse'],
      hard: ['Wastes', 'Reaches', 'Depths', 'Heights', 'Bounds'],
      extreme: ['Abyss', 'Maelstrom', 'Vortex', 'Chasm', 'Tempest'],
      legendary: ['Apocalypse', 'Cataclysm', 'Terminus', 'Nexus', 'Oblivion']
    };
    
    const biomeName = this.rng.choice(biomeNames[biome]);
    const suffix = this.rng.choice(suffixes[difficulty]);
    
    return `${biomeName} ${suffix}`;
  }
  
  private calculateRequiredLevel(difficulty: LocationDifficulty, distance: number): number {
    const baseLevels = {
      peaceful: 1,
      easy: 3,
      normal: 8,
      hard: 15,
      extreme: 25,
      legendary: 40
    };
    
    const distanceBonus = Math.floor(distance / 100);
    return baseLevels[difficulty] + distanceBonus;
  }
  
  private generateResources(biome: BiomeType, difficulty: LocationDifficulty, height: number): any {
    const biomeResources = {
      volcanic: {
        common: ['obsidian_shard', 'sulfur_crystal', 'lava_stone'],
        rare: ['fire_essence', 'molten_core', 'phoenix_feather'],
        unique: ['dragon_heart_ruby', 'eternal_flame']
      },
      frozen: {
        common: ['ice_crystal', 'frost_berry', 'winter_herb'],
        rare: ['frozen_tear', 'ice_essence', 'aurora_fragment'],
        unique: ['heart_of_winter', 'glacier_core']
      },
      forest: {
        common: ['elderwood', 'moonflower', 'spirit_moss'],
        rare: ['treant_bark', 'fairy_dust', 'nature_essence'],
        unique: ['world_tree_seed', 'druid_stone']
      },
      desert: {
        common: ['sand_glass', 'cactus_spine', 'sun_stone'],
        rare: ['mirage_essence', 'desert_rose', 'scorpion_venom'],
        unique: ['pharaoh_treasure', 'oasis_heart']
      },
      swamp: {
        common: ['bog_root', 'marsh_gas', 'toxic_moss'],
        rare: ['will_o_wisp', 'swamp_essence', 'crocodile_scale'],
        unique: ['ancient_bog_treasure', 'plague_source']
      },
      mountain: {
        common: ['mountain_ore', 'eagle_feather', 'stone_moss'],
        rare: ['mythril_vein', 'wind_essence', 'giant_tooth'],
        unique: ['mountain_king_crown', 'skyforge_metal']
      },
      ocean: {
        common: ['coral_fragment', 'sea_salt', 'kelp_strand'],
        rare: ['pearl', 'water_essence', 'kraken_ink'],
        unique: ['poseidon_trident', 'leviathan_scale']
      },
      sky_realm: {
        common: ['cloud_essence', 'wind_feather', 'star_fragment'],
        rare: ['storm_core', 'lightning_bottle', 'celestial_silk'],
        unique: ['sky_god_blessing', 'rainbow_bridge_shard']
      },
      shadow_realm: {
        common: ['shadow_wisp', 'dark_crystal', 'void_essence'],
        rare: ['nightmare_fuel', 'soul_fragment', 'darkness_incarnate'],
        unique: ['abyss_heart', 'oblivion_shard']
      }
    };
    
    return biomeResources[biome] || biomeResources.forest;
  }
  
  private generateEncounters(biome: BiomeType, difficulty: LocationDifficulty): any {
    // Generate wild dragons, ruins, and events based on biome and difficulty
    const encounters = {
      wildDragons: this.generateWildDragons(biome, difficulty),
      ancientRuins: this.generateRuins(biome, difficulty),
      events: this.generateEvents(biome, difficulty)
    };
    
    return encounters;
  }
  
  private generateWildDragons(biome: BiomeType, difficulty: LocationDifficulty): string[] {
    const biomeElements: Record<BiomeType, ElementType[]> = {
      volcanic: ['fire'],
      frozen: ['ice'],
      forest: ['earth', 'air'],
      desert: ['fire', 'earth'],
      swamp: ['poison', 'earth'],
      mountain: ['earth', 'air'],
      ocean: ['ice', 'air'],
      sky_realm: ['air', 'lightning'],
      shadow_realm: ['shadow', 'poison']
    };
    
    const elements = biomeElements[biome] || ['fire'];
    const dragonCount = this.getDragonCountByDifficulty(difficulty);
    
    return Array.from({ length: dragonCount }, (_, i) => 
      `${this.rng.choice(elements)}_dragon_${difficulty}_${i}`
    );
  }
  
  private generateRuins(biome: BiomeType, difficulty: LocationDifficulty): AncientRuin[] {
    if (this.rng.random() > this.config.ruinProbability) return [];
    
    const ruinTypes = ['temple', 'tower', 'tomb', 'library', 'fortress', 'sanctuary'] as const;
    const ruinType = this.rng.choice(ruinTypes);
    
    const ruin: AncientRuin = {
      id: `ruin_${this.rng.random().toString(36).substr(2, 9)}`,
      name: this.generateRuinName(ruinType, biome),
      type: ruinType,
      explored: false,
      floors: this.generateRuinFloors(ruinType, difficulty),
      requiredKeys: [],
      legendaryReward: this.generateLegendaryReward(biome, difficulty)
    };
    
    return [ruin];
  }
  
  private generateEvents(biome: BiomeType, difficulty: LocationDifficulty): WorldEvent[] {
    // Generate random events based on biome characteristics
    return [];
  }
  
  private generateEnvironmentalEffects(biome: BiomeType): any {
    const biomeEffects = {
      volcanic: {
        favoredElements: ['fire'],
        resistantElements: ['ice', 'air'],
        dangerLevel: 7
      },
      frozen: {
        favoredElements: ['ice'],
        resistantElements: ['fire'],
        dangerLevel: 5
      },
      forest: {
        favoredElements: ['earth', 'air'],
        resistantElements: ['fire'],
        dangerLevel: 3
      },
      desert: {
        favoredElements: ['fire'],
        resistantElements: ['ice', 'air'],
        dangerLevel: 6
      },
      swamp: {
        favoredElements: ['poison', 'earth'],
        resistantElements: ['light', 'fire'],
        dangerLevel: 8
      },
      mountain: {
        favoredElements: ['earth', 'air'],
        resistantElements: ['poison'],
        dangerLevel: 4
      },
      ocean: {
        favoredElements: ['ice', 'air'],
        resistantElements: ['fire', 'earth'],
        dangerLevel: 6
      },
      sky_realm: {
        favoredElements: ['air', 'lightning'],
        resistantElements: ['earth'],
        dangerLevel: 9
      },
      shadow_realm: {
        favoredElements: ['shadow'],
        resistantElements: ['light'],
        dangerLevel: 10
      }
    };
    
    return biomeEffects[biome] || biomeEffects.forest;
  }
  
  // Helper methods
  private noise(x: number, y: number): number {
    // Simplified noise function - in production use proper Perlin noise
    const n = Math.sin(x) * Math.cos(y) * 12345.6789;
    return (n - Math.floor(n)) * 2 - 1;
  }
  
  private getDragonCountByDifficulty(difficulty: LocationDifficulty): number {
    const counts = {
      peaceful: 0,
      easy: 1,
      normal: 2,
      hard: 3,
      extreme: 4,
      legendary: 6
    };
    return counts[difficulty];
  }
  
  private generateRuinName(type: string, biome: BiomeType): string {
    const adjectives = {
      volcanic: 'Molten',
      frozen: 'Frozen',
      forest: 'Ancient',
      desert: 'Buried',
      swamp: 'Sunken',
      mountain: 'Sky-high',
      ocean: 'Sunken',
      sky_realm: 'Floating',
      shadow_realm: 'Cursed'
    };
    
    return `${adjectives[biome] || 'Ancient'} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }
  
  private generateRuinFloors(type: string, difficulty: LocationDifficulty): any[] {
    const floorCount = {
      peaceful: 1,
      easy: 2,
      normal: 3,
      hard: 4,
      extreme: 5,
      legendary: 7
    }[difficulty];
    
    return Array.from({ length: floorCount }, (_, i) => ({
      level: i + 1,
      layout: this.rng.choice(['linear', 'branching', 'circular', 'maze']),
      challenges: [],
      treasures: [],
      guardian: i === floorCount - 1 ? { type: 'boss', difficulty: 8, rewards: [] } : undefined
    }));
  }
  
  private generateLegendaryReward(biome: BiomeType, difficulty: LocationDifficulty): string | undefined {
    if (difficulty === 'legendary') {
      return `${biome}_legendary_artifact`;
    }
    return undefined;
  }
  
  private ensureStartingArea(locations: WorldLocation[]): void {
    // Ensure there are appropriate starting locations near center
    const startingLocations = locations.filter(loc => 
      Math.sqrt(loc.coordinates.x ** 2 + loc.coordinates.y ** 2) < 100
    );
    
    if (startingLocations.length < 3) {
      // Add starter locations if needed
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3;
        const x = Math.cos(angle) * 50;
        const y = Math.sin(angle) * 50;
        
        const starterLocation: WorldLocation = {
          id: `starter_${i}`,
          name: `Peaceful Valley ${i + 1}`,
          biome: 'forest',
          difficulty: 'peaceful',
          discovered: true,
          explorationProgress: 100,
          coordinates: { x, y },
          requiredLevel: 1,
          resources: {
            commonTreasures: ['basic_gem', 'small_gold'],
            rareTreasures: ['training_manual'],
            uniqueResources: []
          },
          encounters: {
            wildDragons: [],
            ancientRuins: [],
            events: []
          },
          environmentEffects: {
            favoredElements: ['earth', 'air'],
            resistantElements: [],
            dangerLevel: 1
          }
        };
        
        locations.push(starterLocation);
      }
    }
  }
  
  private addLocationConnections(locations: WorldLocation[]): void {
    // Add logical connections between locations for progression
    // This would implement pathfinding and ensure locations are reachable
  }
}

class SeededRandom {
  private seed: number;
  
  constructor(seedString: string) {
    this.seed = this.stringToSeed(seedString);
  }
  
  private stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  random(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  
  choice<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }
}