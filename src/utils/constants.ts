// Application constants
export const APP_CONFIG = {
  name: "Indian Traffic Law AI Assistant",
  description: "Get instant answers about Indian traffic laws and regulations",
  version: "1.0.0"
} as const;

// API configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  timeout: 30000, // 30 seconds
  endpoints: {
    // Auth endpoints
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout", 
    me: "/auth/me",
    
    // Chat endpoints
    ask: "/chat/ask",
    
    // Conversation endpoints
    conversations: "/conversations",
    conversationMessages: (id: string) => `/conversations/${id}/messages`,
    deleteConversation: (id: string) => `/conversations/${id}`
  }
} as const;

// UI constants
export const UI_CONFIG = {
  // Chat interface
  maxMessageLength: 1000,
  messagesPerPage: 50,
  autoScrollDelay: 100,
  
  // Sidebar
  conversationTitleMaxLength: 50,
  sidebarWidth: "320px",
  
  // Theme
  defaultTheme: "light" as "light" | "dark",
  
  // Animation durations (in milliseconds)
  animations: {
    fast: 150,
    normal: 300,
    slow: 500
  }
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  authToken: "traffic_ai_token",
  theme: "traffic_ai_theme",
  user: "traffic_ai_user"
} as const;