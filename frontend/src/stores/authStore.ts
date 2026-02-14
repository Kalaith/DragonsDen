import { create } from 'zustand';
type PersistedAuthState = {
  state?: {
    user?: AuthUser | null;
    token?: string | null;
    loginUrl?: string | null;
  };
};

const readPersistedAuth = (): {
  user: AuthUser | null;
  token: string | null;
  loginUrl: string | null;
} => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, loginUrl: null };
  }

  try {
    const raw = window.localStorage.getItem('auth-storage');
    if (!raw) return { user: null, token: null, loginUrl: null };
    const parsed = JSON.parse(raw) as PersistedAuthState;
    return {
      user: parsed.state?.user ?? null,
      token: parsed.state?.token ?? null,
      loginUrl: parsed.state?.loginUrl ?? null,
    };
  } catch {
    return { user: null, token: null, loginUrl: null };
  }
};

export interface AuthUser {
  id: number;
  email?: string | null;
  username?: string | null;
  roles?: string[];
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loginUrl: string | null;
}

const initialAuth = readPersistedAuth();

export const useAuthStore = create<AuthState>()(() => ({
  user: initialAuth.user,
  token: initialAuth.token,
  loginUrl: initialAuth.loginUrl,
}));
