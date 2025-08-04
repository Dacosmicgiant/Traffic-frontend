import { apiClient } from '../utils/api';
import { API_CONFIG } from '../utils/constants';
import type {
    Conversation,
    ConversationCreate,
    Message,
    ConversationWithMessages,
    ApiResponse
} from './types';

/**
 * Conversations API functions
 * Handles conversation management operations
 */

/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<ApiResponse<Conversation[]>> {
  return await apiClient.get<Conversation[]>(API_CONFIG.endpoints.conversations);
}

/**
 * Get a specific conversation by ID
 */
export async function getConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
  return await apiClient.get<Conversation>(`${API_CONFIG.endpoints.conversations}/${conversationId}`);
}

/**
 * Create a new conversation
 */
export async function createConversation(conversationData: ConversationCreate): Promise<ApiResponse<Conversation>> {
  return await apiClient.post<Conversation>(API_CONFIG.endpoints.conversations, conversationData);
}

/**
 * Get all messages for a specific conversation
 */
export async function getConversationMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
  const url = API_CONFIG.endpoints.conversationMessages(conversationId);
  return await apiClient.get<Message[]>(url);
}

/**
 * Delete a conversation and all its messages
 */
export async function deleteConversation(conversationId: string): Promise<ApiResponse<void>> {
  const url = API_CONFIG.endpoints.deleteConversation(conversationId);
  return await apiClient.delete<void>(url);
}

/**
 * Load a complete conversation with all its messages
 * This is a helper function that combines conversation + messages
 */
export async function loadConversationWithMessages(
  conversationId: string
): Promise<{
  success: boolean;
  conversation?: ConversationWithMessages;
  error?: string;
}> {
  try {
    // Get conversation details and messages in parallel
    const [conversationResponse, messagesResponse] = await Promise.all([
      getConversation(conversationId),
      getConversationMessages(conversationId)
    ]);

    if (conversationResponse.success && messagesResponse.success) {
      const conversation: ConversationWithMessages = {
        ...conversationResponse.data!,
        messages: messagesResponse.data!
      };

      return {
        success: true,
        conversation
      };
    } else {
      const error = conversationResponse.error?.detail || messagesResponse.error?.detail || "Failed to load conversation";
      return {
        success: false,
        error
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error occurred"
    };
  }
}

/**
 * Helper function to get all conversations with basic error handling
 */
export async function loadConversationsList(): Promise<{
  success: boolean;
  conversations?: Conversation[];
  error?: string;
}> {
  try {
    const response = await getConversations();
    
    if (response.success && response.data) {
      return {
        success: true,
        conversations: response.data
      };
    } else {
      return {
        success: false,
        error: response.error?.detail || "Failed to load conversations"
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error occurred"
    };
  }
}