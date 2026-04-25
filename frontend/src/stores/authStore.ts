import { create } from 'zustand';
export type AuthMode = 'frontpage' | 'guest';
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
  id: string;
  email?: string | null;
  username?: string | null;
  roles?: string[];
  display_name?: string | null;
  auth_type?: string;
  is_guest?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loginUrl: string | null;
  authMode: AuthMode | null;
}

export interface GuestSessionData {
  token: string;
  user: AuthUser;
}

export const WEBHATCHERY_AUTH_STORAGE_KEY = 'auth-storage';
export const GUEST_AUTH_STORAGE_KEY = 'dragons-den-guest-session';

export const getFrontpageToken = (): string | null => {
  try {
    const raw = window.localStorage.getItem(WEBHATCHERY_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedAuthState;
    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
};

export const getGuestSession = (): GuestSessionData | null => {
  try {
    const raw = window.localStorage.getItem(GUEST_AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GuestSessionData) : null;
  } catch {
    return null;
  }
};

export const saveGuestSession = (session: GuestSessionData): void => {
  window.localStorage.setItem(GUEST_AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const clearGuestSession = (): void => {
  window.localStorage.removeItem(GUEST_AUTH_STORAGE_KEY);
};

export const getActiveToken = (): string | null => {
  const guestSession = getGuestSession();
  if (guestSession?.token) {
    return guestSession.token;
  }

  return getFrontpageToken();
};

const initialAuth = readPersistedAuth();

export const useAuthStore = create<AuthState>()(() => ({
  user: initialAuth.user,
  token: initialAuth.token,
  loginUrl: initialAuth.loginUrl,
  authMode: null,
}));
