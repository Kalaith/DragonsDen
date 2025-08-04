<?php
// tests/Routes/PlayerControllerTest.php
use PHPUnit\Framework\TestCase;
use Slim\App;
use Slim\Http\Request;
use Slim\Psr7\Response;
use Slim\Http\Environment;
use Slim\Http\Uri;
use Slim\Http\Headers;
use Slim\Http\RequestBody;
use App\Controllers\PlayerController;
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\StreamFactory;

class PlayerControllerTest extends TestCase
{
    private $app;
    private $controller;

    protected function setUp(): void
    {
        $this->controller = new PlayerController();
        $this->app = AppFactory::create();
    }

    private function createRequest($method, $uri, $data = null)
    {
        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest($method, $uri);
        if ($data) {
            $streamFactory = new StreamFactory();
            $stream = $streamFactory->createStream($data);
            $request = $request->withBody($stream)
                ->withHeader('Content-Type', 'application/json');
        }
        return $request;
    }

    // GET /api/player tests
    public function testGetPlayerDataWithValidPlayer()
    {
        $request = $this->createRequest('GET', '/api/player');
        $response = new Response();

        $result = $this->controller->getPlayerData($request, $response);
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('gold', $body);
        $this->assertArrayHasKey('goblins', $body);
        $this->assertArrayHasKey('gold_display', $body);
        $this->assertArrayHasKey('goblins_display', $body);
        $this->assertArrayHasKey('achievements', $body);
        $this->assertArrayHasKey('treasures', $body);
        $this->assertArrayHasKey('last_updated', $body);
        // Remove checks for 'level' and 'experience' as they are not in the schema or data
    }


    // POST /api/player/collect-gold tests
    public function testCollectGoldWithValidData()
    {
        $data = json_encode(['amount' => 100]);
        $request = $this->createRequest('POST', '/api/player/collect-gold', $data);
        $response = new Response();

        $result = $this->controller->collectGold($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('success', $body);
        $this->assertArrayHasKey('new_gold_amount', $body);
    }

    public function testCollectGoldWithNoData()
    {
        $request = $this->createRequest('POST', '/api/player/collect-gold');
        $response = new Response();

        $result = $this->controller->collectGold($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Missing required amount parameter', $body['error']);
    }

    public function testCollectGoldWithInvalidAmount()
    {
        $data = json_encode(['amount' => -50]);
        $request = $this->createRequest('POST', '/api/player/collect-gold', $data);
        $response = new Response();

        $result = $this->controller->collectGold($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Invalid amount - must be positive', $body['error']);
    }

    // POST /api/player/send-minions tests
    public function testSendMinionsWithValidData()
    {
        $data = json_encode(['target' => 'ruins', 'minion_count' => 5]);
        $request = $this->createRequest('POST', '/api/player/send-minions', $data);
        $response = new Response();

        $result = $this->controller->sendMinions($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('success', $body);
        $this->assertArrayHasKey('mission_id', $body);
    }

    public function testSendMinionsWithNoData()
    {
        $request = $this->createRequest('POST', '/api/player/send-minions');
        $response = new Response();

        $result = $this->controller->sendMinions($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Missing required parameters', $body['error']);
    }

    public function testSendMinionsWithInsufficientMinions()
    {
        $data = json_encode(['target' => 'ruins', 'minion_count' => 1000]);
        $request = $this->createRequest('POST', '/api/player/send-minions', $data);
        $response = new Response();

        $result = $this->controller->sendMinions($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Insufficient minions available', $body['error']);
    }

    // POST /api/player/explore-ruins tests
    public function testExploreRuinsWithValidData()
    {
        $data = json_encode(['ruin_id' => 1, 'exploration_type' => 'quick']);
        $request = $this->createRequest('POST', '/api/player/explore-ruins', $data);
        $response = new Response();

        $result = $this->controller->exploreRuins($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('success', $body);
        $this->assertArrayHasKey('exploration_result', $body);
    }

    public function testExploreRuinsWithNoData()
    {
        $request = $this->createRequest('POST', '/api/player/explore-ruins');
        $response = new Response();

        $result = $this->controller->exploreRuins($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Missing required parameters', $body['error']);
    }

    public function testExploreRuinsWithInvalidRuinId()
    {
        $data = json_encode(['ruin_id' => 99999, 'exploration_type' => 'quick']);
        $request = $this->createRequest('POST', '/api/player/explore-ruins', $data);
        $response = new Response();

        $result = $this->controller->exploreRuins($request, $response);
        
        $this->assertEquals(404, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Ruin not found', $body['error']);
    }

    // POST /api/player/hire-goblin tests
    public function testHireGoblinWithValidData()
    {
        $data = json_encode(['goblin_type' => 'worker', 'quantity' => 1]);
        $request = $this->createRequest('POST', '/api/player/hire-goblin', $data);
        $response = new Response();

        $result = $this->controller->hireGoblin($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('success', $body);
        $this->assertArrayHasKey('new_minion_count', $body);
    }

    public function testHireGoblinWithNoData()
    {
        $request = $this->createRequest('POST', '/api/player/hire-goblin');
        $response = new Response();

        $result = $this->controller->hireGoblin($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Missing required parameters', $body['error']);
    }

    public function testHireGoblinWithInsufficientGold()
    {
        $data = json_encode(['goblin_type' => 'elite', 'quantity' => 100]);
        $request = $this->createRequest('POST', '/api/player/hire-goblin', $data);
        $response = new Response();

        $result = $this->controller->hireGoblin($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Insufficient gold', $body['error']);
    }

    // POST /api/player/prestige tests
    public function testPrestigeWithValidRequirements()
    {
        $data = json_encode(['confirm' => true]);
        $request = $this->createRequest('POST', '/api/player/prestige', $data);
        $response = new Response();

        $result = $this->controller->prestige($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('success', $body);
        $this->assertArrayHasKey('prestige_level', $body);
        $this->assertArrayHasKey('prestige_bonuses', $body);
    }

    public function testPrestigeWithNoConfirmation()
    {
        $request = $this->createRequest('POST', '/api/player/prestige');
        $response = new Response();

        $result = $this->controller->prestige($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Prestige confirmation required', $body['error']);
    }

    public function testPrestigeWithInsufficientLevel()
    {
        $data = json_encode(['confirm' => true]);
        $request = $this->createRequest('POST', '/api/player/prestige', $data);
        $response = new Response();

        // Mock low level player
        $result = $this->controller->prestige($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Insufficient level for prestige', $body['error']);
    }

    // Additional edge case tests
    public function testInvalidJsonPayload()
    {
        $request = $this->createRequest('POST', '/api/player/collect-gold', 'invalid json');
        $response = new Response();

        $result = $this->controller->collectGold($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
        $this->assertEquals('Invalid JSON payload', $body['error']);
    }

    public function testLargePayloadHandling()
    {
        $largeData = json_encode(['amount' => str_repeat('9', 10000)]);
        $request = $this->createRequest('POST', '/api/player/collect-gold', $largeData);
        $response = new Response();

        $result = $this->controller->collectGold($request, $response);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
    }

    public function testRateLimitingScenario()
    {
        // Test multiple rapid requests
        $data = json_encode(['amount' => 1]);
        for ($i = 0; $i < 10; $i++) {
            $request = $this->createRequest('POST', '/api/player/collect-gold', $data);
            $response = new Response();
            $result = $this->controller->collectGold($request, $response);
            
            if ($i > 5) {
                // After several requests, should hit rate limit
                $this->assertEquals(429, $result->getStatusCode());
                break;
            }
        }
    }
}
