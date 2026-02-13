
import { AncientRuin, RuinChallenge } from "../types/world";
import { Dragon, type DragonStats, type ElementType } from "../types/dragons";

export type PuzzleType =
  | "symbol_sequence"
  | "elemental_alignment"
  | "riddle"
  | "pattern_matching"
  | "pressure_plates"
  | "mirror_reflection"
  | "ancient_language"
  | "mechanical_gears";

export type TrapType =
  | "spike_trap"
  | "poison_dart"
  | "flame_jet"
  | "ice_prison"
  | "lightning_field"
  | "gravity_well"
  | "illusion_maze"
  | "temporal_loop";

export interface PuzzleSolution {
  type: PuzzleType;
  difficulty: number;
  solution: unknown;
  hints: string[];
  timeLimit?: number;
  requiredElements?: ElementType[];
  requiredStats?: Array<{ stat: keyof DragonStats; minimum: number }>;
}

export interface TrapConfiguration {
  type: TrapType;
  damage: number;
  effect: string;
  duration: number;
  disarmRequirements: {
    skill: string;
    difficulty: number;
    tools?: string[];
  };
}

export interface ExplorationResult {
  success: boolean;
  damage: number;
  loot: string[];
  experience: number;
  discoveries: string[];
  penalties?: string[];
  newRoomUnlocked?: boolean;
}

export const puzzleTemplates: Record<PuzzleType, PuzzleSolution[]> = {
  symbol_sequence: [
    {
      type: "symbol_sequence",
      difficulty: 3,
      solution: ["fire", "water", "earth", "air"],
      hints: [
        "The four primal elements in order of creation",
        "Heat before moisture",
        "Foundation before freedom",
      ],
      timeLimit: 300,
    },
    {
      type: "symbol_sequence",
      difficulty: 5,
      solution: ["shadow", "light", "lightning", "poison", "ice"],
      hints: [
        "From darkness comes illumination",
        "Energy flows through corruption to purity",
      ],
      timeLimit: 480,
      requiredElements: ["shadow", "light"],
    },
  ],

  elemental_alignment: [
    {
      type: "elemental_alignment",
      difficulty: 4,
      solution: { fire: "south", ice: "north", earth: "center", air: "above" },
      hints: [
        "Fire seeks warmth",
        "Ice embraces cold",
        "Earth anchors all",
        "Air rises free",
      ],
      requiredElements: ["fire", "ice", "earth", "air"],
    },
    {
      type: "elemental_alignment",
      difficulty: 6,
      solution: {
        light: "zenith",
        shadow: "nadir",
        lightning: "storm",
        poison: "decay",
      },
      hints: [
        "Light reaches highest",
        "Darkness delves deepest",
        "Power crackles in chaos",
      ],
      requiredElements: ["light", "shadow", "lightning"],
    },
  ],

  riddle: [
    {
      type: "riddle",
      difficulty: 2,
      solution: "echo",
      hints: [
        "I speak without a mouth and hear without ear",
        "I am born of your voice but I am not you",
        "In mountains and caverns I am found",
      ],
      timeLimit: 600,
    },
    {
      type: "riddle",
      difficulty: 4,
      solution: "time",
      hints: [
        "I devour all things: birds, beasts, trees, flowers",
        "I gnaw iron, bite steel, and turn stone to sand",
        "I slay kings and ruin cities, yet none can slay me",
      ],
      timeLimit: 900,
      requiredStats: [{ stat: "intelligence", minimum: 120 }],
    },
    {
      type: "riddle",
      difficulty: 6,
      solution: "dragon_soul",
      hints: [
        "Ancient as mountains, yet born of flame",
        "Wisdom of ages, yet hunger for more",
        "Master of elements, yet slave to pride",
        "Keeper of treasures, yet seeks the priceless",
      ],
      timeLimit: 1200,
      requiredStats: [{ stat: "intelligence", minimum: 150 }],
    },
  ],

  pattern_matching: [
    {
      type: "pattern_matching",
      difficulty: 3,
      solution: [1, 1, 2, 3, 5, 8, 13, 21],
      hints: [
        "Each number is the sum of the two before",
        "Nature loves this sequence",
      ],
      timeLimit: 240,
    },
    {
      type: "pattern_matching",
      difficulty: 5,
      solution: ["triangle", "square", "pentagon", "hexagon"],
      hints: ["Growing sides in harmony", "Sacred geometry of creation"],
      timeLimit: 420,
      requiredStats: [{ stat: "intelligence", minimum: 110 }],
    },
  ],

  pressure_plates: [
    {
      type: "pressure_plates",
      difficulty: 4,
      solution: {
        sequence: ["plate_1", "plate_3", "plate_2", "plate_4"],
        weight_required: 500,
      },
      hints: [
        "Weight of a dragon is needed",
        "The path is not straight",
        "Begin where the eye looks first",
      ],
      requiredStats: [{ stat: "health", minimum: 200 }], // Heavy dragon needed
    },
  ],

  mirror_reflection: [
    {
      type: "mirror_reflection",
      difficulty: 5,
      solution: { angle: 45, target: "crystal_focus" },
      hints: [
        "Light bends to will",
        "The crystal hungers for illumination",
        "Angels matter more than distance",
      ],
      requiredElements: ["light"],
      timeLimit: 300,
    },
  ],

  ancient_language: [
    {
      type: "ancient_language",
      difficulty: 6,
      solution: "draconum_eternus_sapientia",
      hints: [
        "The first word speaks of our kind",
        "The second speaks of unending time",
        "The third speaks of accumulated knowledge",
      ],
      timeLimit: 900,
      requiredStats: [{ stat: "intelligence", minimum: 140 }],
    },
  ],

  mechanical_gears: [
    {
      type: "mechanical_gears",
      difficulty: 7,
      solution: {
        gear_1: "clockwise",
        gear_2: "counter",
        gear_3: "clockwise",
        turns: 7,
      },
      hints: [
        "Seven is the number of completion",
        "Opposition creates motion",
        "The first turns as the sun",
      ],
      timeLimit: 600,
    },
  ],
};

