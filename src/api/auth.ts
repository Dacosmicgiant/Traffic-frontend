import { apiClient } from '../utils/api';
import { API_CONFIG } from '../utils/constants';
import type { UserCreate, UserLogin, Token, User, ApiResponse } from './types';

/**
 * Authentication API functions
 * These functions handle all auth-related API calls to the backend
 */

/**
 * Register a new user account
 */
export async function registerUser(userData: UserCreate): Promise<ApiResponse<Token>> {
  return await apiClient.post<Token>(API_CONFIG.endpoints.register, userData);
}

/**
 * Login with email and password
 */
export async function loginUser(credentials: UserLogin): Promise<ApiResponse<Token>> {
  return await apiClient.post<Token>(API_CONFIG.endpoints.login, credentials);
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<ApiResponse<{ message: string }>> {
  return await apiClient.post(API_CONFIG.endpoints.logout);
}

/**
 * Get current user information
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return await apiClient.get<User>(API_CONFIG.endpoints.me);
}

/**
 * Validate if current token is still valid
 * Useful for checking authentication status on app startup
 */
export async function validateToken(): Promise<boolean> {
  try {
    const response = await getCurrentUser();
    return response.success;
  } catch (error) {
    return false;
  }
}