<?php

// src/Controllers/SystemController.php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Environment;
use App\Http\Response;
use App\Http\Request;

class SystemController
{
    public static function status(Request $request, Response $response): Response
    {
        $data = [
            'status' => 'ok',
            'timestamp' => time(),
            'version' => '1.0.0',
            'database' => Environment::required('DB_NAME'),
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
                // Auth
                '/api/auth/login-info',
                '/api/auth/session',
                '/api/auth/guest-session',
                '/api/auth/link-guest',
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