export const trapConfigurations: Record<TrapType, TrapConfiguration[]> = {
  spike_trap: [
    {
      type: "spike_trap",
      damage: 50,
      effect: "Physical damage and bleeding",
      duration: 3,
      disarmRequirements: { skill: "perception", difficulty: 5 },
    },
  ],

  poison_dart: [
    {
      type: "poison_dart",
      damage: 30,
      effect: "Poison damage over time",
      duration: 10,
      disarmRequirements: { skill: "agility", difficulty: 6 },
    },
  ],

  flame_jet: [
    {
      type: "flame_jet",
      damage: 80,
      effect: "Fire damage and burn",
      duration: 5,
      disarmRequirements: {
        skill: "elemental_resistance",
        difficulty: 4,
        tools: ["fire_immunity"],
      },
    },
  ],

  ice_prison: [
    {
      type: "ice_prison",
      damage: 40,
      effect: "Frozen for multiple turns",
      duration: 8,
      disarmRequirements: { skill: "strength", difficulty: 7 },
    },
  ],

  lightning_field: [
    {
      type: "lightning_field",
      damage: 120,
      effect: "Electrical damage and stun",
      duration: 2,
      disarmRequirements: { skill: "magical_knowledge", difficulty: 8 },
    },
  ],

  gravity_well: [
    {
      type: "gravity_well",
      damage: 0,
      effect: "Immobilized and gradual crushing",
      duration: 15,
      disarmRequirements: { skill: "flight", difficulty: 9 },
    },
  ],

  illusion_maze: [
    {
      type: "illusion_maze",
      damage: 0,
      effect: "Lost in illusions, time wasted",
      duration: 30,
      disarmRequirements: { skill: "mental_resistance", difficulty: 7 },
    },
  ],

  temporal_loop: [
    {
      type: "temporal_loop",
      damage: 0,
      effect: "Stuck repeating same actions",
      duration: 20,
      disarmRequirements: { skill: "ancient_knowledge", difficulty: 10 },
    },
  ],
};

