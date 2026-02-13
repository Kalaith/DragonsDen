
import { WeatherSystem, WeatherType, BiomeType } from "../types/world";
import { ElementType } from "../types/dragons";

export interface WeatherEffect {
  explorationSpeed: number;
  treasureChance: number;
  dragonMoodEffect: number;
  elementalBonuses: Array<{ element: ElementType; multiplier: number }>;
  combatModifiers: {
    accuracy: number;
    damage: number;
    speed: number;
  };
  specialEffects: string[];
}

export const weatherEffects: Record<WeatherType, WeatherEffect> = {
  clear: {
    explorationSpeed: 1.0,
    treasureChance: 1.0,
    dragonMoodEffect: 0.1,
    elementalBonuses: [
      { element: "light", multiplier: 1.2 },
      { element: "air", multiplier: 1.1 },
    ],
    combatModifiers: {
      accuracy: 1.0,
      damage: 1.0,
      speed: 1.0,
    },
    specialEffects: ["increased_visibility", "good_flying_conditions"],
  },

  rain: {
    explorationSpeed: 0.8,
    treasureChance: 0.9,
    dragonMoodEffect: -0.05,
    elementalBonuses: [
      { element: "ice", multiplier: 1.3 },
      { element: "lightning", multiplier: 1.4 },
    ],
    combatModifiers: {
      accuracy: 0.9,
      damage: 1.0,
      speed: 0.95,
    },
    specialEffects: [
      "fire_resistance",
      "muddy_terrain",
      "enhanced_plant_growth",
    ],
  },

  storm: {
    explorationSpeed: 0.5,
    treasureChance: 0.7,
    dragonMoodEffect: -0.2,
    elementalBonuses: [
      { element: "lightning", multiplier: 2.0 },
      { element: "air", multiplier: 1.5 },
    ],
    combatModifiers: {
      accuracy: 0.7,
      damage: 1.1,
      speed: 0.8,
    },
    specialEffects: [
      "lightning_strikes",
      "strong_winds",
      "flight_hazard",
      "electrical_interference",
    ],
  },

  fog: {
    explorationSpeed: 0.6,
    treasureChance: 1.2,
    dragonMoodEffect: -0.1,
    elementalBonuses: [
      { element: "shadow", multiplier: 1.6 },
      { element: "ice", multiplier: 1.2 },
    ],
    combatModifiers: {
      accuracy: 0.6,
      damage: 0.9,
      speed: 0.9,
    },
    specialEffects: [
      "reduced_visibility",
      "stealth_bonus",
      "mystery_encounters",
    ],
  },

  blizzard: {
    explorationSpeed: 0.3,
    treasureChance: 0.5,
    dragonMoodEffect: -0.3,
    elementalBonuses: [
      { element: "ice", multiplier: 2.5 },
      { element: "air", multiplier: 1.3 },
    ],
    combatModifiers: {
      accuracy: 0.5,
      damage: 0.8,
      speed: 0.6,
    },
    specialEffects: [
      "freezing_damage",
      "extreme_cold",
      "ice_terrain",
      "visibility_zero",
    ],
  },

  sandstorm: {
    explorationSpeed: 0.4,
    treasureChance: 0.6,
    dragonMoodEffect: -0.25,
    elementalBonuses: [
      { element: "earth", multiplier: 1.8 },
      { element: "air", multiplier: 1.4 },
    ],
    combatModifiers: {
      accuracy: 0.6,
      damage: 0.9,
      speed: 0.7,
    },
    specialEffects: [
      "sand_damage",
      "equipment_wear",
      "buried_treasures",
      "navigation_difficulty",
    ],
  },

  eclipse: {
    explorationSpeed: 0.9,
    treasureChance: 1.5,
    dragonMoodEffect: 0.2,
    elementalBonuses: [
      { element: "shadow", multiplier: 2.0 },
      { element: "light", multiplier: 0.5 },
    ],
    combatModifiers: {
      accuracy: 0.8,
      damage: 1.3,
      speed: 1.1,
    },
    specialEffects: [
      "magical_surge",
      "rare_events",
      "shadow_creatures",
      "mystical_phenomena",
    ],
  },

  aurora: {
    explorationSpeed: 1.1,
    treasureChance: 1.3,
    dragonMoodEffect: 0.3,
    elementalBonuses: [
      { element: "lightning", multiplier: 1.7 },
      { element: "ice", multiplier: 1.4 },
      { element: "light", multiplier: 1.5 },
    ],
    combatModifiers: {
      accuracy: 1.0,
      damage: 1.2,
      speed: 1.1,
    },
    specialEffects: [
      "magical_enhancement",
      "inspiration_boost",
      "navigation_aid",
      "beauty_bonus",
    ],
  },
};

