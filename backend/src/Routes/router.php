<?php

use App\Core\Router;
use App\Controllers\GameDataController;
use App\Controllers\PlayerController;
use App\Controllers\SystemController;
use App\Controllers\AuthController;
use App\Middleware\WebHatcheryJwtMiddleware;

return function (Router $router): void {
    $api = '/api';

    // Game Data (public)
    $router->get($api . '/constants', [GameDataController::class, 'getConstants']);
    $router->get($api . '/constants/{key}', [GameDataController::class, 'getConstant']);
    $router->get($api . '/achievements', [GameDataController::class, 'getAchievements']);
    $router->get($api . '/achievements/{id}', [GameDataController::class, 'getAchievement']);
    $router->get($api . '/treasures', [GameDataController::class, 'getTreasures']);
    $router->get($api . '/treasures/{id}', [GameDataController::class, 'getTreasure']);
    $router->get($api . '/upgrades', [GameDataController::class, 'getUpgrades']);
    $router->get($api . '/upgrades/{id}', [GameDataController::class, 'getUpgrade']);
    $router->get($api . '/upgrade-definitions', [GameDataController::class, 'getUpgradeDefinitions']);
    $router->get($api . '/upgrade-definitions/{id}', [GameDataController::class, 'getUpgradeDefinition']);

    // Auth
    $router->get($api . '/auth/session', [AuthController::class, 'session'], [WebHatcheryJwtMiddleware::class]);

    // Player Actions (protected)
    $router->get($api . '/player', [PlayerController::class, 'getPlayerData'], [WebHatcheryJwtMiddleware::class]);
    $router->post($api . '/player/collect-gold', [PlayerController::class, 'collectGold'], [WebHatcheryJwtMiddleware::class]);
    $router->post($api . '/player/send-minions', [PlayerController::class, 'sendMinions'], [WebHatcheryJwtMiddleware::class]);
    $router->post($api . '/player/explore-ruins', [PlayerController::class, 'exploreRuins'], [WebHatcheryJwtMiddleware::class]);
    $router->post($api . '/player/hire-goblin', [PlayerController::class, 'hireGoblin'], [WebHatcheryJwtMiddleware::class]);
    $router->post($api . '/player/prestige', [PlayerController::class, 'prestige'], [WebHatcheryJwtMiddleware::class]);

    // System
    $router->get($api . '/status', [SystemController::class, 'status']);
};
