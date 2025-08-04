<?php

// Dragons Den Database Initialization Script
// This script creates and seeds tables for game constants, achievements, treasures, upgrades, and upgrade definitions.

require_once __DIR__ . '/../vendor/autoload.php';

use App\External\DatabaseService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

echo "Initializing dragons_den database...\n";

// Initialize database connection
$dbService = new DatabaseService();

try {
    // Test connection
    if (!$dbService->testConnection()) {
        throw new Exception('Could not connect to database');
    }
    
    echo "✓ Database connection established\n";

    // --- Create Tables ---
    // Game Constants (key-value)
    if (!Capsule::schema()->hasTable('game_constants')) {
        Capsule::schema()->create('game_constants', function (Blueprint $table) {
            $table->string('key', 64)->primary();
            $table->text('value');
        });
        echo "✓ Created game_constants table\n";
    } else {
        echo "✓ game_constants table already exists\n";
    }

    // Achievements
    if (!Capsule::schema()->hasTable('achievements')) {
        Capsule::schema()->create('achievements', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('name', 128);
            $table->text('description');
        });
        echo "✓ Created achievements table\n";
    } else {
        echo "✓ achievements table already exists\n";
    }

    // Treasures
    if (!Capsule::schema()->hasTable('treasures')) {
        Capsule::schema()->create('treasures', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('name', 128);
            $table->string('rarity', 32);
            $table->text('description');
            $table->text('effect');
        });
        echo "✓ Created treasures table\n";
    } else {
        echo "✓ treasures table already exists\n";
    }

    // Upgrades
    if (!Capsule::schema()->hasTable('upgrades')) {
        Capsule::schema()->create('upgrades', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('name', 128);
            $table->integer('baseCost');
            $table->text('effect');
            $table->integer('maxLevel');
        });
        echo "✓ Created upgrades table\n";
    } else {
        echo "✓ upgrades table already exists\n";
    }

    // Upgrade Definitions
    if (!Capsule::schema()->hasTable('upgrade_definitions')) {
        Capsule::schema()->create('upgrade_definitions', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('name', 128);
            $table->text('description');
            $table->text('baseEffect');
        });
        echo "✓ Created upgrade_definitions table\n";
    } else {
        echo "✓ upgrade_definitions table already exists\n";
    }

    // Player State (supports huge numbers)
    if (!Capsule::schema()->hasTable('player_state')) {
        Capsule::schema()->create('player_state', function (Blueprint $table) {
            $table->integer('id')->primary()->default(1);
            $table->string('gold_value', 32)->default('0');
            $table->integer('gold_exp')->default(0);
            $table->string('goblins_value', 32)->default('0');
            $table->integer('goblins_exp')->default(0);
            $table->timestamps();
        });
        echo "✓ Created player_state table\n";
    } else {
        echo "✓ player_state table already exists\n";
    }

    // Player Achievements
    if (!Capsule::schema()->hasTable('player_achievements')) {
        Capsule::schema()->create('player_achievements', function (Blueprint $table) {
            $table->string('achievement_id', 64)->primary();
            $table->timestamp('unlocked_at')->useCurrent();
        });
        echo "✓ Created player_achievements table\n";
    } else {
        echo "✓ player_achievements table already exists\n";
    }

    // Player Treasures
    if (!Capsule::schema()->hasTable('player_treasures')) {
        Capsule::schema()->create('player_treasures', function (Blueprint $table) {
            $table->string('treasure_id', 64)->primary();
            $table->timestamp('collected_at')->useCurrent();
        });
        echo "✓ Created player_treasures table\n";
    } else {
        echo "✓ player_treasures table already exists\n";
    }

    // --- Seed Data from JSON files ---
    $backendDir = realpath(__DIR__ . '/../');

    // Helper to seed a table from a JSON file
    function seedTableFromJson($table, $jsonFile, $uniqueKey = null) {
        $data = json_decode(file_get_contents($jsonFile), true);
        if (!$data) return;
        foreach ($data as $row) {
            if ($uniqueKey && isset($row[$uniqueKey])) {
                $exists = Capsule::table($table)->where($uniqueKey, $row[$uniqueKey])->first();
                if (!$exists) {
                    Capsule::table($table)->insert($row);
                }
            } else {
                Capsule::table($table)->insert($row);
            }
        }
        echo "✓ Seeded $table from $jsonFile\n";
    }

    // Seed game_constants (key-value)
    $constants = json_decode(file_get_contents("$backendDir/game_constants.json"), true);
    if ($constants) {
        foreach ($constants as $key => $value) {
            $exists = Capsule::table('game_constants')->where('key', $key)->first();
            if (!$exists) {
                Capsule::table('game_constants')->insert([
                    'key' => $key,
                    'value' => is_array($value) ? json_encode($value) : $value
                ]);
            }
        }
        echo "✓ Seeded game_constants from game_constants.json\n";
    }

    // Seed other tables
    seedTableFromJson('achievements', "$backendDir/achievements.json", 'id');
    seedTableFromJson('treasures', "$backendDir/treasures.json", 'id');
    seedTableFromJson('upgrades', "$backendDir/upgrades.json", 'id');
    seedTableFromJson('upgrade_definitions', "$backendDir/upgrade_definitions.json", 'id');

    // Initialize default player state
    $playerExists = Capsule::table('player_state')->where('id', 1)->first();
    if (!$playerExists) {
        Capsule::table('player_state')->insert([
            'id' => 1,
            'gold_value' => '0',
            'gold_exp' => 0,
            'goblins_value' => '0',
            'goblins_exp' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);
        echo "✓ Created default player state\n";
    } else {
        echo "✓ Default player state already exists\n";
    }

    echo "\n✅ dragons_den database initialization completed successfully!\n";
    echo "Backend server can now be started with: composer start\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
