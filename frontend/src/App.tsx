import React from 'react';
import { Header } from './components/layout/Header';
import { GameBoard } from './components/layout/GameBoard';
import { Sidebar } from './components/layout/Sidebar';
import { useGameLoop } from './hooks/useGameLoop';
import { useGameSave } from './hooks/useGameSave';
import './styles/globals.css';

function App() {
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

export default App;