import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from './constants';
import type { ApiResponse } from '../api/types';

/**
 * API client class with authentication and error handling
 * Wraps axios with our app-specific logic
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Set up request interceptor to add auth token
    this.setupRequestInterceptor();
    
    // Set up response interceptor for error handling
    this.setupResponseInterceptor();
  }

  /**
   * Add JWT token to all requests if user is authenticated
   */
  private setupRequestInterceptor(): void {
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const token = localStorage.getItem(STORAGE_KEYS.authToken);
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle response errors globally
   */
  private setupResponseInterceptor(): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        console.error('API Error:', error);
        
        // Handle common error scenarios
        if (error.response?.status === 401) {
          // Token expired or invalid - clear auth data
          this.clearAuthData();
          // Only redirect if we're not already on auth pages
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Clear authentication data from storage
   */
  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.user);
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return {
        data: response.data,
        success: true
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return {
        data: response.data,
        success: true
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return {
        data: response.data,
        success: true
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return {
        data: response.data,
        success: true
      };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: any): ApiResponse<any> {
    let errorMessage = "An unexpected error occurred";
    let statusCode = 500;

    if (error.response) {
      // Server responded with error status
      errorMessage = error.response.data?.detail || error.response.statusText;
      statusCode = error.response.status;
    } else if (error.request) {
      // Request was made but no response received (CORS, network, etc.)
      if (error.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to server. Please check if the backend is running.";
      } else {
        errorMessage = "Network error - please check your connection and ensure the backend is running.";
      }
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage;
    }

    console.error('API Error Details:', {
      message: errorMessage,
      status: statusCode,
      error: error
    });

    return {
      success: false,
      error: {
        detail: errorMessage,
        status_code: statusCode
      }
    };
  }
}

// Create and export a single instance
export const apiClient = new ApiClient();