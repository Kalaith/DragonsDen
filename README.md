# Dragon's Den React TypeScript

A modern React TypeScript implementation of the Dragon's Den idle game with treasure collection, upgrades, minions, and prestige mechanics.

## Tech Stack

### Core Framework
- **React 19.1.0** - Latest React with modern features
- **React DOM 19.1.0** - DOM-specific methods for React
- **TypeScript 5.8.3** - Type safety and developer experience
- **Vite 6.3.5** - Fast build tool and dev server

### State Management & Utilities
- **Zustand 5.0.5** - Lightweight state management with persistence
- **React Use 17.6.0** - Collection of essential React hooks
- **React Router DOM 7.6.2** - Client-side routing

### Styling & Animations
- **Tailwind CSS 4.1.10** - Utility-first CSS framework
- **@tailwindcss/vite 4.1.10** - Tailwind CSS integration for Vite
- **Framer Motion 12.18.1** - Production-ready motion library for React
- **Autoprefixer 10.4.21** - CSS vendor prefix automation

### Data Visualization
- **Chart.js 4.4.9** - Charts for game statistics and progress tracking

### Development Tools
- **ESLint 9.25.0** - Code linting and quality
- **TypeScript ESLint 8.30.1** - TypeScript-specific linting rules
- **@vitejs/plugin-react 4.4.1** - React support for Vite
- **@types/react 19.1.2** - TypeScript definitions for React
- **@types/react-dom 19.1.2** - TypeScript definitions for React DOM

## Dragon's Den Frontend

### Overview
The frontend for Dragon's Den is built using modern React and TypeScript principles, ensuring maintainability, scalability, and performance. It implements idle game mechanics with treasure collection, upgrades, minions, and prestige systems.

### Features
- **Idle Game Mechanics**: Click-based and passive income systems.
- **Treasure Discovery**: Randomized treasure finding with rarity tiers.
- **Upgrade System**: Multiple upgrade paths affecting game mechanics.
- **Minion System**: Automated gold collection with cooldowns.
- **Prestige Mechanic**: Reset progress for permanent bonuses.
- **Achievement System**: Unlockable achievements for various milestones.
- **Save/Load System**: Local storage persistence with offline earnings.
- **Game Statistics**: Visual charts and progress tracking.
- **Modern UI**: Beautiful animations with Framer Motion and Tailwind CSS.

### Architecture Highlights

#### State Management
- **Zustand**: Utilized for global game state, including player resources (gold, gems), dragon stats, upgrade levels, and minion status. Zustand stores are defined in `src/stores/` and provide reactive access to data. Persistence is handled via Zustand's built-in middleware, saving critical game state to `localStorage` to enable save/load functionality and offline earnings.
- **React Query**: (If applicable, based on backend interaction) Used for managing server-side data, such as fetching initial game configurations or syncing player progress with a potential backend. This ensures efficient caching, background refetching, and simplified data synchronization. (Note: If there's no backend, this point can be removed or adjusted).

#### Data Flow & Storage
- **Game Data (`src/data/`)**: Static game configurations like treasure definitions, upgrade trees, and achievement criteria are stored as immutable JavaScript objects/arrays. These are loaded once at application startup.
- **Client-Side State (`src/stores/`)**: Dynamic game state (player progress, current resources, active minions, etc.) is managed by Zustand stores. These stores are the single source of truth for the UI.
- **Local Storage**: Zustand stores are configured to persist key game state slices to `localStorage`. This allows players to close and reopen the game without losing progress and enables calculation of offline earnings.
- **API Interaction**: (If applicable) For features requiring server interaction (e.g., leaderboards, cloud saves), data is fetched from and sent to the backend API using standard `fetch` or a library like `axios`. Responses are then integrated into the Zustand state.

#### Data Presentation
- **React Components (`src/components/`)**: Data from Zustand stores and static game data is consumed by React components. Components are designed to be modular and reusable, focusing on presenting specific pieces of information or interactive elements.
- **Tailwind CSS**: Used for styling all UI elements. Components are built with utility classes for responsive layouts, consistent theming, and rapid prototyping. This ensures a cohesive visual design across the application.
- **Framer Motion**: Applied to create smooth and engaging animations. Examples include:
    - Floating text animations for gold collection.
    - Transition effects for opening/closing modals and menus.
    - Visual feedback for button clicks and upgrades.
    - Progress bar animations for minion cooldowns.

#### Type Safety
- **TypeScript**: Enforced throughout the codebase. Comprehensive type definitions (`src/types/`) are used for:
    - **Game State**: Defining the structure of all Zustand stores.
    - **API Contracts**: Ensuring consistency between frontend requests and backend responses.
    - **Component Props**: Clearly defining the expected inputs for each React component.
    - **Game Entities**: Strongly typing game objects like `Dragon`, `Upgrade`, `Minion`, and `Treasure`.
This significantly reduces runtime errors and improves code maintainability and developer experience.

### Project Structure
```
src/
├── api/                # (Optional) API service definitions and types for backend interaction
├── components/         # Reusable React components
│   ├── ui/             # Generic UI components (Button, Modal, Input, etc.)
│   ├── game/           # Game-specific components (DragonDisplay, UpgradeCard, MinionPanel)
│   └── layout/         # Layout components (Header, Sidebar, MainContent)
├── hooks/              # Custom React hooks for encapsulating logic (e.g., useGameLoop, useOfflineEarnings)
├── stores/             # Zustand state management definitions (e.g., useGameStore, usePlayerStore)
├── types/              # TypeScript type definitions for all data structures and interfaces
├── data/               # Static game data (e.g., treasure.ts, upgrades.ts, achievements.ts)
├── utils/              # Utility functions and core game logic (e.g., calculations, data transformations)
├── assets/             # Static assets like images, icons (if not in public/)
└── styles/             # Global CSS, Tailwind configuration, and any custom styles
```

### Development
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

### License
This project is licensed under the MIT License.
