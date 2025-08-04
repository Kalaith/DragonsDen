<?php
// src/External/DatabaseService.php
namespace App\External;

use Illuminate\Database\Capsule\Manager as Capsule;

class DatabaseService
{
    public function __construct()
    {
        $capsule = new Capsule;
        $capsule->addConnection([
            'driver'    => 'mysql',
            'host'      => $_ENV['DB_HOST'] ?? 'localhost',
            'database'  => $_ENV['DB_NAME'] ?? 'dragons_den',
            'username'  => $_ENV['DB_USER'] ?? 'root',
            'password'  => $_ENV['DB_PASSWORD'] ?? '',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
        ]);
        $capsule->setAsGlobal();
        $capsule->bootEloquent();
    }
    public function testConnection()
    {
        try {
            Capsule::connection()->getPdo();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
