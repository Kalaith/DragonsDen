<?php
// src/Utils/Logger.php
namespace App\Utils;

use Monolog\Logger as MonoLogger;
use Monolog\Handler\StreamHandler;

class Logger
{
    public static function getLogger($name = 'app')
    {
        $logger = new MonoLogger($name);
        $logPath = __DIR__ . '/../../storage/logs/app.log';
        if (!file_exists(dirname($logPath))) {
            mkdir(dirname($logPath), 0777, true);
        }
        $logger->pushHandler(new StreamHandler($logPath, MonoLogger::DEBUG));
        return $logger;
    }
}
