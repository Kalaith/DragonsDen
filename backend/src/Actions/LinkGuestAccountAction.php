<?php

declare(strict_types=1);

namespace App\Actions;

use App\Core\Environment;
use App\Repositories\PlayerRepository;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

final class LinkGuestAccountAction
{
    public function __construct(private readonly PlayerRepository $players = new PlayerRepository())
    {
    }

    /**
     * @param array<string, mixed> $authUser
     * @return array<string, mixed>
     */
    public function execute(array $authUser, string $guestToken): array
    {
        if (($authUser['is_guest'] ?? false) === true) {
            throw new \InvalidArgumentException('Guest sessions cannot link another guest save.');
        }

        $decoded = JWT::decode($guestToken, new Key(Environment::required('JWT_SECRET'), 'HS256'));
        if (($decoded->is_guest ?? false) !== true) {
            throw new \InvalidArgumentException('Provided token is not a guest session.');
        }

        $guestUserId = $decoded->sub ?? $decoded->user_id ?? null;
        if (!is_string($guestUserId) || !str_starts_with($guestUserId, 'guest_')) {
            throw new \InvalidArgumentException('Guest token is missing a valid user identifier.');
        }

        $targetUserId = (string) $authUser['id'];
        $this->players->moveGuestSaveToUser($guestUserId, $targetUserId);

        return PlayerActions::getPlayerData($targetUserId);
    }
}