export class RuinsExplorationSystem {
  static exploreFloor(
    ruin: AncientRuin,
    floorIndex: number,
    explorationTeam: Dragon[],
    playerChoices: Record<string, unknown> = {},
  ): ExplorationResult {
    const floor = ruin.floors[floorIndex];
    if (!floor) {
      return {
        success: false,
        damage: 0,
        loot: [],
        experience: 0,
        discoveries: ["Floor not found"],
      };
    }

    let totalDamage = 0;
    let totalExperience = 0;
    const loot: string[] = [];
    const discoveries: string[] = [];
    let success = true;

    // Process challenges in order
    for (const challenge of floor.challenges) {
      const result = this.processChallenge(
        challenge,
        explorationTeam,
        playerChoices,
      );

      totalDamage += result.damage;
      totalExperience += result.experience;
      loot.push(...result.loot);
      discoveries.push(...result.discoveries);

      if (!result.success) {
        success = false;
        // Some challenges might be optional or have alternative solutions
        if (challenge.type === "combat") {
          break; // Combat failures end exploration
        }
      }
    }

    // Floor completion bonus
    if (success) {
      totalExperience += floor.level * 50;
      loot.push(...floor.treasures);

      // Guardian encounter
      if (floor.guardian) {
        const guardianResult = this.processGuardian(
          floor.guardian,
          explorationTeam,
        );
        totalDamage += guardianResult.damage;
        totalExperience += guardianResult.experience;
        loot.push(...guardianResult.loot);

        if (!guardianResult.success) {
          success = false;
        }
      }
    }

    return {
      success,
      damage: totalDamage,
      loot,
      experience: totalExperience,
      discoveries,
      newRoomUnlocked: success && floorIndex < ruin.floors.length - 1,
    };
  }

  static processChallenge(
    challenge: RuinChallenge,
    team: Dragon[],
    playerChoices: Record<string, unknown>,
  ): ExplorationResult {
    switch (challenge.type) {
      case "puzzle":
        return this.solvePuzzle(challenge, team, playerChoices);
      case "trap":
        return this.disarmTrap(challenge, team, playerChoices);
      case "riddle":
        return this.answerRiddle(challenge, team, playerChoices);
      case "combat":
        return this.fightGuardian(challenge, team);
      case "stealth":
        return this.stealthChallenge(challenge, team);
      default:
        return {
          success: false,
          damage: 0,
          loot: [],
          experience: 0,
          discoveries: ["Unknown challenge type"],
        };
    }
  }

  static solvePuzzle(
    challenge: RuinChallenge,
    team: Dragon[],
    playerChoices: Record<string, unknown>,
  ): ExplorationResult {
    const puzzle = this.generatePuzzle(challenge.difficulty);
    const playerSolution = playerChoices[`puzzle_${challenge.description}`];

    // Check if team meets requirements
    const canSolve = this.checkPuzzleRequirements(puzzle, team);
    if (!canSolve.success) {
      return {
        success: false,
        damage: 0,
        loot: [],
        experience: 10,
        discoveries: canSolve.reason
          ? [canSolve.reason]
          : ["Unable to solve puzzle"],
      };
    }

    // Check solution
    const solved = this.validatePuzzleSolution(puzzle, playerSolution);

    if (solved) {
      return {
        success: true,
        damage: 0,
        loot: this.getPuzzleRewards(puzzle.difficulty),
        experience: puzzle.difficulty * 25,
        discoveries: [
          "Ancient knowledge unlocked",
          "Puzzle mechanism understood",
        ],
      };
    } else {
      // Failure might have consequences
      const penalty = Math.min(20, puzzle.difficulty * 5);
      return {
        success: false,
        damage: penalty,
        loot: [],
        experience: 5,
        discoveries: ["Puzzle mechanism triggered defensive measures"],
        penalties: ["Wrong solution caused backlash"],
      };
    }
  }

