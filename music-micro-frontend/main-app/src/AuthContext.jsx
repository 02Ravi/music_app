import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const generateMockJWT = (user) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { sub: user.id, username: user.username, role: user.role, exp: Date.now() + 24*60*60*1000 };
  const token = btoa(JSON.stringify(header)) + '.' + btoa(JSON.stringify(payload)) + '.' + btoa('mock-signature');
  return token;
};

const decodeMockJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user',  password: 'user123',  role: 'user' }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeMockJWT(token);
      if (decoded) setUser(decoded);
      else localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const found = mockUsers.find(u => u.username === username && u.password === password);
    if (!found) return { success: false, error: 'Invalid credentials' };

    const token = generateMockJWT(found);
    localStorage.setItem('token', token);
    const payload = { id: found.id, username: found.username, role: found.role };
    setUser(payload);
    return { success: true, user: payload };
  };

  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
