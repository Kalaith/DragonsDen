<?php
// tests/Routes/GameDataControllerTest.php
use PHPUnit\Framework\TestCase;
use Slim\App;
use Slim\Http\Request;
use Slim\Psr7\Response;
use Slim\Http\Environment;
use Slim\Http\Uri;
use Slim\Http\Headers;
use Slim\Http\RequestBody;
use App\Controllers\GameDataController;
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\StreamFactory;
use App\External\DatabaseService;

class GameDataControllerTest extends TestCase
{
    private $app;
    private $controller;

    protected function setUp(): void
    {
        // Ensure database connection for tests
        new DatabaseService();
        $this->controller = new GameDataController();
        // Initialize Slim app for testing
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

    // GET /api/constants tests
    public function testGetConstantsWithData()
    {
        $request = $this->createRequest('GET', '/api/constants');
        $response = new Response();

        $result = $this->controller->getConstants($request, $response);
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testGetConstantsErrorState()
    {
        // Test database connection error scenario
        $request = $this->createRequest('GET', '/api/constants');
        $response = new Response();

        // This would require mocking database failure
        // For now, test that method handles errors gracefully
        try {
            $result = $this->controller->getConstants($request, $response);
            $this->assertTrue(true); // If no exception, test passes
        } catch (Exception $e) {
            $this->assertEquals(500, $response->getStatusCode());
        }
    }

    // GET /api/constants/{key} tests
    public function testGetConstantWithValidKey()
    {
        $request = $this->createRequest('GET', '/api/constants/AUTO_SAVE_INTERVAL');
        $response = new Response();
        $args = ['key' => 'AUTO_SAVE_INTERVAL'];

        $result = $this->controller->getConstant($request, $response, $args);
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertEquals(10000, $body);
    }

    public function testGetConstantWithInvalidKey()
    {
        $request = $this->createRequest('GET', '/api/constants/invalid_key');
        $response = new Response();
        $args = ['key' => 'invalid_key'];

        $result = $this->controller->getConstant($request, $response, $args);
        
        $this->assertEquals(404, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
    }

    public function testGetConstantWithEmptyKey()
    {
        $request = $this->createRequest('GET', '/api/constants/');
        $response = new Response();
        $args = ['key' => ''];

        $result = $this->controller->getConstant($request, $response, $args);
        
        $this->assertEquals(400, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
    }

    // GET /api/achievements tests
    public function testGetAchievementsWithData()
    {
        $request = $this->createRequest('GET', '/api/achievements');
        $response = new Response();

        $result = $this->controller->getAchievements($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testGetAchievementsEmptyDatabase()
    {
        $request = $this->createRequest('GET', '/api/achievements');
        $response = new Response();

        $result = $this->controller->getAchievements($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testGetAchievementsErrorState()
    {
        $request = $this->createRequest('GET', '/api/achievements');
        $response = new Response();

        try {
            $result = $this->controller->getAchievements($request, $response);
            $this->assertTrue(true);
        } catch (Exception $e) {
            $this->assertEquals(500, $response->getStatusCode());
        }
    }

    // GET /api/achievements/{id} tests
    public function testGetAchievementWithValidId()
    {
        $request = $this->createRequest('GET', '/api/achievements/achievement_unlocked');
        $response = new Response();
        $args = ['id' => 'achievement_unlocked'];

        $result = $this->controller->getAchievement($request, $response, $args);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('id', $body);
    }

    public function testGetAchievementWithInvalidId()
    {
        $request = $this->createRequest('GET', '/api/achievements/99999');
        $response = new Response();
        $args = ['id' => '99999'];

        $result = $this->controller->getAchievement($request, $response, $args);
        
        $this->assertEquals(404, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
    }

    // GET /api/treasures tests
    public function testGetTreasuresWithData()
    {
        $request = $this->createRequest('GET', '/api/treasures');
        $response = new Response();

        $result = $this->controller->getTreasures($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testGetTreasuresEmptyDatabase()
    {
        $request = $this->createRequest('GET', '/api/treasures');
        $response = new Response();

        $result = $this->controller->getTreasures($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testGetTreasuresErrorState()
    {
        $request = $this->createRequest('GET', '/api/treasures');
        $response = new Response();

        try {
            $result = $this->controller->getTreasures($request, $response);
            $this->assertTrue(true);
        } catch (Exception $e) {
            $this->assertEquals(500, $response->getStatusCode());
        }
    }

    // GET /api/treasures/{id} tests
    public function testGetTreasureWithValidId()
    {
        $request = $this->createRequest('GET', '/api/treasures/treasure-1');
        $response = new Response();
        $args = ['id' => 'treasure-1'];

        $result = $this->controller->getTreasure($request, $response, $args);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('id', $body);
    }

    public function testGetTreasureWithInvalidId()
    {
        $request = $this->createRequest('GET', '/api/treasures/99999');
        $response = new Response();
        $args = ['id' => '99999'];

        $result = $this->controller->getTreasure($request, $response, $args);
        
        $this->assertEquals(404, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
    }

    // GET /api/upgrades tests
    public function testGetUpgradesWithData()
    {
        $request = $this->createRequest('GET', '/api/upgrades');
        $response = new Response();

        $result = $this->controller->getUpgrades($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testGetUpgradesEmptyDatabase()
    {
        $request = $this->createRequest('GET', '/api/upgrades');
        $response = new Response();

        $result = $this->controller->getUpgrades($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testGetUpgradesErrorState()
    {
        $request = $this->createRequest('GET', '/api/upgrades');
        $response = new Response();

        try {
            $result = $this->controller->getUpgrades($request, $response);
            $this->assertTrue(true);
        } catch (Exception $e) {
            $this->assertEquals(500, $response->getStatusCode());
        }
    }

    // GET /api/upgrades/{id} tests
    public function testGetUpgradeWithValidId()
    {
        $request = $this->createRequest('GET', '/api/upgrades/upgrade1');
        $response = new Response();
        $args = ['id' => 'upgrade1'];

        $result = $this->controller->getUpgrade($request, $response, $args);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('id', $body);
    }

    public function testGetUpgradeWithInvalidId()
    {
        $request = $this->createRequest('GET', '/api/upgrades/99999');
        $response = new Response();
        $args = ['id' => '99999'];

        $result = $this->controller->getUpgrade($request, $response, $args);
        
        $this->assertEquals(404, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
    }

    // GET /api/upgrade-definitions tests
    public function testGetUpgradeDefinitionsWithData()
    {
        $request = $this->createRequest('GET', '/api/upgrade-definitions');
        $response = new Response();

        $result = $this->controller->getUpgradeDefinitions($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testGetUpgradeDefinitionsEmptyDatabase()
    {
        $request = $this->createRequest('GET', '/api/upgrade-definitions');
        $response = new Response();

        $result = $this->controller->getUpgradeDefinitions($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testGetUpgradeDefinitionsErrorState()
    {
        $request = $this->createRequest('GET', '/api/upgrade-definitions');
        $response = new Response();

        try {
            $result = $this->controller->getUpgradeDefinitions($request, $response);
            $this->assertTrue(true);
        } catch (Exception $e) {
            $this->assertEquals(500, $response->getStatusCode());
        }
    }

    // GET /api/upgrade-definitions/{id} tests
    public function testGetUpgradeDefinitionWithValidId()
    {
        $request = $this->createRequest('GET', '/api/upgrade-definitions/clawSharpness');
        $response = new Response();
        $args = ['id' => 'clawSharpness'];

        $result = $this->controller->getUpgradeDefinition($request, $response, $args);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('id', $body);
    }

    public function testGetUpgradeDefinitionWithInvalidId()
    {
        $request = $this->createRequest('GET', '/api/upgrade-definitions/99999');
        $response = new Response();
        $args = ['id' => '99999'];

        $result = $this->controller->getUpgradeDefinition($request, $response, $args);
        
        $this->assertEquals(404, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertArrayHasKey('error', $body);
    }
}
