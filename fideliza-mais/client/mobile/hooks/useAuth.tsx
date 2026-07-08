import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'fideliza_auth_token';
const API_BASE_URL = 'https://ubiquitous-spork-wjpgvqqxqjj2w79-3000.app.github.dev/api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestOtp: (email: string) => Promise<{ success: boolean }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; token?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const loadStoredToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        if (!isMounted) {
          return;
        }

        setToken(storedToken);
        setStatus(storedToken ? 'authenticated' : 'unauthenticated');
      } catch {
        if (!isMounted) {
          return;
        }

        setToken(null);
        setStatus('unauthenticated');
      }
    };

    loadStoredToken();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    const isPublicRoute = segments[0] === 'login';
    const shouldRedirectToLogin = !token && !isPublicRoute;
    const shouldRedirectToTabs = !!token && isPublicRoute;

    if (shouldRedirectToLogin) {
      router.replace('/login');
      return;
    }

    if (shouldRedirectToTabs) {
      router.replace('/(tabs)/cards');
    }
  }, [router, segments, status, token]);

  const signIn = async (nextToken: string) => {
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, nextToken);
    setToken(nextToken);
    setStatus('authenticated');
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    setToken(null);
    setStatus('unauthenticated');
  };

  const requestOtp = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Error('Informe um e-mail para continuar.');
    }

    const response = await fetch(`${API_BASE_URL}/auth/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Não foi possível enviar o código.');
    }

    return {
      success: true,
    };
  };

  const verifyOtp = async (email: string, code: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    if (!normalizedEmail || !normalizedCode) {
      throw new Error('Informe o código recebido por e-mail.');
    }

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: normalizedEmail, code: normalizedCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Não foi possível validar o código.');
    }

    if (!data.token) {
      throw new Error('Token não recebido do servidor.');
    }

    await signIn(data.token);

    return {
      success: true,
      token: data.token,
    };
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      token,
      isAuthenticated: status === 'authenticated' && !!token,
      signIn,
      signOut,
      requestOtp,
      verifyOtp,
    }),
    [status, token]
  );

  if (status === 'loading') {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
