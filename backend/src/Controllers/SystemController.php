<?php
// src/Controllers/SystemController.php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class SystemController
{
    public static function status(Request $request, Response $response): Response
    {
        $data = [
            'status' => 'ok',
            'timestamp' => time(),
            'version' => '1.0.0',
            'database' => $_ENV['DB_NAME'] ?? 'dragons_den',
            'memory_usage' => round(memory_get_usage(true) / 1024 / 1024, 2), // in MB
            'uptime' => time() - $_SERVER['REQUEST_TIME'],
            'endpoints' => [
                // Game Data
                '/api/constants',
                '/api/constants/{key}',
                '/api/achievements',
                '/api/achievements/{id}',
                '/api/treasures',
                '/api/treasures/{id}',
                '/api/upgrades',
                '/api/upgrades/{id}',
                '/api/upgrade-definitions',
                '/api/upgrade-definitions/{id}',
                // Player Actions
                '/api/player',
                '/api/player/collect-gold',
                '/api/player/send-minions',
                '/api/player/explore-ruins',
                '/api/player/hire-goblin',
                '/api/player/prestige',
                // System
                '/api/status'
            ]
        ];
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
