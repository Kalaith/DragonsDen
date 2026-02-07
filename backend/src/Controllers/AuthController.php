<?php

namespace App\Controllers;

use App\Http\Request;
use App\Http\Response;

class AuthController
{
    public static function session(Request $request, Response $response): Response
    {
        $authUser = $request->getAttribute('auth_user');
        if (!$authUser || empty($authUser['id'])) {
            $payload = [
                'success' => false,
                'error' => 'Authentication required',
                'login_url' => $_ENV['WEB_HATCHERY_LOGIN_URL'] ?? ''
            ];
            $response->getBody()->write(json_encode($payload));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $payload = [
            'success' => true,
            'data' => [
                'user' => [
                    'id' => (int) $authUser['id'],
                    'email' => $authUser['email'] ?? null,
                    'username' => $authUser['username'] ?? null,
                    'roles' => $authUser['roles'] ?? [],
                ]
            ]
        ];
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
