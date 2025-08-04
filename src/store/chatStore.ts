import { create } from 'zustand';
import type { Conversation, Message, ConversationWithMessages, ChatState } from '../api/types';

/**
 * Chat store using Zustand
 * Manages conversations, messages, and chat UI state
 */
interface ChatStore extends ChatState {
  // Actions for conversations
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (conversationId: string) => void;
  
  // Actions for current conversation
  setCurrentConversation: (conversation: ConversationWithMessages | null) => void;
  addMessage: (message: Message) => void;
  updateCurrentConversationTitle: (title: string) => void;
  
  // Actions for UI state
  setLoading: (loading: boolean) => void;
  setTyping: (typing: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Helper actions
  createNewConversation: () => void;
  selectConversation: (conversationId: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  conversations: [],
  currentConversation: null,
  isLoading: false,
  isTyping: false,
  error: null,

  // Conversation management
  setConversations: (conversations: Conversation[]) => {
    set({ conversations });
  },

  addConversation: (conversation: Conversation) => {
    set((state) => ({
      conversations: [conversation, ...state.conversations]
    }));
  },

  removeConversation: (conversationId: string) => {
    set((state) => ({
      conversations: state.conversations.filter(c => c.id !== conversationId),
      currentConversation: state.currentConversation?.id === conversationId 
        ? null 
        : state.currentConversation
    }));
  },

  // Current conversation management
  setCurrentConversation: (conversation: ConversationWithMessages | null) => {
    set({ currentConversation: conversation });
  },

  addMessage: (message: Message) => {
    set((state) => {
      if (!state.currentConversation) return state;
      
      return {
        currentConversation: {
          ...state.currentConversation,
          messages: [...state.currentConversation.messages, message]
        }
      };
    });
  },

  updateCurrentConversationTitle: (title: string) => {
    set((state) => {
      if (!state.currentConversation) return state;
      
      return {
        currentConversation: {
          ...state.currentConversation,
          title
        },
        conversations: state.conversations.map(c => 
          c.id === state.currentConversation!.id 
            ? { ...c, title }
            : c
        )
      };
    });
  },

  // UI state management
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setTyping: (typing: boolean) => {
    set({ isTyping: typing });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false, isTyping: false });
  },

  clearError: () => {
    set({ error: null });
  },

  // Helper actions
  createNewConversation: () => {
    set({ 
      currentConversation: null,
      error: null 
    });
  },

  selectConversation: (conversationId: string) => {
    const { conversations } = get();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation) {
      // Create a conversation with empty messages (will be loaded separately)
      const conversationWithMessages: ConversationWithMessages = {
        ...conversation,
        messages: []
      };
      
      set({ 
        currentConversation: conversationWithMessages,
        error: null 
      });
    }
  },

  clearChat: () => {
    set({
      conversations: [],
      currentConversation: null,
      isLoading: false,
      isTyping: false,
      error: null
    });
  }
}));

// Selector hooks for easier usage in components
export const useChat = () => {
  const store = useChatStore();
  return {
    conversations: store.conversations,
    currentConversation: store.currentConversation,
    isLoading: store.isLoading,
    isTyping: store.isTyping,
    error: store.error
  };
};

export const useChatActions = () => {
  const store = useChatStore();
  return {
    setConversations: store.setConversations,
    addConversation: store.addConversation,
    removeConversation: store.removeConversation,
    setCurrentConversation: store.setCurrentConversation,
    addMessage: store.addMessage,
    updateCurrentConversationTitle: store.updateCurrentConversationTitle,
    setLoading: store.setLoading,
    setTyping: store.setTyping,
    setError: store.setError,
    clearError: store.clearError,
    createNewConversation: store.createNewConversation,
    selectConversation: store.selectConversation,
    clearChat: store.clearChat
  };
};