import { useEffect } from 'react';
import { useAuthStore, clearGuestSession, getFrontpageToken, getGuestSession, saveGuestSession } from '../stores/authStore';
import { apiConfig } from '../config/api';

export const useAuthSession = () => {
  const setState = useAuthStore.setState;

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const requestedGuestLink = params.get('guest_user_id');
        const frontpageToken = getFrontpageToken();

        if (requestedGuestLink && frontpageToken) {
          const linkResponse = await fetch(`${apiConfig.BACKEND_BASE_URL}/auth/link-guest`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${frontpageToken}`,
            },
            body: JSON.stringify({ guest_user_id: requestedGuestLink }),
          });
          const linkPayload = (await linkResponse.json()) as { data?: { user?: unknown } };
          if (linkResponse.ok && linkPayload.data?.user) {
            clearGuestSession();
            setState({
              user: linkPayload.data.user as never,
              token: frontpageToken,
              authMode: 'frontpage',
            });
            params.delete('guest_user_id');
            const nextQuery = params.toString();
            window.history.replaceState({}, document.title, `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`);
            return;
          }
        }

        const guestSession = getGuestSession();
        if (guestSession?.token) {
          const response = await fetch(`${apiConfig.BACKEND_BASE_URL}/auth/session`, {
            headers: {
              Authorization: `Bearer ${guestSession.token}`,
            },
          });
          const payload = (await response.json()) as { data?: { user?: unknown } };
          if (response.ok && payload.data?.user) {
            saveGuestSession({
              token: guestSession.token,
              user: payload.data.user as never,
            });
            setState({
              user: payload.data.user as never,
              token: guestSession.token,
              authMode: 'guest',
            });
            return;
          }
        }

        if (frontpageToken) {
          const response = await fetch(`${apiConfig.BACKEND_BASE_URL}/auth/session`, {
            headers: {
              Authorization: `Bearer ${frontpageToken}`,
            },
          });
          const payload = (await response.json()) as { data?: { user?: unknown } };
          if (response.ok && payload.data?.user) {
            setState({
              user: payload.data.user as never,
              token: frontpageToken,
              authMode: 'frontpage',
            });
            return;
          }
        }

        setState({
          user: null,
          token: null,
          authMode: null,
        });
      } catch (error) {
        console.warn('Failed to bootstrap auth session', error);
        clearGuestSession();
        setState({
          user: null,
          token: null,
          authMode: null,
        });
      }
    };

    void bootstrap();
  }, [setState]);
};