export const biomeWeatherPatterns: Record<
  BiomeType,
  { common: WeatherType[]; rare: WeatherType[]; impossible: WeatherType[] }
> = {
  volcanic: {
    common: ["clear", "fog"],
    rare: ["rain", "eclipse"],
    impossible: ["blizzard", "aurora"],
  },

  frozen: {
    common: ["clear", "blizzard", "fog"],
    rare: ["aurora", "eclipse"],
    impossible: ["sandstorm"],
  },

  forest: {
    common: ["clear", "rain", "fog"],
    rare: ["storm", "eclipse"],
    impossible: ["blizzard", "sandstorm"],
  },

  desert: {
    common: ["clear", "sandstorm"],
    rare: ["rain", "eclipse"],
    impossible: ["blizzard", "aurora"],
  },

  swamp: {
    common: ["fog", "rain"],
    rare: ["storm", "eclipse"],
    impossible: ["blizzard", "sandstorm", "aurora"],
  },

  mountain: {
    common: ["clear", "fog", "storm"],
    rare: ["blizzard", "aurora"],
    impossible: ["sandstorm"],
  },

  ocean: {
    common: ["clear", "rain", "storm", "fog"],
    rare: ["aurora", "eclipse"],
    impossible: ["sandstorm", "blizzard"],
  },

  sky_realm: {
    common: ["clear", "storm", "aurora"],
    rare: ["fog", "eclipse"],
    impossible: ["sandstorm"],
  },

  shadow_realm: {
    common: ["fog", "eclipse"],
    rare: ["storm"],
    impossible: ["clear", "aurora", "blizzard", "sandstorm"],
  },
};

export class WeatherSystemManager {
  private currentWeather: WeatherSystem;
  private weatherHistory: Array<{
    weather: WeatherType;
    timestamp: number;
    duration: number;
  }> = [];
  private seasonalModifiers: Record<string, number> = {};

  constructor() {
    this.currentWeather = {
      current: "clear",
      duration: 120, // 2 hours default
      effects: weatherEffects.clear,
    };
  }

  updateWeather(deltaTime: number, currentBiome?: BiomeType): void {
    this.currentWeather.duration -= deltaTime / (1000 * 60); // Convert to minutes

    if (this.currentWeather.duration <= 0) {
      this.generateNewWeather(currentBiome);
    }

    // Apply gradual effects during weather transitions
    this.applyWeatherEffects();
  }

  private generateNewWeather(biome?: BiomeType): void {
    const patterns = biome
      ? biomeWeatherPatterns[biome]
      : {
          common: ["clear", "rain", "fog"] as WeatherType[],
          rare: ["storm", "eclipse"] as WeatherType[],
          impossible: [] as WeatherType[],
        };

    // Weather generation based on patterns and recent history
    let possibleWeathers: WeatherType[] = [];

    // 70% chance for common weather
    if (Math.random() < 0.7) {
      possibleWeathers = patterns.common;
    } else {
      possibleWeathers = [...patterns.common, ...patterns.rare];
    }

    // Remove impossible weathers
    possibleWeathers = possibleWeathers.filter(
      (w) => !patterns.impossible.includes(w),
    );

    // Avoid immediate repetition unless it's a storm system
    const lastWeather =
      this.weatherHistory[this.weatherHistory.length - 1]?.weather;
    if (lastWeather && possibleWeathers.length > 1) {
      possibleWeathers = possibleWeathers.filter(
        (w) =>
          w !== lastWeather || ["storm", "blizzard", "sandstorm"].includes(w),
      );
    }

    // Apply seasonal modifiers
    possibleWeathers = this.applySeasonalModifiers(possibleWeathers);

    // Select new weather
    const newWeather =
      possibleWeathers[Math.floor(Math.random() * possibleWeathers.length)] ??
      "clear";
    const duration = this.calculateWeatherDuration(newWeather);

    // Update current weather
    this.currentWeather = {
      current: newWeather,
      duration,
      effects: weatherEffects[newWeather],
    };

    // Record in history
    this.weatherHistory.push({
      weather: newWeather,
      timestamp: Date.now(),
      duration,
    });

    // Keep only last 10 weather events
    if (this.weatherHistory.length > 10) {
      this.weatherHistory.shift();
    }
  }

  private calculateWeatherDuration(weather: WeatherType): number {
    const baseDurations = {
      clear: 180, // 3 hours
      rain: 90, // 1.5 hours
      storm: 45, // 45 minutes
      fog: 120, // 2 hours
      blizzard: 30, // 30 minutes
      sandstorm: 60, // 1 hour
      eclipse: 15, // 15 minutes (rare event)
      aurora: 90, // 1.5 hours
    };

    const baseDuration = baseDurations[weather];
    const variance = 0.3; // ±30% variance

    return baseDuration * (1 + (Math.random() - 0.5) * variance * 2);
  }

