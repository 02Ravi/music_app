import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(credentials.username, credentials.password);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Music App</h1>
        <p className="text-gray-600 mb-6 text-center">Login to access your music library</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Username"
            required
            value={credentials.username}
            onChange={(e) => setCredentials((p) => ({ ...p, username: e.target.value }))}
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={credentials.password}
            onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))}
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {error && (
            <div className="text-red-600 bg-red-50 px-3 py-2 rounded text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md py-3"
          >
            Login
          </button>
        </form>

        {/* <div className="bg-gray-50 rounded-md p-4 text-sm">
          <h3 className="font-semibold mb-2 text-center">Demo Credentials</h3>
          <div className="mb-1">
            <strong>Admin:</strong> admin / admin123
          </div>
          <div>
            <strong>User:</strong> user / user123
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
