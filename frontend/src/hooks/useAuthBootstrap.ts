import { useCallback } from 'react';
import { AuthUser, saveGuestSession, useAuthStore } from '../stores/authStore';
import { apiClient } from '../api/ApiClient';

export const useAuthBootstrap = () => {
  const { loginUrl } = useAuthStore();

  const continueAsGuest = useCallback(async () => {
    const payload = await apiClient.createGuestSession();
    if (!payload.data?.token || !payload.data?.user) {
      throw new Error('Failed to create guest session');
    }

    saveGuestSession({
      token: payload.data.token,
      user: payload.data.user as AuthUser,
    });

    useAuthStore.setState({
      user: payload.data.user as AuthUser,
      token: payload.data.token,
      authMode: 'guest',
    });
  }, []);

  const getLinkAccountUrl = useCallback(() => {
    if (!loginUrl) {
      throw new Error('Login URL is not configured');
    }

    const url = new URL(loginUrl, window.location.origin);
    url.searchParams.set('return_to', window.location.href);

    return url.toString();
  }, [loginUrl]);

  return {
    continueAsGuest,
    getLinkAccountUrl,
  };
};