  static disarmTrap(
    challenge: RuinChallenge,
    team: Dragon[],
    playerChoices: Record<string, unknown>,
  ): ExplorationResult {
    const trap = this.generateTrap(challenge.difficulty);
    const approachValue = playerChoices[`trap_${challenge.description}`];
    const approach =
      typeof approachValue === "string" ? approachValue : "careful";

    const bestDragon = this.getBestDragonForTrap(team, trap);
    const skillValue = this.calculateTrapDisarmSkill(bestDragon, trap);
    const requiredSkill = trap.disarmRequirements.difficulty * 10;

    // Modify success chance based on approach
    let successModifier = 1.0;
    let damageModifier = 1.0;

    switch (approach) {
      case "careful":
        successModifier = 1.2;
        damageModifier = 0.7;
        break;
      case "quick":
        successModifier = 0.8;
        damageModifier = 1.3;
        break;
      case "forceful":
        successModifier = 0.6;
        damageModifier = 0.5; // Less damage but lower success
        break;
      case "magical":
        if (bestDragon.stats.magic > 120) {
          successModifier = 1.4;
          damageModifier = 0.3;
        } else {
          successModifier = 0.4;
          damageModifier = 1.8;
        }
        break;
    }

    const adjustedSkill = skillValue * successModifier;
    const success = adjustedSkill >= requiredSkill;

    if (success) {
      return {
        success: true,
        damage: 0,
        loot: ["ancient_component", "trap_mechanism"],
        experience: challenge.difficulty * 20,
        discoveries: [
          "Trap disarmed successfully",
          "Learned about ancient security",
        ],
      };
    } else {
      // Trap triggers
      const damage = Math.round(trap.damage * damageModifier);
      return {
        success: false,
        damage,
        loot: [],
        experience: 8,
        discoveries: [`Trap triggered: ${trap.effect}`],
        penalties: ["Team takes trap damage"],
      };
    }
  }

  static answerRiddle(
    challenge: RuinChallenge,
    team: Dragon[],
    playerChoices: Record<string, unknown>,
  ): ExplorationResult {
    const riddle = this.generateRiddle(challenge.difficulty);
    const playerAnswerValue = playerChoices[`riddle_${challenge.description}`];
    const playerAnswer =
      typeof playerAnswerValue === "string"
        ? playerAnswerValue.toLowerCase()
        : "";

    // Check intelligence requirements
    const smartestDragon = team.reduce((best, current) =>
      current.stats.intelligence > best.stats.intelligence ? current : best,
    );

    if (riddle.requiredStats) {
      for (const req of riddle.requiredStats) {
        const dragonStat = smartestDragon.stats[req.stat];
        if (typeof dragonStat === "number" && dragonStat < req.minimum) {
          return {
            success: false,
            damage: 0,
            loot: [],
            experience: 5,
            discoveries: ["The riddle is beyond your understanding"],
            penalties: ["Insufficient intelligence to comprehend riddle"],
          };
        }
      }
    }

    const riddleSolution =
      typeof riddle.solution === "string" ? riddle.solution.toLowerCase() : "";
    const correct = playerAnswer === riddleSolution;

    if (correct) {
      return {
        success: true,
        damage: 0,
        loot: this.getRiddleRewards(riddle.difficulty),
        experience: riddle.difficulty * 30,
        discoveries: [
          "Ancient wisdom gained",
          "Riddle master's blessing received",
        ],
      };
    } else {
      return {
        success: false,
        damage: 0,
        loot: [],
        experience: 10,
        discoveries: ["The ancient guardian remains unconvinced"],
        penalties: ["Wrong answer echoes through the halls"],
      };
    }
  }

  static fightGuardian(
    challenge: RuinChallenge,
    team: Dragon[],
  ): ExplorationResult {
    // Simplified combat resolution
    const teamPower = team.reduce(
      (total, dragon) =>
        total +
        dragon.stats.attack +
        dragon.stats.defense +
        dragon.stats.health,
      0,
    );

    const guardianPower = challenge.difficulty * 150;
    const powerRatio = teamPower / guardianPower;

    let success = false;
    let damage = 0;
    let experience = challenge.difficulty * 40;

    if (powerRatio >= 1.2) {
      // Easy victory
      success = true;
      damage = Math.max(0, guardianPower * 0.1);
      experience *= 1.2;
    } else if (powerRatio >= 0.8) {
      // Close fight
      success = Math.random() < 0.7;
      damage = guardianPower * 0.3;
      experience *= success ? 1.5 : 0.5;
    } else {
      // Difficult fight
      success = Math.random() < 0.3;
      damage = guardianPower * 0.6;
      experience *= success ? 2.0 : 0.3;
    }

    const result: ExplorationResult = {
      success,
      damage: Math.round(damage),
      loot: success ? this.getGuardianLoot(challenge.difficulty) : [],
      experience: Math.round(experience),
      discoveries: success
        ? ["Guardian defeated", "Ancient protector's secrets revealed"]
        : ["Guardian proves too powerful", "Retreat necessary"],
    };

    if (!success) {
      result.penalties = ["Team overwhelmed by guardian"];
    }

    return result;
  }

