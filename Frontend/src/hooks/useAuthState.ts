import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: Error | null;
}

// Cache duration in milliseconds (5 minutes)
const TOKEN_CACHE_DURATION = 5 * 60 * 1000;

let globalAuthState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

let tokenRefreshTimeout: NodeJS.Timeout | null = null;

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>(globalAuthState);

  useEffect(() => {
    const refreshToken = async () => {
      if (globalAuthState.user) {
        try {
          const newToken = await globalAuthState.user.getIdToken(true);
          globalAuthState = {
            ...globalAuthState,
            token: newToken,
          };
          setAuthState(globalAuthState);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          globalAuthState = {
            user,
            token,
            isLoading: false,
            error: null,
          };
          setAuthState(globalAuthState);

          // Schedule token refresh
          if (tokenRefreshTimeout) {
            clearTimeout(tokenRefreshTimeout);
          }
          tokenRefreshTimeout = setTimeout(refreshToken, TOKEN_CACHE_DURATION);
        } catch (error) {
          globalAuthState = {
            user: null,
            token: null,
            isLoading: false,
            error: error as Error,
          };
          setAuthState(globalAuthState);
        }
      } else {
        globalAuthState = {
          user: null,
          token: null,
          isLoading: false,
          error: null,
        };
        setAuthState(globalAuthState);
      }
    });

    return () => {
      unsubscribe();
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout);
      }
    };
  }, []);

  return authState;
}; 