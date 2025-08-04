<?php
// public/index.php
require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use DI\Container;

$container = new Container();
AppFactory::setContainer($container);
$app = AppFactory::create();

// Middleware (CORS, error handling, etc.)
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();

// CORS Middleware
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', $_ENV['CORS_ALLOWED_ORIGINS'] ?? '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

// Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Register routes
(require __DIR__ . '/../src/Routes/api.php')($app);

$app->run();
