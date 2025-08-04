import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '../api/types';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication store using Zustand
 * Handles user authentication state and token management
 */
interface AuthStore extends AuthState {
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: (token: string, user: User) => {
        // Store token in localStorage
        localStorage.setItem(STORAGE_KEYS.authToken, token);
        
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      },

      logout: () => {
        // Clear token from localStorage
        localStorage.removeItem(STORAGE_KEYS.authToken);
        localStorage.removeItem(STORAGE_KEYS.user);
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (user: User) => {
        set({ user });
      }
    }),
    {
      name: STORAGE_KEYS.user, // localStorage key
      // Only persist user and authentication status
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Selector hooks for easier usage in components
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    login: store.login,
    logout: store.logout,
    setLoading: store.setLoading,
    setError: store.setError,
    clearError: store.clearError,
    updateUser: store.updateUser
  };
};