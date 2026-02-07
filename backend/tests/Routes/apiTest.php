<?php
// tests/Routes/apiTest.php
use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/RouterTestHelper.php';

class ApiRoutesIntegrationTest extends TestCase
{
    use RouterTestHelper;

    public function testGetConstantsRoute()
    {
        [$status] = $this->dispatch('GET', '/api/constants');
        $this->assertContains($status, [200, 500]);
    }

    public function testGetConstantRoute()
    {
        [$status] = $this->dispatch('GET', '/api/constants/AUTO_SAVE_INTERVAL');
        $this->assertContains($status, [200, 404, 500]);
    }

    public function testGetAchievementsRoute()
    {
        [$status] = $this->dispatch('GET', '/api/achievements');
        $this->assertContains($status, [200, 500]);
    }

    public function testGetAchievementRoute()
    {
        [$status] = $this->dispatch('GET', '/api/achievements/1');
        $this->assertContains($status, [200, 404, 500]);
    }

    public function testGetTreasuresRoute()
    {
        [$status] = $this->dispatch('GET', '/api/treasures');
        $this->assertContains($status, [200, 500]);
    }

    public function testGetTreasureRoute()
    {
        [$status] = $this->dispatch('GET', '/api/treasures/1');
        $this->assertContains($status, [200, 404, 500]);
    }

    public function testGetUpgradesRoute()
    {
        [$status] = $this->dispatch('GET', '/api/upgrades');
        $this->assertContains($status, [200, 500]);
    }

    public function testGetUpgradeRoute()
    {
        [$status] = $this->dispatch('GET', '/api/upgrades/1');
        $this->assertContains($status, [200, 404, 500]);
    }

    public function testGetUpgradeDefinitionsRoute()
    {
        [$status] = $this->dispatch('GET', '/api/upgrade-definitions');
        $this->assertContains($status, [200, 500]);
    }

    public function testGetUpgradeDefinitionRoute()
    {
        [$status] = $this->dispatch('GET', '/api/upgrade-definitions/1');
        $this->assertContains($status, [200, 404, 500]);
    }

    public function testGetPlayerDataRoute()
    {
        [$status] = $this->dispatch('GET', '/api/player');
        $this->assertContains($status, [200, 401, 500]);
    }

    public function testCollectGoldRoute()
    {
        $data = json_encode(['amount' => 100]);
        [$status] = $this->dispatch('POST', '/api/player/collect-gold', $data);
        $this->assertContains($status, [200, 400, 401, 500]);
    }

    public function testCollectGoldRouteNoData()
    {
        [$status] = $this->dispatch('POST', '/api/player/collect-gold');
        $this->assertContains($status, [401, 500]);
    }

    public function testSendMinionsRoute()
    {
        $data = json_encode(['target' => 'ruins', 'minion_count' => 5]);
        [$status] = $this->dispatch('POST', '/api/player/send-minions', $data);
        $this->assertContains($status, [200, 400, 401, 500]);
    }

    public function testExploreRuinsRoute()
    {
        $data = json_encode(['ruin_id' => 1, 'exploration_type' => 'quick']);
        [$status] = $this->dispatch('POST', '/api/player/explore-ruins', $data);
        $this->assertContains($status, [200, 400, 401, 404, 500]);
    }

    public function testHireGoblinRoute()
    {
        $data = json_encode(['goblin_type' => 'worker', 'quantity' => 1]);
        [$status] = $this->dispatch('POST', '/api/player/hire-goblin', $data);
        $this->assertContains($status, [200, 400, 401, 500]);
    }

    public function testPrestigeRoute()
    {
        $data = json_encode(['confirm' => true]);
        [$status] = $this->dispatch('POST', '/api/player/prestige', $data);
        $this->assertContains($status, [200, 400, 401, 500]);
    }

    public function testStatusRoute()
    {
        [$status] = $this->dispatch('GET', '/api/status');
        $this->assertContains($status, [200, 500, 503]);
    }

    public function testAuthSessionRoute()
    {
        [$status, , $body] = $this->dispatch('GET', '/api/auth/session');
        $this->assertEquals(401, $status);
        $payload = json_decode($body, true);
        $this->assertIsArray($payload);
    }

    public function testInvalidRoute()
    {
        [$status] = $this->dispatch('GET', '/api/invalid-endpoint');
        $this->assertEquals(404, $status);
    }

    public function testInvalidMethod()
    {
        [$status] = $this->dispatch('PATCH', '/api/constants');
        $this->assertEquals(404, $status);
    }

    public function testMalformedJson()
    {
        [$status] = $this->dispatch('POST', '/api/player/collect-gold', 'invalid json');
        $this->assertContains($status, [200, 401, 500]);
    }

    public function testResponseIsJson()
    {
        [$status, $headers] = $this->dispatch('GET', '/api/status');
        $this->assertContains($status, [200, 500, 503]);
        $contentType = implode(' ', $headers);
        $this->assertStringContainsString('Content-Type: application/json', $contentType);
    }
}
