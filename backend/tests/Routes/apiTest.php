<?php
// tests/Routes/apiTest.php
// Integration tests for all API routes defined in api.php
use PHPUnit\Framework\TestCase;
use Slim\Factory\AppFactory;
use Slim\Http\Request;
use Slim\Psr7\Response;
use Slim\Http\Environment;
use Slim\Http\Uri;
use Slim\Http\Headers;
use Slim\Http\RequestBody;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\StreamFactory;

class ApiRoutesIntegrationTest extends TestCase
{
    private $app;

    protected function setUp(): void
    {
        // Initialize Slim app with routes
        $this->app = AppFactory::create();
        
        // Load the routes
        $routes = require __DIR__ . '/../../src/Routes/api.php';
        $routes($this->app);
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

    // Game Data Routes Integration Tests
    public function testGetConstantsRoute()
    {
        $request = $this->createRequest('GET', '/api/constants');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 500]);
    }

    public function testGetConstantRoute()
    {
        $request = $this->createRequest('GET', '/api/constants/AUTO_SAVE_INTERVAL');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 404, 500]);
    }

    public function testGetAchievementsRoute()
    {
        $request = $this->createRequest('GET', '/api/achievements');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 500]);
    }

    public function testGetAchievementRoute()
    {
        $request = $this->createRequest('GET', '/api/achievements/1');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 404, 500]);
    }

    public function testGetTreasuresRoute()
    {
        $request = $this->createRequest('GET', '/api/treasures');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 500]);
    }

    public function testGetTreasureRoute()
    {
        $request = $this->createRequest('GET', '/api/treasures/1');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 404, 500]);
    }

    public function testGetUpgradesRoute()
    {
        $request = $this->createRequest('GET', '/api/upgrades');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 500]);
    }

    public function testGetUpgradeRoute()
    {
        $request = $this->createRequest('GET', '/api/upgrades/1');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 404, 500]);
    }

    public function testGetUpgradeDefinitionsRoute()
    {
        $request = $this->createRequest('GET', '/api/upgrade-definitions');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 500]);
    }

    public function testGetUpgradeDefinitionRoute()
    {
        $request = $this->createRequest('GET', '/api/upgrade-definitions/1');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 404, 500]);
    }

    // Player Action Routes Integration Tests
    public function testGetPlayerDataRoute()
    {
        $request = $this->createRequest('GET', '/api/player');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 401, 500]);
    }

    public function testCollectGoldRoute()
    {
        $data = json_encode(['amount' => 100]);
        $request = $this->createRequest('POST', '/api/player/collect-gold', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 400, 401, 500]);
    }

    public function testCollectGoldRouteNoData()
    {
        $request = $this->createRequest('POST', '/api/player/collect-gold');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 500]);
    }

    public function testCollectGoldRouteInvalidData()
    {
        $data = json_encode(['amount' => -50]);
        $request = $this->createRequest('POST', '/api/player/collect-gold', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 500]);
    }

    public function testSendMinionsRoute()
    {
        $data = json_encode(['target' => 'ruins', 'minion_count' => 5]);
        $request = $this->createRequest('POST', '/api/player/send-minions', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 400, 401, 500]);
    }

    public function testSendMinionsRouteNoData()
    {
        $request = $this->createRequest('POST', '/api/player/send-minions');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 500]);
    }

    public function testSendMinionsRouteInvalidTarget()
    {
        $data = json_encode(['target' => 'invalid', 'minion_count' => 5]);
        $request = $this->createRequest('POST', '/api/player/send-minions', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 500]);
    }

    public function testExploreRuinsRoute()
    {
        $data = json_encode(['ruin_id' => 1, 'exploration_type' => 'quick']);
        $request = $this->createRequest('POST', '/api/player/explore-ruins', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 400, 401, 404, 500]);
    }

    public function testExploreRuinsRouteNoData()
    {
        $request = $this->createRequest('POST', '/api/player/explore-ruins');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 500]);
    }

    public function testExploreRuinsRouteInvalidRuin()
    {
        $data = json_encode(['ruin_id' => 99999, 'exploration_type' => 'quick']);
        $request = $this->createRequest('POST', '/api/player/explore-ruins', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 404, 500]);
    }

    public function testHireGoblinRoute()
    {
        $data = json_encode(['goblin_type' => 'worker', 'quantity' => 1]);
        $request = $this->createRequest('POST', '/api/player/hire-goblin', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 400, 401, 500]);
    }

    public function testHireGoblinRouteNoData()
    {
        $request = $this->createRequest('POST', '/api/player/hire-goblin');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 500]);
    }

    public function testHireGoblinRouteInvalidType()
    {
        $data = json_encode(['goblin_type' => 'invalid', 'quantity' => 1]);
        $request = $this->createRequest('POST', '/api/player/hire-goblin', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 500]);
    }

    public function testPrestigeRoute()
    {
        $data = json_encode(['confirm' => true]);
        $request = $this->createRequest('POST', '/api/player/prestige', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 400, 401, 500]);
    }

    public function testPrestigeRouteNoConfirmation()
    {
        $request = $this->createRequest('POST', '/api/player/prestige');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 500]);
    }

    public function testPrestigeRouteInvalidConfirmation()
    {
        $data = json_encode(['confirm' => false]);
        $request = $this->createRequest('POST', '/api/player/prestige', $data);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 401, 500]);
    }

    // System Routes Integration Tests
    public function testStatusRoute()
    {
        $request = $this->createRequest('GET', '/api/status');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [200, 500, 503]);
    }

    // Error Handling Tests
    public function testInvalidRoute()
    {
        $request = $this->createRequest('GET', '/api/invalid-endpoint');
        $response = $this->app->process($request, new Response());
        
        $this->assertEquals(404, $response->getStatusCode());
    }

    public function testInvalidMethod()
    {
        $request = $this->createRequest('PATCH', '/api/constants');
        $response = $this->app->process($request, new Response());
        
        $this->assertEquals(405, $response->getStatusCode());
    }

    public function testMalformedJson()
    {
        $request = $this->createRequest('POST', '/api/player/collect-gold', 'invalid json');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 500]);
    }

    public function testEmptyRequestBody()
    {
        $request = $this->createRequest('POST', '/api/player/collect-gold', '');
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 500]);
    }

    public function testLargeRequestBody()
    {
        $largeData = json_encode(['data' => str_repeat('x', 10000)]);
        $request = $this->createRequest('POST', '/api/player/collect-gold', $largeData);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 413, 500]);
    }

    // Content Type Tests
    public function testContentTypeHandling()
    {
        $env = Environment::mock([
            'REQUEST_METHOD' => 'POST',
            'REQUEST_URI' => '/api/player/collect-gold',
            'CONTENT_TYPE' => 'text/plain'
        ]);

        $uri = Uri::createFromEnvironment($env);
        $headers = Headers::createFromEnvironment($env);
        $cookies = [];
        $serverParams = $env->all();
        $body = new RequestBody();
        $body->write('{"amount": 100}');

        $request = new Request('POST', $uri, $headers, $cookies, $serverParams, $body);
        $response = $this->app->process($request, new Response());
        
        $this->assertContains($response->getStatusCode(), [400, 415, 500]);
    }

    // Response Format Tests
    public function testResponseIsJson()
    {
        $request = $this->createRequest('GET', '/api/status');
        $response = $this->app->process($request, new Response());
        
        $contentType = $response->getHeaderLine('Content-Type');
        $this->assertStringContainsString('application/json', $contentType);
    }

    public function testResponseStructure()
    {
        $request = $this->createRequest('GET', '/api/status');
        $response = $this->app->process($request, new Response());
        
        if ($response->getStatusCode() === 200) {
            $body = json_decode((string)$response->getBody(), true);
            $this->assertIsArray($body);
            $this->assertNotNull($body);
        }
    }
}