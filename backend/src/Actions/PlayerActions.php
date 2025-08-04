<?php
// src/Actions/PlayerActions.php
namespace App\Actions;

use Illuminate\Database\Capsule\Manager as Capsule;
use App\Utils\IdleNumber;

class PlayerActions
{
    private static function getPlayerState()
    {
        $state = Capsule::table('player_state')->where('id', 1)->first();
        if (!$state) {
            // Create default player state
            Capsule::table('player_state')->insert([
                'id' => 1,
                'gold_value' => '0',
                'gold_exp' => 0,
                'goblins_value' => '0', 
                'goblins_exp' => 0
            ]);
            $state = Capsule::table('player_state')->where('id', 1)->first();
        }
        return $state;
    }

    private static function updatePlayerState($goldNumber, $goblinsNumber)
    {
        Capsule::table('player_state')->where('id', 1)->update([
            'gold_value' => $goldNumber->value,
            'gold_exp' => $goldNumber->exp,
            'goblins_value' => $goblinsNumber->value,
            'goblins_exp' => $goblinsNumber->exp,
            'updated_at' => date('Y-m-d H:i:s')
        ]);
    }

    public static function getPlayerData()
    {
        $state = self::getPlayerState();
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);
        
        $achievements = Capsule::table('player_achievements')->pluck('achievement_id');
        $treasures = Capsule::table('player_treasures')->pluck('treasure_id');
        
        return [
            'gold' => $gold->toString(),
            'gold_display' => $gold->toDisplay(),
            'goblins' => $goblins->toString(),
            'goblins_display' => $goblins->toDisplay(),
            'achievements' => $achievements->toArray(),
            'treasures' => $treasures->toArray(),
            'last_updated' => $state->updated_at
        ];
    }

    public static function collectGold($amount = 1)
    {
        $state = self::getPlayerState();
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);
        
        // Add gold
        $goldToAdd = new IdleNumber($amount, 0);
        $gold = $gold->add($goldToAdd);
        
        self::updatePlayerState($gold, $goblins);
        self::checkAchievements();
        
        return [
            'success' => true,
            'new_gold_amount' => $gold->toString(),
            'gold_earned' => $goldToAdd->toString(),
            'gold_display' => $gold->toDisplay()
        ];
    }

    public static function sendMinions()
    {
        $state = self::getPlayerState();
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);
        
        if ($goblins->value <= 0) {
            return ['success' => false, 'error' => 'No goblins to send'];
        }
        
        // Goblins collect gold based on their count
        $goldFromGoblins = $goblins->mul(2); // Each goblin collects 2 gold
        $gold = $gold->add($goldFromGoblins);
        
        self::updatePlayerState($gold, $goblins);
        
        return [
            'success' => true,
            'gold_earned' => $goldFromGoblins->toString(),
            'total_gold' => $gold->toString(),
            'gold_display' => $gold->toDisplay()
        ];
    }

    public static function exploreRuins()
    {
        $treasureChance = 0.3; // 30% chance
        $foundTreasure = rand(1, 100) <= ($treasureChance * 100);
        
        if ($foundTreasure) {
            // Get random treasure that player doesn't have
            $allTreasures = Capsule::table('treasures')->pluck('id');
            $playerTreasures = Capsule::table('player_treasures')->pluck('treasure_id');
            $availableTreasures = $allTreasures->diff($playerTreasures);
            
            if ($availableTreasures->count() > 0) {
                $treasureId = $availableTreasures->random();
                $treasure = Capsule::table('treasures')->where('id', $treasureId)->first();
                
                // Add to player treasures
                Capsule::table('player_treasures')->insert([
                    'treasure_id' => $treasureId,
                    'collected_at' => date('Y-m-d H:i:s')
                ]);
                
                self::checkAchievements();
                
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

    public static function hireGoblin()
    {
        $state = self::getPlayerState();
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
        
        self::updatePlayerState($gold, $goblins);
        self::checkAchievements();
        
        return [
            'success' => true,
            'cost' => $cost->toString(),
            'total_goblins' => $goblins->toString(),
            'remaining_gold' => $gold->toString()
        ];
    }

    public static function prestige()
    {
        $state = self::getPlayerState();
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        
        // Check if player has enough gold (1M requirement)
        $requirement = new IdleNumber(1000000, 0);
        if ($gold->exp < $requirement->exp || ($gold->exp == $requirement->exp && $gold->value < $requirement->value)) {
            return ['success' => false, 'error' => 'Not enough gold for prestige'];
        }
        
        // Reset progress but keep achievements and treasures
        $newGold = new IdleNumber(0, 0);
        $newGoblins = new IdleNumber(0, 0);
        
        self::updatePlayerState($newGold, $newGoblins);
        self::checkAchievements();
        
        return [
            'success' => true,
            'message' => 'Prestige completed! Progress reset with permanent bonuses.'
        ];
    }

    private static function checkAchievements()
    {
        $state = self::getPlayerState();
        $gold = new IdleNumber($state->gold_value, $state->gold_exp);
        $goblins = new IdleNumber($state->goblins_value, $state->goblins_exp);
        
        $newAchievements = [];
        
        // Check first click achievement
        if (!Capsule::table('player_achievements')->where('achievement_id', 'first_click')->exists()) {
            Capsule::table('player_achievements')->insert([
                'achievement_id' => 'first_click',
                'unlocked_at' => date('Y-m-d H:i:s')
            ]);
            $newAchievements[] = 'first_click';
        }
        
        // Check treasure hunter achievement
        $treasureCount = Capsule::table('player_treasures')->count();
        if ($treasureCount > 0 && !Capsule::table('player_achievements')->where('achievement_id', 'treasure_hunter')->exists()) {
            Capsule::table('player_achievements')->insert([
                'achievement_id' => 'treasure_hunter',
                'unlocked_at' => date('Y-m-d H:i:s')
            ]);
            $newAchievements[] = 'treasure_hunter';
        }
        
        // Check golden collector achievement (10,000 gold)
        $tenThousand = new IdleNumber(10000, 0);
        if (($gold->exp > $tenThousand->exp || ($gold->exp == $tenThousand->exp && $gold->value >= $tenThousand->value)) &&
            !Capsule::table('player_achievements')->where('achievement_id', 'golden_collector')->exists()) {
            Capsule::table('player_achievements')->insert([
                'achievement_id' => 'golden_collector',
                'unlocked_at' => date('Y-m-d H:i:s')
            ]);
            $newAchievements[] = 'golden_collector';
        }
        
        // Check minion master achievement (10 goblins)
        if ($goblins->value >= 10 && !Capsule::table('player_achievements')->where('achievement_id', 'minion_master')->exists()) {
            Capsule::table('player_achievements')->insert([
                'achievement_id' => 'minion_master',
                'unlocked_at' => date('Y-m-d H:i:s')
            ]);
            $newAchievements[] = 'minion_master';
        }
        
        return $newAchievements;
    }
}
