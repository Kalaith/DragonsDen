import { useEffect } from 'react';
import { AuthUser, useAuthStore, clearGuestSession, getFrontpageToken, getGuestSession, saveGuestSession } from '../stores/authStore';
import { apiClient } from '../api/ApiClient';

export const useAuthSession = () => {
  const setState = useAuthStore.setState;

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const loginInfo = await apiClient.getLoginInfo();
        if (loginInfo.data?.login_url) {
          setState({ loginUrl: loginInfo.data.login_url });
        }

        const frontpageToken = getFrontpageToken();
        const guestSession = getGuestSession();

        if (frontpageToken && guestSession?.token) {
          const linkPayload = await apiClient.linkGuestAccount(guestSession.token);
          if (linkPayload.data?.user) {
            clearGuestSession();
            setState({
              user: linkPayload.data.user as AuthUser,
              token: frontpageToken,
              authMode: 'frontpage',
            });
            return;
          }
        }

        if (guestSession?.token) {
          const payload = await apiClient.getSession();
          if (payload.data?.user) {
            saveGuestSession({
              token: guestSession.token,
              user: payload.data.user as AuthUser,
            });
            setState({
              user: payload.data.user as AuthUser,
              token: guestSession.token,
              authMode: 'guest',
            });
            return;
          }
        }

        if (frontpageToken) {
          const payload = await apiClient.getSession();
          if (payload.data?.user) {
            setState({
              user: payload.data.user as AuthUser,
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
