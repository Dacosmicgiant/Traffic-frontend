import { apiClient } from '../utils/api';
import { API_CONFIG } from '../utils/constants';
import type { ChatRequest, ChatResponse, ApiResponse } from './types';

/**
 * Chat API functions
 * Handles asking questions to the AI assistant
 */

/**
 * Ask a question to the AI assistant
 * Can create a new conversation or continue an existing one
 */
export async function askQuestion(
  message: string, 
  conversationId?: string
): Promise<ApiResponse<ChatResponse>> {
  const requestData: ChatRequest = {
    message,
    ...(conversationId && { conversation_id: conversationId })
  };
  
  return await apiClient.post<ChatResponse>(API_CONFIG.endpoints.ask, requestData);
}

/**
 * Helper function to send a message and handle the response
 * This combines the API call with common error handling
 */
export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<{
  success: boolean;
  response?: ChatResponse;
  error?: string;
}> {
  try {
    const apiResponse = await askQuestion(message, conversationId);
    
    if (apiResponse.success && apiResponse.data) {
      return {
        success: true,
        response: apiResponse.data
      };
    } else {
      return {
        success: false,
        error: apiResponse.error?.detail || "Failed to send message"
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error occurred"
    };
  }
}