import { Header } from '../components/layout/Header';
import { GameBoard } from '../components/layout/GameBoard';
import { Sidebar } from '../components/layout/Sidebar';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGameSave } from '../hooks/useGameSave';

export function GamePage() {
  useGameLoop();
  useGameSave();

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <GameBoard />
      </div>
    </div>
  );
}