<?php
// src/Actions/GameDataActions.php
namespace App\Actions;

use Illuminate\Database\Capsule\Manager as Capsule;

class GameDataActions
{
    public static function getConstants()
    {
        $rows = Capsule::table('game_constants')->get();
        $constants = [];
        foreach ($rows as $row) {
            $constants[$row->key] = json_decode($row->value, true) ?? $row->value;
        }
        return $constants;
    }
    public static function getAchievements()
    {
        return Capsule::table('achievements')->get();
    }
    public static function getTreasures()
    {
        return Capsule::table('treasures')->get();
    }
    public static function getUpgrades()
    {
        return Capsule::table('upgrades')->get();
    }
    public static function getUpgradeDefinitions()
    {
        return Capsule::table('upgrade_definitions')->get();
    }
    public static function getConstant($key)
    {
        $row = Capsule::table('game_constants')->where('key', $key)->first();
        if (!$row) return null;
        return json_decode($row->value, true) ?? $row->value;
    }
    public static function getAchievement($id)
    {
        $row = Capsule::table('achievements')->where('id', $id)->first();
        return $row ?: null;
    }
    public static function getTreasure($id)
    {
        $row = Capsule::table('treasures')->where('id', $id)->first();
        return $row ?: null;
    }
    public static function getUpgrade($id)
    {
        $row = Capsule::table('upgrades')->where('id', $id)->first();
        return $row ?: null;
    }
    public static function getUpgradeDefinition($id)
    {
        $row = Capsule::table('upgrade_definitions')->where('id', $id)->first();
        return $row ?: null;
    }
}
