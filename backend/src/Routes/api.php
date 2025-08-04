<?php
// src/Routes/api.php
use Slim\App;
use App\Controllers\GameDataController;
use App\Controllers\PlayerController;
use App\Controllers\SystemController;

return function (App $app) {
    // Game Data
    $app->get('/api/constants', [GameDataController::class, 'getConstants']);
    $app->get('/api/constants/{key}', [GameDataController::class, 'getConstant']);
    $app->get('/api/achievements', [GameDataController::class, 'getAchievements']);
    $app->get('/api/achievements/{id}', [GameDataController::class, 'getAchievement']);
    $app->get('/api/treasures', [GameDataController::class, 'getTreasures']);
    $app->get('/api/treasures/{id}', [GameDataController::class, 'getTreasure']);
    $app->get('/api/upgrades', [GameDataController::class, 'getUpgrades']);
    $app->get('/api/upgrades/{id}', [GameDataController::class, 'getUpgrade']);
    $app->get('/api/upgrade-definitions', [GameDataController::class, 'getUpgradeDefinitions']);
    $app->get('/api/upgrade-definitions/{id}', [GameDataController::class, 'getUpgradeDefinition']);

    // Player Actions
    $app->get('/api/player', [PlayerController::class, 'getPlayerData']);
    $app->post('/api/player/collect-gold', [PlayerController::class, 'collectGold']);
    $app->post('/api/player/send-minions', [PlayerController::class, 'sendMinions']);
    $app->post('/api/player/explore-ruins', [PlayerController::class, 'exploreRuins']);
    $app->post('/api/player/hire-goblin', [PlayerController::class, 'hireGoblin']);
    $app->post('/api/player/prestige', [PlayerController::class, 'prestige']);

    // System
    $app->get('/api/status', [SystemController::class, 'status']);
};
