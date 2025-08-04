<?php

// Dragons Den Database Initialization Script
// This script creates the database, runs init.sql for schema, and seeds data.

require_once __DIR__ . '/../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Check if .env file exists and Dotenv will load it
$envPath = realpath(__DIR__ . '/../.env');
if ($envPath && file_exists($envPath)) {
    echo ".env file found at: $envPath\n";
} else {
    echo "❌ .env file NOT found at expected location: " . (__DIR__ . '/../.env') . "\n";
}

// --- Ensure database exists ---
try {
    $pdo = new PDO(
        'mysql:host=' . ($_ENV['DB_HOST'] ?? '127.0.0.1'),
        $_ENV['DB_USER'] ?? 'root',
        $_ENV['DB_PASSWORD'] ?? ''
    );
    $dbName = $_ENV['DB_NAME'] ?? 'dragons_den';
    // Drop if exists
    $pdo->exec("DROP DATABASE IF EXISTS `$dbName`");
    echo "✓ Dropped database if it existed: $dbName\n";
    // Create
    $pdo->exec("CREATE DATABASE `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✓ Created database: $dbName\n";
} catch (PDOException $e) {
    echo "❌ Error creating database: " . $e->getMessage() . "\n";
    exit(1);
}

// === Capsule/Eloquent Setup ===
$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => $_ENV['DB_CONNECTION'] ?? 'mysql',
    'host'      => $_ENV['DB_HOST'] ?? '127.0.0.1',
    'database'  => $_ENV['DB_NAME'] ?? 'dragons_den',
    'username'  => $_ENV['DB_USER'] ?? 'root',
    'password'  => $_ENV['DB_PASSWORD'] ?? '',
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

// --- Run init.sql for schema ---
$initSqlPath = realpath(__DIR__ . '/../initData/init.sql');
if ($initSqlPath && file_exists($initSqlPath)) {
    try {
        $pdo = new PDO(
            'mysql:host=' . ($_ENV['DB_HOST'] ?? '127.0.0.1') . ';dbname=' . ($_ENV['DB_NAME'] ?? 'dragons_den'),
            $_ENV['DB_USER'] ?? 'root',
            $_ENV['DB_PASSWORD'] ?? ''
        );
        $sql = file_get_contents($initSqlPath);
        $pdo->exec($sql);
        echo "✓ Ran schema from init.sql\n";
    } catch (PDOException $e) {
        echo "❌ Error running init.sql: " . $e->getMessage() . "\n";
        exit(1);
    }
} else {
    echo "❌ init.sql not found at $initSqlPath\n";
}

// --- Seed Data from JSON files ---
$backendDir = realpath(__DIR__ . '/../initData/');

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

echo "\n✅ dragons_den database initialization completed successfully!\n";
echo "Backend server can now be started.\n";
