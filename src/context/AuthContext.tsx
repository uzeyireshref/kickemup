import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import {
  AuthContext,
  type AuthContextValue,
  type SignInPayload,
  type SignUpResult,
  type SignUpPayload,
} from './auth-context';

const buildFullName = (firstName?: string, lastName?: string) => {
  const value = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  return value.length > 0 ? value : undefined;
};

const normalizeAuthErrorMessage = (message: string) => {
  const normalized = message.toLowerCase();

  if (normalized.includes('email not confirmed')) {
    return 'E-posta adresinizi doğrulamanız gerekiyor. Lütfen mail kutunuzu kontrol edin.';
  }

  if (normalized.includes('email rate limit exceeded')) {
    return 'Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.';
  }

  if (normalized.includes('user already registered')) {
    return 'Bu e-posta ile zaten bir hesap bulunuyor.';
  }

  return message;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [session, setSession] = useState<AuthContextValue['session']>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const syncSession = useCallback((nextSession: AuthContextValue['session']) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
  }, []);

  const setAuthLoading = useCallback((value: boolean) => {
    setIsAuthLoading(value);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInPayload) => {
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const nextMessage = normalizeAuthErrorMessage(error.message);
      setAuthError(nextMessage);
      throw new Error(nextMessage);
    }

    syncSession(data.session ?? null);
  }, [syncSession]);

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    setAuthError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        scopes: 'openid email profile',
      },
    });

    if (error) {
      const nextMessage = normalizeAuthErrorMessage(error.message);
      setAuthError(nextMessage);
      throw new Error(nextMessage);
    }
  }, []);

  const signUp = useCallback(async ({ email, password, firstName, lastName }: SignUpPayload): Promise<SignUpResult> => {
    setAuthError(null);

    const fullName = buildFullName(firstName, lastName);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName ?? '',
          last_name: lastName ?? '',
          full_name: fullName ?? '',
        },
      },
    });

    if (error) {
      const nextMessage = normalizeAuthErrorMessage(error.message);
      setAuthError(nextMessage);
      throw new Error(nextMessage);
    }

    if (data.session) {
      syncSession(data.session);
      return { status: 'signed_in' };
    }

    return { status: 'needs_email_confirmation' };
  }, [syncSession]);

  const signOut = useCallback(async () => {
    setAuthError(null);

    const { error } = await supabase.auth.signOut();
    if (error) {
      const nextMessage = normalizeAuthErrorMessage(error.message);
      setAuthError(nextMessage);
      throw new Error(nextMessage);
    }

    syncSession(null);
  }, [syncSession]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    isAuthLoading,
    authError,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    syncSession,
    setAuthLoading,
    clearAuthError,
  }), [authError, clearAuthError, isAuthLoading, session, setAuthLoading, signIn, signInWithGoogle, signOut, signUp, syncSession, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
