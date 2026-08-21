import { createContext, useContext, useMemo, useState } from 'react';
import {
  api,
  clearSession,
  getStoredUser,
  getToken,
  setSession
} from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null));

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isModerator: user?.role === 'moderator' || user?.role === 'admin',
      async login(email, password) {
        const data = await api.post('/auth/login', { email, password });
        setSession(data.token, data.user);
        setUser(data.user);
        return data.user;
      },
      async register(name, email, password) {
        return api.post('/auth/register', { name, email, password });
      },
      logout() {
        clearSession();
        setUser(null);
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
