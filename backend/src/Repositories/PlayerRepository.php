<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Utils\IdleNumber;
use Illuminate\Database\Capsule\Manager as Capsule;
use PDO;

final class PlayerRepository
{
    private PDO $pdo;

    public function __construct(?PDO $pdo = null)
    {
        $this->pdo = $pdo ?? Capsule::connection()->getPdo();
    }

    public function loadOrCreateState(string $authUserId): object
    {
        $statement = $this->pdo->prepare('SELECT * FROM player_state WHERE auth_user_id = :auth_user_id LIMIT 1');
        $statement->execute(['auth_user_id' => $authUserId]);
        $state = $statement->fetch(PDO::FETCH_OBJ);

        if ($state !== false) {
            return $state;
        }

        $insert = $this->pdo->prepare(
            'INSERT INTO player_state (auth_user_id, gold_value, gold_exp, goblins_value, goblins_exp)
             VALUES (:auth_user_id, :gold_value, :gold_exp, :goblins_value, :goblins_exp)'
        );
        $insert->execute([
            'auth_user_id' => $authUserId,
            'gold_value' => '0',
            'gold_exp' => 0,
            'goblins_value' => '0',
            'goblins_exp' => 0,
        ]);

        $statement->execute(['auth_user_id' => $authUserId]);
        $state = $statement->fetch(PDO::FETCH_OBJ);
        if ($state === false) {
            throw new \RuntimeException('Failed to create player state.');
        }

        return $state;
    }

    public function updateState(string $authUserId, IdleNumber $gold, IdleNumber $goblins): void
    {
        $statement = $this->pdo->prepare(
            'UPDATE player_state
             SET gold_value = :gold_value,
                 gold_exp = :gold_exp,
                 goblins_value = :goblins_value,
                 goblins_exp = :goblins_exp,
                 updated_at = CURRENT_TIMESTAMP
             WHERE auth_user_id = :auth_user_id'
        );
        $statement->execute([
            'auth_user_id' => $authUserId,
            'gold_value' => (string) $gold->value,
            'gold_exp' => (int) $gold->exp,
            'goblins_value' => (string) $goblins->value,
            'goblins_exp' => (int) $goblins->exp,
        ]);
    }

    /**
     * @return string[]
     */
    public function listAchievementIds(string $authUserId): array
    {
        $statement = $this->pdo->prepare(
            'SELECT achievement_id FROM player_achievements WHERE auth_user_id = :auth_user_id'
        );
        $statement->execute(['auth_user_id' => $authUserId]);

        return array_map('strval', $statement->fetchAll(PDO::FETCH_COLUMN));
    }

    /**
     * @return string[]
     */
    public function listTreasureIds(string $authUserId): array
    {
        $statement = $this->pdo->prepare('SELECT treasure_id FROM player_treasures WHERE auth_user_id = :auth_user_id');
        $statement->execute(['auth_user_id' => $authUserId]);

        return array_map('strval', $statement->fetchAll(PDO::FETCH_COLUMN));
    }

    public function achievementExists(string $authUserId, string $achievementId): bool
    {
        $statement = $this->pdo->prepare(
            'SELECT 1 FROM player_achievements WHERE auth_user_id = :auth_user_id AND achievement_id = :achievement_id'
        );
        $statement->execute(['auth_user_id' => $authUserId, 'achievement_id' => $achievementId]);

        return $statement->fetchColumn() !== false;
    }

    public function addAchievement(string $authUserId, string $achievementId): void
    {
        $statement = $this->pdo->prepare(
            'INSERT IGNORE INTO player_achievements (auth_user_id, achievement_id)
             VALUES (:auth_user_id, :achievement_id)'
        );
        $statement->execute(['auth_user_id' => $authUserId, 'achievement_id' => $achievementId]);
    }

    public function treasureCount(string $authUserId): int
    {
        $statement = $this->pdo->prepare('SELECT COUNT(*) FROM player_treasures WHERE auth_user_id = :auth_user_id');
        $statement->execute(['auth_user_id' => $authUserId]);

        return (int) $statement->fetchColumn();
    }

