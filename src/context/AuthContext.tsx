/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  getMe,
  login as loginRequest,
  register as registerRequest,
  type AuthUser,
} from '../services/authService';

export type AuthMode = 'guest' | 'demo' | 'authenticated';

export interface AuthContextValue {
  authMode: AuthMode;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  enterDemoMode: () => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const tokenStorageKey = 'nba_insight_token';
const authModeStorageKey = 'nba_insight_auth_mode';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredAuthMode(): AuthMode {
  const storedMode = window.localStorage.getItem(authModeStorageKey);

  return storedMode === 'demo' || storedMode === 'authenticated' ? storedMode : 'guest';
}

function clearStoredAuth() {
  window.localStorage.removeItem(tokenStorageKey);
  window.localStorage.removeItem(authModeStorageKey);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('guest');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      const storedToken = window.localStorage.getItem(tokenStorageKey);

      if (storedToken) {
        try {
          const response = await getMe(storedToken);

          if (isMounted) {
            setUser(response.user);
            setToken(storedToken);
            setAuthMode('authenticated');
            window.localStorage.setItem(authModeStorageKey, 'authenticated');
          }

          return;
        } catch {
          clearStoredAuth();

          if (isMounted) {
            setUser(null);
            setToken(null);
            setAuthMode('guest');
          }

          return;
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }

      if (readStoredAuthMode() === 'demo') {
        setAuthMode('demo');
      }

      setIsLoading(false);
    }

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);

    window.localStorage.setItem(tokenStorageKey, response.token);
    window.localStorage.setItem(authModeStorageKey, 'authenticated');
    setUser(response.user);
    setToken(response.token);
    setAuthMode('authenticated');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await registerRequest(name, email, password);

    window.localStorage.setItem(tokenStorageKey, response.token);
    window.localStorage.setItem(authModeStorageKey, 'authenticated');
    setUser(response.user);
    setToken(response.token);
    setAuthMode('authenticated');
  }, []);

  const enterDemoMode = useCallback(() => {
    window.localStorage.removeItem(tokenStorageKey);
    window.localStorage.setItem(authModeStorageKey, 'demo');
    setUser(null);
    setToken(null);
    setAuthMode('demo');
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    setToken(null);
    setAuthMode('guest');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      authMode,
      user,
      token,
      isLoading,
      isAuthenticated: authMode === 'authenticated' && Boolean(user) && Boolean(token),
      isDemoMode: authMode === 'demo',
      login,
      register,
      enterDemoMode,
      logout,
    }),
    [authMode, enterDemoMode, isLoading, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
