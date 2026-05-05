<?php

// src/Controllers/GameDataController.php
namespace App\Controllers;

use App\Http\Response;
use App\Http\Request;
use App\Actions\GameDataActions;

class GameDataController
{
    public static function getConstants(Request $request, Response $response): Response
    {
        return self::writeActionResponse($response, fn () => GameDataActions::getConstants());
    }
    public static function getAchievements(Request $request, Response $response): Response
    {

        return self::writeActionResponse($response, fn () => GameDataActions::getAchievements());
    }
    public static function getTreasures(Request $request, Response $response): Response
    {

        return self::writeActionResponse($response, fn () => GameDataActions::getTreasures());
    }
    public static function getUpgrades(Request $request, Response $response): Response
    {

        return self::writeActionResponse($response, fn () => GameDataActions::getUpgrades());
    }
    public static function getUpgradeDefinitions(Request $request, Response $response): Response
    {

        return self::writeActionResponse($response, fn () => GameDataActions::getUpgradeDefinitions());
    }
    public static function getConstant(Request $request, Response $response, $args): Response
    {
        $key = $args['key'] ?? null;
        if (empty($key)) {
            $response = $response->withStatus(400);
            $response->getBody()->write(json_encode(['error' => 'Constant key is required']));
            return $response->withHeader('Content-Type', 'application/json');
        }
        $data = GameDataActions::getConstant($key);
        if ($data === null) {
            $response = $response->withStatus(404);
            $response->getBody()->write(json_encode(['error' => 'Constant not found']));
        } else {
            $response->getBody()->write(json_encode($data));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }
    public static function getAchievement(Request $request, Response $response, $args): Response
    {
        $id = $args['id'] ?? null;
        $data = GameDataActions::getAchievement($id);
        if ($data === null) {
            $response = $response->withStatus(404);
            $response->getBody()->write(json_encode(['error' => 'Achievement not found']));
        } else {
            $response->getBody()->write(json_encode($data));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }
    public static function getTreasure(Request $request, Response $response, $args): Response
    {
        $id = $args['id'] ?? null;
        $data = GameDataActions::getTreasure($id);
        if ($data === null) {
            $response = $response->withStatus(404);
            $response->getBody()->write(json_encode(['error' => 'Treasure not found']));
        } else {
            $response->getBody()->write(json_encode($data));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }
    public static function getUpgrade(Request $request, Response $response, $args): Response
    {
        $id = $args['id'] ?? null;
        $data = GameDataActions::getUpgrade($id);
        if ($data === null) {
            $response = $response->withStatus(404);
            $response->getBody()->write(json_encode(['error' => 'Upgrade not found']));
        } else {
            $response->getBody()->write(json_encode($data));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }
    public static function getUpgradeDefinition(Request $request, Response $response, $args): Response
    {
        $id = $args['id'] ?? null;
        $data = GameDataActions::getUpgradeDefinition($id);
        if ($data === null) {
            $response = $response->withStatus(404);
            $response->getBody()->write(json_encode(['error' => 'Upgrade definition not found']));
        } else {
            $response->getBody()->write(json_encode($data));
        }
        return $response->withHeader('Content-Type', 'application/json');
    }

    private static function writeActionResponse(Response $response, callable $action): Response
    {

        try {
            $payload = $action();
            $status = 200;
        } catch (\Throwable $exception) {
            $payload = [
                'success' => false,
                'error' => 'Database unavailable',
                'message' => $exception->getMessage(),
            ];
            $status = 500;
        }

        $response->getBody()->write(json_encode($payload));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}
