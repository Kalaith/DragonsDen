<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\Environment;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Http\Response;
use App\Http\Request;
use Illuminate\Database\Capsule\Manager as Capsule;

class WebHatcheryJwtMiddleware
{
    public function __invoke(Request $request, Response $response, array $routeParams = []): Response|Request|bool
    {
        if (str_contains($request->getUri(), '/api/player')) {
            try {
                Capsule::connection()->getPdo();
            } catch (\Throwable $e) {
                return $this->databaseError($response, $e->getMessage());
            }
        }

        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $this->unauthorized($response, 'Authorization header missing or invalid');
        }

        $token = $matches[1];
        try {
            $secret = Environment::required('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $isGuest = (bool) ($decoded->is_guest ?? false);

            $expectedIssuer = Environment::optional('JWT_ISSUER');
            if (!$isGuest && $expectedIssuer !== null && isset($decoded->iss) && $decoded->iss !== $expectedIssuer) {
                return $this->unauthorized($response, 'Invalid token issuer');
            }

            $expectedAudience = Environment::optional('JWT_AUDIENCE');
            if (!$isGuest && $expectedAudience && isset($decoded->aud)) {
                $aud = $decoded->aud;
                $isValidAudience = is_array($aud)
                    ? in_array($expectedAudience, $aud, true)
                    : $aud === $expectedAudience;
                if (!$isValidAudience) {
                    return $this->unauthorized($response, 'Invalid token audience');
                }
            }

            $userId = $decoded->sub ?? $decoded->user_id ?? null;
            if (!$userId) {
                return $this->unauthorized($response, 'Token missing user identifier');
            }

            $request = $request->withAttribute('auth_user', [
                'id' => (string) $userId,
                'email' => $decoded->email ?? null,
                'username' => $decoded->username ?? null,
                'roles' => $decoded->roles ?? [],
                'role' => $decoded->role ?? (($decoded->roles[0] ?? null) ?: 'user'),
                'display_name' => $decoded->display_name ?? $decoded->username ?? null,
                'auth_type' => $decoded->auth_type ?? ($isGuest ? 'guest' : 'frontpage'),
                'is_guest' => $isGuest,
            ]);

            return $request;
        } catch (\Throwable $e) {
            return $this->unauthorized($response, 'Invalid token');
        }
    }

    private function unauthorized(Response $response, string $message): Response
    {
        $payload = [
            'success' => false,
            'error' => 'Authentication required',
            'message' => $message,
            'login_url' => Environment::required('WEB_HATCHERY_LOGIN_URL')
        ];
        $response->getBody()->write(json_encode($payload));
        return $response
            ->withStatus(401)
            ->withHeader('Content-Type', 'application/json');
    }

    private function databaseError(Response $response, string $message): Response
    {
        $payload = [
            'success' => false,
            'error' => 'Database error',
            'message' => $message
        ];
        $response->getBody()->write(json_encode($payload));
        return $response
            ->withStatus(500)
            ->withHeader('Content-Type', 'application/json');
    }
}
