<?php

use App\Core\Router;

trait RouterTestHelper
{
    protected function buildRouter(): Router
    {
        $router = new Router();
        $routes = require __DIR__ . '/../../src/Routes/router.php';
        $routes($router);
        return $router;
    }

    protected function dispatch(string $method, string $uri, ?string $body = null, array $headers = []): array
    {
        header_remove();
        $_GET = [];
        $_POST = [];
        $_SERVER = [
            'REQUEST_METHOD' => $method,
            'REQUEST_URI' => $uri,
            'REQUEST_TIME' => time(),
            'REQUEST_TIME_FLOAT' => microtime(true),
        ];

        $parts = parse_url($uri);
        if (isset($parts['query'])) {
            parse_str($parts['query'], $_GET);
        }

        if ($body !== null) {
            $_SERVER['RAW_BODY'] = $body;
        }

        if (!isset($headers['Content-Type']) && $body !== null) {
            $headers['Content-Type'] = 'application/json';
        }

        foreach ($headers as $name => $value) {
            $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
            $_SERVER[$key] = $value;
            if (strtolower($name) === 'content-type') {
                $_SERVER['CONTENT_TYPE'] = $value;
            }
        }

        $router = $this->buildRouter();

        ob_start();
        $router->handle();
        $output = ob_get_clean();
        $status = http_response_code();
        $responseHeaders = headers_list();
        header_remove();

        return [$status, $responseHeaders, $output];
    }
}
