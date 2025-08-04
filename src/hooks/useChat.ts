import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../store/uiStore';
import { 
  loadConversationsList, 
  loadConversationWithMessages, 
  deleteConversation 
} from '../api/conversations';
import { sendChatMessage } from '../api/chat';
import { type Message } from '../api/types';

/**
 * Custom hook for chat operations
 * Combines chat API calls with state management
 */
export function useChat() {
  const chatStore = useChatStore();
  const { isAuthenticated } = useAuthStore();
  const { addNotification } = useNotifications();

  // Clear chat data when user logs out
  if (!isAuthenticated && chatStore.conversations.length > 0) {
    chatStore.clearChat();
  }

  /**
   * Load all conversations for the current user
   */
  const loadConversations = async (): Promise<void> => {
    chatStore.setLoading(true);
    
    try {
      const result = await loadConversationsList();
      
      if (result.success && result.conversations) {
        chatStore.setConversations(result.conversations);
      } else {
        chatStore.setError(result.error || 'Failed to load conversations');
      }
    } catch (error) {
      chatStore.setError('Failed to load conversations');
    } finally {
      chatStore.setLoading(false);
    }
  };

  /**
   * Load a specific conversation with all its messages
   */
  const loadConversation = async (conversationId: string): Promise<void> => {
    chatStore.setLoading(true);
    
    try {
      const result = await loadConversationWithMessages(conversationId);
      
      if (result.success && result.conversation) {
        chatStore.setCurrentConversation(result.conversation);
      } else {
        chatStore.setError(result.error || 'Failed to load conversation');
        addNotification({
          type: 'error',
          message: 'Could not load conversation'
        });
      }
    } catch (error) {
      chatStore.setError('Failed to load conversation');
    } finally {
      chatStore.setLoading(false);
    }
  };

  /**
   * Send a message to the AI assistant
   */
  const sendMessage = async (message: string, conversationId?: string): Promise<void> => {
    // Add user message to UI immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`, // Temporary ID
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      conversation_id: conversationId || ''
    };
    
    chatStore.addMessage(userMessage);
    chatStore.setTyping(true);

    try {
      const result = await sendChatMessage(message, conversationId);
      
      if (result.success && result.response) {
        // Update user message with real conversation ID
        const updatedUserMessage: Message = {
          ...userMessage,
          conversation_id: result.response.conversation_id
        };

        // Add AI response
        const aiMessage: Message = {
          id: result.response.message_id,
          role: 'assistant',
          content: result.response.response,
          timestamp: new Date().toISOString(),
          conversation_id: result.response.conversation_id
        };

        // If this was a new conversation, update current conversation
        if (!conversationId) {
          // This means we created a new conversation
          chatStore.setCurrentConversation({
            id: result.response.conversation_id,
            title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
            user_id: 'current_user', // Will be populated properly
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            message_count: 2,
            messages: [updatedUserMessage, aiMessage]
          });
        } else {
          // Add AI message to existing conversation
          chatStore.addMessage(aiMessage);
        }

        // Reload conversations list to get updated data
        await loadConversations();
        
      } else {
        chatStore.setError(result.error || 'Failed to send message');
        addNotification({
          type: 'error',
          message: result.error || 'Failed to send message'
        });
      }
    } catch (error) {
      chatStore.setError('Failed to send message');
      addNotification({
        type: 'error',
        message: 'Network error - please try again'
      });
    } finally {
      chatStore.setTyping(false);
    }
  };

  /**
   * Delete a conversation
   */
  const removeConversation = async (conversationId: string): Promise<void> => {
    try {
      const response = await deleteConversation(conversationId);
      
      if (response.success) {
        chatStore.removeConversation(conversationId);
        addNotification({
          type: 'success',
          message: 'Conversation deleted'
        });
      } else {
        addNotification({
          type: 'error',
          message: response.error?.detail || 'Failed to delete conversation'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to delete conversation'
      });
    }
  };

  /**
   * Start a new conversation
   */
  const startNewConversation = (): void => {
    chatStore.createNewConversation();
  };

  /**
   * Select and load a conversation
   */
  const selectConversation = async (conversationId: string): Promise<void> => {
    chatStore.selectConversation(conversationId);
    await loadConversation(conversationId);
  };

  return {
    // State
    conversations: chatStore.conversations,
    currentConversation: chatStore.currentConversation,
    isLoading: chatStore.isLoading,
    isTyping: chatStore.isTyping,
    error: chatStore.error,
    
    // Actions
    loadConversations,
    loadConversation,
    sendMessage,
    removeConversation,
    startNewConversation,
    selectConversation,
    clearError: chatStore.clearError
  };
}