<?php
use PHPUnit\Framework\TestCase;
use App\Controllers\GameDataController;
use App\Http\Request;
use App\Http\Response;

class GameDataControllerTest extends TestCase
{
    private function makeRequest(string $method, string $uri, array $body = []): Request
    {
        return new Request([
            'content-type' => 'application/json'
        ], [], $body, [
            'REQUEST_METHOD' => $method,
            'REQUEST_URI' => $uri,
        ], $method, $uri);
    }

    public function testGetConstantsReturnsJson()
    {
        $request = $this->makeRequest('GET', '/api/constants');
        $response = new Response();
        $result = GameDataController::getConstants($request, $response);

        $this->assertInstanceOf(Response::class, $result);
        $this->assertStringContainsString('application/json', implode(' ', $result->getHeaders()));
    }

    public function testGetConstantMissingKeyReturns400()
    {
        $request = $this->makeRequest('GET', '/api/constants/');
        $response = new Response();
        $result = GameDataController::getConstant($request, $response, []);

        $this->assertEquals(400, $result->getStatusCode());
    }
}
