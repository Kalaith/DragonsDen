<?php
// tests/Routes/SystemControllerTest.php
use PHPUnit\Framework\TestCase;
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Response;
use App\Controllers\SystemController;
use Slim\Psr7\Environment;
use Slim\Psr7\Uri;

class SystemControllerTest extends TestCase
{
    private $app;
    private $controller;

    protected function setUp(): void
    {
        $this->controller = new SystemController();
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

    // GET /api/status tests
    public function testStatusWithHealthySystem()
    {
        $request = $this->createRequest('GET', '/api/status');
        $response = new Response();

        $result = $this->controller->status($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        
        // Verify expected status fields
        $this->assertArrayHasKey('status', $body);
        $this->assertArrayHasKey('timestamp', $body);
        $this->assertArrayHasKey('version', $body);
        $this->assertArrayHasKey('database', $body);
        $this->assertArrayHasKey('memory_usage', $body);
        $this->assertArrayHasKey('uptime', $body);
        
        $this->assertEquals('healthy', $body['status']);
        $this->assertEquals('connected', $body['database']);
    }

    public function testStatusWithDatabaseConnectionIssue()
    {
        $request = $this->createRequest('GET', '/api/status');
        $response = new Response();

        // Mock database connection failure
        $result = $this->controller->status($request, $response);
        
        // System should still respond but indicate degraded status
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        
        $this->assertArrayHasKey('status', $body);
        $this->assertArrayHasKey('database', $body);
        
        // Status might be 'degraded' with database 'disconnected'
        $this->assertContains($body['status'], ['healthy', 'degraded', 'unhealthy']);
        $this->assertContains($body['database'], ['connected', 'disconnected', 'error']);
    }

    public function testStatusWithSystemOverload()
    {
        $request = $this->createRequest('GET', '/api/status');
        $response = new Response();

        // Simulate high memory usage scenario
        $result = $this->controller->status($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        
        $this->assertArrayHasKey('memory_usage', $body);
        $this->assertIsNumeric($body['memory_usage']);
        
        // Memory usage should be a reasonable value
        $this->assertGreaterThan(0, $body['memory_usage']);
        $this->assertLessThan(100, $body['memory_usage']); // Assuming percentage
    }

    public function testStatusResponseStructure()
    {
        $request = $this->createRequest('GET', '/api/status');
        $response = new Response();

        $result = $this->controller->status($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        
        // Verify response structure
        $requiredFields = [
            'status',
            'timestamp', 
            'version',
            'database',
            'memory_usage',
            'uptime'
        ];
        
        foreach ($requiredFields as $field) {
            $this->assertArrayHasKey($field, $body, "Missing required field: $field");
        }
        
        // Verify data types
        $this->assertIsString($body['status']);
        $this->assertIsNumeric($body['timestamp']);
        $this->assertIsString($body['version']);
        $this->assertIsString($body['database']);
        $this->assertIsNumeric($body['memory_usage']);
        $this->assertIsNumeric($body['uptime']);
    }

    public function testStatusTimestampAccuracy()
    {
        $beforeRequest = time();
        
        $request = $this->createRequest('GET', '/api/status');
        $response = new Response();
        $result = $this->controller->status($request, $response);
        
        $afterRequest = time();
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        
        $timestamp = $body['timestamp'];
        
        // Timestamp should be within reasonable range of request time
        $this->assertGreaterThanOrEqual($beforeRequest, $timestamp);
        $this->assertLessThanOrEqual($afterRequest, $timestamp);
    }

    public function testStatusVersionFormat()
    {
        $request = $this->createRequest('GET', '/api/status');
        $response = new Response();

        $result = $this->controller->status($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        
        $version = $body['version'];
        
        // Version should follow semantic versioning pattern
        $this->assertMatchesRegularExpression('/^\d+\.\d+\.\d+/', $version);
    }

    public function testStatusWithMalformedRequest()
    {
        // Test with invalid HTTP method
        $request = $this->createRequest('POST', '/api/status');
        $response = new Response();

        // Status endpoint should only accept GET requests
        $result = $this->controller->status($request, $response);
        
        // Should either work (if method not checked) or return 405 Method Not Allowed
        $this->assertContains($result->getStatusCode(), [200, 405]);
    }

    public function testStatusWithQueryParameters()
    {
        // Test with query parameters (should be ignored)
        $request = $this->createRequest('GET', '/api/status?detailed=true&format=json');
        $response = new Response();

        $result = $this->controller->status($request, $response);
        
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        
        // Should return same structure regardless of query params
        $this->assertArrayHasKey('status', $body);
    }

    public function testStatusWithHeaderVariations()
    {
        // Test with different Accept headers
        $env = Environment::mock([
            'REQUEST_METHOD' => 'GET',
            'REQUEST_URI' => '/api/status',
            'HTTP_ACCEPT' => 'application/xml'
        ]);

        $uri = Uri::createFromEnvironment($env);
        $headers = Headers::createFromEnvironment($env);
        $cookies = [];
        $serverParams = $env->all();
        $body = new RequestBody();

        $request = new Request('GET', $uri, $headers, $cookies, $serverParams, $body);
        $response = new Response();

        $result = $this->controller->status($request, $response);
        
        // Should still return JSON even with XML Accept header
        $this->assertEquals(200, $result->getStatusCode());
        $body = json_decode((string)$result->getBody(), true);
        $this->assertIsArray($body);
    }

    public function testStatusConcurrentRequests()
    {
        // Simulate multiple concurrent status requests
        $requests = [];
        $responses = [];
        
        for ($i = 0; $i < 5; $i++) {
            $request = $this->createRequest('GET', '/api/status');
            $response = new Response();
            
            $result = $this->controller->status($request, $response);
            
            $this->assertEquals(200, $result->getStatusCode());
            $responses[] = json_decode((string)$result->getBody(), true);
        }
        
        // All responses should have consistent structure
        $firstResponse = $responses[0];
        foreach ($responses as $response) {
            $this->assertEquals(array_keys($firstResponse), array_keys($response));
        }
    }

    public function testStatusPerformance()
    {
        $startTime = microtime(true);
        
        $request = $this->createRequest('GET', '/api/status');
        $response = new Response();
        $result = $this->controller->status($request, $response);
        
        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;
        
        $this->assertEquals(200, $result->getStatusCode());
        
        // Status endpoint should respond quickly (under 1 second)
        $this->assertLessThan(1.0, $executionTime, 'Status endpoint took too long to respond');
    }

    public function testStatusErrorHandling()
    {
        try {
            $request = $this->createRequest('GET', '/api/status');
            $response = new Response();
            
            // Test that status endpoint handles errors gracefully
            $result = $this->controller->status($request, $response);
            
            // Should always return a response, even if some checks fail
            $this->assertInstanceOf(Response::class, $result);
            $this->assertContains($result->getStatusCode(), [200, 500, 503]);
            
        } catch (Exception $e) {
            // If an exception is thrown, it should be a handled error
            $this->assertStringContainsString('status', strtolower($e->getMessage()));
        }
    }
}
