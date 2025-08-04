import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../store/uiStore';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../api/auth';
import type { UserCreate, UserLogin } from '../api/types';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Custom hook for authentication operations
 * Combines API calls with state management
 */
export function useAuth() {
  const authStore = useAuthStore();
  const { addNotification } = useNotifications();

  /**
   * Register a new user
   */
  const register = async (userData: UserCreate): Promise<boolean> => {
    authStore.setLoading(true);
    authStore.clearError();

    try {
      const response = await registerUser(userData);
      
      if (response.success && response.data) {
        authStore.login(response.data.access_token, response.data.user);
        addNotification({
          type: 'success',
          message: `Welcome ${response.data.user.full_name}! Your account has been created.`
        });
        return true;
      } else {
        const errorMessage = response.error?.detail || 'Registration failed';
        authStore.setError(errorMessage);
        addNotification({
          type: 'error',
          message: errorMessage
        });
        return false;
      }
    } catch (error: any) {
      const errorMessage = 'Registration failed. Please try again.';
      authStore.setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage
      });
      return false;
    }
  };

  /**
   * Login user
   */
  const login = async (credentials: UserLogin): Promise<boolean> => {
    authStore.setLoading(true);
    authStore.clearError();

    try {
      const response = await loginUser(credentials);
      
      if (response.success && response.data) {
        authStore.login(response.data.access_token, response.data.user);
        addNotification({
          type: 'success',
          message: `Welcome back, ${response.data.user.full_name}!`
        });
        return true;
      } else {
        const errorMessage = response.error?.detail || 'Login failed';
        authStore.setError(errorMessage);
        addNotification({
          type: 'error',
          message: errorMessage
        });
        return false;
      }
    } catch (error: any) {
      const errorMessage = 'Login failed. Please check your credentials.';
      authStore.setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage
      });
      return false;
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      authStore.logout();
      addNotification({
        type: 'info',
        message: 'You have been logged out successfully.'
      });
    } catch (error) {
      // Even if logout API fails, clear local state
      authStore.logout();
    }
  };

  /**
   * Check if user is still authenticated (validate token)
   */
  const checkAuth = async (): Promise<boolean> => {
    // Check if token exists in localStorage
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    
    if (!token) {
      authStore.logout();
      return false;
    }

    // If we have a token but no user in store, validate with backend
    if (!authStore.user) {
      authStore.setLoading(true);
      
      try {
        const response = await getCurrentUser();
        
        if (response.success && response.data) {
          // Restore user data
          authStore.login(token, response.data);
          return true;
        } else {
          // Token invalid, logout
          authStore.logout();
          return false;
        }
      } catch (error) {
        authStore.logout();
        return false;
      } finally {
        authStore.setLoading(false);
      }
    }
    
    return true;
  };

  // Initialize auth state on hook creation
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    if (token && !authStore.isAuthenticated) {
      checkAuth();
    }
  }, []);

  return {
    // State
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    
    // Actions
    register,
    login,
    logout,
    checkAuth,
    clearError: authStore.clearError,
    setError: authStore.setError
  };
}