<?php
use PHPUnit\Framework\TestCase;
use App\Controllers\SystemController;
use App\Http\Request;
use App\Http\Response;

class SystemControllerTest extends TestCase
{
    private function makeRequest(string $method, string $uri): Request
    {
        return new Request([], [], [], [
            'REQUEST_METHOD' => $method,
            'REQUEST_URI' => $uri,
            'REQUEST_TIME' => time(),
        ], $method, $uri);
    }

    public function testStatusReturnsJson()
    {
        $request = $this->makeRequest('GET', '/api/status');
        $response = new Response();
        $result = SystemController::status($request, $response);

        $this->assertStringContainsString('application/json', implode(' ', $result->getHeaders()));
    }
}
