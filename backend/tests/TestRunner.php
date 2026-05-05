<?php

namespace Tests;

// tests/TestRunner.php
// Simple test runner script to execute all route tests

class TestRunner
{
    private $testResults = [];
    public function runAllTests()
    {
        echo "=== Dragons Den API Route Tests ===\n\n";
        $testFiles = [
            'Routes/GameDataControllerTest.php',
            'Routes/PlayerControllerTest.php',
            'Routes/SystemControllerTest.php',
            'Routes/apiTest.php'
        ];
        foreach ($testFiles as $testFile) {
            $this->runTestFile($testFile);
        }

        $this->printSummary();
    }

    private function runTestFile($testFile)
    {
        echo "Running tests in: $testFile\n";
        echo str_repeat('-', 50) . "\n";
        $fullPath = __DIR__ . '/' . $testFile;
        if (!file_exists($fullPath)) {
            echo "❌ Test file not found: $testFile\n\n";
            return;
        }

        try {
            require_once $fullPath;
            $className = $this->getClassNameFromFile($testFile);
            if (!class_exists($className)) {
                echo "❌ Test class not found: $className\n\n";
                return;
            }

            $testClass = new $className();
            $methods = get_class_methods($testClass);
            $testMethods = array_filter($methods, function ($method) {

                return strpos($method, 'test') === 0;
            });
            $passed = 0;
            $failed = 0;
            foreach ($testMethods as $method) {
                try {
                    if (method_exists($testClass, 'setUp')) {
                            $testClass->setUp();
                    }

                    $testClass->$method();
                    echo "✅ $method\n";
                    $passed++;
                } catch (Exception $e) {
                    echo "❌ $method - " . $e->getMessage() . "\n";
                    $failed++;
                }
            }

            $this->testResults[$testFile] = [
                'passed' => $passed,
                'failed' => $failed,
                'total' => $passed + $failed
            ];
            echo "\nResults: $passed passed, $failed failed\n\n";
        } catch (Exception $e) {
            echo "❌ Error running test file: " . $e->getMessage() . "\n\n";
        }
    }

    private function getClassNameFromFile($testFile)
    {
        $fileName = basename($testFile, '.php');
// Map file names to class names
        $classMap = [
            'GameDataControllerTest' => 'GameDataControllerTest',
            'PlayerControllerTest' => 'PlayerControllerTest',
            'SystemControllerTest' => 'SystemControllerTest',
            'apiTest' => 'ApiRoutesIntegrationTest'
        ];
        return $classMap[$fileName] ?? $fileName;
    }

    private function printSummary()
    {
        echo str_repeat('=', 60) . "\n";
        echo "TEST SUMMARY\n";
        echo str_repeat('=', 60) . "\n";
        $totalPassed = 0;
        $totalFailed = 0;
        $totalTests = 0;
        foreach ($this->testResults as $file => $results) {
            $totalPassed += $results['passed'];
            $totalFailed += $results['failed'];
            $totalTests += $results['total'];

            echo sprintf(
                "%-40s %3d passed, %3d failed\n",
                basename($file),
                $results['passed'],
                $results['failed']
            );
        }

        echo str_repeat('-', 60) . "\n";
        echo sprintf(
            "%-40s %3d passed, %3d failed\n",
            'TOTAL',
            $totalPassed,
            $totalFailed
        );
        $successRate = $totalTests > 0 ? ($totalPassed / $totalTests) * 100 : 0;
        echo sprintf("Success Rate: %.1f%%\n", $successRate);
        if ($totalFailed === 0) {
            echo "\n🎉 All tests passed!\n";
        } else {
            echo "\n⚠️  Some tests failed. Check the output above for details.\n";
        }
    }
}
