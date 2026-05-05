<?php

// src/Controllers/PlayerController.php
declare(strict_types=1);

namespace App\Controllers;

use App\Http\Response;
use App\Http\Request;
use App\Actions\PlayerActions;

class PlayerController
{
    public static function getPlayerData(Request $request, Response $response): Response
    {
        $authUserId = self::authUserId($request);
        if ($authUserId === null) {
            return self::json($response, ['success' => false, 'error' => 'Authentication required'], 401);
        }

        $data = PlayerActions::getPlayerData($authUserId);
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public static function collectGold(Request $request, Response $response): Response
    {
        $authUserId = self::authUserId($request);
        if ($authUserId === null) {
            return self::json($response, ['success' => false, 'error' => 'Authentication required'], 401);
        }

        $result = PlayerActions::collectGold($authUserId);
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public static function sendMinions(Request $request, Response $response): Response
    {
        $authUserId = self::authUserId($request);
        if ($authUserId === null) {
            return self::json($response, ['success' => false, 'error' => 'Authentication required'], 401);
        }

        $result = PlayerActions::sendMinions($authUserId);
        $status = $result['success'] ? 200 : 400;
        $response->getBody()->write(json_encode($result));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    public static function exploreRuins(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        $ruinId = isset($data['ruin_id']) && is_string($data['ruin_id']) ? $data['ruin_id'] : null;
        $explorationType = isset($data['exploration_type']) && is_string($data['exploration_type'])
            ? $data['exploration_type']
            : null;

        if ($ruinId === null || $explorationType === null) {
            $response->getBody()->write(json_encode(['error' => 'Missing required parameters']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $authUserId = self::authUserId($request);
        if ($authUserId === null) {
            return self::json($response, ['success' => false, 'error' => 'Authentication required'], 401);
        }

        $result = PlayerActions::exploreRuins($authUserId, $ruinId, $explorationType);
        $status = $result['success'] ? 200 : (($result['error'] ?? '') === 'Ruin not found' ? 404 : 400);
        $response->getBody()->write(json_encode($result));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    public static function hireGoblin(Request $request, Response $response): Response
    {
        $authUserId = self::authUserId($request);
        if ($authUserId === null) {
            return self::json($response, ['success' => false, 'error' => 'Authentication required'], 401);
        }

        $result = PlayerActions::hireGoblin($authUserId);
        $status = $result['success'] ? 200 : 400;
        $response->getBody()->write(json_encode($result));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    public static function prestige(Request $request, Response $response): Response
    {
        $authUserId = self::authUserId($request);
        if ($authUserId === null) {
            return self::json($response, ['success' => false, 'error' => 'Authentication required'], 401);
        }

        $result = PlayerActions::prestige($authUserId);
        $status = $result['success'] ? 200 : 400;
        $response->getBody()->write(json_encode($result));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    private static function authUserId(Request $request): ?string
    {
        $authUser = $request->getAttribute('auth_user');
        if (!is_array($authUser) || empty($authUser['id'])) {
            return null;
        }

        return (string) $authUser['id'];
    }

    /**
     * @param array<string, mixed> $payload
     */
    private static function json(Response $response, array $payload, int $status): Response
    {
        $response->getBody()->write(json_encode($payload));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}
