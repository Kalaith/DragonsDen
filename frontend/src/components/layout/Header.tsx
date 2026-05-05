import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useAuthStore } from '../../stores/authStore';

const Header: React.FC = () => {
  const { prestigeLevel, achievements } = useGameStore();
  const { user, authMode, loginUrl } = useAuthStore();
  const userLabel = user?.username || user?.email || (user?.id ? `User #${user.id}` : null);
  const linkAccountUrl = loginUrl ? (() => {
    const url = new URL(loginUrl, window.location.origin);
    url.searchParams.set('return_to', window.location.href);
    return url.toString();
  })() : null;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-red-900 to-orange-800 text-white shadow-lg">
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <h1 className="text-xl sm:text-2xl font-bold">🐉 Dragon's Den</h1>
        {prestigeLevel > 0 && (
          <div className="flex items-center gap-2 bg-yellow-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
            <span>⭐</span>
            <span>Prestige {prestigeLevel}</span>
          </div>
        )}
      </div>

      <nav className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center gap-2">
          <span>🏆</span>
          <span className="text-xs sm:text-sm">{achievements.size} Achievements</span>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          {userLabel ? (
            <span className="px-2 py-1 rounded bg-white/10">
              {authMode === 'guest' ? 'Guest' : 'Logged in'}: {userLabel}
            </span>
          ) : (
            <span className="px-2 py-1 rounded bg-white/10">Not logged in</span>
          )}
          {user?.is_guest && linkAccountUrl ? (
            <a href={linkAccountUrl} className="px-2 py-1 rounded bg-yellow-300 text-red-950 font-semibold">
              Link Account
            </a>
          ) : null}
        </div>

        <div className="flex gap-2 sm:gap-4">
          <button className="text-white hover:text-yellow-300 transition-colors text-sm sm:text-base px-2 py-1 rounded">
            Game
          </button>
          <button className="text-white hover:text-yellow-300 transition-colors text-sm sm:text-base px-2 py-1 rounded">
            Achievements
          </button>
          <button className="text-white hover:text-yellow-300 transition-colors text-sm sm:text-base px-2 py-1 rounded">
            Stats
          </button>
        </div>
      </nav>
    </header>
  );
};

export { Header };
