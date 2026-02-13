import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { ApiStatus } from "../components/debug/ApiStatus";
import { ServerResourceCounter } from "../components/game/ServerResourceCounter";
import { ServerActionButtons } from "../components/game/ServerActionButtons";
import { useServerSync } from "../hooks/useServerSync";

export function GamePage() {
  const { isLoading } = useServerSync();

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1">
          {/* API Status - only show in development */}
          {import.meta.env.DEV && (
            <div className="p-4">
              <ApiStatus className="max-w-md" />
            </div>
          )}

          {/* Server-Authoritative Game Content */}
          <div className="p-4 lg:p-6 space-y-6">
            <ServerResourceCounter />
            <ServerActionButtons />
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span>Syncing with server...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
