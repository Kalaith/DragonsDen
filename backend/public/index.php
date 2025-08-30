<?php
// public/index.php
require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use DI\Container;
use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Initialize database connection
$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => $_ENV['DB_HOST'] ?? 'localhost',
    'database'  => $_ENV['DB_NAME'] ?? 'dragons_den',
    'username'  => $_ENV['DB_USER'] ?? 'root',
    'password'  => $_ENV['DB_PASSWORD'] ?? '',
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix'    => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

$container = new Container();
AppFactory::setContainer($container);
$app = AppFactory::create();

// Set the base path for proper routing when accessed via rewrite rules
$app->setBasePath('/dragons_den');

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

// Debug: Log the request URI (commented out for production)
// error_log("Request URI: " . ($_SERVER['REQUEST_URI'] ?? 'Not set'));
// error_log("Script name: " . ($_SERVER['SCRIPT_NAME'] ?? 'Not set'));
// error_log("Path info: " . ($_SERVER['PATH_INFO'] ?? 'Not set'));

// Register routes
(require __DIR__ . '/../src/Routes/api.php')($app);

// Add a simple test route
$app->get('/test', function ($request, $response) {
    $response->getBody()->write('Test route works!');
    return $response;
});

$app->run();
