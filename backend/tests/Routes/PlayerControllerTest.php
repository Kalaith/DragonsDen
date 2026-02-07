<?php
use PHPUnit\Framework\TestCase;
use App\Controllers\PlayerController;
use App\Http\Request;
use App\Http\Response;

class PlayerControllerTest extends TestCase
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

    public function testExploreRuinsMissingParamsReturns400()
    {
        $request = $this->makeRequest('POST', '/api/player/explore-ruins', []);
        $response = new Response();
        $result = PlayerController::exploreRuins($request, $response);

        $this->assertEquals(400, $result->getStatusCode());
    }
}
