// Utility functions for performing game-related calculations

import type { Treasure } from "../types/treasures";

export const calculateGoldEarned = (
  goldPerClick: number,
  clicks: number,
): number => {
  return goldPerClick * clicks;
};

export const calculateUpgradeCost = (
  baseCost: number,
  level: number,
  multiplier: number,
): number => {
  return Math.ceil(baseCost * Math.pow(multiplier, level));
};

export const calculateGoldPerSecond = (
  goldPerSecond: number,
  time: number,
): number => {
  return goldPerSecond * time;
};

export const calculateTotalTreasures = (treasures: Set<string>): number => {
  return treasures.size;
};

export const calculateUniqueTreasures = (
  discoveredTreasures: Treasure[],
): number => {
  const uniqueTreasures = new Set(
    discoveredTreasures.map((treasure) => treasure.name),
  );
  return uniqueTreasures.size;
};
