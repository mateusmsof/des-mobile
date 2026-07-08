import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'fideliza_auth_token';
const DEMO_MODE = true;

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestOtp: (email: string) => Promise<{ success: boolean; message: string; usedDemo: boolean }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; message: string; usedDemo: boolean; token?: string }>;
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

    if (DEMO_MODE) {
      return {
        success: true,
        message: 'Use qualquer e-mail e o código 123456 para continuar.',
        usedDemo: true,
      };
    }

    return {
      success: true,
      message: 'Código enviado com sucesso.',
      usedDemo: false,
    };
  };

  const verifyOtp = async (email: string, code: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    if (!normalizedEmail || !normalizedCode) {
      throw new Error('Informe o código recebido por e-mail.');
    }

    if (DEMO_MODE && normalizedCode === '123456') {
      const token = `demo-${normalizedEmail}-${normalizedCode}`;
      await signIn(token);
      return {
        success: true,
        message: 'Login realizado com sucesso.',
        usedDemo: true,
        token,
      };
    }

    if (DEMO_MODE) {
      throw new Error('No modo demonstração, use o código 123456.');
    }

    const token = `demo-${normalizedEmail}-${normalizedCode}`;
    await signIn(token);
    return {
      success: true,
      message: 'Login realizado com sucesso.',
      usedDemo: false,
      token,
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
