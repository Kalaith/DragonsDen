import { ElementalAdvantage, ElementType } from "../types/dragons";

export const elementalAdvantages: Record<ElementType, ElementalAdvantage> = {
  fire: {
    element: "fire",
    strongAgainst: ["ice", "earth"],
    weakAgainst: ["water", "air"],
    immuneTo: ["fire"],
  },
  ice: {
    element: "ice",
    strongAgainst: ["air", "earth"],
    weakAgainst: ["fire", "lightning"],
    immuneTo: ["ice"],
  },
  earth: {
    element: "earth",
    strongAgainst: ["lightning", "poison"],
    weakAgainst: ["air", "ice"],
    immuneTo: ["earth"],
  },
  air: {
    element: "air",
    strongAgainst: ["fire", "earth"],
    weakAgainst: ["ice", "lightning"],
    immuneTo: ["air"],
  },
  shadow: {
    element: "shadow",
    strongAgainst: ["light", "poison"],
    weakAgainst: ["light"],
    immuneTo: ["shadow"],
  },
  light: {
    element: "light",
    strongAgainst: ["shadow", "poison"],
    weakAgainst: ["shadow"],
    immuneTo: ["light"],
  },
  poison: {
    element: "poison",
    strongAgainst: ["air", "ice"],
    weakAgainst: ["earth", "light"],
    immuneTo: ["poison"],
  },
  lightning: {
    element: "lightning",
    strongAgainst: ["air", "ice"],
    weakAgainst: ["earth"],
    immuneTo: ["lightning"],
  },
};

export const elementColors = {
  fire: "#FF4500",
  ice: "#87CEEB",
  earth: "#8B4513",
  air: "#E0E0E0",
  shadow: "#2F2F2F",
  light: "#FFD700",
  poison: "#32CD32",
  lightning: "#9370DB",
};

export const elementDescriptions = {
  fire: "Masters of flame and heat, dealing devastating damage over time",
  ice: "Controllers of frost, slowing enemies and providing defensive barriers",
  earth: "Stalwart defenders with high health and armor penetration",
  air: "Swift and agile, excelling in speed and evasion",
  shadow: "Mysterious and cunning, specializing in stealth and debuffs",
  light: "Holy warriors with healing abilities and purification magic",
  poison: "Toxic specialists dealing damage through corrosion and disease",
  lightning: "Energetic strikers with high burst damage and chain attacks",
};

export function calculateElementalDamageMultiplier(
  attackerElement: ElementType,
  defenderElement: ElementType,
): number {
  const attacker = elementalAdvantages[attackerElement];

  if (attacker.strongAgainst.includes(defenderElement)) {
    return 1.5; // 50% bonus damage
  }

  if (attacker.weakAgainst.includes(defenderElement)) {
    return 0.75; // 25% reduced damage
  }

  const defender = elementalAdvantages[defenderElement];
  if (defender.immuneTo && defender.immuneTo.includes(attackerElement)) {
    return 0.1; // 90% damage reduction (near immunity)
  }

  return 1.0; // Normal damage
}

export function getElementalInteractions(element: ElementType) {
  return elementalAdvantages[element];
}
