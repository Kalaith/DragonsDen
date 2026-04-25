import React from 'react';
import { GamePage } from './pages/GamePage';
import { useAuthBootstrap } from './hooks/useAuthBootstrap';
import { useAuthSession } from './hooks/useAuthSession';
import { useAuthStore } from './stores/authStore';
import './styles/globals.css';

function App() {
  const { user } = useAuthStore();
  const { continueAsGuest, getLinkAccountUrl } = useAuthBootstrap();
  useAuthSession();

  if (!user) {
    return (
      <div className="min-h-screen bg-amber-50 text-slate-800 flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
          <h1 className="text-3xl font-bold mb-3 text-red-900">Dragon&apos;s Den</h1>
          <p className="text-slate-600 mb-6">
            Continue as a guest to manage the den now, or sign in with WebHatchery to attach the session to your account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => void continueAsGuest()}
              className="px-5 py-3 rounded-lg bg-red-800 text-white font-semibold hover:bg-red-700"
            >
              Continue as Guest
            </button>
            <a
              href={getLinkAccountUrl()}
              className="px-5 py-3 rounded-lg bg-amber-200 text-red-950 font-semibold text-center hover:bg-amber-300"
            >
              Login with WebHatchery
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <GamePage />;
}

export default App;