  private applySeasonalModifiers(weathers: WeatherType[]): WeatherType[] {
    // This could be expanded with actual seasonal systems
    return weathers;
  }

  private applyWeatherEffects(): void {
    // Apply ongoing weather effects to game systems
    // This would integrate with other game systems
  }

  // Public methods for game integration
  getCurrentWeather(): WeatherSystem {
    return { ...this.currentWeather };
  }

  getWeatherEffect<K extends keyof WeatherEffect>(stat: K): WeatherEffect[K] {
    return this.currentWeather.effects[stat] as WeatherEffect[K];
  }

  getElementalModifier(element: ElementType): number {
    const bonus = (this.currentWeather.effects.elementalBonuses ?? []).find(
      (b) => b.element === element,
    );
    return bonus ? bonus.multiplier : 1.0;
  }

  isWeatherSuitableFor(activity: string): boolean {
    const effects = this.currentWeather.effects;

    switch (activity) {
      case "exploration":
        return effects.explorationSpeed >= 0.7;
      case "flight":
        return !(effects.specialEffects ?? []).includes("flight_hazard");
      case "treasure_hunting":
        return effects.treasureChance >= 0.8;
      case "combat":
        return (effects.combatModifiers?.accuracy ?? 1) >= 0.8;
      default:
        return true;
    }
  }

  forceWeatherChange(newWeather: WeatherType, duration?: number): void {
    this.currentWeather = {
      current: newWeather,
      duration: duration || this.calculateWeatherDuration(newWeather),
      effects: weatherEffects[newWeather],
    };
  }

  getWeatherForecast(
    biome?: BiomeType,
    hoursAhead = 12,
  ): Array<{ weather: WeatherType; probability: number }> {
    void hoursAhead;
    // Simple forecast system based on current conditions and patterns
    const patterns = biome
      ? biomeWeatherPatterns[biome]
      : {
          common: ["clear", "rain", "fog"] as WeatherType[],
          rare: ["storm", "eclipse"] as WeatherType[],
          impossible: [] as WeatherType[],
        };

    const forecast: Array<{ weather: WeatherType; probability: number }> = [];

    // Common weathers have base probability
    patterns.common.forEach((weather) => {
      forecast.push({ weather, probability: 0.6 / patterns.common.length });
    });

    // Rare weathers have lower probability
    patterns.rare.forEach((weather) => {
      forecast.push({ weather, probability: 0.3 / patterns.rare.length });
    });

    // Current weather continuation has bonus probability
    const currentWeatherForecast = forecast.find(
      (f) => f.weather === this.currentWeather.current,
    );
    if (currentWeatherForecast) {
      currentWeatherForecast.probability += 0.1;
    }

    return forecast.sort((a, b) => b.probability - a.probability);
  }

  getWeatherDescription(): string {
    const descriptions = {
      clear:
        "The sky is crystal clear with perfect visibility. Dragons soar freely through the pristine air.",
      rain: "Gentle rain falls steadily, creating a soothing rhythm. The air smells fresh and clean.",
      storm:
        "Dark clouds rage overhead with fierce winds and crackling lightning. Flight is treacherous.",
      fog: "A thick, mysterious fog blankets the land, reducing visibility but hiding secrets.",
      blizzard:
        "A howling blizzard brings bitter cold and blinding snow. Only the hardiest dare venture out.",
      sandstorm:
        "Fierce winds whip sand into a stinging vortex, obscuring all landmarks.",
      eclipse:
        "The sun is blocked by shadow, creating an otherworldly twilight filled with mystical energy.",
      aurora:
        "Beautiful lights dance across the sky in ribbons of green, blue, and purple.",
    };

    return descriptions[this.currentWeather.current];
  }

  // Static utility methods
  static getOptimalWeatherFor(activity: string): WeatherType[] {
    const optimalWeathers: Record<string, WeatherType[]> = {
      exploration: ["clear", "aurora"],
      combat: ["clear", "aurora"],
      treasure_hunting: ["fog", "eclipse", "aurora"],
      flight: ["clear", "aurora"],
      stealth: ["fog", "storm", "eclipse"],
      magic: ["eclipse", "aurora", "storm"],
      rest: ["clear", "rain"],
    };

    return (
      optimalWeathers[activity as keyof typeof optimalWeathers] || ["clear"]
    );
  }

  static getWorstWeatherFor(activity: string): WeatherType[] {
    const worstWeathers: Record<string, WeatherType[]> = {
      exploration: ["blizzard", "sandstorm"],
      combat: ["blizzard", "fog"],
      flight: ["storm", "blizzard", "sandstorm"],
      precision: ["storm", "fog", "blizzard"],
      visibility: ["fog", "blizzard", "sandstorm"],
    };

    return worstWeathers[activity as keyof typeof worstWeathers] || [];
  }
}
