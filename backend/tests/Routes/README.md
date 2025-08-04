# Dragons Den API Route Tests

This directory contains comprehensive test files for all API routes defined in the Dragons Den backend.

## Test Files Created

### 1. GameDataControllerTest.php
Tests for all game data endpoints:
- `GET /api/constants` - Tests with data, empty database, and error states
- `GET /api/constants/{key}` - Tests valid keys, invalid keys, and empty keys
- `GET /api/achievements` - Tests with data, empty database, and error states
- `GET /api/achievements/{id}` - Tests valid IDs, invalid IDs, and non-numeric IDs
- `GET /api/treasures` - Tests with data, empty database, and error states
- `GET /api/treasures/{id}` - Tests valid IDs, invalid IDs, and non-numeric IDs
- `GET /api/upgrades` - Tests with data, empty database, and error states
- `GET /api/upgrades/{id}` - Tests valid IDs, invalid IDs, and non-numeric IDs
- `GET /api/upgrade-definitions` - Tests with data, empty database, and error states
- `GET /api/upgrade-definitions/{id}` - Tests valid IDs, invalid IDs, and non-numeric IDs

### 2. PlayerControllerTest.php
Tests for all player action endpoints:
- `GET /api/player` - Tests valid player, no session, and database errors
- `POST /api/player/collect-gold` - Tests valid data, no data, invalid amounts
- `POST /api/player/send-minions` - Tests valid data, no data, insufficient minions
- `POST /api/player/explore-ruins` - Tests valid data, no data, invalid ruin IDs
- `POST /api/player/hire-goblin` - Tests valid data, no data, insufficient gold
- `POST /api/player/prestige` - Tests valid requirements, no confirmation, insufficient level
- Additional edge cases: Invalid JSON, large payloads, rate limiting

### 3. SystemControllerTest.php
Tests for system endpoints:
- `GET /api/status` - Tests healthy system, database issues, system overload
- Response structure validation
- Timestamp accuracy testing
- Version format validation
- Performance testing
- Error handling scenarios

### 4. apiTest.php (Integration Tests)
Integration tests that test the actual route definitions:
- All GET routes with various scenarios
- All POST routes with valid data, no data, and error states
- Invalid routes and methods
- Content type handling
- Response format validation

## Test Scenarios Covered

Each route is tested with at least these scenarios:
1. **Valid Data**: Normal operation with expected inputs
2. **No Data**: Missing or empty request data
3. **Error State**: Invalid inputs, database errors, authentication failures

## Running Tests

### Using PHPUnit (Recommended)
```bash
# Install PHPUnit if not already installed
composer require --dev phpunit/phpunit

# Run all tests
./vendor/bin/phpunit

# Run specific test file
./vendor/bin/phpunit tests/Routes/GameDataControllerTest.php

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage
```

### Using Test Runner
```bash
# Simple test runner (no dependencies)
php tests/TestRunner.php
```

## Configuration

- `phpunit.xml` - PHPUnit configuration with test suites and coverage settings
- Tests are configured to use a test database environment
- Coverage reports generated in `coverage/` directory

## Test Structure

Each test file follows this pattern:
- setUp() method for test initialization
- Individual test methods for each scenario
- Helper methods for creating mock requests
- Assertions for status codes and response structure

## Expected Status Codes

- **200**: Successful operation
- **400**: Bad request (invalid data)
- **401**: Unauthorized (no session)
- **404**: Not found (invalid IDs)
- **405**: Method not allowed
- **413**: Payload too large
- **415**: Unsupported media type
- **429**: Too many requests (rate limiting)
- **500**: Internal server error
- **503**: Service unavailable

## Extending Tests

To add new tests:
1. Create test methods starting with `test`
2. Use the provided helper methods for request creation
3. Assert expected status codes and response structure
4. Include edge cases and error scenarios
