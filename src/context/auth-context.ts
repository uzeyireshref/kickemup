import { createContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

export type SignUpPayload = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpResult = {
  status: 'signed_in' | 'needs_email_confirmation';
};

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isAuthLoading: boolean;
  authError: string | null;
  signUp: (payload: SignUpPayload) => Promise<SignUpResult>;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => Promise<void>;
  syncSession: (session: Session | null) => void;
  setAuthLoading: (value: boolean) => void;
  clearAuthError: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