  static stealthChallenge(
    challenge: RuinChallenge,
    team: Dragon[],
  ): ExplorationResult {
    // Check team stealth capabilities
    const stealthScore =
      team.reduce((total, dragon) => {
        let score = dragon.stats.speed * 0.5 + dragon.stats.intelligence * 0.3;

        // Shadow dragons get bonus
        if (dragon.traits.primaryElement === "shadow") {
          score *= 1.5;
        }

        // Smaller dragons are stealthier
        score *= 2.0 - dragon.appearance.size;

        return total + score;
      }, 0) / team.length;

    const requiredStealth = challenge.difficulty * 80;
    const success = stealthScore >= requiredStealth;

    if (success) {
      return {
        success: true,
        damage: 0,
        loot: ["stealth_knowledge", "hidden_passage_map"],
        experience: challenge.difficulty * 25,
        discoveries: ["Passed undetected", "Secret path discovered"],
      };
    } else {
      return {
        success: false,
        damage: challenge.difficulty * 15, // Alert guards cause damage
        loot: [],
        experience: 5,
        discoveries: ["Detection triggers ancient defenses"],
        penalties: ["Stealth attempt failed"],
      };
    }
  }

  // Helper methods
  private static generatePuzzle(difficulty: number): PuzzleSolution {
    const puzzleTypes = Object.keys(puzzleTemplates) as PuzzleType[];
    const suitablePuzzles = puzzleTypes.filter((type) =>
      puzzleTemplates[type].some(
        (p) => Math.abs(p.difficulty - difficulty) <= 1,
      ),
    );

    const randomType =
      suitablePuzzles[Math.floor(Math.random() * suitablePuzzles.length)];
    const puzzles = puzzleTemplates[randomType].filter(
      (p) => Math.abs(p.difficulty - difficulty) <= 1,
    );

    return puzzles[Math.floor(Math.random() * puzzles.length)];
  }

  private static generateTrap(difficulty: number): TrapConfiguration {
    void difficulty;
    const trapTypes = Object.keys(trapConfigurations) as TrapType[];
    const randomType = trapTypes[Math.floor(Math.random() * trapTypes.length)];
    const traps = trapConfigurations[randomType];

    return traps[Math.floor(Math.random() * traps.length)];
  }

  private static generateRiddle(difficulty: number): PuzzleSolution {
    const riddles = puzzleTemplates.riddle.filter(
      (r) => Math.abs(r.difficulty - difficulty) <= 1,
    );

    return (
      riddles[Math.floor(Math.random() * riddles.length)] ||
      puzzleTemplates.riddle[0]
    );
  }

  private static checkPuzzleRequirements(
    puzzle: PuzzleSolution,
    team: Dragon[],
  ): { success: boolean; reason?: string } {
    if (puzzle.requiredElements) {
      const teamElements = new Set(
        team
          .flatMap((d) => [d.traits.primaryElement, d.traits.secondaryElement])
          .filter((e): e is ElementType => Boolean(e)),
      );

      for (const element of puzzle.requiredElements) {
        if (!teamElements.has(element)) {
          return {
            success: false,
            reason: `Missing required element: ${element}`,
          };
        }
      }
    }

    if (puzzle.requiredStats) {
      for (const req of puzzle.requiredStats) {
        const hasStat = team.some((dragon) => {
          const stat = dragon.stats[req.stat];
          return typeof stat === "number" && stat >= req.minimum;
        });

        if (!hasStat) {
          return {
            success: false,
            reason: `Need ${req.stat} of at least ${req.minimum}`,
          };
        }
      }
    }

    return { success: true };
  }

