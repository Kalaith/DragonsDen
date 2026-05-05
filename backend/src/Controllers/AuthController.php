<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\LinkGuestAccountAction;
use App\Core\Environment;
use App\Http\Request;
use App\Http\Response;
use Firebase\JWT\JWT;

class AuthController
{
    public static function loginInfo(Request $request, Response $response): Response
    {
        return self::json($response, [
            'success' => true,
            'data' => [
                'login_url' => Environment::required('WEB_HATCHERY_LOGIN_URL'),
            ],
        ]);
    }

    public static function session(Request $request, Response $response): Response
    {
        $authUser = $request->getAttribute('auth_user');
        if (!$authUser || empty($authUser['id'])) {
            return self::json($response, [
                'success' => false,
                'error' => 'Authentication required',
                'login_url' => Environment::required('WEB_HATCHERY_LOGIN_URL'),
            ], 401);
        }

        $payload = [
            'success' => true,
            'data' => [
                'user' => self::serializeUser($authUser),
            ]
        ];
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public static function guestSession(Request $request, Response $response): Response
    {
        $secret = Environment::required('JWT_SECRET');
        $issuedAt = time();
        $guestUserId = 'guest_' . bin2hex(random_bytes(16));
        $guestName = 'Guest ' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
        $token = JWT::encode([
            'sub' => $guestUserId,
            'user_id' => $guestUserId,
            'username' => $guestName,
            'display_name' => $guestName,
            'role' => 'guest',
            'roles' => ['guest'],
            'auth_type' => 'guest',
            'is_guest' => true,
            'iat' => $issuedAt,
            'exp' => $issuedAt + (60 * 60 * 24 * 30),
        ], $secret, 'HS256');

        $response->getBody()->write(json_encode([
            'success' => true,
            'data' => [
                'token' => $token,
                'user' => self::serializeUser([
                    'id' => $guestUserId,
                    'username' => $guestName,
                    'display_name' => $guestName,
                    'role' => 'guest',
                    'roles' => ['guest'],
                    'auth_type' => 'guest',
                    'is_guest' => true,
                ]),
            ],
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public static function linkGuest(Request $request, Response $response): Response
    {
        $authUser = $request->getAttribute('auth_user');
        if (!$authUser || empty($authUser['id'])) {
            return self::json($response, [
                'success' => false,
                'error' => 'Authentication required',
                'login_url' => Environment::required('WEB_HATCHERY_LOGIN_URL'),
            ], 401);
        }

        $body = $request->getParsedBody();
        $guestToken = is_array($body) ? ($body['guest_token'] ?? null) : null;
        if (!is_string($guestToken) || trim($guestToken) === '') {
            return self::json($response, [
                'success' => false,
                'error' => 'Invalid guest token',
            ], 422);
        }

        try {
            $state = (new LinkGuestAccountAction())->execute($authUser, $guestToken);
        } catch (\InvalidArgumentException $exception) {
            return self::json($response, [
                'success' => false,
                'error' => $exception->getMessage(),
            ], 422);
        } catch (\RuntimeException $exception) {
            return self::json($response, [
                'success' => false,
                'error' => $exception->getMessage(),
            ], 404);
        }

        return self::json($response, [
            'success' => true,
            'data' => [
                'linked' => true,
                'user' => self::serializeUser($authUser),
                'state' => $state,
            ],
        ]);
    }

    private static function serializeUser(array $authUser): array
    {
        return [
            'id' => (string) $authUser['id'],
            'email' => $authUser['email'] ?? null,
            'username' => $authUser['username'] ?? null,
            'display_name' => $authUser['display_name'] ?? ($authUser['username'] ?? null),
            'role' => $authUser['role'] ?? 'user',
            'roles' => $authUser['roles'] ?? [],
            'auth_type' => $authUser['auth_type'] ?? 'frontpage',
            'is_guest' => (bool) ($authUser['is_guest'] ?? false),
        ];
    }

    /**
     * @param array<string, mixed> $payload
     */
    private static function json(Response $response, array $payload, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($payload));
        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }
}
