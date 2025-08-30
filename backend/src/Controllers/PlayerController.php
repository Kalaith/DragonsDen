<?php
// src/Controllers/PlayerController.php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Actions\PlayerActions;

class PlayerController
{
    public static function getPlayerData(Request $request, Response $response): Response
    {
        $data = PlayerActions::getPlayerData();
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public static function collectGold(Request $request, Response $response): Response
    {
        // Server determines the gold amount to prevent cheating
        $result = PlayerActions::collectGold();
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public static function sendMinions(Request $request, Response $response): Response
    {
        $result = PlayerActions::sendMinions();
        $status = $result['success'] ? 200 : 400;
        $response->getBody()->write(json_encode($result));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    public static function exploreRuins(Request $request, Response $response): Response
    {
        // Parse input
        $body = (string)$request->getBody();
        $data = json_decode($body, true);
        $ruinId = $data['ruin_id'] ?? null;
        $explorationType = $data['exploration_type'] ?? null;

        // Validate input
        if (!$ruinId || !$explorationType) {
            $response->getBody()->write(json_encode(['error' => 'Missing required parameters']));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Check if ruin exists
        $ruin = \Illuminate\Database\Capsule\Manager::table('ruins')->where('id', $ruinId)->first();
        if (!$ruin) {
            $response->getBody()->write(json_encode(['error' => 'Ruin not found']));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        // Call action
        $result = \App\Actions\PlayerActions::exploreRuins();
        $response->getBody()->write(json_encode($result));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public static function hireGoblin(Request $request, Response $response): Response
    {
        $result = PlayerActions::hireGoblin();
        $status = $result['success'] ? 200 : 400;
        $response->getBody()->write(json_encode($result));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    public static function prestige(Request $request, Response $response): Response
    {
        $result = PlayerActions::prestige();
        $status = $result['success'] ? 200 : 400;
        $response->getBody()->write(json_encode($result));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}
