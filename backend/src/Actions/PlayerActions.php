<?php

// src/Actions/PlayerActions.php
declare(strict_types=1);

namespace App\Actions;

use App\Repositories\PlayerRepository;
use App\Utils\IdleNumber;

class PlayerActions
{
    private static function repository(): PlayerRepository
    {
        return new PlayerRepository();
    }

    private static function getPlayerState(string $authUserId)
    {
        return self::repository()->loadOrCreateState($authUserId);
    }

    private static function updatePlayerState(
        string $authUserId,
        IdleNumber $goldNumber,
        IdleNumber $goblinsNumber
    ): void {
        self::repository()->updateState($authUserId, $goldNumber, $goblinsNumber);
    }

    public static function getPlayerData(string $authUserId): array
    {
        self::processIdleEarnings($authUserId);

        $state = self::getPlayerState($authUserId);
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);
        $repository = self::repository();

        return [
            'gold' => $gold->toString(),
            'gold_display' => $gold->toDisplay(),
            'goblins' => $goblins->toString(),
            'goblins_display' => $goblins->toDisplay(),
            'achievements' => $repository->listAchievementIds($authUserId),
            'treasures' => $repository->listTreasureIds($authUserId),
            'last_updated' => $state->updated_at,
            'server_time' => time()
        ];
    }

    public static function processIdleEarnings(string $authUserId): void
    {
        $state = self::getPlayerState($authUserId);
        $lastUpdated = strtotime($state->updated_at ?? 'now');
        $now = time();
        $secondsOffline = $now - $lastUpdated;

        if ($secondsOffline > 0) {
            $gold = new IdleNumber($state->gold_value, $state->gold_exp);
            $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);

            // Base gold per second (1 gold/sec)
            $goldPerSecond = new IdleNumber(1, 0);

            // Additional gold from goblins (each goblin adds 0.1 gold/sec)
            if ($goblins->value > 0) {
                $goblinGoldPerSecond = $goblins->mul(new IdleNumber(0.1, 0));
                $goldPerSecond = $goldPerSecond->add($goblinGoldPerSecond);
            }

            // Calculate total idle earnings
            $idleEarnings = $goldPerSecond->mul(new IdleNumber($secondsOffline, 0));
            $gold = $gold->add($idleEarnings);

            // Update state
            self::updatePlayerState($authUserId, $gold, $goblins);
        }
    }

    public static function collectGold(string $authUserId): array
    {
        self::processIdleEarnings($authUserId);

        $state = self::getPlayerState($authUserId);
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);

        // Server determines click value, not client (prevent cheating)
        $baseGoldPerClick = 1;
        $goldToAdd = new IdleNumber($baseGoldPerClick, 0);

        $gold = $gold->add($goldToAdd);

        self::updatePlayerState($authUserId, $gold, $goblins);
        self::checkAchievements($authUserId);

        return [
            'success' => true,
            'new_gold_amount' => $gold->toString(),
            'gold_earned' => $goldToAdd->toString(),
            'gold_display' => $gold->toDisplay()
        ];
    }

    public static function sendMinions(string $authUserId): array
    {
        $state = self::getPlayerState($authUserId);
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);

        if ($goblins->value <= 0) {
            return ['success' => false, 'error' => 'No goblins to send'];
        }

        // Goblins collect gold based on their count
        $goldFromGoblins = $goblins->mul(2); // Each goblin collects 2 gold
        $gold = $gold->add($goldFromGoblins);

        self::updatePlayerState($authUserId, $gold, $goblins);

        return [
            'success' => true,
            'gold_earned' => $goldFromGoblins->toString(),
            'total_gold' => $gold->toString(),
            'gold_display' => $gold->toDisplay()
        ];
    }

    public static function exploreRuins(
        string $authUserId,
        ?string $ruinId = null,
        ?string $explorationType = null
    ): array {
        if ($ruinId === null || $explorationType === null) {
            return ['success' => false, 'error' => 'Missing required parameters'];
        }

        $repository = self::repository();
        if (!$repository->ruinExists($ruinId)) {
            return ['success' => false, 'error' => 'Ruin not found'];
        }

        $treasureChance = 0.3; // 30% chance
        $foundTreasure = rand(1, 100) <= ($treasureChance * 100);

        if ($foundTreasure) {
            $treasureId = $repository->pickAvailableTreasureId($authUserId);
            if ($treasureId !== null) {
                $treasure = $repository->getTreasure($treasureId);
                $repository->addTreasure($authUserId, $treasureId);
                self::checkAchievements($authUserId);

                return [
                    'success' => true,
                    'treasure_found' => true,
                    'treasure' => $treasure
                ];
            }
        }

        return [
            'success' => true,
            'treasure_found' => false
        ];
    }

    public static function hireGoblin(string $authUserId): array
    {
        $state = self::getPlayerState($authUserId);
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);

        // Calculate cost: base 50 * 1.2^current_goblins
        $baseCost = 50;
        $multiplier = 1.2;
        $cost = new IdleNumber($baseCost * pow($multiplier, $goblins->value), 0);

        // Check if player has enough gold (simplified comparison)
        if ($gold->exp < $cost->exp || ($gold->exp == $cost->exp && $gold->value < $cost->value)) {
            return ['success' => false, 'error' => 'Not enough gold'];
        }

        // Subtract cost and add goblin
        $gold = new IdleNumber($gold->value - $cost->value, $gold->exp);
        $goblins = $goblins->add(new IdleNumber(1, 0));

        self::updatePlayerState($authUserId, $gold, $goblins);
        self::checkAchievements($authUserId);

        return [
            'success' => true,
            'cost' => $cost->toString(),
            'total_goblins' => $goblins->toString(),
            'remaining_gold' => $gold->toString()
        ];
    }

    public static function prestige(string $authUserId): array
    {
        $state = self::getPlayerState($authUserId);
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);

        // Check if player has enough gold (1M requirement)
        $requirement = new IdleNumber(1000000, 0);
        if ($gold->exp < $requirement->exp || ($gold->exp == $requirement->exp && $gold->value < $requirement->value)) {
            return ['success' => false, 'error' => 'Not enough gold for prestige'];
        }

        // Reset progress but keep achievements and treasures
        $newGold = new IdleNumber(0, 0);
        $newGoblins = new IdleNumber(0, 0);

        self::updatePlayerState($authUserId, $newGold, $newGoblins);
        self::checkAchievements($authUserId);

        return [
            'success' => true,
            'message' => 'Prestige completed! Progress reset with permanent bonuses.'
        ];
    }

    private static function checkAchievements(string $authUserId): array
    {
        $state = self::getPlayerState($authUserId);
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);
        $repository = self::repository();

        $newAchievements = [];

        // Check first click achievement
        if (!$repository->achievementExists($authUserId, 'first_click')) {
            $repository->addAchievement($authUserId, 'first_click');
            $newAchievements[] = 'first_click';
        }

        // Check treasure hunter achievement
        if (
            $repository->treasureCount($authUserId) > 0
            && !$repository->achievementExists($authUserId, 'treasure_hunter')
        ) {
            $repository->addAchievement($authUserId, 'treasure_hunter');
            $newAchievements[] = 'treasure_hunter';
        }

        // Check golden collector achievement (10,000 gold)
        $tenThousand = new IdleNumber(10000, 0);
        if (
            (
                $gold->exp > $tenThousand->exp
                || ($gold->exp == $tenThousand->exp && $gold->value >= $tenThousand->value)
            )
            && !$repository->achievementExists($authUserId, 'golden_collector')
        ) {
            $repository->addAchievement($authUserId, 'golden_collector');
            $newAchievements[] = 'golden_collector';
        }

        // Check minion master achievement (10 goblins)
        if ($goblins->value >= 10 && !$repository->achievementExists($authUserId, 'minion_master')) {
            $repository->addAchievement($authUserId, 'minion_master');
            $newAchievements[] = 'minion_master';
        }

        return $newAchievements;
    }
}
