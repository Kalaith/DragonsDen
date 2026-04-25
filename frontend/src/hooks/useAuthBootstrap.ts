import { useCallback } from 'react';
import { apiConfig } from '../config/api';
import { saveGuestSession, useAuthStore } from '../stores/authStore';

export const useAuthBootstrap = () => {
  const { loginUrl, user } = useAuthStore();

  const continueAsGuest = useCallback(async () => {
    const response = await fetch(`${apiConfig.BACKEND_BASE_URL}/auth/guest-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const payload = (await response.json()) as {
      data?: { token?: string; user?: unknown };
    };

    if (!response.ok || !payload.data?.token || !payload.data?.user) {
      throw new Error('Failed to create guest session');
    }

    saveGuestSession({
      token: payload.data.token,
      user: payload.data.user as never,
    });

    useAuthStore.setState({
      user: payload.data.user as never,
      token: payload.data.token,
      authMode: 'guest',
    });
  }, []);

  const getLinkAccountUrl = useCallback(() => {
    const baseLoginUrl = loginUrl || import.meta.env.VITE_WEB_HATCHERY_LOGIN_URL || '/login';
    const url = new URL(baseLoginUrl, window.location.origin);
    url.searchParams.set('return_to', window.location.href);

    if (user?.is_guest && user.id) {
      url.searchParams.set('guest_user_id', user.id);
    }

    return url.toString();
  }, [loginUrl, user]);

  return {
    continueAsGuest,
    getLinkAccountUrl,
  };
};
