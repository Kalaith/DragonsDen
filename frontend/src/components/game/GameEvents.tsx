import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/gameStore';
import ApiClient from '../../api/ApiClient';

interface GameEvent {
  id: string;
  message: string;
  type: 'gold' | 'treasure' | 'achievement' | 'minion';
  timestamp: number;
}

const apiClient = new ApiClient('/api');

export const GameEvents: React.FC = () => {
  const [events, setEvents] = useState<GameEvent[]>([]);
  const { gold, totalTreasures, achievements, minions } = useGameStore();

  // Track game state changes and create events
  useEffect(() => {
    const addEvent = async (message: string, type: GameEvent['type']) => {
      try {
        const eventData = await apiClient.getPlayerData('playerId');
        console.log('Fetched player data:', eventData);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }

      const newEvent: GameEvent = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: Date.now()
      };
      
      setEvents(prev => [newEvent, ...prev.slice(0, 4)]); // Keep only last 5 events
    };

    // This is a simplified event tracking - in a real game you'd want more sophisticated tracking
    if (gold > 0) {
      addEvent('Gold milestone reached!', 'gold');
    }
  }, [gold, totalTreasures, achievements, minions]);

  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'gold': return '💰';
      case 'treasure': return '💎';
      case 'achievement': return '🏆';
      case 'minion': return '👹';
      default: return '📝';
    }
  };

  const getEventColor = (type: GameEvent['type']) => {
    switch (type) {
      case 'gold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'treasure': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'achievement': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'minion': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="upgrade-card">
      <h2 className="text-xl font-bold mb-4 text-gray-800">📜 Recent Events</h2>
      
      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent events...</p>
          <p className="text-sm text-gray-400 mt-2">Start playing to see your progress!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {events.map((event) => (
            <div 
              key={event.id} 
              className={`flex items-center gap-3 p-3 rounded-lg border ${getEventColor(event.type)}`}
            >
              <span className="text-lg">{getEventIcon(event.type)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{event.message}</p>
                <p className="text-xs opacity-75">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Current Game Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span>🏆</span>
            <span>{achievements.size} achievements</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💎</span>
            <span>{totalTreasures} treasures</span>
          </div>
        </div>
      </div>
    </div>
  );
};