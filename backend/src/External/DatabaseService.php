<?php

// src/External/DatabaseService.php
declare(strict_types=1);

namespace App\External;

use App\Core\Environment;
use Illuminate\Database\Capsule\Manager as Capsule;

class DatabaseService
{
    public function __construct()
    {
        $capsule = new Capsule();
        $capsule->addConnection([
            'driver'    => 'mysql',
            'host'      => Environment::required('DB_HOST'),
            'database'  => Environment::required('DB_NAME'),
            'username'  => Environment::required('DB_USER'),
            'password'  => Environment::required('DB_PASSWORD'),
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