    public function pickAvailableTreasureId(string $authUserId): ?string
    {
        $statement = $this->pdo->prepare(
            'SELECT t.id
             FROM treasures t
             LEFT JOIN player_treasures pt
               ON pt.treasure_id = t.id AND pt.auth_user_id = :auth_user_id
             WHERE pt.treasure_id IS NULL
             ORDER BY RAND()
             LIMIT 1'
        );
        $statement->execute(['auth_user_id' => $authUserId]);
        $treasureId = $statement->fetchColumn();

        return is_string($treasureId) ? $treasureId : null;
    }

    public function getTreasure(string $treasureId): ?object
    {
        $statement = $this->pdo->prepare('SELECT * FROM treasures WHERE id = :id LIMIT 1');
        $statement->execute(['id' => $treasureId]);
        $treasure = $statement->fetch(PDO::FETCH_OBJ);

        return $treasure === false ? null : $treasure;
    }

    public function addTreasure(string $authUserId, string $treasureId): void
    {
        $statement = $this->pdo->prepare(
            'INSERT IGNORE INTO player_treasures (auth_user_id, treasure_id) VALUES (:auth_user_id, :treasure_id)'
        );
        $statement->execute(['auth_user_id' => $authUserId, 'treasure_id' => $treasureId]);
    }

    public function ruinExists(string $ruinId): bool
    {
        $table = $this->pdo->query("SHOW TABLES LIKE 'ruins'")->fetchColumn();
        if ($table === false) {
            return true;
        }

        $statement = $this->pdo->prepare('SELECT 1 FROM ruins WHERE id = :id LIMIT 1');
        $statement->execute(['id' => $ruinId]);

        return $statement->fetchColumn() !== false;
    }

    public function moveGuestSaveToUser(string $guestUserId, string $targetUserId): object
    {
        $this->pdo->beginTransaction();
        try {
            $guestState = $this->findStateForUpdate($guestUserId);
            if ($guestState === null) {
                throw new \RuntimeException('Guest save not found.');
            }

            $deleteTargetAchievements = $this->pdo->prepare(
                'DELETE FROM player_achievements WHERE auth_user_id = :auth_user_id'
            );
            $deleteTargetAchievements->execute(['auth_user_id' => $targetUserId]);

            $deleteTargetTreasures = $this->pdo->prepare(
                'DELETE FROM player_treasures WHERE auth_user_id = :auth_user_id'
            );
            $deleteTargetTreasures->execute(['auth_user_id' => $targetUserId]);

            $deleteTargetState = $this->pdo->prepare('DELETE FROM player_state WHERE auth_user_id = :auth_user_id');
            $deleteTargetState->execute(['auth_user_id' => $targetUserId]);

            $moveState = $this->pdo->prepare(
                'UPDATE player_state SET auth_user_id = :target_user_id, updated_at = CURRENT_TIMESTAMP
                 WHERE auth_user_id = :guest_user_id'
            );
            $moveState->execute(['target_user_id' => $targetUserId, 'guest_user_id' => $guestUserId]);

            $moveAchievements = $this->pdo->prepare(
                'UPDATE player_achievements SET auth_user_id = :target_user_id WHERE auth_user_id = :guest_user_id'
            );
            $moveAchievements->execute(['target_user_id' => $targetUserId, 'guest_user_id' => $guestUserId]);

            $moveTreasures = $this->pdo->prepare(
                'UPDATE player_treasures SET auth_user_id = :target_user_id WHERE auth_user_id = :guest_user_id'
            );
            $moveTreasures->execute(['target_user_id' => $targetUserId, 'guest_user_id' => $guestUserId]);

            $this->pdo->commit();

            return $this->loadOrCreateState($targetUserId);
        } catch (\Throwable $exception) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $exception;
        }
    }

    private function findStateForUpdate(string $authUserId): ?object
    {
        $statement = $this->pdo->prepare(
            'SELECT * FROM player_state WHERE auth_user_id = :auth_user_id LIMIT 1 FOR UPDATE'
        );
        $statement->execute(['auth_user_id' => $authUserId]);
        $state = $statement->fetch(PDO::FETCH_OBJ);

        return $state === false ? null : $state;
    }
}
