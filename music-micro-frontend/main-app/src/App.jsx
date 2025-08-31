// main-app/src/App.jsx
import React, { Suspense } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';

const MusicLibrary = React.lazy(() =>
  import('musicLibrary/MusicLibrary').catch((err) => {
    console.error('Failed to load musicLibrary remote:', err);
    return {
      default: () => (
        <div className="p-4 m-3 rounded border border-red-200 bg-red-50 text-red-700">
          Music Library failed to load. Make sure the remote is running on http://localhost:3001 and that <code>/assets/remoteEntry.js</code> is reachable.
        </div>
      ),
    };
  })
);

const AppContent = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - clean, no emoji, no 'user' badge */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <h1 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900">
            Music Streaming App
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">
              Welcome, <strong className="font-semibold">{user.username}</strong>
            </span>

            {/* Show role badge only for admins
            {user.role === 'admin' && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                Admin
              </span>
            )} */}

            <button
              onClick={logout}
              className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-sm text-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-5">
        <div className="max-w-6xl mx-auto px-5">
          <Suspense
            fallback={
              <div className="min-h-[200px] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-gray-600">Loading Music Library...</p>
              </div>
            }
          >
            <MusicLibrary userRole={user.role} />
          </Suspense>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 text-gray-600 text-center text-sm py-4">
        2025 &copy; Music Streaming App. All rights reserved.
      </footer>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
