export const calculateGoldPerClick = (baseGoldPerClick: number, upgrades: Record<string, number>, treasures: Array<{ name: string; effect: number }>): number => {
    let totalGold = baseGoldPerClick;

    // Apply upgrades
    if (upgrades.clawSharpness) {
        totalGold *= (1 + upgrades.clawSharpness * 0.5);
    }

    // Apply treasure bonuses
    treasures.forEach(treasure => {
        if (treasure.name === "Ancient Golden Goblet") {
            totalGold *= 1.05;
        }
    });

    return Math.ceil(totalGold);
};

export const calculateGoldPerSecond = (goldPerSecond: number, minions: number): number => {
    return goldPerSecond + (minions * 0.1); // Example calculation
};

export const formatNumber = (num: number): string => {
    return num.toLocaleString(); // Formats number with commas
};

export const checkAchievements = (achievements: Set<string>, condition: string): Set<string> => {
    // Logic to check and unlock achievements based on conditions
    if (condition === 'collectGold') {
        achievements.add('Gold Collector');
    }
    return achievements;
};