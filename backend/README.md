# Dragons Den - Backend

A PHP backend for the "Dragons Den" incremental/idle game.

## Features

- **RESTful API** for game data and player progress
- **Game constants, upgrades, treasures, and achievements** managed in MySQL
- **Seed/init scripts** for all game data
- **Robust error handling** and logging
- **CORS support** for frontend integration

## API Endpoints (Planned)

### Game Data
- `GET /api/constants` - Get all game constants
- `GET /api/achievements` - List all achievements
- `GET /api/treasures` - List all treasures
- `GET /api/upgrades` - List all upgrades
- `GET /api/upgrade-definitions` - List all upgrade definitions

### Player Data (Planned)
- `GET /api/player/{id}` - Get player state
- `POST /api/player/{id}/save` - Save player state
- `POST /api/player/{id}/prestige` - Prestige/reset player

### System
- `GET /api/status` - API status and endpoints

## Quick Start

1. **Install Dependencies**
   ```bash
   composer install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database settings
   ```

3. **Initialize Database**
   ```bash
   php scripts/init-database.php
   ```

4. **Start Server**
   ```bash
   composer start
   # Server runs on http://localhost:3010
   ```

## Project Structure

```
backend/
├── public/
│   └── index.php                # Application entry point
├── src/
│   ├── Actions/
│   ├── Controllers/
│   ├── External/
│   ├── Models/
│   ├── Routes/
│   └── Utils/
├── scripts/
│   └── init-database.php        # Database setup
├── game_constants.json
├── achievements.json
├── treasures.json
├── upgrades.json
├── upgrade_definitions.json
├── composer.json
└── README.md
```

## Architecture

The backend follows the **Actions Pattern**:

- **Controllers** handle HTTP requests/responses
- **Actions** contain business logic and database operations
- **Models** define data structure and relationships
- **External** services handle third-party integrations
- **Utils** provide common functionality

## Database Schema

See `init.sql` for full schema. Example:

### Achievements Table
```sql
id          VARCHAR(64) PRIMARY KEY
name        VARCHAR(128) NOT NULL
description TEXT NOT NULL
```

### Treasures Table
```sql
id          VARCHAR(64) PRIMARY KEY
name        VARCHAR(128) NOT NULL
rarity      VARCHAR(32) NOT NULL
description TEXT NOT NULL
effect      TEXT NOT NULL
```

## Frontend Integration

Update your frontend's API base URL to point to the backend:

```javascript
const API_BASE_URL = 'http://localhost:3010/api';
```

## Development

### Code Standards
- Follows PSR-12 coding standards
- Uses Actions pattern for business logic separation
- Comprehensive error handling and logging
- Type hints and proper documentation

### Testing
```bash
composer test        # Run PHPUnit tests
composer cs-check    # Check code standards
composer cs-fix      # Fix code formatting
```

## Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_NAME=dragons_den
DB_USER=root
DB_PASSWORD=

# Server Configuration
PORT=3010
DEBUG=true

# CORS Configuration
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
```