  private static validatePuzzleSolution(
    puzzle: PuzzleSolution,
    playerSolution: unknown,
  ): boolean {
    if (Array.isArray(puzzle.solution)) {
      return JSON.stringify(puzzle.solution) === JSON.stringify(playerSolution);
    }

    if (typeof puzzle.solution === "object") {
      return JSON.stringify(puzzle.solution) === JSON.stringify(playerSolution);
    }

    return puzzle.solution === playerSolution;
  }

  private static getBestDragonForTrap(
    team: Dragon[],
    trap: TrapConfiguration,
  ): Dragon {
    return team.reduce((best, current) => {
      const currentSkill = this.calculateTrapDisarmSkill(current, trap);
      const bestSkill = this.calculateTrapDisarmSkill(best, trap);
      return currentSkill > bestSkill ? current : best;
    });
  }

  private static calculateTrapDisarmSkill(
    dragon: Dragon,
    trap: TrapConfiguration,
  ): number {
    const skill = trap.disarmRequirements.skill;
    let skillValue = 0;

    switch (skill) {
      case "perception":
        skillValue = dragon.stats.intelligence + dragon.stats.speed * 0.5;
        break;
      case "agility":
        skillValue = dragon.stats.speed + dragon.stats.intelligence * 0.3;
        break;
      case "strength":
        skillValue = dragon.stats.attack + dragon.stats.health * 0.4;
        break;
      case "magical_knowledge":
        skillValue = dragon.stats.magic + dragon.stats.intelligence * 0.6;
        break;
      case "elemental_resistance":
        skillValue = dragon.stats.defense + dragon.stats.magic * 0.4;
        break;
      case "flight":
        skillValue = dragon.stats.speed * 1.2 + dragon.stats.health * 0.2;
        break;
      case "mental_resistance":
        skillValue =
          dragon.stats.intelligence * 1.1 + dragon.stats.defense * 0.3;
        break;
      case "ancient_knowledge":
        skillValue =
          dragon.stats.intelligence * 0.8 +
          (dragon.traits.age === "ancient"
            ? 200
            : dragon.traits.age === "elder"
              ? 100
              : 0);
        break;
      default:
        skillValue = 50;
    }

    return skillValue;
  }

  private static getPuzzleRewards(difficulty: number): string[] {
    const baseRewards = [
      "ancient_knowledge_fragment",
      "puzzle_solution_scroll",
    ];

    if (difficulty >= 5) {
      baseRewards.push("rare_ancient_artifact");
    }

    if (difficulty >= 7) {
      baseRewards.push("legendary_puzzle_key");
    }

    return baseRewards;
  }

  private static getRiddleRewards(difficulty: number): string[] {
    const baseRewards = ["wisdom_essence", "ancient_scroll"];

    if (difficulty >= 4) {
      baseRewards.push("riddle_master_token");
    }

    if (difficulty >= 6) {
      baseRewards.push("oracle_blessing");
    }

    return baseRewards;
  }

  private static getGuardianLoot(difficulty: number): string[] {
    const baseRewards = ["guardian_essence", "ancient_weapon_fragment"];

    if (difficulty >= 5) {
      baseRewards.push("guardian_crystal");
    }

    if (difficulty >= 8) {
      baseRewards.push("legendary_guardian_core");
    }

    return baseRewards;
  }

  private static processGuardian(
    guardian: { type: string; difficulty: number; rewards: string[] },
    team: Dragon[],
  ): ExplorationResult {
    void guardian.type;
    // Process floor guardian (boss fight)
    const teamPower = team.reduce(
      (total, dragon) =>
        total +
        dragon.stats.attack +
        dragon.stats.defense +
        dragon.stats.health,
      0,
    );

    const guardianPower = guardian.difficulty * 200; // Stronger than regular combat
    const success = teamPower >= guardianPower * 0.8;

    return {
      success,
      damage: success ? guardianPower * 0.2 : guardianPower * 0.8,
      loot: success ? guardian.rewards : [],
      experience: guardian.difficulty * 60,
      discoveries: success
        ? ["Floor guardian defeated", "Ancient chamber secured"]
        : ["Floor guardian victorious", "Must retreat and return stronger"],
    };
  }
}

